import {Map} from 'engine/maps/Map';
import {CameraConfig} from 'types/EngineConifig';
import GameObject from 'engine/utils/GameObject';

class Camera {
  ctx: CanvasRenderingContext2D;
  config: CameraConfig;
  baseMap: Map;
  x: number = 0;
  y: number = 0;
  maxX: number;
  maxY: number;

  constructor(
    ctx: CanvasRenderingContext2D,
    config: CameraConfig,
    baseMap: Map,
  ) {
    this.ctx = ctx;
    this.config = config;
    this.baseMap = baseMap;
    this.maxX = baseMap.tileData.cols - this.config.width;
    this.maxY = baseMap.tileData.rows - this.config.height;
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

  follow(obj: GameObject) {
    let {x, y} = obj.position;

    this.x = x - this.config.width / 2;
    this.y = y - this.config.height / 2;

    // clamp values
    this.x = Math.max(0, Math.min(this.x, this.maxX));
    this.y = Math.max(0, Math.min(this.y, this.maxY));

    console.log('new pos:', this.x, this.y);
  }
}

export {Camera};
