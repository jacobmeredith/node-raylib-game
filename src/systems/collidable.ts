import { Collidable, PreviousPosition, Size, Velocity } from "./../components";
import { Position } from "../components";
import { Entity, System } from "../ecs";
import spatialHash from "../spatial-hash";
import { isAabbCollision } from "../helpers/aabb";

enum CollisionSurface {
  top,
  bottom,
  left,
  right,
}

function collisionSide(
  a_x: number,
  a_y: number,
  a_width: number,
  a_height: number,
  b_x: number,
  b_y: number,
  b_width: number,
  b_height: number
) {
  const subjectBottom = a_y + a_height;
  const targetBottom = b_y + b_height;
  const subjectRight = a_x + a_width;
  const targetRight = b_x + b_width;

  const b_collision = targetBottom - a_y;
  const t_collision = subjectBottom - b_y;
  const l_collision = subjectRight - b_x;
  const r_collision = targetRight - a_x;

  if (
    t_collision < b_collision &&
    t_collision < l_collision &&
    t_collision < r_collision
  ) {
    return CollisionSurface.bottom;
  }
  if (
    b_collision < t_collision &&
    b_collision < l_collision &&
    b_collision < r_collision
  ) {
    return CollisionSurface.top;
  }
  if (
    l_collision < r_collision &&
    l_collision < t_collision &&
    l_collision < b_collision
  ) {
    return CollisionSurface.right;
  }
  if (
    r_collision < l_collision &&
    r_collision < t_collision &&
    r_collision < b_collision
  ) {
    return CollisionSurface.left;
  }

  return undefined;
}

export class CollidableSystem extends System {
  componentsRequired = new Set<Function>([
    Collidable,
    Position,
    PreviousPosition,
    Size,
    Velocity,
  ]);

  update(entities: Set<Entity>): void {
    for (let entity of entities) {
      const entityPosition = this.ecs?.getComponents(entity)?.get(Position);
      const entityPreviousPosition = this.ecs
        ?.getComponents(entity)
        ?.get(PreviousPosition);

      if (entityPreviousPosition !== entityPosition) {
        const entitySize = this.ecs?.getComponents(entity)?.get(Size);
        const entityVelocity = this.ecs?.getComponents(entity)?.get(Velocity);

        if (
          entityPosition &&
          entityPreviousPosition &&
          entitySize &&
          entityVelocity
        ) {
          const potentialCollisionsCurrent = spatialHash.getInRange(
            entityPosition.x,
            entityPosition.y,
            32
          );

          potentialCollisionsCurrent.forEach((entityB) => {
            const entityBCollidable = this.ecs
              ?.getComponents(entityB)
              ?.get(Collidable);

            if (entityBCollidable && entityB !== entity) {
              const entityBPosition = this.ecs
                ?.getComponents(entityB)
                ?.get(Position);
              const entityBSize = this.ecs?.getComponents(entityB)?.get(Size);

              if (
                entityBPosition &&
                entityBSize &&
                isAabbCollision(
                  entityPosition.x,
                  entityPosition.y,
                  entitySize.x,
                  entitySize.y,
                  entityBPosition.x,
                  entityBPosition.y,
                  entityBSize.x,
                  entityBSize.y
                )
              ) {
                const side = collisionSide(
                  entityPosition.x,
                  entityPosition.y,
                  entitySize.x,
                  entitySize.y,
                  entityBPosition.x,
                  entityBPosition.y,
                  entityBSize.x,
                  entityBSize.y
                );

                switch (side) {
                  case CollisionSurface.top:
                    entityPosition.y = entityBPosition.y + entityBSize.y;
                    entityVelocity.y = 0;
                    break;
                  case CollisionSurface.bottom:
                    entityPosition.y = entityBPosition.y - entityBSize.y;
                    entityVelocity.y = 0;
                    break;
                  case CollisionSurface.left:
                    entityPosition.x = entityBPosition.x + entityBSize.x;
                    entityVelocity.x = 0;
                    break;
                  case CollisionSurface.right:
                    entityPosition.x = entityBPosition.x - entityBSize.x;
                    entityVelocity.x = 0;
                    break;
                  default:
                    break;
                }
              }
            }
          });
        }
      }
    }
  }
}
