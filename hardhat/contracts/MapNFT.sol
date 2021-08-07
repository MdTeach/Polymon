//SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MapNFT is ERC721 {
    uint256 public tokenCounter;
    mapping(uint256 => string) private _tokenURIs;
    string private _baseURL = "https://ipfs.io/ipfs/";

    // public creators data
    mapping(uint256 => address) public musicCreator;
    mapping(uint256 => address) public graphicsCreator;

    constructor() ERC721("MAP Token", "MAP") {
        // set base URI
        _setBaseURI("https://ipfs.io/ipfs/");
    }

    // #### HANDLE MINT ####
    function MintMap(
        address owner,
        address graphicOwner,
        address musicOwner,
        string memory _tokenURI
    ) public {
        // mint the nft
        uint256 newItemId = tokenCounter;
        _safeMint(owner, newItemId);
        _setTokenURI(newItemId, _tokenURI);

        // add the creators address
        musicCreator[newItemId] = musicOwner;
        graphicsCreator[newItemId] = graphicOwner;

        tokenCounter += 1;
    }

    function _setTokenURI(uint256 _tokenId, string memory _tokenURI)
        internal
        override
    {
        require(
            _exists(_tokenId),
            "ERC721Metadata: URI set of nonexistent token"
        );
        _tokenURIs[_tokenId] = _tokenURI;
    }
}
