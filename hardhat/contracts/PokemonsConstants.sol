//SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

contract PokemonsConstants {
    // Names of pokemon to be minted
    string[8] public ListedPokemon = [
        "Pikachu",
        "Zapdos",
        "Blastoise",
        "Feraligatr",
        "Charizard",
        "Typhlosion",
        "Ivysaur",
        "Meganium"
    ];

    string[8] public MetaDatas = [
        "bafyreicsuhjalye73rtjxny35bshhzueyl5hxweanx4fz7dnuw5cdujnqy/metadata.json", //Pika
        "bafyreif2xactzw2svnapfuzu54uurz2fj3oyu5hpopnihxypsniss2wo4a/metadata.json", //Zapdos
        "bafyreib3kytnlyl4ozklhg3ysjczd6cgqpmwyl4soj3wrzlm3ytd2qheeq/metadata.json", //Blast
        "bafyreifkomjhydcqkhb6slgi6y4rrtukzhqjy3qen3zuxvij66tzwlnc4e/metadata.json", //Fara
        "bafyreienrtlhwld3rvfv4hr765wd4xcb3u7nxvur3t2ccv2zp2wgpuqb5i/metadata.json", //Chali
        "bafyreidcnqbr6onagazfoloaagsaqz4olukznbrq2bcmeqwushuzt4n2oa/metadata.json", //Typo
        "bafyreiezh6bsvcfyicf4q5njqeogxniq4ut7rut2zperdpbdsahvgiybta/metadata.json", //g
        "bafyreidjcr26ppljuhhb7dqvcpv7oka2jon2v4ustj2gsgmanwm5dtatge/metadata.json" //gg
    ];

    // Types of listed pkm
    uint256[8] public ListedTypes = [0, 0, 1, 1, 2, 2, 3, 3];

    // supported elemental types
    string[5] public ElTypes = ["electric", "water", "fire", "grass", "normal"];

    // effectiveness of one attack over another
    uint256[5][5] public AttackMap = [
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

    attack[25] public attacks;

    constructor() {
        // Electric Attacks
        attacks[0] = attack("Spark", 0, 15);
        attacks[1] = attack("Thunder Shock", 0, 18);
        attacks[2] = attack("Shock Wave", 0, 22);
        attacks[3] = attack("Bolt Attack", 0, 25);
        attacks[4] = attack("Thunder", 0, 25);
        // Water Attacks
        attacks[5] = attack("Water Gun", 1, 13);
        attacks[6] = attack("Bubble Beam", 1, 15);
        attacks[7] = attack("Muddy Water", 1, 20);
        attacks[8] = attack("Surf", 1, 24);
        attacks[9] = attack("Hydropump", 1, 28);
        // Fire Attacks
        attacks[10] = attack("Ember", 2, 15);
        attacks[11] = attack("Flame Wheel", 2, 20);
        attacks[12] = attack("Flame Thrower", 2, 22);
        attacks[13] = attack("Fire Blast", 2, 28);
        attacks[14] = attack("Eruption", 2, 30);
        // Grass Attacks
        attacks[15] = attack("Rajor Leaf", 3, 14);
        attacks[16] = attack("Bullet Seed", 3, 17);
        attacks[17] = attack("Leaf Blade", 3, 22);
        attacks[18] = attack("Leaf Strom", 3, 25);
        attacks[19] = attack("Frenzy Plant", 3, 28);
        // Normal Attacks
        attacks[20] = attack("Tackle", 0, 12);
        attacks[21] = attack("Quick Attack", 0, 18);
        attacks[22] = attack("Swift", 0, 22);
        attacks[23] = attack("Slash", 0, 26);
        attacks[24] = attack("Extreme Speed", 0, 28);
    }

    function getAttack(uint256 idx) public view returns (attack memory) {
        require(idx >= 0 && idx < 25, "Index out of bounds");
        return attacks[idx];
    }
}
