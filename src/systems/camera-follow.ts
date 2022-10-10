import * as r from "raylib";
import { CameraFollow, Velocity } from "./../components";
import { Position } from "../components";
import { Entity, System } from "../ecs";

export class CameraFollowSystem extends System {
  componentsRequired = new Set<Function>([CameraFollow, Position, Velocity]);

  public camera?: r.Camera2D;

  update(entities: Set<Entity>): void {
    if (!this.camera) return;

    for (let entity of entities) {
      let pos = this.ecs?.getComponents(entity)?.get(Position);
      if (pos) {
        this.camera.target = pos;
      }
    }
  }
}
