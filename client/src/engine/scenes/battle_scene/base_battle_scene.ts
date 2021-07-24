import Engine from 'engine/engine';
import ActionTextBox from 'engine/textbox/actionTextBox';
import TextBox from 'engine/textbox/textbox';
import Pokemon from 'engine/pokemon/Pokemon';
import Scene from '../scene';
import PlayerImage from 'assets/battle_view/battle_player.png';
import PikajuImage from 'assets/pokemons/01_Pikaju.png';
import PokemonInfo from 'types/PokemonInfo';
import BattleConfig from './battle_config';
import PikajuData from 'character_data/pikaju_data';

import {getActionsStrings} from './helpers';
import battleConfig from './battle_config';

class BaseBattleScene extends Scene {
  playerImage: HTMLImageElement;
  textBox: TextBox;
  actionText: ActionTextBox;
  pokemon: Pokemon | undefined;
  userAction: [number, number] = [0, 0];
  texts = [
    'Pokemon arrived !!! <> now what do you want to do ???????pokemon arrived !!! now what do you want to do ??????? Pokemon arrived !!! now what do you want to do ???????',
    'I challenge you with my pokemon, I challenge you with my pokemonI challenge you with my pokemon, go alaka jam, here we go... ???!!!',
  ];
  currentText = 0;

  can_switch_text2action = false;
  textView = true;
  actionView = false;

  constructor(engine: Engine) {
    super(engine);
    this.playerImage = new Image();
    this.playerImage.src = PlayerImage;
    this.textBox = new TextBox({x: 0, y: 0});
    this.actionText = new ActionTextBox({x: 0, y: 0});
  }

  loadImage(img: HTMLImageElement) {
    return new Promise((resolve, reject) => {
      try {
        img.onload = () => {
          resolve(true);
        };
      } catch (e) {
        reject(e);
      }
    });
  }

  init_text_box() {
    const {height, width} = this.engine.ctx.canvas;
    const textBoxPos = {x: 0, y: (1 - 0.3) * height};

    // textbox init
    this.textBox.pos = textBoxPos;
    this.textBox.width = width;
    this.textBox.height = height - textBoxPos.y;

    // action box init
    this.actionText.pos = textBoxPos;
    this.actionText.width = width;
    this.actionText.height = height - textBoxPos.y;
  }

  async start_scene() {
    await this.loadImage(this.playerImage);
    const pokemon = await this.getPokemon();
    this.pokemon = pokemon;
    this.init_text_box();
  }

  async getPokemon() {
    const pikajuInfo: PokemonInfo = {
      tsize: 16,
      spriteSrc: PikajuImage,
      userFacingPos: [0, 1],
      noAnimations: 6,
      width: 2.4,
      height: 2.4,
      tileOffsets: [0.19, 0],
      characterData: PikajuData,
    };

    const pokemon = new Pokemon(pikajuInfo);
    await pokemon.loadImage(pikajuInfo.spriteSrc);
    return pokemon;
  }

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
    const {userActions} = BattleConfig;
    if (this.actionView && this.engine.input._isDown(' ')) {
      const selectedAction = `${this.userAction[0]}${this.userAction[1]}`;

      if (selectedAction === '11') {
        // run
        this.texts = [`Running safely_`];
      } else if (selectedAction === '00') {
        // fight
        this.texts = [`Go pikachu!!! I choose you._`];
      } else {
        this.texts = [
          `The ${userActions[selectedAction].name} action is not available. Try another option_`,
        ];
      }

      this.actionView = false;
      this.textBox.reset();
      this.currentText = 0;
      this.textView = true;
    }
  }

  user_action_text(ctx: CanvasRenderingContext2D) {
    const actionStrings = getActionsStrings(battleConfig.userActions);
    this.handle_user_action();
    this.actionText.render(ctx, this.userAction, actionStrings);
  }

  update_scene() {
    if (!this.pokemon) throw new Error('opponent not defined');

    const {height, width} = this.engine.ctx.canvas;
    const ctx = this.engine.ctx;

    // make the bg color white
    ctx.fillStyle = '#F9F8F9';
    ctx.fillRect(0, 0, width, height);

    // render the tet box and return true if the texbox animation is completed
    this.switch_text2action();
    if (this.textView) this.intro_battle_scene(ctx);
    if (this.actionView) this.user_action_text(ctx);

    // render the opponet pokemon
    this.pokemon.render(ctx, this.engine.time.delta);
    ctx.drawImage(this.playerImage, 100, 0.4 * height, 250, 200);
  }
}

const getBattleScene = async function (engine: Engine) {
  return new BaseBattleScene(engine);
};

export {getBattleScene};
export default BaseBattleScene;
