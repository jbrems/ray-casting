import { Wall } from './wall.js';
import { Vector } from './vector.js';

const WALL_THICKNESS = 5;

export class Map {
  constructor (offset, width, height) {
    this.offset = offset;
    this.width = width;
    this.height = height;

    this.setup();
  }

  setup () {
    this.walls = [
      new Wall(Vector.add(this.offset, new Vector(0, 0)), Vector.add(this.offset, new Vector(WALL_THICKNESS, this.height))),
      new Wall(Vector.add(this.offset, new Vector(0, 0)), Vector.add(this.offset, new Vector(this.width, WALL_THICKNESS))),
      new Wall(Vector.add(this.offset, new Vector(this.width - WALL_THICKNESS, 0)), Vector.add(this.offset, new Vector(this.width, this.height))),
      new Wall(Vector.add(this.offset, new Vector(0, this.height - WALL_THICKNESS)), Vector.add(this.offset, new Vector(this.width, this.height))),
      new Wall(Vector.add(this.offset, new Vector(50, 0)), Vector.add(this.offset, new Vector(55, 100))),
      new Wall(Vector.add(this.offset, new Vector(0, 150)), Vector.add(this.offset, new Vector(75, 155))),
      new Wall(Vector.add(this.offset, new Vector(100, 50)), Vector.add(this.offset, new Vector(200, 55))),
      new Wall(Vector.add(this.offset, new Vector(125, 100)), Vector.add(this.offset, new Vector(130, 200))),
      new Wall(Vector.add(this.offset, new Vector(85, 100)), Vector.add(this.offset, new Vector(95, 110))),
    ];
  }

  draw (ctx) {
    ctx.fillStyle = 'black';
    ctx.fillRect(this.offset.x, this.offset.y, this.width, this.height);

    this.walls.forEach(wall => wall.draw(ctx));
  }
}
