import { Transform } from "./transform.js";
import { App } from "./app.js";
import { Input } from "./input.js";
import { Vec3 } from "./maths.js";

export class PlayerController {
    pos: Vec3;
    speed: number;
    heading: number;
    elevation: number;

    constructor(pos?: Vec3) {
        this.pos = pos ? pos : new Vec3(0,0,0);
        this.speed = 0.1
        this.heading = 0;
        this.elevation = 0;
    }

    handleInput(): Transform {
        // Calculate forward direction
        let vx = this.speed * -Math.sin(this.heading);
        let vz = this.speed * Math.cos(this.heading);
        if (Input.keys.up) {
            this.pos.x -= vx
            this.pos.z += vz;
            //console.log(this.z)
        }
        if (Input.keys.down) {
            this.pos.x += vx;
            this.pos.z -= vz;
        }
        if (Input.keys.left) {
            this.pos.x -= vz;
            this.pos.z -= vx;
        }
        if (Input.keys.right) {
            this.pos.x += vz;
            this.pos.z += vx;
        }

        if (Input.keys.space) {
            this.pos.y += this.speed
            //console.log(this.pos)
        }

        if (Input.keys.shift) {
            this.pos.y -= this.speed;
        }

        if (document.pointerLockElement === App.canvas) {
            if (Input.mouseX) {
                this.heading += Input.mouseDx * App.mouseSensitivity;
                this.elevation += Input.mouseDy * App.mouseSensitivity;
                Input.mouseX = 0;
                Input.mouseY = 0;
            } else {
                Input.mouseX = 0;
            }
        }
        return new Transform(this.pos, undefined, new Vec3(this.elevation, this.heading, 0) );
    }
}