import { Transform } from "./transform.js";
import { Camera } from "./camera.js";
import { GameObject } from "./gameObject.js";
import { Vec3 } from "./maths.js";
import { Mesh } from "./mesh.js";
import { Render } from "./render.js";
import { Scene } from "./scene.js";
import { Tri } from "./tri.js";

export class GameEngine {
    static t: number;
    static sceneArray: Array<Scene>;
    static camArray: Array<Camera>;
    static sceneNum: number;
    static player: GameObject;

    static init() {
        this.t = 0;
        this.sceneArray = [];
        this.camArray = [];
        this.sceneNum = 0;

        let cube = new GameObject();
        cube.mesh = Mesh.cubeMesh(new Transform(new Vec3(0,0,20), new Vec3(3,3,3), new Vec3()));
        cube.mesh.randomiseTextures();
        this.sceneArray.push(new Scene([cube]));
    }

    static update(dt: number) {
        this.player.update(dt);
        this.sceneArray.forEach(scene => {
            scene.gameObjects.forEach((obj, i) => {
                obj.update(dt);
                scene.gameObjects[i] = obj;
            })
        })
        this.camArray[0].setState(this.player.transform);
        this.t++;
    }

    static renderScene(scene: Scene, cam: Camera) {
        let triArr: Array<Tri> = [];
 
        scene.gameObjects.forEach(obj => {
            if (obj.has(obj.mesh)) {
                obj.mesh!.triArray.forEach((tri, i) => {
                    tri.texture = obj.mesh!.textureArray[i];
                    tri = tri.transform(obj.transform);
                    triArr.push(tri)
                })
                //triArr.push(...obj.mesh!.triArray.map(tri => {return tri.transform(obj.transform)}));
            }
        })
        //console.log(scene);
        //console.log(triArr.length, Game.triArr.length);
        console.log(triArr.length)
        Render.renderTriArray(triArr, cam);
    }


}










