//SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;
import "./CashFlow.sol";
import {ERC721} from "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v3.2.0-solc-0.7/contracts/token/ERC721/ERC721.sol";

contract PokeMap is ERC721 {
    uint256 public tokenCounter;
    mapping(uint256 => string) private _tokenURIs;
    mapping(uint256 => address) public CashFlows;

    string private _baseURL = "https://ipfs.io/ipfs/";

    // public creators data
    mapping(uint256 => address) public musicCreator;
    mapping(uint256 => address) public graphicsCreator;

    constructor() ERC721("MAP Token", "MAP") {
        // set base URI
        _setBaseURI("https://ipfs.io/ipfs/");
    }

    // #### HANDLE MINT ####
    function MintMap() public // address owner,
    // address graphicOwner,
    // address musicOwner,
    // string memory _tokenURI
    {
        // temp fields
        address owner = 0x8db7C7ed6403e26445843855D86834014500D4D7;
        address graphicOwner = 0x7e3b984faE2b9235B38D8f8704091253F6e34692;
        address musicOwner = 0x09278C2E543A7090f149c4F312be4eb3f8dA70c2;
        string
            memory _tokenURI = "bafybeig7hfci6swvkdtubmofuhwsdvl6zse5j3qjcdpzah7dkuiypdrqwm";

        uint256 newItemId = tokenCounter;

        // add the creators address
        musicCreator[newItemId] = musicOwner;
        graphicsCreator[newItemId] = graphicOwner;

        // mint the token
        _safeMint(owner, newItemId);
        _setTokenURI(newItemId, _tokenURI);
        tokenCounter += 1;
    }

    function _beforeTokenTransfer(
        address,
        address to,
        uint256 tokenId
    ) internal override {
        // init the cashFlows
        TradeableCashflow cashFlow = new TradeableCashflow(
            to,
            musicCreator[tokenId],
            graphicsCreator[tokenId]
        );

        // cashFlow.changeReceiver(owner);
        CashFlows[tokenId] = address(cashFlow);
    }
}
