import Engine from 'engine/engine';
import Scene from '../scene';

import PlayerImage from 'assets/battle_view/battle_player.png';

class BaseBattleScene extends Scene {
  playerImage: HTMLImageElement;

  constructor(engine: Engine) {
    super(engine);
    this.playerImage = new Image();
    this.playerImage.src = PlayerImage;
  }

  async start_scene() {
    await this.loadImage(this.playerImage);
    console.log('start_scene');
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

  update_scene() {
    const ctx = this.engine.ctx;
    const {width, height} = ctx.canvas;
    ctx.fillStyle = '#F8F8F8';

    ctx.fillRect(0, 0, width, height);
    ctx.lineWidth = 3;

    ctx.strokeRect(100, 0.71 * height, width / 2, 150);
    ctx.drawImage(this.playerImage, 100, 0.4 * height, 250, 250);
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 24px pokemon';
    // ctx.font = 'bold 24px Arial';
    ctx.fillText('Wild pokemon appeared!!!', 150, 0.71 * height + 50);
  }
}

const getBattleScene = async function (engine: Engine) {
  return new BaseBattleScene(engine);
};

export {getBattleScene};
export default BaseBattleScene;
