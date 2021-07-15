interface CameraConfig {
  width: number;
  height: number;
  scaleF: number;
}

interface EngineConfig {
  camera: CameraConfig;
}

export {CameraConfig, EngineConfig};
