"use strict";
class Game {
    static init() {
        this.t = 0;
        this.gameObjects = [];
        Render.init();
        Render.camArray.push(new Camera());
        this.triArr = Game.loadTris();
        this.player = new PlayerController();
        /*
        let playerController = new PlayerController();
        let cam = new Camera();
        this.player = new GameObject()
        this.player.controller = playerController;
        let newScene = new Scene();
        sceneArray.push(newScene);


        */
    }
    static gameLoop(dt) {
        // Update player and cam position
        this.player.handleInput();
        Render.camArray[0].setState(this.player.pos, this.player.heading, this.player.elevation);
        this.triArr.forEach((tri, i) => {
            let c = tri.getCentroid();
            Game.triArr[i] = tri.rotate((Math.random()) * Math.random() / 100, (Math.random()) * Math.random() / 100, c.x, c.y, c.z);
            let randomDir = Vec2.fromHeading(Math.random() * Math.PI * 2, Math.random() / 100);
            Game.triArr[i] = tri.translate(randomDir.x, -0.0, randomDir.y);
        });
        /*
        this.player.controller.handleInput();
        this.camArray[0].setState(this.player.pos, this.player.heading, this.player.elevation)

        this.player.update(); -> handleInput, do phyisics
        this.camArray[0].setState(this.player.transform.pos, this.player.transform.rotate[1], this.player.transform.rotate[0])
        */
        Game.draw();
        let fps = Math.round(1000 / (App.dt < 1000 / 60 ? 1000 / 60 : App.dt));
        Graphics.drawFps(fps);
        Game.t++;
    }
    static draw() {
        Graphics.background();
        let cam = Render.camArray[0];
        Render.drawGrid(new Vec3(0, -2, 0), 10, 10, 1, cam);
        Render.renderTriArray(Game.triArr, cam);
        /*
        Graphics.background();
        let cam = Game.camArray[0];
        let scene = Game.sceneArray[0];

        Render.drawGrid(new Vec3(0, -2, 0), 10, 10, 1, cam);
        Game.renderScene(scene, cam);

        


        */
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
2 0 7

3 3 3
4 3 5
3 3 5`;
        let triArr = Tri.handleString(triArrayString);
        triArr.forEach((tri, i) => {
            triArr[i].colour = Game.randomColour();
        });
        triArr = [];
        let numTris = 1000;
        let worldSize = 20;
        let maxSize = 1;
        for (let i = 0; i < numTris; i++) {
            let randomPos = new Vec3((Math.random() - 0.5) * worldSize, (Math.random() - 0.5) * worldSize, (Math.random() - 0.5) * worldSize);
            let randomSize = new Vec3(Math.random() * maxSize, Math.random() * maxSize, Math.random() * maxSize);
            let v1 = randomPos.add(new Vec3(randomSize.x, 0, 0));
            let v2 = randomPos.add(new Vec3(0, randomSize.y, 0));
            let v3 = randomPos.add(new Vec3(0, 0, randomSize.z));
            triArr.push(new Tri([v1, v2, v3], i, Game.randomColour()));
        }
        return triArr;
    }
    static randomColour() {
        return `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
    }
}
