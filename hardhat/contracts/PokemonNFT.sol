//SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;
import "@chainlink/contracts/src/v0.7/VRFConsumerBase.sol";
import {ERC721} from "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v3.2.0-solc-0.7/contracts/token/ERC721/ERC721.sol";
import "./PokemonsConstants.sol";

contract PokemonNFT is VRFConsumerBase, ERC721 {
    string private _baseURL = "https://ipfs.io/ipfs/";

    // admin game address
    address gameAddress;

    //initial minted flag
    bool initalMinted;
    bool isRandomNumGenerated;
    uint256 initalSeed;

    // Pokemons Maps info
    mapping(uint256 => uint256) PokemonToMap;
    mapping(address => uint256) MapUploadRecord;

    // random number gen
    bytes32 internal keyHash;
    uint256 internal fee;
    uint256 private randomResult;

    address public owner;
    uint256 public tokenCounter;

    // pkm data
    PokemonsConstants pkmData;

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

        // set base URI
        _setBaseURI("https://ipfs.io/ipfs/");

        // pkm data
        pkmData = PokemonsConstants(0x17556Abf36FC06a955Fb4DfCa509A1E1f160F1C5);
        gameAddress = 0xBB1AE12EeaE89F1A8915aa4Afc3b117c31d69807;
        // chainlink init
        keyHash = 0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4;
        fee = 0.0001 * 10**18; // 0.0001 LINK
    }

    // ##### Put Pokemon on Map #########
    function PutOnMap(uint256 token, uint256 mapId) public {
        _transfer(msg.sender, gameAddress, token);
        PokemonToMap[token] = mapId;
        MapUploadRecord[msg.sender] = token;
    }

    function RequestGameTransfer(
        uint256 token,
        uint256 mapId,
        address rec
    ) external {
        require(msg.sender == gameAddress, "Ony game contract can call this");
        require(PokemonToMap[token] == mapId);

        _transfer(gameAddress, rec, token);
    }

    // #### HANDLE MINT ####
    function genPokemon(
        uint256 randomNum,
        uint256 pkmType,
        uint256 nameIdx
    ) internal pure returns (PokemonData memory) {
        uint256 attack = 65 + (randomNum % 35);
        uint256 defence = 65 + ((randomNum + attack) % 35);

        uint256 ar1 = randomNum % 5;
        uint256 ar2 = attack % 5;

        uint256 attack0 = pkmType * 5 + ar1;
        uint256 attack1 = pkmType * 5 + ar2;
        uint256 attack2 = 20 + ar1;
        uint256 attack3 = 20 + ar2;

        PokemonData memory _pkmData = PokemonData({
            nameId: nameIdx,
            randomSeed: randomNum,
            pkmType: pkmType,
            attack: attack,
            defence: defence,
            moves: [attack0, attack1, attack2, attack3]
        });

        return _pkmData;
    }

    function handleInitialMint() public {
        require(msg.sender == owner, "Only owner");
        require(initalMinted == false, "Already minted");
        require(isRandomNumGenerated, "Request random number first");

        // initally mint the base pkms
        MintBasePokemons(randomResult);
    }

    function MintBasePokemons(uint256 seed) internal {
        // mint all the base pkms
        uint256 numPkms = 8;
        seed += numPkms * 13;

        // loop through all and mint it
        for (uint256 i = 0; i < numPkms; i++) {
            uint256 nameIdx = i;
            uint256 pkmType = pkmData.ListedTypes(nameIdx);

            PokemonData memory data = genPokemon(seed, pkmType, nameIdx);
            string memory _tokenURI = pkmData.MetaDatas(nameIdx);

            _safeMint(msg.sender, tokenCounter);
            _setTokenURI(tokenCounter, _tokenURI);

            PokemonsMinted[tokenCounter] = data;
            tokenCounter += 1;
        }
    }

    // ########## VRF Code ###################
    function getRandomNumber() public returns (bytes32 requestId) {
        require(
            LINK.balanceOf(address(this)) > fee,
            "Not enough LINK - fill contract with faucet"
        );
        return requestRandomness(keyHash, fee);
    }

    function fulfillRandomness(bytes32, uint256 randomness) internal override {
        uint256 number = randomness % 1000000;
        randomResult = number;
        isRandomNumGenerated = true;
    }
}
