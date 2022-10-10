import { Size, Collidable, Position, DrawColour } from "../components";
import { ECS } from "../ecs";
import spatialHash from "../spatial-hash";
import * as r from "raylib";

export const tilePrefab = (
  ecs: ECS,
  x: number,
  y: number,
  width: number,
  height: number,
  color: r.Color,
  collidable: boolean
): number => {
  const tileEntity = ecs.addEntity();
  const size = new Size(width, height);

  if (collidable) {
    ecs.addComponent(tileEntity, new Collidable());
  }

  ecs.addComponent(tileEntity, new Position(x * width, y * height));
  ecs.addComponent(tileEntity, new DrawColour(color));
  ecs.addComponent(tileEntity, size);

  spatialHash.add(x * width, y * height, tileEntity);

  return tileEntity;
};
