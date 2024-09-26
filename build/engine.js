"use strict";
class GameObject {
    constructor(physicsBody, transform, mesh, playerController) {
        this.physicsBody = physicsBody !== null && physicsBody !== void 0 ? physicsBody : null;
        this.transform = transform ? transform : new Transform();
        this.mesh = mesh !== null && mesh !== void 0 ? mesh : null;
        this.controller = playerController !== null && playerController !== void 0 ? playerController : null;
        console.log(this.controller);
    }
    update(dt) {
        if (!!this.controller) {
            this.transform = this.controller.handleInput();
            if (this.transform.pos.y != 0) {
                //console.log(this.transform.pos)
            }
        }
        if (!!this.physicsBody) {
            this.transform.pos = this.physicsBody.update(dt);
            //console.log("trans",this.transform.pos);
        }
    }
    has(component) {
        return !!component;
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
    static cubeMesh(transform) {
        const cubeVertices = [
            new Vec3(-1, -1, -1),
            new Vec3(1, -1, -1),
            new Vec3(1, 1, -1),
            new Vec3(-1, 1, -1),
            new Vec3(-1, -1, 1),
            new Vec3(1, -1, 1),
            new Vec3(1, 1, 1),
            new Vec3(-1, 1, 1),
        ];
        const triangles = [];
        // Define the triangles of the cube (6 faces, 2 triangles per face)
        const indices = [
            [0, 1, 2, 0, 2, 3], // back
            [4, 5, 6, 4, 6, 7], // front
            [0, 4, 5, 0, 5, 1], // bottom
            [2, 3, 7, 2, 7, 6], // top
            [0, 3, 7, 0, 7, 4], // left
            [1, 5, 6, 1, 6, 2], // right
        ];
        // Generate triangles from cube vertices
        for (const face of indices) {
            const v1 = cubeVertices[face[0]];
            const v2 = cubeVertices[face[1]];
            const v3 = cubeVertices[face[2]];
            let newTri = new Tri([v1, v2, v3], 0);
            newTri = newTri.rotate(transform.rotate.y, transform.rotate.x, new Vec3());
            newTri = newTri.scale(transform.scale, new Vec3());
            newTri = newTri.translate(transform.pos);
            triangles.push(newTri);
        }
        return new Mesh(triangles);
    }
}
class Camera {
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
    translate(offset) {
        let vArr = [];
        this.vertexArray.forEach(v => {
            vArr.push(v.add(offset));
        });
        return new Tri(vArr, this.id, this.colour);
    }
    rotate(theta, phi, centre) {
        // Translate so cam is the origin
        let offset = this.translate(centre);
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
        newTri = newTri.translate(centre);
        return newTri;
    }
    scale(size, centre) {
        let vArr = [];
        let transT = this.translate(centre.mult(-1));
        transT.vertexArray.forEach((v, i) => {
            vArr[i] = v.mult(size.toArray()[i]);
        });
        return new Tri(vArr, 0);
    }
    transform(t) {
        let newT = this.scale(t.scale, new Vec3());
        newT = this.rotate(t.rotate.y, t.rotate.x, new Vec3());
        newT = this.translate(t.pos);
        return newT;
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
