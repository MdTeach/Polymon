//SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

import {RedirectAll, ISuperToken, IConstantFlowAgreementV1, ISuperfluid} from "./RedirectAll.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TradeableCashflow is ERC721, RedirectAll {
    // 0x8db7C7ed6403e26445843855D86834014500D4D7
    // Host:0xEB796bdb90fFA0f28255275e16936D25d3418603
    // CFAv1:0x49e565Ed1bdc17F3d220f72DF0857C26FA83F873
    // token:0x5D8B4C2554aeB7e86F387B4d6c00Ac33499Ed01f

    address public graphicsTeam = 0x7e3b984faE2b9235B38D8f8704091253F6e34692;
    address public musicMaker = 0x09278C2E543A7090f149c4F312be4eb3f8dA70c2;
    address public owner = 0x8db7C7ed6403e26445843855D86834014500D4D7;
    ISuperfluid host = ISuperfluid(0xEB796bdb90fFA0f28255275e16936D25d3418603);
    IConstantFlowAgreementV1 cfa =
        IConstantFlowAgreementV1(0x49e565Ed1bdc17F3d220f72DF0857C26FA83F873);
    ISuperToken acceptedToken =
        ISuperToken(0x5D8B4C2554aeB7e86F387B4d6c00Ac33499Ed01f);

    constructor()
        // address owner
        // ISuperfluid host,
        // IConstantFlowAgreementV1 cfa,
        // ISuperToken acceptedToken
        ERC721("_name", "_symbol")
        RedirectAll(host, cfa, acceptedToken, owner, musicMaker, graphicsTeam)
    {
        _mint(owner, 1);
    }

    //now I will insert a nice little hook in the _transfer, including the RedirectAll function I need
    function _beforeTokenTransfer(
        address, /*from*/
        address to,
        uint256 /*tokenId*/
    ) internal override {
        _changeReceiver(to);
    }
}
