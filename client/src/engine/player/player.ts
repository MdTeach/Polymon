import RpgScene from 'engine/scenes/rpg_walkable_scene';
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
  isMoving = false;

  private movement = {
    LEFT: 'a',
    RIGHT: 'd',
    UP: 'w',
    DOWN: 's',
    SPEED: 3,
    // SPEED: 1,
  };
  playerHead: String;
  scene: RpgScene;

  constructor(
    scene: RpgScene,
    pos: Position = {x: 0, y: 0},
    imageSrc: string = '',
  ) {
    super(pos, imageSrc);
    this.playerHead = 'LEFT';
    this.scene = scene;
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
    const input = this.scene.engine.input;
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
    } else {
      this.move(dirX, dirY);
    }
  }

  move(dirX: number, dirY: number) {
    const deltaTime = this.scene.engine.time.delta;
    const moveFactor = this.movement.SPEED * deltaTime;
    let newPos = {
      x: this.position.x + dirX * moveFactor,
      y: this.position.y + dirY * moveFactor,
    };

    const isCollided = this.scene.checkMapCollider(
      dirX > 0 || dirY > 0
        ? {x: newPos.x + 1, y: newPos.y + 1}
        : {x: newPos.x, y: newPos.y},
    );

    // if no collision, move
    if (!isCollided) {
      this.position = newPos;
    }
  }
}

const getPlayer = async (scene: RpgScene, pos: Position, imageSrc: string) => {
  const player = new Player(scene, pos, imageSrc);
  await player.loadImage();
  return player;
};

export default getPlayer;
export {Player};
