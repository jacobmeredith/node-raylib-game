import {
  Position,
  PreviousPosition,
  Velocity,
  Size,
  CameraFollow,
  Controllable,
  Collidable,
  DrawColour,
} from "../components";
import spatialHash from "../spatial-hash";
import { ECS } from "../ecs";
import * as r from "raylib";

export const playerPrefab = (
  ecs: ECS,
  x: number,
  y: number,
  width: number,
  height: number
): number => {
  const player = ecs.addEntity();

  ecs.addComponent(player, new Position(x * width, y * height));
  ecs.addComponent(player, new PreviousPosition(x, y));
  ecs.addComponent(player, new Velocity(0, 0));
  ecs.addComponent(player, new Size(width, height));
  ecs.addComponent(player, new CameraFollow());
  ecs.addComponent(player, new Controllable());
  ecs.addComponent(player, new Collidable());
  ecs.addComponent(player, new DrawColour(r.WHITE));

  spatialHash.add(x, y, player);

  return player;
};
