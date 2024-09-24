"use strict";
class Files {
    static init() {
    }
    static readFile(path) {
        let fd = "";
        this.fs.readFile(path, "utf8", (err, data) => {
            if (err) {
                console.error("Error reading file:", err);
                return;
            }
            fd = data;
        });
        return fd;
    }
}
class App {
    static init() {
        App.canvas = document.getElementById("canvas");
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
        App.canvas.onclick = function () {
            App.canvas.requestPointerLock();
        };
        Graphics.init(App.canvas);
        Graphics.centreMode = true;
        Graphics.inverseY = true;
        Graphics.centre = { x: App.width / 2, y: App.height / 2 };
        Game.init();
        window.requestAnimationFrame(App.gameLoop);
    }
    static gameLoop(timeStamp) {
        if (App.noLoop) {
            window.requestAnimationFrame(App.gameLoop);
        }
        else {
            App.dt = (timeStamp - App.oldTimeStamp);
            App.oldTimeStamp = timeStamp;
            App.frames++;
            Game.gameLoop(App.dt);
            App.noLoop = false;
            window.requestAnimationFrame(App.gameLoop);
        }
    }
    static testGraphics() {
        Graphics.background("black");
        Graphics.drawCircle(100, 200, 20, "blue");
    }
}
App.init();
