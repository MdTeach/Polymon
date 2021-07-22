import PokemonInfo from 'types/PokemonInfo';

class Pokemon {
  sprite: HTMLImageElement;
  attacks = [
    ['takle', 20],
    ['thunder', 20],
  ];
  pokemonInfo: PokemonInfo;

  constructor(pokemonInfo: PokemonInfo) {
    this.sprite = new Image();
    this.pokemonInfo = pokemonInfo;
  }

  render(ctx: CanvasRenderingContext2D, deltaTime: number) {
    const x = 800;
    const y = 100;

    const tsize = this.pokemonInfo.tsize;
    const scalef = 12;
    const scaledVal = tsize * scalef;

    let [tileX, tileY] = this.pokemonInfo.userFacingPos;
    let [offSetX, offsetY] = this.pokemonInfo.tileOffsets;

    tileX += offSetX;
    tileY += offsetY;

    const width = tsize * this.pokemonInfo.width;
    const height = tsize * this.pokemonInfo.height;

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
