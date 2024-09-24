class Render {

    static triArray: Array<Tri>
    static camArray: Array<Camera>
    static matArray: Array<string>

    static init(): void {

        this.triArray = [];
        this.camArray = [];
        this.matArray = [];

        let triArrayString = `0 0 5
2 2 5
2 0 5

0 0 5
0 2 5
2 2 5

0 0 5
0 0 7
0 2 7

0 0 5
0 2 5
0 2 7

0 0 5
2 0 5
2 0 7

0 0 5
0 0 7
2 0 7`

        



        let vArray = [
            new Vec3(0, 0, 5),
            new Vec3(3, 3, 10),
            new Vec3(3, 0, 10)
        ];
        let myTri = new Tri(vArray, 0);

        let myCam = new Camera(0, -1, 0, 0, 0); // Camera facing towards +ve z-axis

        //this.triArray.push(myTri);
        this.camArray.push(myCam);

        this.triArray.push(...Tri.handleString(triArrayString));




        this.triArray.forEach((tri, i) => {
            tri.id = i;
            this.matArray.push(`rgb(${Math.random()*255}, ${Math.random()*255}, ${Math.random()*255})`)
        })
        //console.log(this.matArray)
    }

    static draw(): void {
    }

    /*
    static drawLine3d(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, cam: Camera): void {
        
        let v1 = new Vec3(x1, y1, z1);
        let v2 = new Vec3(x2, y2, z2);
        let transV1 = this.translateToCam(v1, cam);
        let transV2 = this.translateToCam(v2, cam);
        let screenP = new Vec3(0, 0, 0.01);
        let screenN = new Vec3(0, 0, 1);
        let vArr = Geometry.lineClipAgainstPlane(screenP, screenN, transV1, transV2);

        if (vArr.length == 0) {
            return;
        }
        


        let p1 = this.projectPointToViewport(vArr[0], cam);
        let p2 = this.projectPointToViewport(vArr[1], cam);
        p1 = {x: p1.x*Graphics.width, y: p1.y*Graphics.height}
        p2 = {x: p2.x*Graphics.width, y: p2.y*Graphics.height}
        Graphics.line(p1.x, p1.y, p2.x, p2.y);
        
    }*/

    static drawLine3d(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, cam: Camera): void {

        let transV1 = this.translateToCam(new Vec3(x1,y1,z1), cam);
        let transV2 = this.translateToCam(new Vec3(x2,y2,z2), cam);

        let screenP = new Vec3(0, 0, 0.01);
        let screenN = new Vec3(0, 0, 1);

        let vArr = Geometry.lineClipAgainstPlane(screenP, screenN, transV1, transV2);

        if (vArr.length == 0) {
            return;
        }
        


        let p1 = this.projectPointToViewport(vArr[0], cam);
        let p2 = this.projectPointToViewport(vArr[1], cam);

        p1 = {x: p1.x*Graphics.width, y: p1.y*Graphics.height};
        p2 = {x: p2.x*Graphics.width, y: p2.y*Graphics.height}
        Graphics.line(p1.x, p1.y, p2.x, p2.y);

        
    }



    static drawPoint3d(x: number, y: number, z: number, cam: Camera): void {
        let v = this.translateToCam(new Vec3(x,y,z), cam);
        let screenP = new Vec3(0, 0, 0.01);
        let screenN = new Vec3(0, 0, 1);

        let vArr = Geometry.lineClipAgainstPlane(screenP, screenN, v, v);

        if (vArr.length == 0) {
            return
        }

        let p = this.projectPointToViewport(vArr[0], cam);
        p = {x: p.x*Graphics.width, y: p.y*Graphics.height};
        Graphics.drawCircle(p.x, p.y, 3);
    }

    static projectTriangle(tri: Tri, cam: Camera): Array<screenPos> {
        let spArray: Array<screenPos> = [];

        // Translate and Rotate
        let rotArr: Array<Vec3> = [];
        tri.vertexArray.forEach(v => {rotArr.push(this.translateToCam(v, cam))})
        let rotTri = new Tri(rotArr, tri.id, tri.colour);

        // Clip to screen
        let screenPoint = new Vec3(0, 0, 0.01);
        let screenNorm = new Vec3(0, 0, 1);
        let p1 = screenPoint.add(new Vec3(cam.x, cam.y, cam.z));
        let p2 = screenPoint.add(screenNorm).add(new Vec3(cam.x, cam.y, cam.z));
        
        let clipped: Array<Tri> = [];



        clipped = Geometry.triangleClipAgainstPlane(screenPoint, screenNorm, rotTri);

        let triList: Array<Tri> = [];
        //console.log(clipped)
        clipped.forEach(clippedTri => {
            let vArr: Array<Vec3> = [];
            clippedTri.vertexArray.forEach(rotV => {
                let fl = cam.getFocalLength();
                let ar = Graphics.width / Graphics.height;
                let vx = fl * rotV.x / rotV.z / ar;
                let vy = fl * rotV.y / rotV.z;
                let vp = {x: vx, y: vy};
                let sp = {x: vp.x*Graphics.width, y: vp.y*Graphics.height};
                spArray.push(sp);
                vArr.push(new Vec3(vx, vy, 0));
            })
            let triToRaster = new Tri(vArr, clippedTri.id, clippedTri.colour);
            let tris: Array<Tri> = [];
            tris.push(triToRaster);

            let i = 0;
            let newTris = 1;

            for (let p = 0; p < 0; p++) {
                while (newTris > 0) {
                    console.log(tris.length, "tris len")
                    let test: Tri = tris.shift()!;
                    newTris--;
                    let h = Graphics.height;
                    let w = Graphics.width;
                    
                    switch (p) {
                        case 0: tris.push(...Geometry.triangleClipAgainstPlane(new Vec3(0,0,0), new Vec3(0,1,0), test)); break;
                        case 1: tris.push(...Geometry.triangleClipAgainstPlane(new Vec3(0,h-1,0), new Vec3(0, -1, 0), test)); break;
                        case 2: tris.push(...Geometry.triangleClipAgainstPlane(new Vec3(0,0,0), new Vec3(1,0,0), test)); break;
                        case 3: tris.push(...Geometry.triangleClipAgainstPlane(new Vec3(w-1,0,0), new Vec3(-1,0,0), test)); break;
                    }
                }
                newTris = tris.length;
            }



            tris.forEach(tri => {
                let fill = tri.colour
                //console.log(tri)
                tri.vertexArray.forEach(v => {
                    //spArray.push(new screenPos(v.x, v.y));
                })
                Graphics.fillPoly(spArray, Graphics.fg, fill);
            })

        })





        return spArray;

    }

    static projectPointToViewport(vertex: Vec3, cam: Camera): {x: number, y: number} {
        let fl = cam.getFocalLength();
        let ar = Graphics.width / Graphics.height;
        let vx = fl * vertex.x / vertex.z / ar;
        let vy = fl * vertex.y / vertex.z;
        return {x: vx, y: vy};
    }

    static translateToCam(vertex: Vec3, cam: Camera): Vec3 {
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

        //Geometry.rotatePointsAboutAxis()

        return rotV;
    }

    static detranslateToCam(vertex: Vec3, cam: Camera): Vec3 {
        let st = -Math.sin(cam.heading);
        let ct = Math.cos(cam.heading);
        let rotMat = new Mat3x3(ct, 0, st, 0, 1, 0, -st, 0, ct);
        st = -Math.sin(cam.elevation);
        ct = Math.cos(cam.elevation);
        let rotMat2 = new Mat3x3(1, 0, 0, 0, ct, -st, 0, st, ct);
        let rotV = rotMat.mult(rotMat2.mult(new Vec3(vertex.x, vertex.y, vertex.z))) as Vec3;
        

        // Translate so cam is origin
        let transV = new Vec3(rotV.x + cam.x, rotV.y + cam.y, rotV.z + cam.z)
        return transV;
    }

    static renderTriArray(triArr: Array<Tri>, cam: Camera) {
        // Sort triArr by depth
        triArr = this.sortTrisByDepth(triArr, cam);
        //console.log("Sorted Tris", triArr)

        triArr.forEach(tri => {
            let rotArr: Array<Vec3> = [];
            tri.vertexArray.forEach(v => {rotArr.push(this.translateToCam(v, cam))})
            let rotTri = new Tri(rotArr, tri.id, tri.colour);

            let ps = new Vec3(0, 0, 0.1);
            let ns = new Vec3(0, 0, 1);
            let clippedTris = Geometry.triangleClipAgainstPlane(ps, ns, rotTri);

            let screenTris: Array<Tri2d> = [];

            clippedTris.forEach(tri => {
                let vArr: Array<Vec2> = [];
                tri.vertexArray.forEach(v => {
                    let fl = cam.getFocalLength();
                    let ar = Graphics.width / Graphics.height;
                    let vx = fl * v.x / v.z / ar;
                    let vy = fl * v.y / v.z;
                    let vp = {x: vx, y: vy};
                    let sp = {x: vp.x*Graphics.width, y: vp.y*Graphics.height};
                    vArr.push(new Vec2(sp.x, sp.y));
                })
                screenTris.push(new Tri2d(vArr, tri.id, tri.colour))
            })

            let clippedScreenTris: Array<Tri2d> = screenTris;

            clippedScreenTris.forEach(tri => {
                console.log("Filling tri: ", tri.vertexArray)
                Graphics.fillPoly(tri.vertexArray, undefined, tri.colour);
            })

        })

        // For each tri:
        //      Translate and rotate
        //      Clip to screen:
        //          Clip screen plane -> clippedTris
        //      For each clippedTri:
        //          Project each vertex to screen, new triangle
        //          Add 2d triangle (screen space) to screenTris
        //      For each screenTri:
        //          Clip to left side -> tempTris
        //          clip tempTris to right side, top side, bottom side
        //          Add tempTris to clippedScreenTris
        //      Draw clippedScreenTris

        

    }

    static sortTrisByDepth(triArr: Array<Tri>, cam: Camera): Array<Tri> {
        let sortedTriArr: Array<Tri> = triArr.sort((a, b) => {
            let camPos = new Vec3(cam.x, cam.y, cam.z);
            let aDist = camPos.sub(a.getCentroid()).magSq();
            let bDist = camPos.sub(b.getCentroid()).magSq();
            return bDist - aDist;
        })
        return sortedTriArr;
    }

}

// Input: Triangle, camera
// Project Triangle onto screen space (2d)
// Draw Triangle


class Camera {
    // Object in 3d space with orientation

    x: number;
    y: number;
    z: number;
    heading: number
    elevation: number;
    fov: number;

    constructor(x: number, y: number, z: number, heading: number, elevation: number, fov: number = 90) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.heading = heading;
        this.elevation = elevation;
        this.fov = fov * Math.PI / 180;
    }

    getFocalLength(): number {
        return 1 / Math.tan(this.fov/2);
    }

    
}

class screenPos {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

class Vertex {
    // 3d object representing a point in space

    x: number;
    y: number;
    z: number;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

class Tri {
    // 3d object representing a triangle in space, made of 3 vertecies

    vertexArray: Array<Vec3>;
    id: number;
    colour: string;

    constructor(vertexArray: Array<Vec3>, id: number, colour: string = Graphics.fg) {
        this.vertexArray = vertexArray;
        this.id = id;
        this.colour = colour;
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
            triArray.push(new Tri(vArr, Math.round(Math.random()*100), `rgb(${Math.random()*255}, ${Math.random()*255}, ${Math.random()*255})`))
        })
        //console.log("The output of handle string: ",triArray, str)
        return triArray;
    }

    translate(offsetX: number, offsetY: number, offsetZ: number): Tri {
        let vArr: Array<Vec3> = [];
        this.vertexArray.forEach(v => {
            vArr.push(new Vec3(v.x + offsetX, v.y + offsetY, v.z + offsetZ));
        })
        return new Tri(vArr, this.id, this.colour);
    }

    rotate(theta: number, phi: number, centreX: number, centreY: number, centreZ: number): Tri {
        // Translate so cam is the origin
        let offset = this.translate(-centreX, -centreY, -centreZ);
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

    getCentroid(): Vec3 {
        let vArr = this.vertexArray;
        return vArr[0].add(vArr[1]).add(vArr[2]).div(3)!;
    }
}

class Tri2d {
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
            let v1 = Render.detranslateToCam(vArr[1], Render.camArray[0]);
            let v2 = Render.detranslateToCam(vArr[2], Render.camArray[0]);
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

        let intersect = Render.detranslateToCam(this.vectorPlaneIntersect(planeP, planeN, v1, v2), Render.camArray[0]);
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

/* 
create queue
add triangle that needs clipping]
for each plane:
    for each tri in queue:
        remove front tri
        newt <- test tri using clipping function against plane (yields 0,1,2 tris)
    queue <- newt
next plane
    
*/