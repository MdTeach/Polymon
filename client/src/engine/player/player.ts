import Engine from 'engine/engine';
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
    LEFT_ANI: [4, 4, 4, 4, 5, 5, 5, 5],
    RIGHT_ANI: [2, 2, 2, 3, 3, 3],
    UP_ANI: [6, 6, 6, 7, 7, 7],
    DOWN_ANI: [0, 0, 0, 1, 1, 1],
  };

  private animationCounter = 0;
  playerHead: String;

  constructor(
    engine: Engine,
    pos: Position = {x: 0, y: 0},
    imageSrc: string = '',
  ) {
    super(engine, pos, imageSrc);
    this.playerHead = 'LEFT';

    document.addEventListener('keydown', (e) => {
      this.handleMove(e.key);
    });
  }

  handleMove(direction: string) {
    // const movement = 0.2;
    const movement = 1;
    let newPos = {x: this.position.x, y: this.position.y};

    let keyPressed = false;

    switch (direction) {
      case 'w':
        if (this.playerHead === 'UP') {
          this.animationCounter = (this.animationCounter + 1) % 6;
          newPos.y -= 1 * movement;
          keyPressed = true;
        } else {
          this.playerHead = 'UP';
        }
        break;
      case 'a':
        if (this.playerHead === 'LEFT') {
          newPos.x -= 1 * movement;
          this.animationCounter = (this.animationCounter + 1) % 6;
          keyPressed = true;
        } else {
          this.playerHead = 'LEFT';
        }
        break;
      case 'd':
        if (this.playerHead === 'RIGHT') {
          this.animationCounter = (this.animationCounter + 1) % 6;
          newPos.x += 1 * movement;
          keyPressed = true;
        } else {
          this.playerHead = 'RIGHT';
        }
        break;
      case 's':
        if (this.playerHead === 'DOWN') {
          this.animationCounter = (this.animationCounter + 1) % 6;
          newPos.y += 1 * movement;
          keyPressed = true;
        } else {
          this.playerHead = 'DOWN';
        }
        break;
    }

    if (keyPressed) {
      // check if playes collides with the obstacle in the map
      const isCollided = this.engineRef.checkMapCollider({
        x: Math.floor(newPos.x),
        y: Math.floor(newPos.y),
      });

      if (!isCollided) {
        this.position.x = newPos.x;
        this.position.y = newPos.y;
      }
    }
  }

  getSpriteLocation(): [number, number] {
    let dir = 0;
    switch (this.playerHead) {
      case 'LEFT':
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

const getPlayer = async (engine: Engine, pos: Position, imageSrc: string) => {
  const player = new Player(engine, pos, imageSrc);
  await player.loadImage();
  return player;
};

export default getPlayer;
export {Player};
