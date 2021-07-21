import Engine from 'engine/engine';
import Scene from '../scene';

class BaseBattleScene extends Scene {
  // constructor(engine:Engine){
  // 		super(engine);
  // }

  start_scene() {
    alert('start_scene');
  }

  update_scene() {
    //this.engine.update_scene();
  }
}

const getBattleScene = async function (engine: Engine) {
  return new BaseBattleScene(engine);
};

export {getBattleScene};
export default BaseBattleScene;
