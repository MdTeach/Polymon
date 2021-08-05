//SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

contract PokemonsConstants {
    // Names of pokemon to be minted
    string[8] ListedPokemon = [
        "EPkm1",
        "EPkm2",
        "WPkm1",
        "WPkm2",
        "FPkm1",
        "FPkm2",
        "GPkm1",
        "GPkm2"
    ];

    // Types of listed pkm
    uint256[8] ListedTypes = [0, 0, 1, 1, 2, 2, 3, 3];

    // supported elemental types
    string[5] ElTypes = ["electric", "water", "fire", "grass", "normal"];

    // effectiveness of one attack over another
    uint256[5][5] AttackMap = [
        [10, 15, 12, 8, 10],
        [8, 10, 15, 8, 10],
        [11, 8, 10, 15, 11],
        [11, 15, 8, 10, 10],
        [11, 12, 12, 12, 10]
    ];

    constructor() {}
}
