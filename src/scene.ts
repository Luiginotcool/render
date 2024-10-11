import { GameObject } from "./gameObject.js";

export class Scene {
    gameObjects: Array<GameObject>;

    constructor(gameObjects? : Array<GameObject>) {
        this.gameObjects = gameObjects ? gameObjects : [];
    }
}