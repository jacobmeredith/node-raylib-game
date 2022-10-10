import { Size, Position, DrawColour, Interactable } from "../components";
import { ECS } from "../ecs";
import spatialHash from "../spatial-hash";
import * as r from "raylib";

export const buttonPrefab = (
  ecs: ECS,
  x: number,
  y: number,
  width: number,
  height: number
): number => {
  const buttonEntity = ecs.addEntity();
  const size = new Size(width, height);

  ecs.addComponent(buttonEntity, new Position(x * width, y * height));
  ecs.addComponent(buttonEntity, new DrawColour(r.BLUE));
  ecs.addComponent(buttonEntity, size);
  ecs.addComponent(buttonEntity, new Interactable(r.KEY_E, false, 32));

  spatialHash.add(x * width, y * height, buttonEntity);

  return buttonEntity;
};
