import { Vector } from './vector.js';

export class HitBox {
  constructor (topLeft, bottomRight) {
    this.topLeft = topLeft;
    this.bottomRight = bottomRight;
  }

  get topRight () {
    return new Vector(this.bottomRight.x, this.topLeft.y);
  }

  get bottomLeft () {
    return new Vector(this.topLeft.x, this.bottomRight.y);
  }

  intersects (hitBox) {
    return this.vectorHits(hitBox.topLeft) || this.vectorHits(hitBox.topRight) || this.vectorHits(hitBox.bottomLeft) || this.vectorHits(hitBox.bottomRight);
  }

  vectorHits (vector) {
    return vector.x > this.topLeft.x && vector.x < this.bottomRight.x && vector.y > this.topLeft.y && vector.y < this.bottomRight.y;
  }
}
