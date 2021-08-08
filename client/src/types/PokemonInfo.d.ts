import CharacterData from './CharacterData';

interface SpriteData {
  tsize: number;
  noAnimations: number;
  enemyFacingTile: [number, number];
  enemyFacingSize: [number, number];
  userFacingPos: [number, number];
  width: number;
  height: number;
  tileOffsets: [number, number];
}

interface PokemonInfo {
  spriteSrc: string;
  spriteData: SpriteData;
  characterData: CharacterData;
}
export default PokemonInfo;
export {SpriteData};
