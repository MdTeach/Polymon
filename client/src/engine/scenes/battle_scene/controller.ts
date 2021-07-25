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
  showPokemon = true;
  // showPokemon = false;

  constructor(engine: Engine, textBox: TextBox, actionText: ActionTextBox) {
    this.textBox = textBox;
    this.actionText = actionText;
    this.engine = engine;
  }

  // text box config
  texts = ['A wild pokemon appeared_'];
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
      if (this.currentText < this.texts.length - 1) {
        this.currentText++;
        this.textBox.reset();
      } else {
        // can switch from the text and action view
        this.can_switch_text2action = true;
      }
    }
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

    const actionName =
      this.pokemon.pokemonInfo.characterData.attacks[selectedAction].name;
    const pkmName = this.pokemon.pokemonInfo.characterData.name;

    this.texts = [`${pkmName} used ${actionName}_`];
  }

  handle_user_action_option(selectedAction: string) {
    const actionName = BattleConfig.userActions[selectedAction].name;
    if (selectedAction === '11') {
      // run
      this.texts = [`Running safely_`];
    } else if (selectedAction === '00') {
      // fight
      this.texts = [`Go pikachu!!! I choose you._`];
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
