import { Vector } from './vector.js';
import { HitBox } from './hitbox.js';

const PLAYER_SIZE = 3;

export class Player {
  isMovingForward = false;
  isMovingBackward = false;
  isTurningLeft = false;
  isTurningRight = false;

  constructor (mapOffset) {
    this.pos = Vector.add(mapOffset, new Vector(25, 20));
    this.dir = Math.PI / 2;
  }

  get directionVector () {
    return new Vector(Math.cos(this.dir), Math.sin(this.dir));
  }

  get hitBox () {
    return new HitBox(
      Vector.subtract(this.pos, new Vector(PLAYER_SIZE, PLAYER_SIZE)),
      Vector.add(this.pos, new Vector(PLAYER_SIZE, PLAYER_SIZE)),
    );
  }

  update (walls) {
    this.move();
    this.fovHits = this.castFovRays(walls);
  }

  draw (ctx) {
    this.drawFov(ctx);
    this.drawPlayer(ctx);
  }

  drawPlayer (ctx) {
    ctx.fillStyle = 'gold';
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, PLAYER_SIZE, 0, 2 * Math.PI);
    ctx.fill();

    // ctx.strokeStyle = 'white';
    // ctx.strokeRect(this.hitBox.topLeft.x, this.hitBox.topLeft.y, PLAYER_SIZE * 2, PLAYER_SIZE * 2);
  }

  drawFov (ctx) {
    this.fovHits.forEach((fovHit) => {
      ctx.strokeStyle = 'red';
      ctx.beginPath();
      ctx.moveTo(this.pos.x, this.pos.y);
      ctx.lineTo(fovHit.point.x, fovHit.point.y);
      ctx.stroke();
    });
  }

  move () {
    if (this.isMovingForward) this.moveForward();
    if (this.isMovingBackward) this.moveBackward();
    if (this.isTurningLeft) this.turnLeft();
    if (this.isTurningRight) this.turnRight();
  }

  moveForward () {
    this.pos.add(Vector.multiply(this.directionVector, 2));
  }

  moveBackward () {
    this.pos.subtract(Vector.multiply(this.directionVector, 2));
  }

  turnLeft () {
    this.dir = (this.dir - .1) % (2 * Math.PI);
  }

  turnRight () {
    this.dir = (this.dir + .1) % (2 * Math.PI);
  }

  checkCollisions (walls) {
    const wallHit = walls.some((wall) => wall.intersects(this.hitBox));
    if (wallHit && this.isMovingForward) this.moveBackward();
    if (wallHit && this.isMovingBackward) this.moveForward();
  }

  castFovRays (walls) {
    const fovHitPoints = [];

    for (let dirOffset = -Math.PI / 4; dirOffset <= Math.PI / 4; dirOffset += .0125) {
      let shortestHitDistance = Infinity;
      let closestHit;

      walls.forEach(wall => {
        const hit = this.castRayToWall(dirOffset, wall);
        if (hit.point && hit.distance < shortestHitDistance) {
          shortestHitDistance = hit.distance;
          closestHit = hit;
        }
      });

      fovHitPoints.push(closestHit);
    }

    return fovHitPoints;
  }

  castRayToWall (dirOffset, wall) {
    const directionVector = new Vector(Math.cos(this.dir + dirOffset), Math.sin(this.dir + dirOffset));

    let shortestHitDistance = Infinity;
    let closestHitPoint;
    let projectedDistance;

    const topSegmentHit = this.castRayToWallSegment(directionVector, wall.topLeft, wall.topRight);
    const rightSegmentHit = this.castRayToWallSegment(directionVector, wall.topRight, wall.bottomRight);
    const bottomSegmentHit = this.castRayToWallSegment(directionVector, wall.bottomRight, wall.bottomLeft);
    const leftSegmentHit = this.castRayToWallSegment(directionVector, wall.bottomLeft, wall.topLeft);

    ({ shortestHitDistance, projectedDistance, closestHitPoint } = this.determineClosestHitPoint(shortestHitDistance, projectedDistance, closestHitPoint, topSegmentHit, dirOffset));
    ({ shortestHitDistance, projectedDistance, closestHitPoint } = this.determineClosestHitPoint(shortestHitDistance, projectedDistance, closestHitPoint, rightSegmentHit, dirOffset));
    ({ shortestHitDistance, projectedDistance, closestHitPoint } = this.determineClosestHitPoint(shortestHitDistance, projectedDistance, closestHitPoint, bottomSegmentHit, dirOffset));
    ({ shortestHitDistance, projectedDistance, closestHitPoint } = this.determineClosestHitPoint(shortestHitDistance, projectedDistance, closestHitPoint, leftSegmentHit, dirOffset));

    return { point: closestHitPoint, distance: projectedDistance };
  }

  determineClosestHitPoint (shortestHitDistance, projectedDistance, closestHitPoint, hitPoint, dirOffset) {
    if (hitPoint) {
      const distance = Vector.subtract(this.pos, hitPoint).magnitude;
      const projectedDistance = distance * Math.cos(Math.abs(dirOffset));
      if (distance < shortestHitDistance) {
        return { shortestHitDistance: distance, projectedDistance: projectedDistance, closestHitPoint: hitPoint };
      }
    }
    return { shortestHitDistance, projectedDistance, closestHitPoint };
  }

  castRayToWallSegment (directionVector, wallSegmentStart, wallSegmentEnd) {
    const x1 = wallSegmentStart.x;
    const y1 = wallSegmentStart.y;
    const x2 = wallSegmentEnd.x;
    const y2 = wallSegmentEnd.y;

    const x3 = this.pos.x;
    const y3 = this.pos.y;
    const x4 = Vector.add(this.pos, directionVector).x;
    const y4 = Vector.add(this.pos, directionVector).y;

    const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (den === 0) {
      return;
    }
    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;

    if (t > 0 && t < 1 && u > 0) {
      const x = x1 + t * (x2 - x1);
      const y = y1 + t * (y2 - y1);
      return new Vector(x, y);
    }
  }

  onKeyDown (event) {
    if (['KeyW', 'ArrowUp'].includes(event.code)) this.isMovingForward = true;
    if (['KeyS', 'ArrowDown'].includes(event.code)) this.isMovingBackward = true;
    if (['KeyA', 'ArrowLeft'].includes(event.code)) this.isTurningLeft = true;
    if (['KeyD', 'ArrowRight'].includes(event.code)) this.isTurningRight = true;
  }

  onKeyUp (event) {
    if (['KeyW', 'ArrowUp'].includes(event.code)) this.isMovingForward = false;
    if (['KeyS', 'ArrowDown'].includes(event.code)) this.isMovingBackward = false;
    if (['KeyA', 'ArrowLeft'].includes(event.code)) this.isTurningLeft = false;
    if (['KeyD', 'ArrowRight'].includes(event.code)) this.isTurningRight = false;
  }
}
