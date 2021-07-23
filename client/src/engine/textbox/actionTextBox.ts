import {Position} from 'types/Common';

class ActionTextBox {
  pos: Position;
  height = 0;
  width = 0;
  fontSize = 26;
  padding = 0.1;
  charLimit = 55;
  lineLimit = 3;

  // for the text animation
  wordIdx = 0;
  maxIdx = 0;
  counter = 0;
  animationSpeed = 0.01;
  animated = false;

  constructor(pos: Position) {
    this.pos = pos;
  }

  render(ctx: CanvasRenderingContext2D, deltaTime: number) {
    ctx.fillStyle = '#000000';
    ctx.lineWidth = 3;

    // draw the boader
    const displayPos = {
      x: this.pos.x + this.padding * this.width * 0.1,
      y: this.pos.y - this.padding * this.height * 0.1,
    };

    const displaySize = {
      x: this.width - this.padding * this.width,
      y: this.height - this.padding * this.height,
    };

    // draw the boarder
    ctx.strokeRect(displayPos.x, displayPos.y, displaySize.x, displaySize.y);

    // draw inner box
    const innerBoxPos = {
      x: displayPos.x + displaySize.x / 2 - 10,
      y: displayPos.y + 0.05 * displaySize.y,
    };
    const innerBoxSize = {
      x: displaySize.x / 2,
      y: 0.9 * displaySize.y,
    };
    ctx.strokeRect(
      innerBoxPos.x,
      innerBoxPos.y,
      innerBoxSize.x,
      innerBoxSize.y,
    );

    // inner box actions
    const textWidth = 0.3 * innerBoxSize.x;
    const textOffSetX = 0.15 * innerBoxSize.x;
    const textHeight = 0.3 * innerBoxSize.y;
    const textOffSetY = 0.1 * innerBoxSize.y;

    ctx.font = `bold ${24}px pokemon`;
    ctx.fillText(
      'FIGHT',
      innerBoxPos.x + textOffSetX,
      innerBoxPos.y + textHeight + textOffSetY,
      textWidth,
    );

    ctx.fillText(
      'PACK',
      innerBoxPos.x + textOffSetX + textWidth + textOffSetX,
      innerBoxPos.y + textHeight + textOffSetY,
      textWidth,
    );

    ctx.fillText(
      'POKEMONS',
      innerBoxPos.x + textOffSetX,
      innerBoxPos.y + textHeight * 2 + 1.25 * textOffSetY,
      textWidth,
    );

    ctx.fillText(
      'RUN',
      innerBoxPos.x + textOffSetX + textWidth + textOffSetX,
      innerBoxPos.y + textHeight * 2 + 1.25 * textOffSetY,
      textWidth,
    );

    // draw selection triangle
    const trPosX = innerBoxPos.x + textOffSetX / 1.5;
    const trPosY = innerBoxPos.y + textOffSetY * 2.5;
    const path = new Path2D();
    path.moveTo(trPosX, trPosY);
    path.lineTo(trPosX + 25, trPosY + 15);
    path.lineTo(trPosX, trPosY + 30);
    ctx.fill(path);

    return this.animated;
  }

  handleAnimation(detlaTime: number) {
    if (this.wordIdx >= this.maxIdx) {
      this.animated = true;
      return;
    }
    this.counter += detlaTime;

    if (this.counter > this.animationSpeed) {
      this.counter = 0;
      this.wordIdx++;
    }
  }

  reset() {
    this.wordIdx = 0;
    this.counter = 0;
    this.animated = false;
  }
}

export default ActionTextBox;
