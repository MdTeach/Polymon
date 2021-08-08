import {SpriteData} from 'types/PokemonInfo';
import CharacterData from 'types/CharacterData';

// PKM images
import PikajuImage from 'assets/pokemons/01_Pikaju.png';
import ZapdosImage from 'assets/pokemons/elec2.png';
import Chalizard from 'assets/pokemons/fire2.png';
import Typloson from 'assets/pokemons/fire1.png';
import Blastoise from 'assets/pokemons/water2.png';
import Faraligator from 'assets/pokemons/water1.png';
import Ivasor from 'assets/pokemons/grass2.png';
import MegaLeaf from 'assets/pokemons/leaf1.png';

interface SpriteDatas {
  [key: string]: SpriteData;
}
const spriteDatas: SpriteDatas = {
  pikaju: {
    tsize: 16,
    enemyFacingTile: [14.8, 0.5],
    enemyFacingSize: [3, 3],
    userFacingPos: [0, 1],
    noAnimations: 6,
    width: 2.4,
    height: 2.4,
    tileOffsets: [0.19, 0],
  },
  zapdos: {
    tsize: 16,
    enemyFacingTile: [15.3, 0.8],
    enemyFacingSize: [3, 3],
    userFacingPos: [0, 1],
    noAnimations: 4,
    width: 4.2,
    height: 4.2,
    tileOffsets: [0, -1],
  },
  charizard: {
    tsize: 16,
    enemyFacingTile: [14.5, 1.1],
    enemyFacingSize: [3, 3],
    userFacingPos: [0, 1],
    noAnimations: 4,
    width: 3.75,
    height: 3.75,
    tileOffsets: [0, -0.8],
  },
  blastoise: {
    tsize: 16,
    enemyFacingTile: [18.4, 0.6],
    enemyFacingSize: [3, 3],
    userFacingPos: [0, 1],
    noAnimations: 5,
    width: 3.75,
    height: 3.6,
    tileOffsets: [-0.1, -0.8],
  },
  typhlosion: {
    tsize: 16,
    enemyFacingTile: [18.8, 0.8],
    enemyFacingSize: [3, 3],
    userFacingPos: [0, 0],
    noAnimations: 4,
    width: 3.4,
    height: 3.7,
    tileOffsets: [0, 0],
  },
};

interface PkmImages {
  [key: string]: string;
}
const pkmImages: PkmImages = {
  pikaju: PikajuImage,
  zapdos: ZapdosImage,
  charizard: Chalizard,
  typhlosion: Typloson,
  blastoise: Blastoise,
  feraligatr: Faraligator,
  ivysaur: Ivasor,
  meganium: MegaLeaf,
};

const getPkmImage = (pkmName: string) => {
  return pkmImages[pkmName];
};

const loadPokemon = () => {};

const loadSpriteData = (pkmName: string): SpriteData => {
  return spriteDatas[pkmName];
};

const getCharacterData = async () => {
  const PikajuData: CharacterData = {
    name: 'Piklaju',
    attacks: {
      '00': {
        name: 'Tackle',
        hit: 10,
      },
      '01': {
        name: 'Quick Attack',
        hit: 15,
      },
      '10': {
        name: 'Thunder Shock',
        hit: 25,
      },
      '11': {
        name: 'Swift',
        hit: 18,
      },
    },
  };
  return PikajuData;
};

export default loadPokemon;
export {loadSpriteData, getPkmImage, getCharacterData};
