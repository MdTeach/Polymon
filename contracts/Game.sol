//SPDX-License-Identifier: MIT
import "@chainlink/contracts/src/v0.7/VRFConsumerBase.sol";
import "./CashFlow.sol";
import "./HashCheck.sol";

pragma solidity ^0.7.0;

contract Game is VRFConsumerBase {
    // hash check
    HashCheck private hashCheck;

    // random number gen
    bytes32 internal keyHash;
    uint256 internal fee;
    uint256 public randomResult;

    // events
    event NumberGenerated(address player, uint256 number);

    constructor(HashCheck _hashCheck)
        VRFConsumerBase(
            // Matic Test Net
            0x8C7382F9D8f56b33781fE506E897a4F1e2d17255, // VRF Coordinator
            0x326C977E6efc84E512bB9C30f76E30c160eD06FB // LINK Token
        )
    {
        // hash check
        hashCheck = _hashCheck;

        // chainlink init
        keyHash = 0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4;
        fee = 0.0001 * 10**18; // 0.1 LINK
    }

    mapping(address => bytes32) users2id;
    mapping(bytes32 => address) id2users;
    mapping(bytes32 => uint256) id2num;

    function myNumber() public view returns (uint256) {
        return id2num[users2id[msg.sender]];
    }

    function handleUserEnter() public {
        bytes32 reqId = getRandomNumber();
        users2id[msg.sender] = reqId;
        id2users[reqId] = msg.sender;
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

    function withdrawLink() external {
        require(
            LINK.transfer(msg.sender, LINK.balanceOf(address(this))),
            "Unable to transfer"
        );
    }
}
