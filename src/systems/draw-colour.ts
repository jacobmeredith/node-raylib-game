import * as r from "raylib";
import { DrawColour, Position, Size } from "./../components";
import { Entity, System } from "../ecs";

export class DrawColourSystem extends System {
  componentsRequired = new Set<Function>([DrawColour, Position, Size]);

  update(entities: Set<Entity>): void {
    for (let entity of entities) {
      const colour = this.ecs?.getComponents(entity)?.get(DrawColour);
      const position = this.ecs?.getComponents(entity)?.get(Position);
      const size = this.ecs?.getComponents(entity)?.get(Size);
      if (colour && position && size) {
        r.DrawRectangle(position.x, position.y, size.x, size.y, colour.colour);
      }
    }
  }
}
