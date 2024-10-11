import { Transform } from "./transform.js";
import { Graphics } from "./graphics.js";
import { Vec3, Mat3x3, Vec2 } from "./maths.js";
import { Texture } from "./texture.js";

export class Tri {
    // 3d object representing a triangle in space, made of 3 vertecies

    vertexArray: Array<Vec3>;
    id: number;
    texture: Texture;

    constructor(vertexArray: Array<Vec3>, id?: number, texture?: Texture) {
        this.vertexArray = vertexArray;
        this.id = id ? id : 0;
        this.texture = texture ? texture : new Texture();
    }

    static handleString(str: string): Array<Tri> {
        let triArray: Array<Tri> = []
        let tris = str.split("\n\n")
        tris.forEach(triStr => {
            let vArrStrArr = triStr.trim().split("\n");
            let vArr: Array<Vec3> = []
            vArrStrArr.forEach(vArrStr => {
                let vStrArr = vArrStr.split(" ");
                vArr.push(new Vec3(+vStrArr[0], +vStrArr[1], +vStrArr[2]));
            })
            triArray.push(new Tri(vArr, Math.round(Math.random()*100), Texture.randomTexture()))
        })
        //console.log("The output of handle string: ",triArray, str)
        return triArray;
    }

    translate(offset: Vec3): Tri {
        let vArr: Array<Vec3> = [];
        this.vertexArray.forEach(v => {
            vArr.push(v.add(offset));
        })
        return new Tri(vArr, this.id, this.texture);
    }

    rotate(theta: number, phi: number, centre: Vec3): Tri {
        // Translate so cam is the origin
        let offset = this.translate(centre);
        // Rotate according to angles
        let st = -Math.sin(theta);
        let ct = Math.cos(theta);
        let rotMat1 = new Mat3x3(ct, 0, st, 0, 1, 0, -st, 0, ct);
        st = -Math.sin(phi);
        ct = Math.cos(phi);
        let rotMat2 = new Mat3x3(1, 0, 0, 0, ct, -st, 0, st, ct);
        let vArr: Array<Vec3> = [];
        offset.vertexArray.forEach(v => {
            let rotV = rotMat1.mult(rotMat2.mult((new Vec3(v.x, v.y, v.z)))) as Vec3;
            vArr.push(new Vec3(rotV.x, rotV.y, rotV.z));
        })
        let newTri = new Tri(vArr, this.id, this.texture);
        newTri = newTri.translate(centre);
        return newTri;
    }

    scale(size: Vec3, centre: Vec3) {
        let vArr: Vec3[] = [];
        let transT = this.translate(centre.mult(-1));
        transT.vertexArray.forEach((v, i) => {
            vArr[i] = v.mult(size.toArray()[i]);
        })
        return new Tri(vArr, 0);
    }

    transform(t: Transform): Tri {
        let newT = this.scale(t.scale, new Vec3());
        newT = newT.rotate(t.rotate.y, t.rotate.x, new Vec3());
        newT = newT.translate(t.pos);
        newT.texture = this.texture;
        return newT;
    }

    getCentroid(): Vec3 {
        let vArr = this.vertexArray;
        return vArr[0].add(vArr[1]).add(vArr[2]).div(3)!;
    }
}

export class Tri2d {
    // 3d object representing a triangle in space, made of 3 vertecies

    vertexArray: Array<Vec2>;
    id: number;
    colour: string;

    constructor(vertexArray: Array<Vec2>, id: number, colour: string = Graphics.fg) {
        this.vertexArray = vertexArray;
        this.id = id;
        this.colour = colour;
    }
}