class Map {
  tiles: number[];
  rows: number;
  cols: number;
  tsize: number;
  tileSheet: HTMLImageElement;

  constructor(
    tileSheet: HTMLImageElement,
    tiles: number[],
    rows: number,
    cols: number,
    tsize: number = 16,
  ) {
    this.tileSheet = tileSheet;
    this.tiles = tiles;
    this.rows = rows;
    this.cols = cols;
    this.tsize = tsize;
  }

  getTile(col: number, row: number) {
    return this.tiles[row * this.cols + col];
  }
}
export {Map};
