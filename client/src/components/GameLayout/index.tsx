import GameEngine from 'engine';
import {useRef, useLayoutEffect} from 'react';
import './style.css';

const GameLayout = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  let gameEngine = useRef<GameEngine | null>();

  useLayoutEffect(() => {
    (() => {
      if (canvasRef.current !== null) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx !== null) {
          gameEngine.current = new GameEngine(ctx);
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
