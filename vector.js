export class Vector {
  constructor (x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }

  get magnitude () {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  static add (vector1, vector2) {
    return new Vector(vector1.x + vector2.x, vector1.y + vector2.y);
  }

  static subtract (vector1, vector2) {
    return new Vector(vector1.x - vector2.x, vector1.y - vector2.y);
  }

  static multiply (vector, amount) {
    return new Vector(vector.x * amount, vector.y * amount);
  }

  add (vector) {
    this.x = this.x + vector.x;
    this.y = this.y + vector.y;
  }

  subtract (vector) {
    this.x = this.x - vector.x;
    this.y = this.y - vector.y;
  }

  multiply (amount) {
    this.x = this.x * amount;
    this.y = this.y * amount;
  }
}
