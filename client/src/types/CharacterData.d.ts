export interface AttacksInfo {
  [key: string]: {
    name: string;
    hit: number;
  };
}
interface CharacterData {
  name: String;
  attacks: AttacksInfo;
}

export default CharacterData;
