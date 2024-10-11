import { Graphics } from "./graphics.js";

export class Texture {
    colour: string;

    constructor(colour?: string) {
        this.colour = colour ? colour : Graphics.fg;
    }

    static randomTexture(): Texture {
        return new Texture(`rgb(${Math.random()*255}, ${Math.random()*255}, ${Math.random()*255})`);
    }
}