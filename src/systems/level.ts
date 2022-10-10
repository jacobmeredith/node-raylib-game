import * as r from "raylib";
import { readFileSync } from "fs";
import { Entity, System } from "../ecs";
import { tilePrefab } from "../prefabs/tile";
import gameState from "../state";
import { Controllable, Gate, Interactable, Position } from "../components";
import spatialHash from "../spatial-hash";
import { LevelBuilderSys, LevelStatusSys } from "./";
import gameEvents from "../events";
import { GameStatesEnum } from "../manager";
import { buttonPrefab } from "../prefabs/button";
import { gatePrefab } from "../prefabs/gate";
import { playerPrefab } from "../prefabs/player";

export class LevelBuilderSystem extends System {
  componentsRequired = new Set<Function>([]);

  private tileMap: Record<string, { color: r.Color; collider: boolean }> = {
    X: { color: r.DARKGRAY, collider: true },
  };

  private entitiesMap: Record<string, string> = {
    X: "button",
    P: "player",
    G: "gate",
  };

  fileTo2DArray(text: string): Array<{ x: number; y: number; type: string }> {
    const data: Array<{ x: number; y: number; type: string }> = [];

    const lines = text.split("\n");

    lines.forEach((line, y) => {
      const columns = line.split("");
      columns.forEach((char, x) => {
        data.push({ x, y, type: char });
      });
    });

    return data;
  }

  buildTiles(level: number) {
    const fileContent = readFileSync(
      process.cwd() + `/assets/levels/${level}/tiles.txt`
    )?.toString();

    if (fileContent) {
      const tiles = this.fileTo2DArray(fileContent);

      tiles
        .filter((tile) => tile.type !== ".")
        .forEach((tile) => {
          const tileOptions = this.tileMap[tile.type];
          if (tileOptions && this.ecs) {
            tilePrefab(
              this.ecs,
              tile.x,
              tile.y,
              32,
              32,
              tileOptions.color,
              tileOptions.collider
            );
          }
        });
    }
  }

  buildEntities(level: number) {
    const fileContent = readFileSync(
      process.cwd() + `/assets/levels/${level}/entities.txt`
    )?.toString();

    if (fileContent) {
      const entities = this.fileTo2DArray(fileContent);

      entities
        .filter((entity) => entity.type !== "." && entity.type !== "P")
        .forEach((entity) => {
          const entityType = this.entitiesMap[entity.type];
          if (this.ecs) {
            switch (entityType) {
              case "button":
                buttonPrefab(this.ecs, entity.x, entity.y, 32, 32);
                break;
              case "gate":
                gatePrefab(this.ecs, entity.x, entity.y, 32, 32);
                break;
              default:
                break;
            }
          }
        });

      entities
        .filter((entity) => entity.type === "P")
        .forEach((entity) => {
          if (this.ecs) {
            playerPrefab(this.ecs, entity.x, entity.y, 32, 32);
          }
        });
    }
  }

  update() {
    try {
      this.buildTiles(gameState.level);
      this.buildEntities(gameState.level);
    } catch {
      this.ecs?.clearAllEntities();
      gameState.finished = true;
      gameEvents.emit("update-game-state", GameStatesEnum.Completed);
    }

    this.disabled = true;
  }
}

export class LevelStatusSystem extends System {
  componentsRequired = new Set<Function>([Interactable]);

  update(entities: Set<Entity>) {
    const arr: boolean[] = [];

    for (let entity of entities) {
      const interactable = this.ecs?.getComponents(entity)?.get(Interactable);

      if (interactable) {
        arr.push(interactable.interacted);
      }
    }

    const remaining = arr.filter((val) => val === false).length;
    if (remaining < 1) {
      this.disabled = true;

      const gates = this.ecs?.getEntitiesByComponent(Gate);
      gates?.forEach((gate) => {
        const gateComp = this.ecs?.getComponents(gate)?.get(Gate);
        if (gateComp) {
          gateComp.open = true;
        }
      });
    }
  }
}

export class GateSystem extends System {
  componentsRequired = new Set<Function>([Gate, Position]);

  update(entities: Set<Entity>) {
    for (let entity of entities) {
      const gate = this.ecs?.getComponents(entity)?.get(Gate);

      if (!gate || !gate?.open) {
        return;
      }

      const position = this.ecs?.getComponents(entity)?.get(Position);

      if (position) {
        const possibleEntering = spatialHash.getInRange(
          position.x,
          position.y,
          32
        );

        possibleEntering
          .filter((e) => e !== entity)
          .forEach((e) => {
            const controllable = this.ecs?.getComponents(e)?.get(Controllable);

            if (controllable) {
              this.ecs?.clearAllEntities();

              gameState.level++;

              LevelBuilderSys.disabled = false;
              LevelStatusSys.disabled = false;
            }
          });
      }
    }
  }
}
