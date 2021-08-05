//SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@chainlink/contracts/src/v0.7/VRFConsumerBase.sol";

contract PokemonNFT is VRFConsumerBase, ERC721 {
    // random number gen
    bytes32 internal keyHash;
    uint256 internal fee;
    uint256 public randomResult;

    address public owner;
    uint256 public tokenCounter;

    struct PokemonData {
        uint256 nameId;
        uint256 randomSeed;
        uint256 pkmType;
        uint256 attack;
        uint256 defence;
        uint256[4] moves;
    }

    mapping(uint256 => PokemonData) public PokemonsMinted;

    constructor()
        ERC721("Pokemon", "PKM")
        VRFConsumerBase(
            // Matic Test Net
            0x8C7382F9D8f56b33781fE506E897a4F1e2d17255, // VRF Coordinator
            0x326C977E6efc84E512bB9C30f76E30c160eD06FB // LINK Token
        )
    {
        owner = msg.sender;

        // chainlink init
        keyHash = 0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4;
        fee = 0.0001 * 10**18; // 0.0001 LINK
    }

    // #### HANDLE MINT ####
    function MintPokemon(uint256 nameIdx) public {
        uint256 randomNum = 10;
        uint256 attack = 65 + (randomNum % 35);
        uint256 defence = 65 + ((randomNum + attack) % 35);

        uint256 pkmType = 1;
        uint256 attack0 = 0;
        uint256 attack1 = 0;
        uint256 attack2 = 0;
        uint256 attack3 = 0;

        _safeMint(msg.sender, tokenCounter);
        PokemonData memory pkmData = PokemonData({
            nameId: nameIdx,
            randomSeed: randomNum,
            pkmType: pkmType,
            attack: attack,
            defence: defence,
            moves: [attack0, attack1, attack2, attack3]
        });
        PokemonsMinted[tokenCounter] = pkmData;

        tokenCounter += 1;
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
        randomResult = number;
    }
}
