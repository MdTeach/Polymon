//SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

contract HashCheck {
    bytes1 private validHash = 0x0f;

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
}
