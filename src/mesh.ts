import { Transform } from "./transform.js";
import { Vec3 } from "./maths.js";
import { Texture } from "./texture.js";
import { Tri } from "./tri.js";

export class Mesh {
    triArray: Array<Tri>
    textureArray: Array<Texture>

    constructor(triArray?: Array<Tri>, textureArray?: Array<Texture>) {
        this.triArray = triArray ? triArray : [];
        this.textureArray = textureArray ? textureArray : [];
    }

    static cubeMesh(transform: Transform): Mesh {
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
    
        const triangles: Tri[] = [];
    
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
            const v4 = cubeVertices[face[3]];
            const v5 = cubeVertices[face[4]];
            const v6 = cubeVertices[face[5]];

            let newTri1 = new Tri([v1,v2,v3], 0);
            let newTri2 = new Tri([v4,v5,v6], 0);
            
            newTri1 = newTri1.rotate(transform.rotate.y, transform.rotate.x, new Vec3());
            newTri1 = newTri1.scale(transform.scale, new Vec3());
            newTri1 = newTri1.translate(transform.pos);
                        
            newTri2 = newTri2.rotate(transform.rotate.y, transform.rotate.x, new Vec3());
            newTri2 = newTri2.scale(transform.scale, new Vec3());
            newTri2 = newTri2.translate(transform.pos);


            triangles.push(newTri1, newTri2);
        }
    
        return new Mesh(triangles);
    }

    randomiseTextures(): void {
        for (let i = 0; i < this.triArray.length; i++) {
            this.textureArray[i] = Texture.randomTexture();
        }
    }
}
