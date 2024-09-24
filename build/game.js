"use strict";
class Game {
    static init() {
        Render.init();
        //Render.triArray = [];
        Render.camArray = [new Camera(0, 0, 0, 0, 0)];
        Game.triArr = Game.loadTris();
        console.log("Tri Array: ", Game.triArr);
        //Render.renderTriArray(triArr, cam);
        this.player = new Player(0, 1, 0);
    }
    static gameLoop(dt) {
        this.player.handleInput();
        Render.camArray[0].x = this.player.x;
        Render.camArray[0].y = this.player.y;
        Render.camArray[0].z = this.player.z;
        Render.camArray[0].heading = this.player.heading;
        Render.camArray[0].elevation = this.player.elevation;
        Game.draw();
        let fps = Math.round(1000 / (App.dt < 1000 / 60 ? 1000 / 60 : App.dt));
        Graphics.drawFps(fps);
    }
    static draw() {
        Graphics.background();
        Render.draw();
        let cam = Render.camArray[0];
        let gridSize = 10;
        for (let x = -gridSize; x <= gridSize; x++) {
            for (let z = -gridSize; z <= gridSize; z++) {
                Render.drawLine3d(x, -1, -gridSize, x, -1, gridSize, cam);
                Render.drawLine3d(-gridSize, -1, z, gridSize, -1, z, cam);
            }
        }
        Render.renderTriArray(Game.triArr, cam);
        ///Graphics.drawText(`${this.player.heading}`, 50, 10);
        //console.log(this.player.heading);
    }
    static parseObjData(objData) {
        let vArr = [];
        let fArr = [];
        let triArr = [];
        let lines = objData.split("\n");
        lines.forEach(line => {
            line = line.trim();
            if (line.startsWith("#") || line == "") {
                return;
            }
            if (line.startsWith("v")) {
                let vert = line.split(" ");
                vArr.push(new Vec3(+vert[1], +vert[2], +vert[3]));
                return;
            }
            if (line.startsWith("f")) {
                let face = line.split(" ");
                let faceArr = [];
                face.forEach(v => {
                    let vSplit = v.split("/");
                    faceArr.push(+[vSplit[0]]);
                });
                fArr.push(faceArr);
            }
        });
        fArr.forEach((face, i) => {
            triArr.push(new Tri([vArr[face[0]], vArr[face[1]], vArr[face[2]]], i));
        });
        return triArr;
    }
    static loadTris() {
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
2 0 7`;
        let triArr = Tri.handleString(triArrayString);
        triArr.forEach((tri, i) => {
            triArr[i].colour = Game.randomColour();
        });
        return triArr;
    }
    static randomColour() {
        return `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
    }
}
class Player {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.speed = 0.1;
        this.heading = 0;
        this.elevation = 0;
    }
    handleInput() {
        // Calculate forward direction
        let vx = this.speed * -Math.sin(this.heading);
        let vz = this.speed * Math.cos(this.heading);
        if (Input.keys.up) {
            this.x -= vx;
            this.z += vz;
            console.log(this.z);
        }
        if (Input.keys.down) {
            this.x += vx;
            this.z -= vz;
        }
        if (Input.keys.left) {
            this.x -= vz;
            this.z -= vx;
        }
        if (Input.keys.right) {
            this.x += vz;
            this.z += vx;
        }
        if (Input.leftMouse) {
            this.y += this.speed;
        }
        if (Input.rightMouse) {
            this.y -= this.speed;
        }
        if (document.pointerLockElement === App.canvas) {
            if (Input.mouseX) {
                Game.player.heading += Input.mouseDx * App.mouseSensitivity;
                Game.player.elevation += Input.mouseDy * App.mouseSensitivity;
                Input.mouseX = 0;
                Input.mouseY = 0;
            }
            else {
                Input.mouseX = 0;
            }
        }
    }
}
