import {throws} from 'assert';
import Engine from 'engine/engine';
import Scene from 'engine/scenes/scene';

interface Position {
  x: number;
  y: number;
}

abstract class GameObject {
  sprite: HTMLImageElement;
  position: Position;
  tsize: number;
  scene: Scene;

  constructor(
    scene: Scene,
    pos: Position = {x: 0, y: 0},
    imageSrc: string,
    tsize = 16,
  ) {
    this.sprite = new Image();
    this.sprite.src = imageSrc;
    this.position = pos;
    this.tsize = tsize;
    this.scene = scene;
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
