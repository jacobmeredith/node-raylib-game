import {
  Interactable,
  Position,
  Controllable,
  DrawColour,
} from "../components";
import { System, Entity } from "../ecs";
import * as r from "raylib";
import spatialHash from "../spatial-hash";

export class InteractionSystem extends System {
  componentsRequired = new Set<Function>([Interactable, Position]);

  public update(entities: Set<Entity>): void {
    for (let entity of entities) {
      const interactable = this.ecs?.getComponents(entity)?.get(Interactable);
      const position = this.ecs?.getComponents(entity)?.get(Position);

      if (
        interactable &&
        position &&
        r.IsKeyPressed(interactable.key) &&
        !interactable.interacted
      ) {
        const potentialEntites = spatialHash.getInRange(
          position.x,
          position.y,
          interactable.radius
        );

        potentialEntites
          .filter((e) => e !== entity)
          .forEach((entityB) => {
            const controllable = this.ecs
              ?.getComponents(entityB)
              ?.get(Controllable);

            if (controllable) {
              interactable.interacted = true;

              // This shouldn't be here
              const drawColour = this.ecs
                ?.getComponents(entity)
                ?.get(DrawColour);

              if (drawColour) {
                drawColour.colour = r.GREEN;
              }
            }
          });
      }
    }
  }
}
