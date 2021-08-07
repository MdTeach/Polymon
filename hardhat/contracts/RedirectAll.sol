// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

import "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";
import "@superfluid-finance/ethereum-contracts/contracts/apps/SuperAppBase.sol";
import "@superfluid-finance/ethereum-contracts/contracts/interfaces/agreements/IConstantFlowAgreementV1.sol";

contract RedirectAll is SuperAppBase {
    ISuperfluid private _host; // host
    IConstantFlowAgreementV1 private _cfa; // the stored constant flow agreement class address
    ISuperToken private _acceptedToken; // accepted token

    struct flowRecord {
        uint256 startTime;
        uint256 endTime;
        int96 flowRate;
    }

    // keep the track of user flows
    mapping(address => flowRecord) public userMaps;

    // income splitting
    address private _receiver;
    address private _musicMaker;
    address private _graphicsTeam;
    mapping(address => uint256) _revenueSplit;

    constructor(
        ISuperfluid host,
        IConstantFlowAgreementV1 cfa,
        ISuperToken acceptedToken,
        address receiver,
        address musicMaker,
        address graphicsTeam
    ) {
        assert(address(host) != address(0));
        assert(address(cfa) != address(0));
        assert(address(acceptedToken) != address(0));
        assert(address(receiver) != address(0));
        //assert(!_host.isApp(ISuperApp(receiver)));

        _host = host;
        _cfa = cfa;
        _acceptedToken = acceptedToken;

        // recipient address
        _receiver = receiver;
        _musicMaker = musicMaker;
        _graphicsTeam = graphicsTeam;

        // revenue splitting
        _revenueSplit[_receiver] = 60;
        _revenueSplit[_musicMaker] = 20;
        _revenueSplit[_graphicsTeam] = 20;

        uint256 configWord = SuperAppDefinitions.APP_LEVEL_FINAL |
            SuperAppDefinitions.BEFORE_AGREEMENT_CREATED_NOOP |
            SuperAppDefinitions.BEFORE_AGREEMENT_UPDATED_NOOP |
            SuperAppDefinitions.BEFORE_AGREEMENT_TERMINATED_NOOP;

        _host.registerApp(configWord);
    }

    function TotalTokensTransfered(address _player)
        public
        view
        returns (uint256)
    {
        flowRecord memory rec = userMaps[_player];
        uint256 endTime = rec.endTime;
        if (endTime == 0) endTime = block.timestamp;
        return (endTime - rec.startTime) * uint256(rec.flowRate);
    }

    /**************************************************************************
     * Redirect Logic
     *************************************************************************/

    // event ReceiverChanged(address receiver); //what is this?

    /// @dev If a new stream is opened, or an existing one is opened
    function _updateOutflow(bytes calldata ctx)
        private
        returns (bytes memory newCtx)
    {
        newCtx = ctx;
        // receivers
        address[3] memory receivers = [_receiver, _musicMaker, _graphicsTeam];
        // @dev This will give me the new flowRate, as it is called in after callbacks
        int96 netFlowRate = _cfa.getNetFlow(_acceptedToken, address(this));

        int96 outFlowRate = 0;
        for (uint256 i = 0; i < 3; i++) {
            (, int96 _outFlowRate, , ) = _cfa.getFlow(
                _acceptedToken,
                address(this),
                receivers[i]
            );
            outFlowRate += _outFlowRate;
        }
        int96 inFlowRate = netFlowRate + outFlowRate;
        if (inFlowRate < 0) inFlowRate = -inFlowRate; // Fixes issue when inFlowRate is negative

        // @dev If inFlowRate === 0, then delete existing flow.
        if (inFlowRate == int96(0)) {
            // @dev if inFlowRate is zero, delete outflow.
            for (uint256 i = 0; i < 3; i++) {
                address rec = receivers[i];
                (newCtx, ) = _host.callAgreementWithContext(
                    _cfa,
                    abi.encodeWithSelector(
                        _cfa.deleteFlow.selector,
                        _acceptedToken,
                        address(this),
                        rec,
                        new bytes(0) // placeholder
                    ),
                    "0x",
                    newCtx
                );
            }
        } else if (outFlowRate != int96(0)) {
            // flow among the receivers
            for (uint256 i = 0; i < 3; i++) {
                address rec = receivers[i];
                int96 rate = int96(
                    (uint256(inFlowRate) / 100) * _revenueSplit[rec]
                );
                (newCtx, ) = _host.callAgreementWithContext(
                    _cfa,
                    abi.encodeWithSelector(
                        _cfa.updateFlow.selector,
                        _acceptedToken,
                        rec,
                        rate,
                        new bytes(0) // placeholder
                    ),
                    "0x",
                    newCtx
                );
            }
        } else {
            // @dev If there is no existing outflow, then create new flow to equal inflow
            for (uint256 i = 0; i < 3; i++) {
                address rec = receivers[i];
                int96 rate = int96(
                    (uint256(inFlowRate) / 100) * _revenueSplit[rec]
                );

                (newCtx, ) = _host.callAgreementWithContext(
                    _cfa,
                    abi.encodeWithSelector(
                        _cfa.createFlow.selector,
                        _acceptedToken,
                        rec,
                        rate,
                        new bytes(0) // placeholder
                    ),
                    "0x",
                    newCtx
                );
            }
        }
    }

    /**************************************************************************
     * SuperApp callbacks
     *************************************************************************/
    function afterAgreementCreated(
        ISuperToken _superToken,
        address _agreementClass,
        bytes32, // _agreementId,
        bytes calldata, /*_agreementData*/
        bytes calldata, // _cbdata,
        bytes calldata _ctx
    )
        external
        override
        onlyExpected(_superToken, _agreementClass)
        onlyHost
        returns (bytes memory newCtx)
    {
        address customer = _host.decodeCtx(_ctx).msgSender;
        (uint256 startTime, int96 flowRate, , ) = _cfa.getFlow(
            _acceptedToken,
            customer,
            address(this)
        );

        // set inital flow data
        userMaps[customer].startTime = startTime;
        userMaps[customer].flowRate = flowRate;
        userMaps[customer].endTime = 0;
        return _updateOutflow(_ctx);
    }

    function afterAgreementUpdated(
        ISuperToken _superToken,
        address _agreementClass,
        bytes32, //_agreementId,
        bytes calldata, /*_agreementData*/
        bytes calldata, //_cbdata,
        bytes calldata _ctx
    )
        external
        override
        onlyExpected(_superToken, _agreementClass)
        onlyHost
        returns (bytes memory newCtx)
    {
        return _updateOutflow(_ctx);
    }

    function afterAgreementTerminated(
        ISuperToken _superToken,
        address _agreementClass,
        bytes32, //_agreementId,
        bytes calldata, /*_agreementData*/
        bytes calldata, //_cbdata,
        bytes calldata _ctx
    ) external override onlyHost returns (bytes memory newCtx) {
        // According to the app basic law, we should never revert in a termination callback
        if (!_isSameToken(_superToken) || !_isCFAv1(_agreementClass))
            return _ctx;
        address customer = _host.decodeCtx(_ctx).msgSender;
        userMaps[customer].endTime = block.timestamp;
        return _updateOutflow(_ctx);

        // return newCtx;
    }

    function _isSameToken(ISuperToken superToken) private view returns (bool) {
        return address(superToken) == address(_acceptedToken);
    }

    function _isCFAv1(address agreementClass) private view returns (bool) {
        return
            ISuperAgreement(agreementClass).agreementType() ==
            keccak256(
                "org.superfluid-finance.agreements.ConstantFlowAgreement.v1"
            );
    }

    modifier onlyHost() {
        require(
            msg.sender == address(_host),
            "RedirectAll: support only one host"
        );
        _;
    }

    modifier onlyExpected(ISuperToken superToken, address agreementClass) {
        require(_isSameToken(superToken), "RedirectAll: not accepted token");
        require(_isCFAv1(agreementClass), "RedirectAll: only CFAv1 supported");
        _;
    }
}
