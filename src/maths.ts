class Vec2 {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    mag(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    magSq(): number {
        return this.x * this.x + this.y * this.y;
    }

    add(v: Vec2): Vec2 {
        return new Vec2(this.x + v.x, this.y + v.y);
    }

    sub(v: Vec2): Vec2 {
        return new Vec2(this.x - v.x, this.y - v.y);
    }

    mult(s: number): Vec2 {
        return new Vec2(this.x * s, this.y * s);
    }

    div(s: number): Vec2 | null {
        if (s !== 0) {
            return new Vec2(this.x / s, this.y / s);
        } else {
            console.error("Cannot divide by zero.");
            return null;
        }
    }

    heading(): number {
        return Math.atan2(this.y, this.x);
    }

    norm(): Vec2 | null {
        let m = this.mag();
        if (m !== 0) {
            return this.div(m);
        } else {
            console.error("Cannot normalize a zero vector.");
            return null;
        }
    }

    abs(): Vec2 {
        return new Vec2(Math.abs(this.x), Math.abs(this.y));
    }

    toArray(): number[] {
        return [this.x, this.y];
    }

    static fromArray(arr: number[]): Vec2 {
        return new Vec2(arr[0], arr[1]);
    }

    static fromHeading(angle: number, length: number): Vec2 {
        return new Vec2(length * Math.cos(angle), length * Math.sin(angle));
    }

    toString(): string {
        return `x: ${this.x} y: ${this.y}`;
    }
}

class Vec3 {
    x: number;
    y: number;
    z: number;

    constructor(x?: number, y?: number, z?: number) {
        this.x = x ? x : 0;
        this.y = y ? y : 0;
        this.z = z ? z : 0;
    }

    mag(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    magSq(): number {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }

    add(v: Vec3): Vec3 {
        return new Vec3(this.x + v.x, this.y + v.y, this.z + v.z);
    }

    sub(v: Vec3): Vec3 {
        return new Vec3(this.x - v.x, this.y - v.y, this.z - v.z);
    }

    mult(s: number): Vec3 {
        return new Vec3(this.x * s, this.y * s, this.z * s);
    }

    div(s: number): Vec3 | null {
        if (s !== 0) {
            return new Vec3(this.x / s, this.y / s, this.z / s);
        } else {
            console.error("Cannot divide by zero.");
            return null;
        }
    }

    norm(): Vec3 | null {
        let m = this.mag();
        if (m !== 0) {
            return this.div(m);
        } else {
            console.error("Cannot normalize a zero vector.");
            return null;
        }
    }

    dot(v: Vec3): number {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    abs(): Vec3 {
        return new Vec3(Math.abs(this.x), Math.abs(this.y), Math.abs(this.z));
    }

    toArray(): number[] {
        return [this.x, this.y, this.z];
    }

    static fromArray(arr: number[]): Vec3 {
        return new Vec3(arr[0], arr[1], arr[2]);
    }

    static randomVec(): Vec3 {
        return new Vec3(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5).norm()!;
    }
    

    toString(): string {
        return `x: ${this.x} y: ${this.y} z: ${this.z}`;
    }
}

class Mat3x3 {
    matrix: number[][];

    constructor(a1: number, a2: number, a3: number, b1: number, b2: number, b3: number, c1: number, c2: number, c3: number) {
        this.matrix = [
            [a1, a2, a3],
            [b1, b2, b3],
            [c1, c2, c3]
        ];
    }

    mult(other: Mat3x3 | Vec3): Mat3x3 | Vec3 {
        if (other instanceof Mat3x3) {
            const result = new Mat3x3(0, 0, 0, 0, 0, 0, 0, 0, 0);

            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    result.matrix[i][j] = 0;
                    for (let k = 0; k < 3; k++) {
                        result.matrix[i][j] += (this.matrix[i][k] * other.matrix[k][j]);
                    }
                }
            }

            return result;
        } else if (other instanceof Vec3) {
            const result: number[] = [0, 0, 0];

            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    result[i] += this.matrix[i][j] * other.toArray()[j];
                }
            }
            return Vec3.fromArray(result);
        }
        throw new Error("Invalid type for multiplication.");
    }

    add(other: Mat3x3): Mat3x3 {
        const result = new Mat3x3(0, 0, 0, 0, 0, 0, 0, 0, 0);

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                result.matrix[i][j] = this.matrix[i][j] + other.matrix[i][j];
            }
        }

        return result;
    }

    sub(other: Mat3x3): Mat3x3 {
        const result = new Mat3x3(0, 0, 0, 0, 0, 0, 0, 0, 0);

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                result.matrix[i][j] = this.matrix[i][j] - other.matrix[i][j];
            }
        }

        return result;
    }

    det(): number {
        const m = this.matrix;
        return (
            m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
            m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
            m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0])
        );
    }

    inverse(): Mat3x3 {
        const det = this.det();
        if (det === 0) {
            console.error("Matrix is singular and cannot be inverted.");
            return new Mat3x3(0, 0, 0, 0, 0, 0, 0, 0, 0);
        }

        const m = this.matrix;
        const invDet = 1 / det;

        return new Mat3x3(
            invDet * (m[1][1] * m[2][2] - m[1][2] * m[2][1]),
            invDet * (m[0][2] * m[2][1] - m[0][1] * m[2][2]),
            invDet * (m[0][1] * m[1][2] - m[0][2] * m[1][1]),

            invDet * (m[1][2] * m[2][0] - m[1][0] * m[2][2]),
            invDet * (m[0][0] * m[2][2] - m[0][2] * m[2][0]),
            invDet * (m[0][2] * m[1][0] - m[0][0] * m[1][2]),

            invDet * (m[1][0] * m[2][1] - m[1][1] * m[2][0]),
            invDet * (m[0][1] * m[2][0] - m[0][0] * m[2][1]),
            invDet * (m[0][0] * m[1][1] - m[0][1] * m[1][0])
        );
    }

    toString(): string {
        return `${this.matrix[0][0]} ${this.matrix[0][1]} ${this.matrix[0][2]} \n ${this.matrix[1][0]} ${this.matrix[1][1]} ${this.matrix[1][2]} \n ${this.matrix[2][0]} ${this.matrix[2][1]} ${this.matrix[2][2]}`;
    }

}

class Mat2x2 {
    matrix: number[][];

    constructor(a1: number, a2: number, b1: number, b2: number) {
        this.matrix = [
            [a1, a2],
            [b1, b2]
        ];
    }

    mult(other: Mat2x2 | Vec2): Mat2x2 | Vec2 {
        if (other instanceof Mat2x2) {
            const result = new Mat2x2(0, 0, 0, 0);

            for (let i = 0; i < 2; i++) {
                for (let j = 0; j < 2; j++) {
                    result.matrix[i][j] = 0;
                    for (let k = 0; k < 2; k++) {
                        result.matrix[i][j] += (this.matrix[i][k] * other.matrix[k][j]);
                    }
                }
            }

            return result;
        } else if (other instanceof Vec2) {
            const result: number[] = [0, 0];

            for (let i = 0; i < 2; i++) {
                for (let j = 0; j < 2; j++) {
                    result[i] += this.matrix[i][j] * other.toArray()[j];
                }
            }
            return Vec2.fromArray(result);
        }
        throw new Error("Invalid type for multiplication.");
    }

    add(other: Mat2x2): Mat2x2 {
        const result = new Mat2x2(0, 0, 0, 0);

        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                result.matrix[i][j] = this.matrix[i][j] + other.matrix[i][j];
            }
        }

        return result;
    }

    sub(other: Mat2x2): Mat2x2 {
        const result = new Mat2x2(0, 0, 0, 0);

        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                result.matrix[i][j] = this.matrix[i][j] - other.matrix[i][j];
            }
        }

        return result;
    }

    det(): number {
        const m = this.matrix;
        return m[0][0] * m[1][1] - m[0][1] * m[1][0];
    }

    inverse(): Mat2x2 {
        const det = this.det();
        if (det === 0) {
            console.error("Matrix is singular and cannot be inverted.");
            return new Mat2x2(0, 0, 0, 0);
        }

        const m = this.matrix;
        const invDet = 1 / det;

        return new Mat2x2(
            invDet * m[1][1], -invDet * m[0][1],
            -invDet * m[1][0], invDet * m[0][0]
        );
    }
}

class Geometry {

    static vectorPlaneIntersect(planeP: Vec3, planeN: Vec3, lineStart: Vec3, lineEnd: Vec3): Vec3 {
        planeN = planeN.norm()!;
        let planeD = -planeN.dot(planeP);
        let ad = lineStart.dot(planeN);
        let bd = lineEnd.dot(planeN);
        let t = (-planeD - ad) / (bd - ad);
        let lineStartToEnd = lineEnd.sub(lineStart);
        let lineToIntersect = lineStartToEnd.mult(t);
        return lineStart.add(lineToIntersect);
    }

    static triangleClipAgainstPlane(planeP: Vec3, planeN: Vec3, tri: Tri): Array<Tri> {
        planeN = planeN.norm()!;

        let insidePoints: Array<Vec3> = [];
        let outsidePoints: Array<Vec3> = [];

        let distArr: Array<number> = []

        tri.vertexArray.forEach((v, i) => {
            distArr.push(this.signedDistPointToPlane(v, planeP, planeN));
            if (this.signedDistPointToPlane(v, planeP, planeN) >= 0) {
                insidePoints.push(v);
            } else {
                outsidePoints.push(v);
            }
        })

        if (insidePoints.length == 0) {
            return [];
        }

        if (insidePoints.length == 3) {
            return [tri];
        }

        if (insidePoints.length == 1) {
            let vArr: Array<Vec3> = [];
            vArr.push(insidePoints[0]);
            vArr.push(this.vectorPlaneIntersect(planeP, planeN, insidePoints[0], outsidePoints[0]));
            vArr.push(this.vectorPlaneIntersect(planeP, planeN, insidePoints[0], outsidePoints[1]));
            //let v1 = Render.detranslateToCam(vArr[1], Render.camArray[0]);
            //let v2 = Render.detranslateToCam(vArr[2], Render.camArray[0]);
            //Render.drawPoint3d(v1.x, v1.y, v1.z, Render.camArray[0])
            //Render.drawPoint3d(v2.x, v2.y, v2.z, Render.camArray[0])
            let clipped = new Tri(vArr, tri.id + 1, tri.colour)
            //console.log("CLIPPED", clipped)                       ///////////                 ///////////////                 ////////////////                /////////
            return [clipped];
        }

        if (insidePoints.length == 2) {
            let vArr1: Array<Vec3> = [];
            let vArr2: Array<Vec3> = [];

            vArr1.push(insidePoints[0]);
            vArr1.push(insidePoints[1]);
            vArr1.push(this.vectorPlaneIntersect(planeP, planeN, insidePoints[0], outsidePoints[0]));


            vArr2.push(insidePoints[1]);
            vArr2.push(this.vectorPlaneIntersect(planeP, planeN, insidePoints[1], outsidePoints[0]));
            vArr2.push(vArr1[2]);


            return [new Tri(vArr1, tri.id, tri.colour), new Tri(vArr2, tri.id + 1, tri.colour)];
        }

        return [];
    }

    static lineClipAgainstPlane(planeP: Vec3, planeN: Vec3, v1: Vec3, v2: Vec3): Array<Vec3> {
        let insidePoints: Array<Vec3> = []
        let outsidePoints: Array<Vec3> = [];

        [v1, v2].forEach(v => {
            if (Geometry.signedDistPointToPlane(v, planeP, planeN) >= 0) {
                insidePoints.push(v);
            } else {
                outsidePoints.push(v);
            }
        })

        if (insidePoints.length == 0) {
            return [];
        }

        if (insidePoints.length == 2) {
            return [v1, v2];
        }

        //let intersect = Render.detranslateToCam(this.vectorPlaneIntersect(planeP, planeN, v1, v2), Render.camArray[0]);
        //Render.drawPoint3d(intersect.x, intersect.y, intersect.z, Render.camArray[0])

        return [insidePoints[0], this.vectorPlaneIntersect(planeP, planeN, v1, v2)];
    
    }

    static signedDistPointToPlane(point: Vec3, planeP: Vec3, planeN: Vec3): number {
        planeN = planeN.norm()!;
        return (planeN.dot(point) - planeN.dot(planeP))
    }

    static rotatePointsAboutAxis(vArr: Array<Vec3>, axis: Vec3, theta: number): Array<Vec3> {
        
        if (axis.magSq() != 1) {
            axis = axis.norm()!;
        }

        let ux, uy, uz, ct, st;
        ct = Math.cos(theta);
        st = Math.sin(theta);
        ux = axis.x;
        uy = axis.y;
        uz = axis.z;
        let rotMat = new Mat3x3(
            ux*ux*(1-ct)+ct,    ux*uy*(1-ct) - uz*st,   ux*uz*(1-ct)+uy*st,
            ux*uy*(1-ct)+uz*st, uy*uy*(1-ct)+ct,        uy*uz*(1-ct)-ux*st,
            ux*uz*(1-ct)-uy*st, uy*uz*(1-ct)+ux*st,     uz*uz*(1-ct)+ct    
        )

        let rotArr: Array<Vec3> = [];

        vArr.forEach(v => {rotArr.push(rotMat.mult(v) as Vec3);})

        return rotArr;

    }
}