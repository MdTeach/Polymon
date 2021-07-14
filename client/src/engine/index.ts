class Engine {
  ctx: CanvasRenderingContext2D;
  height: number;
  width: number;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.ctx.imageSmoothingEnabled = false;

    this.height = document.documentElement.clientHeight;
    this.width = document.documentElement.clientWidth;
  }

  update() {
    window.requestAnimationFrame(() => {
      this.update();
    });
    console.log('game loop');
  }

  start(loop = false) {
    const ctx = this.ctx;
    // game setup

    // game loop
  }
}

export default Engine;
