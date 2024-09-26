"use strict";
class GameObject {
    constructor(physicsBody, transform, mesh, playerController) {
        this.physicsBody = physicsBody ? physicsBody : new PhysicsBody();
        this.transform = transform ? transform : new Transform();
        this.mesh = mesh ? mesh : new Mesh();
        this.controller = playerController ? playerController : new PlayerController();
    }
    update(dt) {
        if (this.controller) {
            this.transform = this.controller.handleInput();
        }
        if (this.physicsBody) {
            this.transform.pos = this.physicsBody.update(dt);
        }
    }
}
class Scene {
    constructor(gameObjects) {
        this.gameObjects = gameObjects ? gameObjects : [];
    }
}
class Transform {
    constructor(pos, scale, rotate) {
        this.pos = pos ? pos : new Vec3(0, 0, 0);
        this.scale = scale ? scale : new Vec3(0, 0, 0);
        this.rotate = rotate ? rotate : new Vec3(0, 0, 0);
    }
}
class Mesh {
    constructor(triArray) {
        this.triArray = triArray ? triArray : [];
    }
}
class Camera {
    constructor(pos, heading, elevation, fov) {
        this.pos = pos ? pos : new Vec3(0, 0, 0);
        this.heading = heading ? heading : 0;
        this.elevation = elevation ? elevation : 0;
        this.fov = fov ? fov * Math.PI / 180 : Math.PI / 2;
    }
    setState(pos, heading, elevation) {
        this.pos = pos;
        this.heading = heading;
        this.elevation = elevation;
    }
    getFocalLength() {
        return 1 / Math.tan(this.fov / 2);
    }
}
class Tri {
    constructor(vertexArray, id, colour = Graphics.fg) {
        this.vertexArray = vertexArray;
        this.id = id;
        this.colour = colour;
    }
    static handleString(str) {
        let triArray = [];
        let tris = str.split("\n\n");
        tris.forEach(triStr => {
            let vArrStrArr = triStr.trim().split("\n");
            let vArr = [];
            vArrStrArr.forEach(vArrStr => {
                let vStrArr = vArrStr.split(" ");
                vArr.push(new Vec3(+vStrArr[0], +vStrArr[1], +vStrArr[2]));
            });
            triArray.push(new Tri(vArr, Math.round(Math.random() * 100), `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`));
        });
        //console.log("The output of handle string: ",triArray, str)
        return triArray;
    }
    translate(offsetX, offsetY, offsetZ) {
        let vArr = [];
        this.vertexArray.forEach(v => {
            vArr.push(new Vec3(v.x + offsetX, v.y + offsetY, v.z + offsetZ));
        });
        return new Tri(vArr, this.id, this.colour);
    }
    rotate(theta, phi, centreX, centreY, centreZ) {
        // Translate so cam is the origin
        let offset = this.translate(-centreX, -centreY, -centreZ);
        // Rotate according to angles
        let st = -Math.sin(theta);
        let ct = Math.cos(theta);
        let rotMat1 = new Mat3x3(ct, 0, st, 0, 1, 0, -st, 0, ct);
        st = -Math.sin(phi);
        ct = Math.cos(phi);
        let rotMat2 = new Mat3x3(1, 0, 0, 0, ct, -st, 0, st, ct);
        let vArr = [];
        offset.vertexArray.forEach(v => {
            let rotV = rotMat1.mult(rotMat2.mult((new Vec3(v.x, v.y, v.z))));
            vArr.push(new Vec3(rotV.x, rotV.y, rotV.z));
        });
        let newTri = new Tri(vArr, this.id, this.colour);
        newTri = newTri.translate(centreX, centreY, centreZ);
        return newTri;
        /*
        // Translate so cam is origin
        let transV = new Vec3(vertex.x - cam.x, vertex.y - cam.y, vertex.z - cam.z)

        // Rotate so cam is facing forwards
        let st = -Math.sin(cam.heading);
        let ct = Math.cos(cam.heading);
        let rotMat = new Mat3x3(ct, 0, st, 0, 1, 0, -st, 0, ct);
        st = -Math.sin(cam.elevation);
        ct = Math.cos(cam.elevation);
        let rotMat2 = new Mat3x3(1, 0, 0, 0, ct, -st, 0, st, ct);
        let rotV = rotMat2.mult(rotMat.mult(new Vec3(transV.x, transV.y, transV.z))) as Vec3;
        return rotV;
        */
    }
    getCentroid() {
        let vArr = this.vertexArray;
        return vArr[0].add(vArr[1]).add(vArr[2]).div(3);
    }
}
class Tri2d {
    constructor(vertexArray, id, colour = Graphics.fg) {
        this.vertexArray = vertexArray;
        this.id = id;
        this.colour = colour;
    }
}
