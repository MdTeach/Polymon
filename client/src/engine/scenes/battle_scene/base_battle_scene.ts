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

  async start_scene() {
    await this.loadImage(this.playerImage);
    const pokemon = await this.getPokemon();
    this.pokemon = pokemon;
    this.controller.pokemon = pokemon;
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
    ctx.drawImage(this.playerImage, 100, 0.4 * height, 250, 200);
  }
}

const getBattleScene = async function (engine: Engine) {
  return new BaseBattleScene(engine);
};

export {getBattleScene};
export default BaseBattleScene;
