import Engine from 'engine/engine';
import ActionTextBox from 'engine/textbox/actionTextBox';
import TextBox from 'engine/textbox/textbox';
import Pokemon from 'engine/pokemon/Pokemon';
import Scene from '../scene';
import PlayerImage from 'assets/battle_view/battle_player.png';
import PikajuImage from 'assets/pokemons/01_Pikaju.png';
import BattleBarImage from 'assets/battle_view/battle_bar.png';
import PokemonInfo from 'types/PokemonInfo';
import PikajuData from 'character_data/pikaju_data';
import TextActionController from './textaction_controller';
import PlayersImgRenderer from './battle_players_renderer';

class BaseBattleScene extends Scene {
  playerImage: HTMLImageElement;
  statusBarImage: HTMLImageElement;
  textBox: TextBox;
  actionText: ActionTextBox;
  pokemon: Pokemon | undefined;
  enemyPokemon: Pokemon | undefined;
  textActionController: TextActionController;

  playerRender: PlayersImgRenderer;
  playerTurn = true;
  playerHealth = 100;
  enemyHealth = 100;
  running = true;

  constructor(engine: Engine) {
    super(engine);
    this.playerImage = new Image();
    this.playerImage.src = PlayerImage;
    this.statusBarImage = new Image();
    this.statusBarImage.src = BattleBarImage;
    this.textBox = new TextBox({x: 0, y: 0});
    this.actionText = new ActionTextBox({x: 0, y: 0});
    this.textActionController = new TextActionController(
      this.engine,
      this.textBox,
      this.actionText,
    );
    this.playerRender = new PlayersImgRenderer(
      this.textActionController,
      this.engine.ctx,
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
      spriteSrc: PikajuImage,
      tsize: 16,
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
    if (!this.pokemon) throw new Error('Pokemon not inited');
    this.playerRender.render_palyer_image(this.playerImage, this.pokemon);
    const tsize = 16;
    if (this.textActionController.showPokemon) {
      this.playerRender.render_user_pokemon_health(
        this.statusBarImage,
        tsize,
        this.playerHealth,
      );
    }
  }

  handle_gameover() {
    if (this.playerHealth <= 0) {
      // we loose
      setTimeout(() => {
        this.running = false;
        alert('You loosed!!');
      }, 1);
    } else if (this.enemyHealth <= 0) {
      // render the opponet
      setTimeout(() => {
        this.running = false;
        alert('You won!!');
      }, 1);
    }
  }

  async start_scene() {
    await this.loadImage(this.playerImage);
    await this.loadImage(this.statusBarImage);
    const pokemon = await this.getPokemon();
    const enemyPokemon = await this.getPokemon();

    this.pokemon = pokemon;
    this.textActionController.pokemon = this.pokemon;

    this.enemyPokemon = enemyPokemon;
    this.textActionController.enemyPokemon = this.enemyPokemon;
    this.init_text_box();
  }

  update_scene() {
    if (!this.running) return;
    if (!this.pokemon) throw new Error('opponent not defined');
    if (!this.enemyPokemon) throw new Error('opponent not defined');

    const {height, width} = this.engine.ctx.canvas;
    const ctx = this.engine.ctx;

    // make the bg color white
    ctx.fillStyle = '#F9F8F9';
    ctx.fillRect(0, 0, width, height);

    // get health updates
    this.playerHealth = this.textActionController.disPlayerHealth;
    this.enemyHealth = this.textActionController.disEnemyHealth;

    // render the tet box and return true if the texbox animation is completed
    this.textActionController.switch_text2action();
    if (this.textActionController.textView)
      this.textActionController.intro_battle_scene(ctx);
    if (this.textActionController.actionView)
      this.textActionController.user_action_text(ctx);

    // render the opponet pokemon
    this.enemyPokemon.render(ctx, this.engine.time.delta);
    this.playerRender.render_opponent_pokemon_health(
      this.statusBarImage,
      16,
      this.enemyHealth,
    );
    this.render_palyer_image();
    // handle gameover
    this.handle_gameover();
  }
}

const getBattleScene = async function (engine: Engine) {
  return new BaseBattleScene(engine);
};

export {getBattleScene};
export default BaseBattleScene;
