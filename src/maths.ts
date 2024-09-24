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

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
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