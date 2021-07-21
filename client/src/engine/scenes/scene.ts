import Engine from 'engine/engine';

abstract class Scene {
  engine: Engine;
  constructor(engine: Engine) {
    this.engine = engine;
  }

  abstract start_scene(): void;
  abstract update_scene(): void;
}

export default Scene;
