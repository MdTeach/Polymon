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
    LEFT_ANI: [4, 5],
    RIGHT_ANI: [2, 3],
    UP_ANI: [6, 7],
    DOWN_ANI: [0, 1],
  };

  private animationCounter = 0;
  private animationFrameLimit = 10;
  private animationIndex = 0;
  private isMoving = false;

  private movement = {
    LEFT: 'a',
    RIGHT: 'd',
    UP: 'w',
    DOWN: 's',
    SPEED: 2,
  };
  playerHead: String;

  constructor(
    engine: Engine,
    pos: Position = {x: 0, y: 0},
    imageSrc: string = '',
  ) {
    super(engine, pos, imageSrc);
    this.playerHead = 'LEFT';
  }

  getSpriteLocation(): [number, number] {
    let dir = 0;
    switch (this.playerHead) {
      case 'LEFT':
        dir = this.playerDirections.LEFT_ANI[this.animationIndex];
        break;
      case 'RIGHT':
        dir = this.playerDirections.RIGHT_ANI[this.animationIndex];
        break;
      case 'UP':
        dir = this.playerDirections.UP_ANI[this.animationIndex];
        break;
      case 'DOWN':
        dir = this.playerDirections.DOWN_ANI[this.animationIndex];
        break;
    }
    return [dir, 0];
  }

  update() {
    // handle movement
    const input = this.engineRef.input;
    let dirX = 0;
    let dirY = 0;

    this.isMoving = false;
    let pressed = true;
    if (input._isDown(this.movement.LEFT)) {
      if (this.playerHead === 'LEFT') {
        dirX = -1;
      } else {
        this.playerHead = 'LEFT';
      }
    } else if (input._isDown(this.movement.RIGHT)) {
      if (this.playerHead === 'RIGHT') {
        dirX = 1;
      } else {
        this.playerHead = 'RIGHT';
        this.animationIndex = 0;
      }
    } else if (input._isDown(this.movement.UP)) {
      if (this.playerHead === 'UP') {
        dirY = -1;
      } else {
        this.playerHead = 'UP';
        this.animationIndex = 0;
      }
    } else if (input._isDown(this.movement.DOWN)) {
      if (this.playerHead === 'DOWN') {
        dirY = 1;
      } else {
        this.playerHead = 'DOWN';
        this.animationIndex = 0;
      }
    } else {
      pressed = false;
    }

    if (pressed) {
      this.isMoving = true;
      this.animationCounter += 1;
      if (this.animationCounter >= this.animationFrameLimit) {
        this.animationCounter = 0;
        this.animationIndex = (this.animationIndex + 1) % 2;
      }
    }

    if (!this.isMoving) {
      this.animationCounter = 0;
      this.animationIndex = 0;
    }

    this.move(dirX, dirY);
  }

  move(dirX: number, dirY: number) {
    // calc next postion
    const deltaTime = this.engineRef.time.delta;
    const moveFactor = this.movement.SPEED * deltaTime;
    let newPos = {
      x: this.position.x + dirX * moveFactor,
      y: this.position.y + dirY * moveFactor,
    };

    // check for collision
    // const isCollided = this.engineRef.checkMapCollider({
    //   x: Math.floor(newPos.x),
    //   y: Math.floor(newPos.y),
    // });

    // if no collision, move
    this.position = newPos;
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
        // move player
        this.position.x = newPos.x;
        this.position.y = newPos.y;

        // move camera
        this.engineRef.camera?.follow(this);
      }
    }
  }
}

const getPlayer = async (engine: Engine, pos: Position, imageSrc: string) => {
  const player = new Player(engine, pos, imageSrc);
  await player.loadImage();
  return player;
};

export default getPlayer;
export {Player};
