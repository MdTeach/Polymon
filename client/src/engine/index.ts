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
  }

  start(loop = true) {
    // game setup

    // game loop
    if (loop) this.update();
  }
}

export default Engine;
