import Pokemon from 'engine/pokemon/Pokemon';
import Controller from './controller';

class PlayersImgRenderer {
  controller: Controller;
  ctx: CanvasRenderingContext2D;
  constructor(controller: Controller, ctx: CanvasRenderingContext2D) {
    this.controller = controller;
    this.ctx = ctx;
  }
  render_palyer_image(playerImage: HTMLImageElement, pokemon: Pokemon) {
    // show either the palyer | pkoemon
    const {height, width} = this.ctx.canvas;
    const x = 0.06 * width;
    const y = 0.35 * height;
    const w = 0.2 * width;
    const h = 0.35 * height;

    if (this.controller.showPokemon) {
      pokemon.render_back(this.ctx, x, y, w, h);
    } else {
      this.ctx.drawImage(playerImage, x, y, w, h);
    }
  }

  render_opponent_pokemon_health(
    statusBarImage: HTMLImageElement,
    tsize: number,
    health: number,
  ) {
    const ctx = this.ctx;
    const {height, width} = ctx.canvas;

    let statusX = 0.1 * width;
    let statusY = 0.05 * height;

    const statusW = 0.35 * width;
    const statusH = 0.15 * height;
    const tileX = 0;
    const tileY = 1.6 * tsize;
    const tileW = 7 * tsize;
    const tileH = 2.2 * tsize;

    // draw the heath bar
    ctx.drawImage(
      statusBarImage,
      tileX,
      tileY,
      tileW,
      tileH,
      statusX,
      statusY,
      statusW,
      statusH,
    );

    const dx = statusX * 2.58;
    const dy = statusY * 2.65;
    const barWidth = width * 0.152;
    const barHeight = height * 0.013;
    ctx.fillStyle = '#506860';
    ctx.fillRect(dx, dy, barWidth, barHeight);

    if (health > 50) {
      // green color
      ctx.fillStyle = '#75EDA8';
    } else if (health > 30) {
      // yellow color
      ctx.fillStyle = '#f8e665';
    } else {
      // red color
      ctx.fillStyle = '#d13d24';
    }
    ctx.fillRect(dx, dy, (barWidth * health) / 100, barHeight);
  }

  render_user_pokemon_health(
    statusBarImage: HTMLImageElement,
    tsize: number,
    health: number,
  ) {
    const ctx = this.ctx;
    const {height, width} = ctx.canvas;

    let statusX = 0.44 * width;
    let statusY = 0.48 * height;

    const statusW = 0.5 * width;
    const statusH = 0.2 * height;
    const tileX = 0;
    const tileY = 1.8 * tsize;
    const tileW = 7 * tsize;
    const tileH = 2.2 * tsize;

    // draw the heath bar
    ctx.drawImage(
      statusBarImage,
      tileX,
      tileY,
      tileW,
      tileH,
      statusX,
      statusY,
      statusW,
      statusH,
    );

    const dx = statusX * 1.518;
    const dy = statusY * 1.194;
    const barWidth = width * 0.215;
    const barHeight = height * 0.016;
    ctx.fillStyle = '#506860';
    ctx.fillRect(dx, dy, barWidth, barHeight);

    if (health > 50) {
      // green color
      ctx.fillStyle = '#75EDA8';
    } else if (health > 30) {
      // yellow color
      ctx.fillStyle = '#f8e665';
    } else {
      // red color
      ctx.fillStyle = '#d13d24';
    }
    ctx.fillRect(dx, dy, (barWidth * health) / 100, barHeight);
  }
}
export default PlayersImgRenderer;
