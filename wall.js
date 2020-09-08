import { Vector } from './vector.js';
import { HitBox } from './hitbox.js';

export class Wall extends HitBox {
  constructor (topLeft, bottomRight) {
    super(topLeft, bottomRight);
  }

  draw (ctx) {
    ctx.fillStyle = 'orange';
    const dimensions = Vector.subtract(this.bottomRight, this.topLeft);
    ctx.fillRect(this.topLeft.x, this.topLeft.y, dimensions.x, dimensions.y);
  }
}
