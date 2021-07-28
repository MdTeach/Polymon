//SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

import {RedirectAll, ISuperToken, IConstantFlowAgreementV1, ISuperfluid} from "./RedirectAll.sol";

import {ERC721} from "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v3.2.0-solc-0.7/contracts/token/ERC721/ERC721.sol";

/* Hello and welcome to your first Super App!
 * In order to deploy this contract, you'll need a few things
 * Get the deployed SF addresses here: https://docs.superfluid.finance/superfluid/resources/networks
 * or using the js-sdk as shown here https://docs.superfluid.finance/superfluid/protocol-tutorials/setup-local-environment
 */

contract TradeableCashflow is ERC721, RedirectAll {
    // Host:0xEB796bdb90fFA0f28255275e16936D25d3418603
    // CFAv1:0x49e565Ed1bdc17F3d220f72DF0857C26FA83F873
    // token:0x5D8B4C2554aeB7e86F387B4d6c00Ac33499Ed01f
    // 0x8db7C7ed6403e26445843855D86834014500D4D7

    constructor(
        address owner,
        ISuperfluid host,
        IConstantFlowAgreementV1 cfa,
        ISuperToken acceptedToken
    ) ERC721("_name", "_symbol") RedirectAll(host, cfa, acceptedToken, owner) {
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
