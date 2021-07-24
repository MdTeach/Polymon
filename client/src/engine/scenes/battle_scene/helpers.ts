import {UserActions} from './battle_config';
import {AttacksInfo} from 'types/CharacterData';

const getActionsStrings = (
  options: UserActions | AttacksInfo,
): [string, string, string, string] => {
  const n1 = options['00'].name;
  const n2 = options['01'].name;
  const n3 = options['10'].name;
  const n4 = options['11'].name;
  return [n1, n2, n3, n4];
};

export {getActionsStrings};
