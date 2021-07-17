import {throws} from 'assert';
import Engine from 'engine/engine';

interface Position {
  x: number;
  y: number;
}

abstract class GameObject {
  sprite: HTMLImageElement;
  position: Position;
  tsize: number;
  engineRef: Engine;

  constructor(
    engineRef: Engine,
    pos: Position = {x: 0, y: 0},
    imageSrc: string,
    tsize = 16,
  ) {
    this.sprite = new Image();
    this.sprite.src = imageSrc;
    this.position = pos;
    this.tsize = tsize;
    this.engineRef = engineRef;
  }

  abstract getSpriteLocation(): [number, number];

  getPosition(): Position {
    return this.position;
  }

  loadImage() {
    return new Promise((resolve, reject) => {
      try {
        this.sprite.onload = () => {
          resolve(true);
        };
      } catch (e) {
        reject(e);
      }
    });
  }
}

export default GameObject;
