//SPDX-License-Identifier: MIT
import "@chainlink/contracts/src/v0.7/VRFConsumerBase.sol";

pragma solidity ^0.7.0;

contract HashCheck is VRFConsumerBase {
    address private owner;
    bytes1 private validHash = 0x0f;

    // random number gen
    bytes32 internal keyHash;
    uint256 internal fee;
    uint256 public randomResult;

    constructor()
        VRFConsumerBase(
            0x8C7382F9D8f56b33781fE506E897a4F1e2d17255, // VRF Coordinator
            0x326C977E6efc84E512bB9C30f76E30c160eD06FB // LINK Token
        )
    {
        owner = msg.sender;

        keyHash = 0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4;
        fee = 0.0001 * 10**18; // 0.1 LINK
    }

    function validate(uint256 token, uint256 random)
        public
        view
        returns (bool)
    {
        bytes32 dataHash = getHash(token, random);
        return isHashValid(dataHash);
    }

    function getHash(uint256 token, uint256 random)
        public
        pure
        returns (bytes32)
    {
        return keccak256(abi.encode(token, random));
    }

    function isHashValid(bytes32 hash) public view returns (bool) {
        bytes1 hashByte = hash[0];
        bytes1 shiftedByte = getShiftedByte(hashByte);
        return (validHash[0] == shiftedByte[0]);
    }

    function getShiftedByte(bytes1 byteData) internal pure returns (bytes1) {
        uint8 n = 4;
        uint8 aInt = uint8(byteData); // Converting bytes1 into 8 bit integer
        uint8 shifted = uint8(aInt / 2**n);
        bytes1 finalData = bytes1(shifted);
        return finalData;
    }

    mapping(address => bytes32) id2users;
    mapping(bytes32 => uint256) id2num;

    function myNumber() public view returns (uint256) {
        return id2num[id2users[msg.sender]];
    }

    function handleUserEnter() public {
        bytes32 reqId = getRandomNumber();
        id2users[msg.sender] = reqId;
    }

    // ########## VRF Code ###################

    /**
     * Requests randomness
     */
    function getRandomNumber() public returns (bytes32 requestId) {
        require(
            LINK.balanceOf(address(this)) > fee,
            "Not enough LINK - fill contract with faucet"
        );
        return requestRandomness(keyHash, fee);
    }

    /**
     * Callback function used by VRF Coordinator
     */
    function fulfillRandomness(bytes32 requestId, uint256 randomness)
        internal
        override
    {
        uint256 d20Value = randomness % 10000;
        id2num[requestId] = d20Value;
        randomResult = d20Value;
    }

    /**
     * Withdraw LINK from this contract
     *
     * DO NOT USE THIS IN PRODUCTION AS IT CAN BE CALLED BY ANY ADDRESS.
     * THIS IS PURELY FOR EXAMPLE PURPOSES.
     */
    function withdrawLink() external {
        require(
            LINK.transfer(msg.sender, LINK.balanceOf(address(this))),
            "Unable to transfer"
        );
    }
}
