import Engine from 'engine/engine';
import ActionTextBox from 'engine/textbox/actionTextBox';
import TextBox from 'engine/textbox/textbox';
import Pokemon from 'engine/pokemon/Pokemon';
import Scene from '../scene';
import PlayerImage from 'assets/battle_view/battle_player.png';
import PikajuImage from 'assets/pokemons/01_Pikaju.png';
import PokemonInfo from 'types/PokemonInfo';
import PikajuData from 'character_data/pikaju_data';

import GameController from './controller';

class BaseBattleScene extends Scene {
  playerImage: HTMLImageElement;
  textBox: TextBox;
  actionText: ActionTextBox;
  pokemon: Pokemon | undefined;
  enemyPokemon: Pokemon | undefined;
  controller: GameController;

  constructor(engine: Engine) {
    super(engine);
    this.playerImage = new Image();
    this.playerImage.src = PlayerImage;
    this.textBox = new TextBox({x: 0, y: 0});
    this.actionText = new ActionTextBox({x: 0, y: 0});
    this.controller = new GameController(
      this.engine,
      this.textBox,
      this.actionText,
    );
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

  async getPokemon() {
    const pikajuInfo: PokemonInfo = {
      tsize: 16,
      spriteSrc: PikajuImage,
      enemyFacingTile: [14.8, 0.5],
      enemyFacingSize: [3, 3],
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

  render_palyer_image() {
    if (!this.pokemon) throw new Error('Pokemon not defined');
    // show either the palyer | pkoemon
    const {height, width} = this.engine.ctx.canvas;
    const x = 0.06 * width;
    const y = 0.35 * height;
    const w = 0.2 * width;
    const h = 0.35 * height;
    const ctx = this.engine.ctx;

    if (this.controller.showPokemon) {
      this.pokemon.render_back(ctx, x, y, w, h);
    } else {
      ctx.drawImage(this.playerImage, x, y, w, h);
    }
  }

  async start_scene() {
    await this.loadImage(this.playerImage);
    const pokemon = await this.getPokemon();
    this.pokemon = pokemon;
    this.controller.pokemon = pokemon;
    this.init_text_box();
  }

  update_scene() {
    if (!this.pokemon) throw new Error('opponent not defined');

    const {height, width} = this.engine.ctx.canvas;
    const ctx = this.engine.ctx;

    // make the bg color white
    ctx.fillStyle = '#F9F8F9';
    ctx.fillRect(0, 0, width, height);

    // render the tet box and return true if the texbox animation is completed
    this.controller.switch_text2action();
    if (this.controller.textView) this.controller.intro_battle_scene(ctx);
    if (this.controller.actionView) this.controller.user_action_text(ctx);

    // render the opponet pokemon
    this.pokemon.render(ctx, this.engine.time.delta);
    this.render_palyer_image();
  }
}

const getBattleScene = async function (engine: Engine) {
  return new BaseBattleScene(engine);
};

export {getBattleScene};
export default BaseBattleScene;
