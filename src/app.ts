class Files {
    static fs: any;
    static init() {
    }

    static readFile(path: string): string {
        let fd = ""
        this.fs.readFile(path, "utf8", (err: any, data: any) => {
            if (err) {
                console.error("Error reading file:", err);
                return;
            }
            fd = data;
        })
        return fd;
    }
}

class App {
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