import GameObject from 'engine/utils/GameObject';

interface Position {
  x: number;
  y: number;
}

class Player extends GameObject {
  constructor(pos: Position = {x: 0, y: 0}, imageSrc: string = '') {
    super(pos, imageSrc);
  }
}

const getPlayer = async (pos: Position, imageSrc: string) => {
  const player = new Player(pos, imageSrc);
  await player.loadImage();
  return player;
};

export default getPlayer;
export {Player};
