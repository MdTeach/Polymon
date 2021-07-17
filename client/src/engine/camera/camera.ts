import {Map} from 'engine/maps/Map';
import {CameraConfig} from 'types/EngineConifig';
import GameObject from 'engine/utils/GameObject';

class Camera {
  ctx: CanvasRenderingContext2D;
  config: CameraConfig;
  x: number = 0;
  y: number = 0;

  constructor(ctx: CanvasRenderingContext2D, config: CameraConfig) {
    this.ctx = ctx;
    this.config = config;
  }

  renderMap(map: Map) {
    const {width, height, scaleF} = this.config;
    const {rows, cols, tsize} = map.tileData;
    const scaledValue = tsize * scaleF;
    // const maxX = cols * tsize - width;
    // const maxY = rows * tsize - height;

    const startCol = this.x;
    const endCol = startCol + width;

    const startRow = this.y;
    const endRow = startRow + height;

    // console.log('Start col,endclol', startCol, endCol);
    // console.log('Start row,endrow', startRow, endRow);

    var d: number[] = [];
    for (let c = startCol; c < endCol; c++) {
      for (let r = startRow; r < endRow; r++) {
        const tile = map.getTile(c, r);
        d.push(tile);
        const [tileX, tileY] = map.getTileLocation(tile);
        // console.log(`place ${tile} to ${tileX},${tileY}`);
        // console.log(`place ${tile} to ${c - startCol},${r - startRow}`);

        this.ctx.drawImage(
          map.tileSheet,
          tileX * tsize,
          tileY * tsize,
          tsize,
          tsize,
          (c - startCol) * scaledValue,
          (r - startRow) * scaledValue,
          scaledValue,
          scaledValue,
        );
      }
    }
  }

  renderObject(obj: GameObject) {
    const tsize = obj.tsize;
    const scaledValue = tsize * this.config.scaleF;
    const [spriteX, spriteY] = obj.getSpriteLocation();

    this.ctx.drawImage(
      obj.sprite,
      tsize * spriteX,
      tsize * spriteY,
      tsize,
      tsize,
      obj.position.x * scaledValue,
      obj.position.y * scaledValue,
      scaledValue,
      scaledValue,
    );
  }
}

export {Camera};
