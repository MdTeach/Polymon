import Engine from 'engine/engine';
import Pokemon from 'engine/pokemon/Pokemon';
import ActionTextBox from 'engine/textbox/actionTextBox';
import TextBox from 'engine/textbox/textbox';
import {getActionsStrings} from './helpers';
import BattleConfig from './battle_config';

class Controller {
  textBox: TextBox;
  actionText: ActionTextBox;
  userAction: [number, number] = [0, 0];
  engine: Engine;
  pokemon: Pokemon | undefined;
  enemyPokemon: Pokemon | undefined;

  playerTurn = true;
  playerHealth = 100;
  enemyHealth = 100;

  disPlayerHealth = 100;
  disEnemyHealth = 100;
  // showPokemon = true;
  showPokemon = false;

  constructor(engine: Engine, textBox: TextBox, actionText: ActionTextBox) {
    this.textBox = textBox;
    this.actionText = actionText;
    this.engine = engine;
  }

  // text box config
  texts = ['A wild pokemon appeared!!! What do you want to do ?_'];

  currentText = 0;

  // show user/pokemon acions text or normal text
  can_switch_text2action = false;
  textView = true;
  actionView = false;

  // user actions or pokemon action
  userActionOption = true;

  intro_battle_scene(ctx: CanvasRenderingContext2D) {
    // render the tet box and return true if the texbox animation is completed
    const request_next_text = this.textBox.render(
      ctx,
      this.texts[this.currentText],
      this.engine.time.delta,
    );
    if (this.engine.input._isDown(' ') && request_next_text) {
      this.disEnemyHealth = this.enemyHealth;
      this.disPlayerHealth = this.playerHealth;
      if (this.currentText < this.texts.length - 1) {
        this.currentText++;
        this.textBox.reset();
      } else if (!this.playerTurn) {
        // enemy trun
        this.handleOponentAction();
      } else {
        // can switch from the text and action view
        this.can_switch_text2action = true;
      }
    }
  }

  handleOponentAction() {
    if (!this.enemyPokemon) throw new Error('Foe Pokemon not defined');
    const actions = ['00', '01', '10', '11'];
    const randOp = Math.floor(Math.random() * actions.length);
    const oponentAction = actions[randOp];

    const move =
      this.enemyPokemon.pokemonInfo.characterData.attacks[oponentAction];
    const actionName = move.name;
    const pkmName = this.enemyPokemon.pokemonInfo.characterData.name;
    const hit = move.hit;
    this.playerHealth -= hit;

    // update the text
    this.textBox.reset();
    this.texts = [`Enemy ${pkmName} used ${actionName} !!!_`];

    //switch to the palyer turn
    this.playerTurn = true;
  }

  switch_text2action() {
    if (this.can_switch_text2action && !this.engine.input._isDown(' ')) {
      this.reset_user_action();
      this.textView = false;
      this.actionView = true;
      this.can_switch_text2action = false;
    }
  }

  // user action part
  reset_user_action() {
    this.userAction = [0, 0];
  }

  handle_user_action() {
    // user moving the selection pointer
    const [x, y] = this.userAction;
    if (this.engine.input._isDown('a')) {
      this.userAction = [0, y];
    } else if (this.engine.input._isDown('d')) {
      this.userAction = [1, y];
    } else if (this.engine.input._isDown('w')) {
      this.userAction = [x, 0];
    } else if (this.engine.input._isDown('s')) {
      this.userAction = [x, 1];
    }

    // user confirms the action
    // go back to the text view
    if (this.actionView && this.engine.input._isDown(' ')) {
      const selectedAction = `${this.userAction[0]}${this.userAction[1]}`;

      // handle user or pokemon options
      if (this.userActionOption) {
        this.handle_user_action_option(selectedAction);
      } else {
        this.handle_pokemon_action_option(selectedAction);
      }

      this.actionView = false;
      this.textBox.reset();
      this.currentText = 0;
      this.textView = true;
    }
  }

  handle_pokemon_action_option(selectedAction: string) {
    if (!this.pokemon) throw new Error('Pokemon not inited');

    if (this.playerTurn) {
      const move =
        this.pokemon.pokemonInfo.characterData.attacks[selectedAction];
      const actionName = move.name;
      const pkmName = this.pokemon.pokemonInfo.characterData.name;
      const hit = move.hit;
      this.enemyHealth -= hit;

      // decrease the  opponent health
      this.texts = [`${pkmName} used ${actionName}_`];
      this.playerTurn = false;
      this.userActionOption = true;
    }
  }

  handle_user_action_option(selectedAction: string) {
    const actionName = BattleConfig.userActions[selectedAction].name;
    const pkmName = this.pokemon?.pokemonInfo.characterData.name;
    if (selectedAction === '11') {
      // run
      this.texts = [`Running safely_`];
    } else if (selectedAction === '00') {
      // fight
      if (this.playerHealth === 100) {
        this.texts = [`Go ${pkmName}!!! I choose you._`];
      } else {
        this.texts = [`What shall ${pkmName} do ?_`];
      }
      this.userActionOption = false;
      this.showPokemon = true;
    } else {
      this.texts = [
        `The ${actionName} action is not available. Try another option_`,
      ];
    }
  }

  user_action_text(ctx: CanvasRenderingContext2D) {
    if (!this.pokemon) throw new Error('Pokemon not defined');
    const actionStrings = this.userActionOption
      ? getActionsStrings(BattleConfig.userActions)
      : getActionsStrings(this.pokemon.pokemonInfo.characterData.attacks);
    this.handle_user_action();
    this.actionText.render(ctx, this.userAction, actionStrings);
  }
}

export default Controller;
