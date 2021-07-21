import {Position} from 'types/Common';
import Scene from './scene';

abstract class RpgScene extends Scene {
  abstract checkMapCollider(pos: Position): boolean;
  abstract checkLocationEvent(pos: Position, tile: number): boolean;
}

export default RpgScene;
