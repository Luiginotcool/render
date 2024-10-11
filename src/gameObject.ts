import { Transform } from "./transform.js";
import { Mesh } from "./mesh.js";
import { PhysicsBody } from "./physics.js";
import { PlayerController } from "./player.js";

export class GameObject {
    physicsBody: PhysicsBody | null;
    transform: Transform;
    mesh: Mesh | null;
    controller: PlayerController | null;

    constructor(physicsBody?: PhysicsBody, transform?: Transform, mesh?: Mesh, playerController?: PlayerController) {
        this.physicsBody = physicsBody ?? null;

        this.transform = transform ? transform : new Transform();

        this.mesh = mesh ?? null;

        this.controller = playerController ?? null;

    }

    update(dt: number) {

        // If this has a controller, update position based on inputs
        // If this has a physics body, update position based on physics

        if(this.has(this.controller)) {
            this.setTrans(this.controller!.handleInput());
        }

        if (this.has(this.physicsBody)) {
            this.setTrans(new Transform(this.physicsBody!.update(dt)));
        }
    }

    has(component: PhysicsBody | Transform | Mesh | PlayerController | null): boolean {
        return !!component
    }

    setTrans(trans: Transform) {
        this.transform = trans;
        if (this.has(this.physicsBody)) {
            this.physicsBody!.pos = trans.pos;
        }
    }
}
