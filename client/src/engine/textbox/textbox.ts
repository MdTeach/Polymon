import {Position} from 'types/Common';

class TextBox {
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

  render(ctx: CanvasRenderingContext2D, text: string, deltaTime: number) {
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
    ctx.strokeRect(displayPos.x, displayPos.y, displaySize.x, displaySize.y);

    // write the text
    this.maxIdx = text.length - 1;
    const textFrame = text.substr(0, this.wordIdx);
    const clippedWord = textFrame.substr(0, this.charLimit * this.lineLimit);
    const numIter = Math.floor(clippedWord.length / this.charLimit);
    this.fontSize = Math.floor(this.width / 70);
    ctx.font = `bold ${this.fontSize}px pokemon`;

    const pad = 50 * 1.2;
    for (let i = 0; i <= numIter; i++) {
      const textToRender = clippedWord.substr(
        i * this.charLimit,
        this.charLimit,
      );

      ctx.fillText(
        textToRender,
        displayPos.x + pad,
        displayPos.y + pad * (1 + i),
      );
    }

    this.handleAnimation(deltaTime);
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
}

export default TextBox;
