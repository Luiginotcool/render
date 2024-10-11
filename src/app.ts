import { Vec2, Vec3, Mat2x2, Mat3x3, Geometry} from "./maths";
import { Graphics } from "./graphics.js";
import { Input } from "./input.js";
import { Files } from "./files.js";
import { Camera } from "./camera";
import { Tri } from "./tri";
import { Mesh } from "./mesh";
import { Scene } from "./scene";
import { Texture } from "./texture";
import { Transform } from "./transform";
import { PhysicsBody } from "./physics";
import { PlayerController } from "./player";
import { Render } from "./render";
import { GameEngine } from "./engine";
import { GameObject } from "./gameObject";
import { Game } from "./game.js";





export class App {
    static canvas: HTMLCanvasElement;
    static width: number;
    static height: number;
    static frames: number;
    static oldTimeStamp: number;
    static noLoop: boolean;
    static dt: number;
    static mouseSensitivity: number;

    static init(): void {
        App.canvas = <HTMLCanvasElement>document.getElementById("canvas");
        App.width = window.innerWidth;
        App.height = window.innerHeight;
        App.canvas.width = App.width;
        App.canvas.height = App.height;
        App.frames = 0;
        App.oldTimeStamp = 0;

        App.noLoop = false;
        App.mouseSensitivity = 0.0005;

        Files.init();
        
        Input.init();
        //console.log(Input.keys)

        App.canvas.onclick = function() {
            App.canvas.requestPointerLock();
        }

        Graphics.init(App.canvas);
        Graphics.centreMode = true;
        Graphics.inverseY = true;
        Graphics.centre = {x: App.width/2, y: App.height/2};

        Game.init();


        window.requestAnimationFrame(App.gameLoop);
    }

    static gameLoop(timeStamp: DOMHighResTimeStamp): void {
        if (App.noLoop) {
            window.requestAnimationFrame(App.gameLoop);
        } else {
            App.dt = (timeStamp - App.oldTimeStamp);
            App.oldTimeStamp = timeStamp;
            
    

            App.frames++;

            Game.gameLoop(App.dt);
    
            App.noLoop = false;
            window.requestAnimationFrame(App.gameLoop);
        }
    }

    static testGraphics(): void {
        Graphics.background("black");
        Graphics.drawCircle(100, 200, 20, "blue");
    }
}

App.init();