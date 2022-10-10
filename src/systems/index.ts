import { TransformSystem } from "./transform";
import { ControllableSystem } from "./controllable";
import { DrawColourSystem } from "./draw-colour";
import { CollidableSystem } from "./collidable";
import { CameraFollowSystem } from "./camera-follow";
import { GateSystem, LevelBuilderSystem, LevelStatusSystem } from "./level";
import { InteractionSystem } from "./interaction";

export const CameraFollowSys = new CameraFollowSystem();
export const CollidableSys = new CollidableSystem();
export const ControllableSys = new ControllableSystem();
export const DrawColourSys = new DrawColourSystem();
export const TransfromSys = new TransformSystem();
export const LevelBuilderSys = new LevelBuilderSystem();
export const LevelStatusSys = new LevelStatusSystem();
export const InteractionSys = new InteractionSystem();
export const GateSys = new GateSystem();
