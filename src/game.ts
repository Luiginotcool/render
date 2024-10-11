import { App } from "./app.js";
import { Camera } from "./camera.js";
import { GameEngine } from "./engine.js";
import { Transform } from "./transform.js";
import { GameObject } from "./gameObject.js";
import { Graphics } from "./graphics.js";
import { Input } from "./input.js";
import { Vec3 } from "./maths.js";
import { PlayerController } from "./player.js";
import { Render } from "./render.js";
import { Texture } from "./texture.js";
import { Tri } from "./tri.js";
import { Obj } from "./obj.js"

export class Game {


    static init(): void {

        GameEngine.init();
        GameEngine.player = new GameObject();
        GameEngine.player.controller = new PlayerController();
        GameEngine.camArray.push(new Camera());

        let testMesh = Obj.parseObjData(Obj.objData[1]);
        testMesh.randomiseTextures();
        GameEngine.sceneArray[0].gameObjects[0].mesh = testMesh;

        Input.setOnMouseDown(Game.onMouseClick);

    }

    static gameLoop(dt: number): void {

        GameEngine.update(dt);

        let trans = new Transform(
            new Vec3(0, 0, 2),
            new Vec3(0.1, 0.1, 0.1),
            new Vec3(0, GameEngine.t/50, 0),
        )
        GameEngine.sceneArray[0].gameObjects[0].transform = trans;


        Game.draw();
        let fps = Math.round(1000 / (App.dt < 1000/60 ? 1000/60: App.dt));
        Graphics.drawFps(fps);
    }

    static draw(): void {       
        Graphics.background();
        let cam = GameEngine.camArray[0];
        let scene = GameEngine.sceneArray[GameEngine.sceneNum%GameEngine.sceneArray.length];
        Render.drawGrid(new Vec3(0, -2, 0), 10, 10, 1, cam);
        if (GameEngine.sceneArray.length > 0) {
            GameEngine.renderScene(scene, cam);
            //console.log("Scene size: ", scene.gameObjects)
        }        
    }

    static getForce(pos: Vec3) {
        let size = 0.0000001 * Math.random();
        return pos.mult(-1 * size);
    }

    

    static parseObjData(objData: string): Array<Tri> {
        let vArr: Array<Vec3> = [];
        let fArr: Array<Array<number>> = [];
        let triArr: Array<Tri> = [];

        let lines: Array<string> = objData.split("\n");

        lines.forEach(line => {
            line = line.trim();

            if (line.startsWith("#") || line == "") {return}

            if (line.startsWith("v")) {
                let vert = line.split(" ");
                vArr.push(new Vec3(+vert[1], +vert[2], +vert[3]));
                return
            }

            if (line.startsWith("f")) {
                let face = line.split(" ");
                let faceArr: Array<number> = [];
                face.forEach(v => {
                    let vSplit = v.split("/");
                    faceArr.push(+[vSplit[0]])
                })
                fArr.push(faceArr);
            }
        })

        fArr.forEach((face, i) => {
            triArr.push(new Tri([vArr[face[0]], vArr[face[1]], vArr[face[2]]], i));
        })

        return triArr;

    }

    static loadTris(): Array<Tri> {
        let triArrayString = 
`0 0 5
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
3 3 5`
        
        let triArr = Tri.handleString(triArrayString);
        triArr.forEach((tri, i) => {
            triArr[i].texture = Texture.randomTexture();
        })

        triArr = [];
        let numTris = 1000;
        let worldSize = 20;
        let maxSize = 1;
        for (let i = 0; i < numTris; i++) {
            let randomPos = new Vec3((Math.random()-0.5)*worldSize, (Math.random()-0.5)*worldSize, (Math.random()-0.5)*worldSize);
            let randomSize = new Vec3(Math.random()*maxSize, Math.random()*maxSize, Math.random()*maxSize);
            let v1 = randomPos.add(new Vec3(randomSize.x, 0, 0));
            let v2 = randomPos.add(new Vec3(0, randomSize.y, 0));
            let v3 = randomPos.add(new Vec3(0, 0, randomSize.z));
            triArr.push(new Tri([v1,v2,v3], i, Texture.randomTexture()));
        }

        return triArr;
    }

    static randomColour(): string {
        return `rgb(${Math.random()*255}, ${Math.random()*255}, ${Math.random()*255})`;
    }   

    static onMouseClick(): void {
        GameEngine.sceneNum = (GameEngine.sceneNum + 1) % 2; 
    }
}

