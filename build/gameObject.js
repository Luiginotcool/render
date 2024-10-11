import { Transform } from "./transform.js";
export class GameObject {
    constructor(physicsBody, transform, mesh, playerController) {
        this.physicsBody = physicsBody !== null && physicsBody !== void 0 ? physicsBody : null;
        this.transform = transform ? transform : new Transform();
        this.mesh = mesh !== null && mesh !== void 0 ? mesh : null;
        this.controller = playerController !== null && playerController !== void 0 ? playerController : null;
    }
    update(dt) {
        // If this has a controller, update position based on inputs
        // If this has a physics body, update position based on physics
        if (this.has(this.controller)) {
            this.setTrans(this.controller.handleInput());
        }
        if (this.has(this.physicsBody)) {
            this.setTrans(new Transform(this.physicsBody.update(dt)));
        }
    }
    has(component) {
        return !!component;
    }
    setTrans(trans) {
        this.transform = trans;
        if (this.has(this.physicsBody)) {
            this.physicsBody.pos = trans.pos;
        }
    }
}
