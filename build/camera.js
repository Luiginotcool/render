import { Vec3 } from "./maths.js";
export class Camera {
    constructor(pos, heading, elevation, fov) {
        this.pos = pos ? pos : new Vec3(0, 0, 0);
        this.heading = heading ? heading : 0;
        this.elevation = elevation ? elevation : 0;
        this.fov = fov ? fov * Math.PI / 180 : Math.PI / 2;
    }
    setState(transform) {
        //console.log("We are in set state: ", transform.pos)
        this.pos = transform.pos;
        this.heading = transform.rotate.y;
        this.elevation = transform.rotate.x;
    }
    getFocalLength() {
        return 1 / Math.tan(this.fov / 2);
    }
}
