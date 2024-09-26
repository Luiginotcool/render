class Render {

    static triArray: Array<Tri>
    static camArray: Array<Camera>
    static matArray: Array<string>

    static init(): void {

        this.triArray = [];
        this.camArray = [];
        this.matArray = [];
    }

    static draw(): void {
    }

    static randomColours(triArr: Array<Tri>): void {
        triArr.forEach((tri, i) => {
            tri.colour = `rgb(${Math.random()*255}, ${Math.random()*255}, ${Math.random()*255})`
        })
    }

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

    static projectTriangle(tri: Tri, cam: Camera): Array<Vec2> {
        let spArray: Array<Vec2> = [];

        // Translate and Rotate
        let rotArr: Array<Vec3> = [];
        tri.vertexArray.forEach(v => {rotArr.push(this.translateToCam(v, cam))})
        let rotTri = new Tri(rotArr, tri.id, tri.colour);

        // Clip to screen
        let screenPoint = new Vec3(0, 0, 0.01);
        let screenNorm = new Vec3(0, 0, 1);
        let p1 = screenPoint.add(cam.pos);
        let p2 = screenPoint.add(screenNorm).add(cam.pos);
        
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
                let sp = new Vec2(vp.x*Graphics.width, vp.y*Graphics.height)
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
                    //console.log(tris.length, "tris len")
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
        let transV = vertex.sub(cam.pos);

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
        let transV = rotV.add(cam.pos);
        return transV;
    }

    static renderTriArray(triArr: Array<Tri>, cam: Camera) {
        // Sort triArr by depth
        triArr = this.sortTrisByDepth(triArr, cam);
        let i = 0;
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
                screenTris.push(new Tri2d(vArr, tri.id, tri.colour));
                i ++;
            })

            let clippedScreenTris: Array<Tri2d> = screenTris;

            clippedScreenTris.forEach(tri => {
                //console.log("Filling tri: ", tri.vertexArray)
                Graphics.fillPoly(tri.vertexArray, undefined, tri.colour);
            })

        })
        console.log("Tris drawn: ", i);

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
            let aDist = cam.pos.sub(a.getCentroid()).magSq();
            let bDist = cam.pos.sub(b.getCentroid()).magSq();
            return bDist - aDist;
        })
        return sortedTriArr;
    }

    static drawGrid(pos: Vec3, width: number, height: number, cellSize: number, cam: Camera) {
        width /= 2;
        height /= 2;
        for (let x = -width; x <= width; x++) {
            for (let z = -height; z <= height; z++) {
                let xt = x * cellSize + pos.x;
                let yt = pos.y;
                let zt = z * cellSize + pos.z;
                let ht = height * cellSize + pos.z;
                let wt = width * cellSize + pos.x;
                Render.drawLine3d(xt, yt, -ht, xt, yt, ht, cam);
                Render.drawLine3d(-wt, yt, zt, wt, yt, zt, cam);
            }
        }
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