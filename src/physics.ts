import { Vec3 } from "./maths.js";

export class PhysicsBody {
    pos: Vec3;
    vel: Vec3;
    acc: Vec3;

    constructor(pos?: Vec3, vel?: Vec3, acc?: Vec3) {
        // vel in u/s; acc in u/s2
        this.pos = pos ? pos : new Vec3(0, 0, 0);
        this.vel = vel ? vel : new Vec3(0, 0, 0);
        this.acc = acc ? acc : new Vec3(0, 0, 0); 
    }

    update(dt: number): Vec3 {
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