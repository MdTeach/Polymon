import PokemonInfo from 'types/PokemonInfo';
// import CharacterData from 'types/CharacterData';

class Pokemon {
  sprite: HTMLImageElement;
  attacks = [
    ['takle', 20],
    ['thunder', 20],
  ];
  pokemonInfo: PokemonInfo;

  // animation part
  animating = true;
  aimationSpeed = 0.1;
  frameCounter = 0;
  currentTile = 0;

  constructor(pokemonInfo: PokemonInfo) {
    this.sprite = new Image();
    this.pokemonInfo = pokemonInfo;
  }

  render(ctx: CanvasRenderingContext2D, deltaTime: number) {
    const x = 0.5 * ctx.canvas.width;
    const y = 0.1 * ctx.canvas.height;

    const tsize = this.pokemonInfo.tsize;
    const scalef = ctx.canvas.width * 0.009;
    const scaledVal = tsize * scalef;
    const width = tsize * this.pokemonInfo.width;
    const height = tsize * this.pokemonInfo.height;

    let [tileX, tileY] = this.pokemonInfo.userFacingPos;
    let [offSetX, offSetY] = this.pokemonInfo.tileOffsets;
    tileY *= tsize;
    tileX *= tsize;
    tileX += offSetX * tsize;
    tileY += offSetY * tsize;

    if (this.animating) {
      tileX += width * this.currentTile;
      this.animation_update(deltaTime);
    }

    ctx.drawImage(
      this.sprite,
      tileX,
      tileY,
      width,
      height,
      x,
      y,
      scaledVal,
      scaledVal,
    );
  }

  render_back(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
  ) {
    // enemyFacingTile: [14.8, 0.5],
    //   enemyFacingSize: [3, 3],
    const tsize = this.pokemonInfo.tsize;
    const [tileX, tileY] = this.pokemonInfo.enemyFacingTile;
    const [tsizeX, tsizeY] = this.pokemonInfo.enemyFacingSize;

    ctx.drawImage(
      this.sprite,
      tileX * tsize,
      tileY * tsize,
      tsizeX * tsize,
      tsizeY * tsize,
      x,
      y,
      w,
      h,
    );
  }

  animation_update(deltaTime: number) {
    if (this.frameCounter < this.pokemonInfo.noAnimations) {
      this.frameCounter += deltaTime;
      // change the sprite for animation
      if (this.frameCounter >= this.aimationSpeed) {
        this.frameCounter = 0;
        this.currentTile += 1;
        console.log(this.currentTile);

        // check end animation
        if (this.currentTile >= this.pokemonInfo.noAnimations) {
          this.animating = false;
          return true;
        }
      }
    }

    return false;
  }

  loadImage(img: string) {
    return new Promise((resolve, reject) => {
      try {
        this.sprite.src = img;
        this.sprite.onload = () => {
          resolve(true);
        };
      } catch (e) {
        reject(e);
      }
    });
  }
}

export default Pokemon;
