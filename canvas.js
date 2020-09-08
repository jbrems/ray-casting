import { Map } from './map.js';
import { Vector } from './vector.js';
import { Player } from './player.js';

export class Canvas {
  width = 1024;
  height = 640;

  constructor (canvasElement) {
    this.nativeElement = canvasElement;
    this.setup();
  }

  get ctx () {
    return this.nativeElement.getContext('2d');
  }

  setup () {
    this.nativeElement.setAttribute('height', this.height);
    this.nativeElement.setAttribute('width', this.width);

    this.mapOffset = new Vector(this.width - 200, this.height - 200);
    this.map = new Map(this.mapOffset, 200, 200);
    this.player = new Player(this.mapOffset);

    this.start();
  }

  async start () {
    this.isRunning = true;
    while (this.isRunning) {
      this.update();
      this.draw();
      await this.sleep(33);
    }
  }

  update () {
    this.player.update(this.map.walls);
    this.player.checkCollisions(this.map.walls);
  }

  draw () {
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.drawFov(this.player.fovHits);

    this.map.draw(this.ctx);
    this.player.draw(this.ctx);

    this.ctx.fillStyle = 'white';
    this.ctx.font = '22px Arial';
    const instructions = 'Move around with W, A, S, D or ⬆️, ⬇️, ⬅️, ➡️.';
    this.ctx.fillText(instructions, this.width / 2 - this.ctx.measureText(instructions).width / 2, this.height - 25);
  }

  drawFov (fovHits) {
    const fovHitWidth = this.width / fovHits.length;

    this.ctx.fillStyle = 'cyan';
    this.ctx.fillRect(0, 0, this.width, this.height / 2);

    this.ctx.fillStyle = 'grey';
    this.ctx.fillRect(0, this.height / 2, this.width, this.height / 2);

    fovHits.forEach((fovHit, index) => {
      const relativeDistance = fovHit.distance / 200;
      this.ctx.fillStyle = `hsl(0, 100%, ${Math.floor(50 - relativeDistance * 50)}%)`;
      const yOffset = this.height / 2 - relativeDistance * this.height / 2 + 50;
      this.ctx.fillRect(index * fovHitWidth, this.height / 2 - yOffset, fovHitWidth + 1, yOffset * 2);
    });
  }

  sleep (timeInMs) {
    return new Promise((resolve) => {
      setTimeout(resolve, timeInMs);
    });
  }

  onKeyDown (event) {
    this.player.onKeyDown(event);
  }

  onKeyUp (event) {
    this.player.onKeyUp(event);
  }
}
