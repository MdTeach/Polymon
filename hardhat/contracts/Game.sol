//SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

import "./CashFlow.sol";
import "./HashCheck.sol";
import "@chainlink/contracts/src/v0.7/VRFConsumerBase.sol";

contract Game is VRFConsumerBase {
    // hash check
    HashCheck public hashCheck;
    TradeableCashflow private cashFlow;

    // map NFT
    PokeMap mapNFT;

    // pokemon NFT
    PokemonNFT pkmNFT;

    // random number gen
    bytes32 internal keyHash;
    uint256 internal fee;
    uint256 public randomResult;

    // events
    event NumberGenerated(address player, uint256 number);

    constructor(PokeMap _mapNFT)
        VRFConsumerBase(
            // Matic Test Net
            0x8C7382F9D8f56b33781fE506E897a4F1e2d17255, // VRF Coordinator
            0x326C977E6efc84E512bB9C30f76E30c160eD06FB // LINK Token
        )
    {
        // MAP NFT
        mapNFT = _mapNFT;

        // super fluid CashFlow
        cashFlow = TradeableCashflow(
            0x5A6C83E613B36a045b59139A48dc177B5B3fc657
        );
        // hash check
        hashCheck = HashCheck(0x1faEF324C48355052158302f2032c1f7220803dF);

        // chainlink init
        keyHash = 0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4;
        fee = 0.0001 * 10**18; // 0.1 LINK
    }

    function setPkmNFT(address _nftAddrss) public {
        pkmNFT = PokemonNFT(_nftAddrss);
    }

    mapping(address => bytes32) users2id;
    mapping(bytes32 => address) id2users;
    mapping(bytes32 => uint256) id2num;

    // ##### Super Flild Query #######
    function getUserTotalToken(address _player, uint256 mapToken)
        public
        view
        returns (uint256)
    {
        address cfa = getCFA(mapToken);
        TradeableCashflow _cf = TradeableCashflow(cfa);
        return _cf.TotalTokensTransfered(_player);
    }

    function getCFA(uint256 tokenId) public view returns (address) {
        address _cashFlow = mapNFT.CashFlows(tokenId);
        return _cashFlow;
    }

    // ####### Game Logic ##########
    function requestUserEnter() public {
        bytes32 reqId = getRandomNumber();
        users2id[msg.sender] = reqId;
        id2users[reqId] = msg.sender;
    }

    function requestPkmCatch(
        uint256 selectedToken,
        uint256 mapToken,
        uint256 pokemonToken
    ) public returns (bool) {
        address _player = msg.sender;

        // Get streamflow info from the sf
        uint256 token = getUserTotalToken(_player, mapToken);
        uint256 userNum = id2num[users2id[_player]];

        // token valid
        uint256 flowRate = 57870370370370; //150 per month
        require(
            selectedToken > 0 && selectedToken <= token,
            "Token out of bounds"
        );
        require(selectedToken % flowRate == 0, "Seleted token invalid");

        // Check hash
        bool isValid = hashCheck.validate(selectedToken, userNum);

        // give the user pokemon
        if (isValid) {
            sendPokemon(_player, pokemonToken, mapToken);
            return true;
        }
        return false;
    }

    // Call for nft for transfer
    function sendPokemon(
        address receiver,
        uint256 token,
        uint256 map
    ) internal {
        pkmNFT.RequestGameTransfer(token, map, receiver);
    }

    function myNumber() public view returns (uint256) {
        return id2num[users2id[msg.sender]];
    }

    // ########## VRF Code ###################
    function getRandomNumber() public returns (bytes32 requestId) {
        require(
            LINK.balanceOf(address(this)) > fee,
            "Not enough LINK - fill contract with faucet"
        );
        return requestRandomness(keyHash, fee);
    }

    function fulfillRandomness(bytes32 requestId, uint256 randomness)
        internal
        override
    {
        uint256 number = randomness % 10000;
        id2num[requestId] = number;
        randomResult = number;
        emit NumberGenerated(id2users[requestId], number);
    }

    // temp
    function withdrawLink() external {
        require(
            LINK.transfer(msg.sender, LINK.balanceOf(address(this))),
            "Unable to transfer"
        );
    }
}
