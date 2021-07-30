// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

import {ISuperfluid, ISuperToken, ISuperApp, ISuperAgreement, SuperAppDefinitions} from "https://github.com/superfluid-finance/protocol-monorepo/blob/remix-support/packages/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";
// When ready to move to leave Remix, change imports to follow this pattern:
// "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";

import {IConstantFlowAgreementV1} from "https://github.com/superfluid-finance/protocol-monorepo/blob/remix-support/packages/ethereum-contracts/contracts/interfaces/agreements/IConstantFlowAgreementV1.sol";

import {SuperAppBase} from "https://github.com/superfluid-finance/protocol-monorepo/blob/remix-support/packages/ethereum-contracts/contracts/apps/SuperAppBase.sol";

contract RedirectAll is SuperAppBase {
    ISuperfluid private _host; // host
    IConstantFlowAgreementV1 private _cfa; // the stored constant flow agreement class address
    ISuperToken private _acceptedToken; // accepted token

    // income splitting
    address private _receiver;
    address private _musicMaker;
    address private _graphicsTeam;
    mapping(address => uint256) _revenueSplit;

    uint256 _astartTime;
    uint256 _endblock;
    int96 _aflowRate;

    function setInitalData(uint256 st, int96 fr) public {
        _astartTime = st;
        _aflowRate = fr;
    }

    function setEndTime(uint256 et) internal {
        _endblock = et;
    }

    function getLogs()
        public
        view
        returns (
            uint256,
            uint256,
            int96
        )
    {
        return (_astartTime, _endblock, _aflowRate);
    }

    struct userFlowData {
        uint256 startTime;
        uint256 endTime;
        int96 flowRate;
        bool endedFlow;
        bool valid;
    }

    mapping(address => userFlowData) public userFlowMapping;

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

        _astartTime = 100;
        _endblock = 100;
        _aflowRate = 100;
    }

    /**************************************************************************
     * Redirect Logic
     *************************************************************************/

    function currentReceiver()
        external
        view
        returns (
            uint256 startTime,
            address receiver,
            int96 flowRate
        )
    {
        if (_receiver != address(0)) {
            (startTime, flowRate, , ) = _cfa.getFlow(
                _acceptedToken,
                address(this),
                _receiver
            );
            receiver = _receiver;
        }
    }

    function setReceiver() public {
        if (_receiver != address(0)) {
            (uint256 startTime, int96 flowRate, , ) = _cfa.getFlow(
                _acceptedToken,
                address(this),
                _receiver
            );
            _astartTime = startTime;
            _aflowRate = flowRate;

            userFlowData memory sFD = userFlowData(
                startTime,
                0,
                flowRate,
                false,
                true
            );
            userFlowMapping[msg.sender] = sFD;
        }
    }

    function endReceiver() public {
        if (_receiver != address(0)) {
            // userFlowData memory sFD = userFlowData(startTime,0,flowRate,false);
            if (userFlowMapping[msg.sender].valid) {
                (uint256 startTime, int96 flowRate, , ) = _cfa.getFlow(
                    _acceptedToken,
                    address(this),
                    _receiver
                );
                _astartTime = startTime;
                _aflowRate = flowRate;
                userFlowMapping[msg.sender].endTime = block.timestamp;
                userFlowMapping[msg.sender].endedFlow = true;
            }
        }
    }

    event ReceiverChanged(address receiver); //what is this?

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
        if (outFlowRate != int96(0)) {
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
        } else if (inFlowRate == int96(0)) {
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

    // @dev Change the Receiver of the total flow
    function _changeReceiver(address newReceiver) internal {
        require(newReceiver != address(0), "New receiver is zero address");
        // @dev because our app is registered as final, we can't take downstream apps
        require(
            !_host.isApp(ISuperApp(newReceiver)),
            "New receiver can not be a superApp"
        );
        if (newReceiver == _receiver) return;
        // @dev delete flow to old receiver
        _host.callAgreement(
            _cfa,
            abi.encodeWithSelector(
                _cfa.deleteFlow.selector,
                _acceptedToken,
                address(this),
                _receiver,
                new bytes(0)
            ),
            "0x"
        );
        // @dev create flow to new receiver
        _host.callAgreement(
            _cfa,
            abi.encodeWithSelector(
                _cfa.createFlow.selector,
                _acceptedToken,
                newReceiver,
                _cfa.getNetFlow(_acceptedToken, address(this)),
                new bytes(0)
            ),
            "0x"
        );
        // @dev set global receiver to new receiver
        _receiver = newReceiver;

        emit ReceiverChanged(_receiver);
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
        // (uint256 startTime,int96 flowRate,,) = _cfa.getFlow(_acceptedToken,_receiver,address(this));
        // setInitalData(startTime,flowRate);
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
        return _updateOutflow(_ctx);
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
