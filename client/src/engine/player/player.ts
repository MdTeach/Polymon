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
    LEFT_ANI: [4, 5],
    RIGHT_ANI: [2, 3],
    UP_ANI: [6, 7],
    DOWN_ANI: [0, 1],
  };
  private animationCounter = 0;
  playerHead: String;

  constructor(pos: Position = {x: 0, y: 0}, imageSrc: string = '') {
    super(pos, imageSrc);
    this.playerHead = 'LEFT';

    document.addEventListener('keydown', (e) => {
      this.handleMove(e.key);
    });
  }

  handleMove(direction: string) {
    const movement = 0.2;
    switch (direction) {
      case 'w':
        if (this.playerHead === 'UP') {
          this.animationCounter = (this.animationCounter + 1) % 2;
          this.position.y -= 1 * movement;
        } else {
          this.playerHead = 'UP';
        }
        break;
      case 'a':
        if (this.playerHead === 'LEFT') {
          this.position.x -= 1 * movement;
          this.animationCounter = (this.animationCounter + 1) % 2;
        } else {
          this.playerHead = 'LEFT';
        }
        break;
      case 'd':
        if (this.playerHead === 'RIGHT') {
          this.animationCounter = (this.animationCounter + 1) % 2;
          this.position.x += 1 * movement;
        } else {
          this.playerHead = 'RIGHT';
        }
        break;
      case 's':
        if (this.playerHead === 'DOWN') {
          this.animationCounter = (this.animationCounter + 1) % 2;
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
        // dir = this.playerDirections.LEFT;
        dir = this.playerDirections.LEFT_ANI[this.animationCounter];
        break;
      case 'RIGHT':
        dir = this.playerDirections.RIGHT_ANI[this.animationCounter];
        break;
      case 'UP':
        dir = this.playerDirections.UP_ANI[this.animationCounter];
        break;
      case 'DOWN':
        dir = this.playerDirections.DOWN_ANI[this.animationCounter];
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
