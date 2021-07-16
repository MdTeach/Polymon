import {TileData} from 'types/TiledData';

class Map {
  tileData: TileData;
  tileSheet: HTMLImageElement;

  constructor(tileSheetSrc: string, tileData: TileData) {
    this.tileSheet = new Image();
    this.tileSheet.src = tileSheetSrc;
    this.tileData = tileData;
  }

  loadImage() {
    return new Promise((resolve, reject) => {
      try {
        this.tileSheet.onload = () => {
          resolve(true);
        };
      } catch (e) {
        reject(e);
      }
    });
  }

  getTile(col: number, row: number) {
    return this.tileData.tiles[row * this.tileData.cols + col];
  }

  getTileLocation(tile: number) {
    let tilemapX = (tile - 1) % this.tileData.tileMapCols;
    let tilemapY = Math.floor((tile - 1) / this.tileData.tileMapCols);
    return [tilemapX, tilemapY];
  }
}

const loadMap = async (tileSheetSrc: string, tileData: TileData) => {
  const map = new Map(tileSheetSrc, tileData);
  await map.loadImage();
  return map;
};

export {Map, loadMap};
