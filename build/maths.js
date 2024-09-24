"use strict";
class Vec2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    magSq() {
        return this.x * this.x + this.y * this.y;
    }
    add(v) {
        return new Vec2(this.x + v.x, this.y + v.y);
    }
    sub(v) {
        return new Vec2(this.x - v.x, this.y - v.y);
    }
    mult(s) {
        return new Vec2(this.x * s, this.y * s);
    }
    div(s) {
        if (s !== 0) {
            return new Vec2(this.x / s, this.y / s);
        }
        else {
            console.error("Cannot divide by zero.");
            return null;
        }
    }
    heading() {
        return Math.atan2(this.y, this.x);
    }
    norm() {
        let m = this.mag();
        if (m !== 0) {
            return this.div(m);
        }
        else {
            console.error("Cannot normalize a zero vector.");
            return null;
        }
    }
    abs() {
        return new Vec2(Math.abs(this.x), Math.abs(this.y));
    }
    toArray() {
        return [this.x, this.y];
    }
    static fromArray(arr) {
        return new Vec2(arr[0], arr[1]);
    }
    static fromHeading(angle, length) {
        return new Vec2(length * Math.cos(angle), length * Math.sin(angle));
    }
    toString() {
        return `x: ${this.x} y: ${this.y}`;
    }
}
class Vec3 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
    magSq() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }
    add(v) {
        return new Vec3(this.x + v.x, this.y + v.y, this.z + v.z);
    }
    sub(v) {
        return new Vec3(this.x - v.x, this.y - v.y, this.z - v.z);
    }
    mult(s) {
        return new Vec3(this.x * s, this.y * s, this.z * s);
    }
    div(s) {
        if (s !== 0) {
            return new Vec3(this.x / s, this.y / s, this.z / s);
        }
        else {
            console.error("Cannot divide by zero.");
            return null;
        }
    }
    norm() {
        let m = this.mag();
        if (m !== 0) {
            return this.div(m);
        }
        else {
            console.error("Cannot normalize a zero vector.");
            return null;
        }
    }
    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }
    abs() {
        return new Vec3(Math.abs(this.x), Math.abs(this.y), Math.abs(this.z));
    }
    toArray() {
        return [this.x, this.y, this.z];
    }
    static fromArray(arr) {
        return new Vec3(arr[0], arr[1], arr[2]);
    }
    toString() {
        return `x: ${this.x} y: ${this.y} z: ${this.z}`;
    }
}
class Mat3x3 {
    constructor(a1, a2, a3, b1, b2, b3, c1, c2, c3) {
        this.matrix = [
            [a1, a2, a3],
            [b1, b2, b3],
            [c1, c2, c3]
        ];
    }
    mult(other) {
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
        }
        else if (other instanceof Vec3) {
            const result = [0, 0, 0];
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    result[i] += this.matrix[i][j] * other.toArray()[j];
                }
            }
            return Vec3.fromArray(result);
        }
        throw new Error("Invalid type for multiplication.");
    }
    add(other) {
        const result = new Mat3x3(0, 0, 0, 0, 0, 0, 0, 0, 0);
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                result.matrix[i][j] = this.matrix[i][j] + other.matrix[i][j];
            }
        }
        return result;
    }
    sub(other) {
        const result = new Mat3x3(0, 0, 0, 0, 0, 0, 0, 0, 0);
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                result.matrix[i][j] = this.matrix[i][j] - other.matrix[i][j];
            }
        }
        return result;
    }
    det() {
        const m = this.matrix;
        return (m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
            m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
            m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]));
    }
    inverse() {
        const det = this.det();
        if (det === 0) {
            console.error("Matrix is singular and cannot be inverted.");
            return new Mat3x3(0, 0, 0, 0, 0, 0, 0, 0, 0);
        }
        const m = this.matrix;
        const invDet = 1 / det;
        return new Mat3x3(invDet * (m[1][1] * m[2][2] - m[1][2] * m[2][1]), invDet * (m[0][2] * m[2][1] - m[0][1] * m[2][2]), invDet * (m[0][1] * m[1][2] - m[0][2] * m[1][1]), invDet * (m[1][2] * m[2][0] - m[1][0] * m[2][2]), invDet * (m[0][0] * m[2][2] - m[0][2] * m[2][0]), invDet * (m[0][2] * m[1][0] - m[0][0] * m[1][2]), invDet * (m[1][0] * m[2][1] - m[1][1] * m[2][0]), invDet * (m[0][1] * m[2][0] - m[0][0] * m[2][1]), invDet * (m[0][0] * m[1][1] - m[0][1] * m[1][0]));
    }
    toString() {
        return `${this.matrix[0][0]} ${this.matrix[0][1]} ${this.matrix[0][2]} \n ${this.matrix[1][0]} ${this.matrix[1][1]} ${this.matrix[1][2]} \n ${this.matrix[2][0]} ${this.matrix[2][1]} ${this.matrix[2][2]}`;
    }
}
class Mat2x2 {
    constructor(a1, a2, b1, b2) {
        this.matrix = [
            [a1, a2],
            [b1, b2]
        ];
    }
    mult(other) {
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
        }
        else if (other instanceof Vec2) {
            const result = [0, 0];
            for (let i = 0; i < 2; i++) {
                for (let j = 0; j < 2; j++) {
                    result[i] += this.matrix[i][j] * other.toArray()[j];
                }
            }
            return Vec2.fromArray(result);
        }
        throw new Error("Invalid type for multiplication.");
    }
    add(other) {
        const result = new Mat2x2(0, 0, 0, 0);
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                result.matrix[i][j] = this.matrix[i][j] + other.matrix[i][j];
            }
        }
        return result;
    }
    sub(other) {
        const result = new Mat2x2(0, 0, 0, 0);
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                result.matrix[i][j] = this.matrix[i][j] - other.matrix[i][j];
            }
        }
        return result;
    }
    det() {
        const m = this.matrix;
        return m[0][0] * m[1][1] - m[0][1] * m[1][0];
    }
    inverse() {
        const det = this.det();
        if (det === 0) {
            console.error("Matrix is singular and cannot be inverted.");
            return new Mat2x2(0, 0, 0, 0);
        }
        const m = this.matrix;
        const invDet = 1 / det;
        return new Mat2x2(invDet * m[1][1], -invDet * m[0][1], -invDet * m[1][0], invDet * m[0][0]);
    }
}
