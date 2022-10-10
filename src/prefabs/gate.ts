import { Size, Position, DrawColour, Gate } from "../components";
import { ECS } from "../ecs";
import spatialHash from "../spatial-hash";
import * as r from "raylib";

export const gatePrefab = (
  ecs: ECS,
  x: number,
  y: number,
  width: number,
  height: number
): number => {
  const gateEntity = ecs.addEntity();
  const size = new Size(width, height);

  ecs.addComponent(gateEntity, new Position(x * width, y * height));
  ecs.addComponent(gateEntity, new DrawColour(r.GREEN));
  ecs.addComponent(gateEntity, new Gate(false));
  ecs.addComponent(gateEntity, size);

  spatialHash.add(x * width, y * height, gateEntity);

  return gateEntity;
};
