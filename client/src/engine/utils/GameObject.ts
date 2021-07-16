interface Position {
  x: number;
  y: number;
}

class GameObject {
  sprite: HTMLImageElement;
  position: Position;
  tsize: number;

  constructor(pos: Position = {x: 0, y: 0}, imageSrc: string, tsize = 16) {
    this.sprite = new Image();
    this.sprite.src = imageSrc;
    this.position = pos;
    this.tsize = tsize;
  }

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
