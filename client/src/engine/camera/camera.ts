import {Map} from 'engine/maps/Map';
import {CameraConfig} from 'types/EngineConifig';

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
    const maxX = map.cols * map.tsize - width;
    const maxY = map.rows * map.tsize - height;

    var startCol = Math.floor(this.x / map.tsize);
    var endCol = startCol + width / map.tsize;
    var startRow = Math.floor(this.y / map.tsize);
    var endRow = startRow + height / map.tsize;

    // rendering...
    for (var c = startCol; c < endCol; c++) {
      for (let r = startRow; r < endRow; r++) {
        var tile = map.getTile(c, r);
        this.ctx.drawImage(
          map.tileSheet,
          tile,
          0, // tileY,
          map.tsize,
          map.tsize,
          (c - startCol) * scaleF,
          (r - startRow) * scaleF,
          scaleF,
          scaleF,
        );
      }
    }
  }
}

export {Camera};
