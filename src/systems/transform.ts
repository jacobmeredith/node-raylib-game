import { Position, PreviousPosition, Velocity } from "./../components";
import { Entity, System } from "../ecs";
import spatialHash from "../spatial-hash";

export class TransformSystem extends System {
  componentsRequired = new Set<Function>([Position, PreviousPosition]);

  update(entities: Set<Entity>): void {
    for (let entity of entities) {
      const position = this.ecs?.getComponents(entity)?.get(Position);
      const prevPosition = this.ecs
        ?.getComponents(entity)
        ?.get(PreviousPosition);

      if (
        position &&
        prevPosition &&
        (position.x !== prevPosition.x || position.y !== prevPosition.y)
      ) {
        spatialHash.removeInRange(prevPosition.x, prevPosition.y, 64, entity);
        spatialHash.add(position.x, position.y, entity);
      }
    }
  }
}
