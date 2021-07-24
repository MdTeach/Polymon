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

  render(
    ctx: CanvasRenderingContext2D,
    userAction: [number, number],
    data: [string, string, string, string],
  ) {
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

    const [t1, t2, t3, t4] = data;
    this.draw_action_text(t1, ctx, innerBoxSize, innerBoxPos, [0, 0]);
    this.draw_action_text(t2, ctx, innerBoxSize, innerBoxPos, [0, 1]);
    this.draw_action_text(t3, ctx, innerBoxSize, innerBoxPos, [1, 0]);
    this.draw_action_text(t4, ctx, innerBoxSize, innerBoxPos, [1, 1]);

    // draw selection triangle
    const trPosX = innerBoxPos.x + textOffSetX / 1.5;
    const trPosY = innerBoxPos.y + textOffSetY * 2.5;
    let wOff = textWidth + textOffSetX * 1;
    let hOff = textHeight * 1 + (1 / 3) * textOffSetY;

    // top left
    ctx.fill(this.get_action_arrow(trPosX, trPosY, wOff, hOff, userAction));

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

  draw_action_text(
    text: string,
    ctx: CanvasRenderingContext2D,
    innerBoxSize: Position,
    innerBoxPos: Position,
    seletedText: [number, number],
  ) {
    // inner box actions
    const textWidth = 0.3 * innerBoxSize.x;
    const textOffSetX = 0.15 * innerBoxSize.x;
    const textHeight = 0.3 * innerBoxSize.y;
    const textOffSetY = 0.1 * innerBoxSize.y;

    const [x, y] = seletedText;
    const offX = x * (textOffSetX + textWidth);
    const offY = y * (textHeight + 0.25 * textOffSetY);
    ctx.fillText(
      text,
      innerBoxPos.x + textOffSetX + offX,
      innerBoxPos.y + textHeight + textOffSetY + offY,
      textWidth,
    );
  }

  get_action_arrow(
    trPosX: number,
    trPosY: number,
    wOff: number,
    hOff: number,
    selectedAction: [number, number],
  ) {
    const [x, y] = selectedAction;
    wOff *= x;
    hOff *= y;

    const path = new Path2D();
    path.moveTo(trPosX + wOff, trPosY + hOff);
    path.lineTo(trPosX + wOff + 25, trPosY + 15 + hOff);
    path.lineTo(trPosX + wOff, trPosY + 30 + hOff);
    return path;
  }

  reset() {
    this.wordIdx = 0;
    this.counter = 0;
    this.animated = false;
  }
}

export default ActionTextBox;
