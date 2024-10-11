import { Graphics } from "./graphics.js";
export class Texture {
    constructor(colour) {
        this.colour = colour ? colour : Graphics.fg;
    }
    static randomTexture() {
        return new Texture(`rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`);
    }
}
