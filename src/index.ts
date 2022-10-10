import { GameManager, GameStatesEnum } from "./manager";
import * as r from "raylib";

const screenWidth = 800;
const screenHeight = 450;

r.InitWindow(screenWidth, screenHeight, "raylib [core] example - basic window");
r.SetTargetFPS(120);

const manager = new GameManager();

manager.startup();

while (!r.WindowShouldClose()) {
  r.BeginDrawing();
  r.BeginMode2D(manager.camera);

  r.ClearBackground(r.BLACK);

  manager.update();

  r.EndMode2D();
  r.EndDrawing();
}

r.CloseWindow();
