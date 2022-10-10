import { Component } from "./ecs";
import * as r from "raylib";

export class Collidable extends Component {}
export class CameraFollow extends Component {}
export class Controllable extends Component {}

export class Gate extends Component {
  constructor(public open: boolean) {
    super();
  }
}

export class DrawColour extends Component {
  constructor(public colour: r.Color) {
    super();
  }
}

export class Size extends Component {
  constructor(public x: number, public y: number) {
    super();
  }
}

export class PreviousPosition extends Component {
  constructor(public x: number, public y: number) {
    super();
  }
}

export class Position extends Component {
  constructor(public x: number, public y: number) {
    super();
  }
}

export class Velocity extends Component {
  constructor(public x: number, public y: number) {
    super();
  }
}

export class Interactable extends Component {
  constructor(
    public key: number,
    public interacted: boolean,
    public radius: number
  ) {
    super();
  }
}
