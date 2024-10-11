import { Vec3 } from "./maths.js";
export class PhysicsBody {
    constructor(pos, vel, acc) {
        // vel in u/s; acc in u/s2
        this.pos = pos ? pos : new Vec3(0, 0, 0);
        this.vel = vel ? vel : new Vec3(0, 0, 0);
        this.acc = acc ? acc : new Vec3(0, 0, 0);
    }
    update(dt) {
        // 10 u/s means after dt s, body will move 10*dt u
        this.vel = this.vel.add(this.acc.mult(dt));
        this.pos = this.pos.add(this.vel.mult(dt));
        //console.log(this.acc)
        this.acc = new Vec3();
        return this.pos;
    }
}
class Boid extends PhysicsBody {
}
