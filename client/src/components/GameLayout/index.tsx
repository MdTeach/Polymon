import GameEngine from 'engine/engine';
import {useRef, useLayoutEffect} from 'react';
import './style.css';
import {loadMap, Map} from 'engine/maps/Map';

const GameLayout = ({mapData}: {mapData: Map}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  let gameEngine = useRef<GameEngine | null>();

  useLayoutEffect(() => {
    (() => {
      if (canvasRef.current !== null) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx !== null) {
          gameEngine.current = new GameEngine(ctx, mapData);
          // gameEngine.current.start(false);
          gameEngine.current.start();
        }
      }
    })();
  }, [canvasRef]);
  return (
    <div className="container">
      <canvas ref={canvasRef} />
    </div>
  );
};
export default GameLayout;
