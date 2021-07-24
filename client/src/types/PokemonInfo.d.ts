import CharacterData from './CharacterData';

interface PokemonInfo {
  spriteSrc: string;
  tsize: number;
  noAnimations: number;
  userFacingPos: [number, number];
  width: number;
  height: number;
  tileOffsets: [number, number];
  characterData: CharacterData;
}
export default PokemonInfo;
