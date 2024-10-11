import { Vec3 } from "./maths.js";

export class Transform {
    pos: Vec3;
    scale: Vec3;
    rotate: Vec3;

    constructor(pos?: Vec3, scale?: Vec3, rotate?: Vec3) {
        this.pos = pos ? pos : new Vec3(0, 0, 0);
        this.scale = scale ? scale : new Vec3(1, 1, 1);
        this.rotate = rotate ? rotate : new Vec3(0, 0, 0);
    }
}
