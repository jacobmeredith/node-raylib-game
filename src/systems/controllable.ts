import * as r from "raylib";
import { Controllable, Velocity, PreviousPosition } from "./../components";
import { Position } from "../components";
import { Entity, System } from "../ecs";

export class ControllableSystem extends System {
  componentsRequired = new Set<Function>([
    Position,
    PreviousPosition,
    Velocity,
    Controllable,
  ]);

  input(velocity: Velocity) {
    if (r.IsKeyDown(r.KEY_A) || r.IsKeyDown(r.KEY_LEFT)) {
      velocity.x -= 30;
    }

    if (r.IsKeyDown(r.KEY_D) || r.IsKeyDown(r.KEY_RIGHT)) {
      velocity.x += 30;
    }

    if (r.IsKeyDown(r.KEY_W) || r.IsKeyDown(r.KEY_UP)) {
      velocity.y -= 30;
    }

    if (r.IsKeyDown(r.KEY_S) || r.IsKeyDown(r.KEY_DOWN)) {
      velocity.y += 30;
    }
  }

  limitVelocity(velocity: Velocity) {
    if (velocity.x > 300) velocity.x = 300;

    if (velocity.x < -300) velocity.x = -300;

    if (velocity.y > 300) velocity.y = 300;

    if (velocity.y < -300) velocity.y = -300;
  }

  decelerate(velocity: Velocity) {
    if (velocity.x > 0) velocity.x -= 10;

    if (velocity.x < 0) velocity.x += 10;

    if (velocity.y > 0) velocity.y -= 10;

    if (velocity.y < 0) velocity.y += 10;
  }

  update(entities: Set<Entity>): void {
    for (let entity of entities) {
      const velocity = this.ecs?.getComponents(entity)?.get(Velocity);
      const position = this.ecs?.getComponents(entity)?.get(Position);
      const prevPosition = this.ecs
        ?.getComponents(entity)
        ?.get(PreviousPosition);

      if (velocity && position && prevPosition) {
        prevPosition.x = position.x;
        prevPosition.y = position.y;

        this.input(velocity);
        this.limitVelocity(velocity);
        this.decelerate(velocity);

        position.x += velocity.x * r.GetFrameTime();
        position.y += velocity.y * r.GetFrameTime();
      }
    }
  }
}
