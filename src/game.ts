class Game {

    static player: GameObject;
    static triArr: Array<Tri>
    static t: number;
    static sceneArray: Array<Scene>;
    static camArray: Array<Camera>;
    static sceneNum: number;

    static init(): void {
        this.t = 0;
        this.sceneNum = 0;
        //this.gameObjects = [];
        this.sceneArray = [];
        this.camArray = [];
        Render.init();

        Input.setOnMouseDown(Game.onMouseClick);


        
        let playerController = new PlayerController();
        this.player = new GameObject()
        this.player.controller = playerController;
        this.camArray.push(new Camera);

        let gameObjects: Array<GameObject> = [];
        Game.loadTris().forEach(tri => {
            let obj = new GameObject();
            obj.mesh = new Mesh([tri]);
            obj.physicsBody = new PhysicsBody(new Vec3(0, 0, 1), Vec3.randomVec().mult(0.001));
            gameObjects.push(obj);
        })

        //this.triArr = Game.loadTris();
        this.sceneArray.push(new Scene(gameObjects));

        gameObjects = [];
        Game.loadTris().forEach(tri => {
            let obj = new GameObject();
            obj.mesh = new Mesh([tri]);
            obj.physicsBody = new PhysicsBody();
            gameObjects.push(obj);
        })
        this.sceneArray.push(new Scene(gameObjects));

        gameObjects = [];
        let obj = new GameObject();
        obj.mesh = Mesh.cubeMesh(new Transform());
        this.sceneArray.push(new Scene([obj]));

        //this.triArr = Game.loadTris();

    }

    static gameLoop(dt: number): void {




         
        //this.player.controller!.handleInput();
        this.player.update(dt); //-> handleInput, do phyisics
        this.camArray[0].setState(this.player.transform);

        let objs = Game.sceneArray[0].gameObjects;
        objs.forEach((obj, i) => {
            if (obj.has(obj.physicsBody)) {
                //console.log(obj.physicsBody!.pos)
                //obj.physicsBody!.acc = new Vec3((Math.random()-0.5)*0.00001,(Math.random()-0.5)*0.00001,(Math.random()-0.5)*0.00001); 
                obj.physicsBody!.acc = Game.getForce(obj.physicsBody!.pos.add(obj.mesh!.triArray[0].getCentroid()));
                obj.update(dt);
                //obj.transform.scale = new Vec3(Game.t /1);
                //obj.transform!.pos = new Vec3(0, 0, 0);
                Game.sceneArray[0].gameObjects[i] = obj;
            }

        })


        
        Game.draw();
        let fps = Math.round(1000 / (App.dt < 1000/60 ? 1000/60: App.dt));
        Graphics.drawFps(fps);
        Game.t ++;
    }

    static draw(): void {       
        Graphics.background();
        let cam = Game.camArray[0];
        let scene = Game.sceneArray[Game.sceneNum%Game.sceneArray.length];


        Render.drawGrid(new Vec3(0, -2, 0), 10, 10, 1, cam);

        if (Game.sceneArray.length > 0) {
            //console.log(Game.sceneArray[0].gameObjects[0].physicsBody!.pos);
            //console.log(Game.sceneArray[0].gameObjects[0].transform!.pos);
            Game.renderScene(scene, cam);
        }


        ///Graphics.drawText(`${this.player.heading}`, 50, 10);
        //console.log(this.player.heading);
        
    }

    static getForce(pos: Vec3) {
        let size = 0.0000001 * Math.random();
        return pos.mult(-1 * size);
    }

    static renderScene(scene: Scene, cam: Camera) {
        let triArr: Array<Tri> = [];
 
        scene.gameObjects.forEach(obj => {
            if (obj.has(obj.mesh)) {
                triArr.push(...obj.mesh!.triArray.map(tri => {return tri.transform(obj.transform)}));
            }
        })
        //console.log(scene);
        //console.log(triArr.length, Game.triArr.length);
        Render.renderTriArray(triArr, cam);
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
            triArr[i].colour = Game.randomColour();
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
            triArr.push(new Tri([v1,v2,v3], i, Game.randomColour()));
        }

        return triArr;
    }

    static randomColour(): string {
        return `rgb(${Math.random()*255}, ${Math.random()*255}, ${Math.random()*255})`;
    }   

    static onMouseClick(): void {
        Game.sceneNum = (Game.sceneNum + 1) % 2; 
    }
}

