import GameObject from 'engine/utils/GameObject';

interface Position {
  x: number;
  y: number;
}

class Player extends GameObject {
  private playerDirections = {
    LEFT: 4,
    RIGHT: 2,
    UP: 6,
    DOWN: 0,
  };
  playerHead: String;

  constructor(pos: Position = {x: 0, y: 0}, imageSrc: string = '') {
    super(pos, imageSrc);
    this.playerHead = 'LEFT';

    document.addEventListener('keydown', (e) => {
      this.handleMove(e.key);
    });
  }

  handleMove(direction: string) {
    console.log('move', direction);
    const movement = 0.2;
    switch (direction) {
      case 'w':
        if (this.playerHead === 'UP') {
          this.position.y -= 1 * movement;
        } else {
          this.playerHead = 'UP';
        }
        break;
      case 'a':
        if (this.playerHead === 'LEFT') {
          this.position.x -= 1 * movement;
        } else {
          this.playerHead = 'LEFT';
        }
        break;
      case 'd':
        if (this.playerHead === 'RIGHT') {
          this.position.x += 1 * movement;
        } else {
          this.playerHead = 'RIGHT';
        }
        break;
      case 's':
        if (this.playerHead === 'DOWN') {
          this.position.y += 1 * movement;
        } else {
          this.playerHead = 'DOWN';
        }
        break;
    }
  }

  getSpriteLocation(): [number, number] {
    let dir = 0;
    switch (this.playerHead) {
      case 'LEFT':
        dir = this.playerDirections.LEFT;
        break;
      case 'RIGHT':
        dir = this.playerDirections.RIGHT;
        break;
      case 'UP':
        dir = this.playerDirections.UP;
        break;
      case 'DOWN':
        dir = this.playerDirections.DOWN;
        break;
    }
    return [dir, 0];
  }
}

const getPlayer = async (pos: Position, imageSrc: string) => {
  const player = new Player(pos, imageSrc);
  await player.loadImage();
  return player;
};

export default getPlayer;
export {Player};
