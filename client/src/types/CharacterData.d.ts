export interface AttacksInfo {
  '00': {
    name: string;
    hit: number;
  };
  '01': {
    name: string;
    hit: number;
  };
  '10': {
    name: string;
    hit: number;
  };
  '11': {
    name: string;
    hit: number;
  };
}
interface CharacterData {
  attacks: AttacksInfo;
}

export default CharacterData;
