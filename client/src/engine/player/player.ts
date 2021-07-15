import playerSprite from 'assets/player/player.png';

interface Position {
  x: number;
  y: number;
}

class Player {
  playerImg: HTMLImageElement;
  constructor(pos: Position = {x: 0, y: 0}) {
    this.playerImg = new Image();
    this.playerImg.src = playerSprite;
  }

  loadImage() {
    return new Promise((resolve, reject) => {
      try {
        this.playerImg.onload = () => {
          resolve(true);
        };
      } catch (e) {
        reject(e);
      }
    });
  }
}

const getPlayer = async (pos: Position) => {
  const player = new Player(pos);
  await player.loadImage();
  return player;
};

export default getPlayer;
export {Player};
