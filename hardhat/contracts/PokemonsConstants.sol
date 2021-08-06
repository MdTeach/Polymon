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

    // attacks part
    struct attack {
        string name;
        uint256 attackType;
        uint256 hit;
    }

    attack[] attacks = [
        // Electric Attacks
        attack("Spark", 0, 15),
        attack("Thunder Shock", 0, 18),
        attack("Shock Wave", 0, 22),
        attack("Bolt Attack", 0, 25),
        attack("Thunder", 0, 25),
        // Water Attacks
        attack("Water Gun", 1, 13),
        attack("Bubble Beam", 1, 15),
        attack("Muddy Water", 1, 20),
        attack("Surf", 1, 24),
        attack("Hydropump", 1, 28),
        // Fire Attacks
        attack("Ember", 2, 15),
        attack("Flame Wheel", 2, 20),
        attack("Flame Thrower", 2, 22),
        attack("Fire Blast", 2, 28),
        attack("Eruption", 2, 30),
        // Grass Attacks
        attack("Rajor Leaf", 3, 14),
        attack("Bullet Seed", 3, 17),
        attack("Leaf Blade", 3, 22),
        attack("Leaf Strom", 3, 25),
        attack("Frenzy Plant", 3, 28),
        // Normal Attacks
        attack("Tackle", 0, 12),
        attack("Quick Attack", 0, 18),
        attack("Swift", 0, 22),
        attack("Slash", 0, 26),
        attack("Extreme Speed", 0, 28)
    ];

    constructor() {}
}
