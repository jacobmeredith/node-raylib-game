import { ECS } from "./ecs";
import * as r from "raylib";
import gameEvents from "./events";
import {
  CameraFollowSys,
  ControllableSys,
  CollidableSys,
  DrawColourSys,
  TransfromSys,
  LevelBuilderSys,
  LevelStatusSys,
  InteractionSys,
  GateSys,
} from "./systems";

export enum GameStatesEnum {
  Loading,
  MainMenu,
  Options,
  StartPlaying,
  Playing,
  Paused,
  Completed,
}

export class GameManager {
  public state: GameStatesEnum = GameStatesEnum.MainMenu;
  public ecs: ECS = new ECS();
  public camera: r.Camera2D = {
    offset: { x: 800 / 2 - 32 / 2, y: 450 / 2 - 32 / 2 },
    target: { x: 0, y: 0 },
    rotation: 0,
    zoom: 1,
  };

  private attachSystems(): void {
    LevelBuilderSys.disabled = true;
    CameraFollowSys.disabled = true;
    ControllableSys.disabled = true;
    CollidableSys.disabled = true;
    DrawColourSys.disabled = true;
    TransfromSys.disabled = true;
    LevelStatusSys.disabled = true;
    InteractionSys.disabled = true;
    GateSys.disabled = true;

    CameraFollowSys.camera = this.camera;

    this.ecs.addSystem(LevelBuilderSys);
    this.ecs.addSystem(CameraFollowSys);
    this.ecs.addSystem(ControllableSys);
    this.ecs.addSystem(TransfromSys);
    this.ecs.addSystem(CollidableSys);
    this.ecs.addSystem(DrawColourSys);
    this.ecs.addSystem(LevelStatusSys);
    this.ecs.addSystem(InteractionSys);
    this.ecs.addSystem(GateSys);
  }

  public startup(): void {
    // Add any event handlers
    gameEvents.on("update-game-state", this.handleGameStateChange.bind(this));
    this.attachSystems();
  }

  public handleGameStateChange(state: GameStatesEnum): void {
    this.state = state;

    switch (this.state) {
      case GameStatesEnum.Loading:
        break;
      case GameStatesEnum.MainMenu:
        break;
      case GameStatesEnum.Options:
        break;
      case GameStatesEnum.StartPlaying:
        LevelBuilderSys.disabled = false;
        CameraFollowSys.disabled = false;
        ControllableSys.disabled = false;
        CollidableSys.disabled = false;
        DrawColourSys.disabled = false;
        TransfromSys.disabled = false;
        LevelStatusSys.disabled = false;
        InteractionSys.disabled = false;
        GateSys.disabled = false;
        break;
      case GameStatesEnum.Playing:
        LevelBuilderSys.disabled = true;
        CameraFollowSys.disabled = false;
        ControllableSys.disabled = false;
        CollidableSys.disabled = false;
        DrawColourSys.disabled = false;
        TransfromSys.disabled = false;
        LevelStatusSys.disabled = false;
        InteractionSys.disabled = false;
        GateSys.disabled = false;
        break;
      case GameStatesEnum.Paused:
        LevelBuilderSys.disabled = true;
        CameraFollowSys.disabled = true;
        ControllableSys.disabled = true;
        CollidableSys.disabled = true;
        DrawColourSys.disabled = false;
        TransfromSys.disabled = true;
        LevelStatusSys.disabled = true;
        InteractionSys.disabled = true;
        GateSys.disabled = true;
        break;
      case GameStatesEnum.Completed:
        console.log("Completed");
        LevelBuilderSys.disabled = true;
        CameraFollowSys.disabled = true;
        ControllableSys.disabled = true;
        CollidableSys.disabled = true;
        DrawColourSys.disabled = true;
        TransfromSys.disabled = true;
        LevelStatusSys.disabled = true;
        InteractionSys.disabled = true;
        GateSys.disabled = true;
        break;
      default:
        break;
    }
  }

  public update(): void {
    if (r.IsKeyPressed(r.KEY_P)) {
      gameEvents.emit("update-game-state", GameStatesEnum.StartPlaying);
    }

    if (r.IsKeyPressed(r.KEY_SPACE)) {
      gameEvents.emit("update-game-state", GameStatesEnum.Paused);
    }

    if (r.IsKeyPressed(r.KEY_L)) {
      gameEvents.emit("update-game-state", GameStatesEnum.Playing);
    }

    this.ecs.update();
  }
}
