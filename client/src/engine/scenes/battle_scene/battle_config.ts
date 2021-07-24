export interface ActionOption {
  name: string;
}

export interface UserActions {
  [key: string]: ActionOption;
}

export interface BattleConfig {
  userActions: UserActions;
}

const battleConfig: BattleConfig = {
  userActions: {
    '00': {
      name: 'FIGHT',
    },
    '01': {
      name: 'POKEMONS',
    },
    '10': {
      name: 'PACK',
    },
    '11': {
      name: 'RUN',
    },
  },
};

export default battleConfig;
