import Engine from 'engine/engine';
import Scene from '../scene';

import PlayerImage from 'assets/battle_view/battle_player.png';
import TextBox from 'engine/textbox/textbox';
import PikajuImage from 'assets/pokemons/01_Pikaju.png';
import PokemonInfo from 'types/PokemonInfo';
import Pokemon from 'engine/pokemon/Pokemon';

class BaseBattleScene extends Scene {
  playerImage: HTMLImageElement;
  textBox: TextBox;
  pokemon: Pokemon | undefined;

  texts = [
    'Pokemon arrived !!! <> now what do you want to do ???????pokemon arrived !!! now what do you want to do ??????? Pokemon arrived !!! now what do you want to do ???????',
    'I challenge you with my pokemon, I challenge you with my pokemonI challenge you with my pokemon, go alaka jam, here we go... ???!!!',
  ];
  currentText = 0;

  constructor(engine: Engine) {
    super(engine);
    this.playerImage = new Image();
    this.playerImage.src = PlayerImage;
    this.textBox = new TextBox({x: 0, y: 0});
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
    this.textBox.pos = textBoxPos;
    this.textBox.width = width;
    this.textBox.height = height - textBoxPos.y;
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
    };

    const pokemon = new Pokemon(pikajuInfo);
    await pokemon.loadImage(pikajuInfo.spriteSrc);
    return pokemon;
  }

  update_scene() {
    if (!this.pokemon) throw new Error('opponent not defined');

    const {height, width} = this.engine.ctx.canvas;
    const ctx = this.engine.ctx;
    ctx.fillStyle = '#F9F8F9';
    // ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    // render the tet box and return true if the texbox animation is completed
    const request_next_text = this.textBox.render(
      ctx,
      this.texts[this.currentText],
      this.engine.time.delta,
    );
    if (
      this.engine.input._isDown(' ') &&
      request_next_text &&
      this.currentText < this.texts.length - 1
    ) {
      this.currentText++;
      this.textBox.reset();
    }

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
