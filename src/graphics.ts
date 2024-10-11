export class Graphics {
    static context: CanvasRenderingContext2D;
    static fg: string;
    static bg: string;
    static centreMode: boolean;
    static inverseY: boolean;
    static centre: {x: number, y: number};
    static width: number;
    static height: number;

    static init(canvas: HTMLCanvasElement): void {
        Graphics.context = canvas.getContext("2d")!;
        Graphics.fg = "black";
        Graphics.bg = "#407579";
        Graphics.centreMode = false;
        Graphics.inverseY = false;
        Graphics.width = canvas.width;
        Graphics.height = canvas.height;
        Graphics.centre = {x: Graphics.width/2, y: Graphics.height/2}
    }

    static drawArrow(startX: number, startY: number, endX: number, endY: number, arrowSize: number): void {


        if (Graphics.centreMode) {
            startX += Graphics.centre.x;
            startY += Graphics.centre.y;
            endX += Graphics.centre.x;
            endY += Graphics.centre.y;
        }

        if (Graphics.inverseY) {
            startY = Graphics.height - startY;
            endY = Graphics.height - endY;
        }

    
        var context = Graphics.context;
        context.fillStyle = Graphics.fg
        // Calculate arrow angle
        var angle = Math.atan2(endY - startY, endX - startX);
    
        // Draw line
        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(endX, endY);
        context.stroke();
    
        // Draw arrowhead
        context.beginPath();
        context.moveTo(endX, endY);
        context.lineTo(endX - arrowSize * Math.cos(angle - Math.PI / 6), endY - arrowSize * Math.sin(angle - Math.PI / 6));
        context.lineTo(endX - arrowSize * Math.cos(angle + Math.PI / 6), endY - arrowSize * Math.sin(angle + Math.PI / 6));
        context.closePath();
        context.fill();
    }

    static line(x1: number, y1: number, x2: number, y2: number, colour = Graphics.fg): void {
        if (Graphics.centreMode) {
            x1 += Graphics.centre.x;
            y1 += Graphics.centre.y;
            x2 += Graphics.centre.x;
            y2 += Graphics.centre.y;
        }

        if (Graphics.inverseY) {
            y1 = Graphics.height - y1;
            y2 = Graphics.height - y2;
        }

        let context = Graphics.context;
        context.strokeStyle = colour;
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2,y2);
        context.stroke();
    }
    
    static drawFps(fps: number): void {
        Graphics.context.fillStyle = "BLACK";
        Graphics.context.fillRect(8,16,43,18);
        Graphics.context.fillStyle = "white";
        Graphics.context.font = "15px Arial";
        Graphics.context.fillText(`${fps.toFixed(0)} fps`, 10, 30);
    }

    static drawText(text: string, x: number, y: number) {
        Graphics.context.fillStyle = "blue";
        Graphics.context.fillRect(x,y,43,18);
        Graphics.context.fillStyle = "white";
        Graphics.context.font = "15px Arial";
        Graphics.context.fillText(text, 10, 30);
    }

    static background(colour = Graphics.bg) {
        if (!this.context) {
            console.log("NO CANVAS")
            return;
        }
        //console.log("FILLING", colour)
        Graphics.context.fillStyle = colour;
        Graphics.context.fillRect(0, 0, this.width, this.height);
    }
    
    static fillRect(x: number, y: number, w: number, h: number, colour = Graphics.fg) {
        if (Graphics.centreMode) {
            x += Graphics.centre.x;
            y += Graphics.centre.y;
        }

        if (Graphics.inverseY) {
            y = Graphics.height - y - h;
        }
        Graphics.context.fillStyle = colour;
        Graphics.context.fillRect(x, y, w, h)
    }
    
    static drawCircle(x:number, y:number, radius:number, fill: null | string = null, stroke = Graphics.fg, strokeWidth = 1) {
        if (Graphics.centreMode) {
            x += Graphics.centre.x;
            y += Graphics.centre.y;
        }

        if (Graphics.inverseY) {
            y = Graphics.height - y
        }
        let ctx = Graphics.context
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, 2 * Math.PI, false)
        if (fill) {
          ctx.fillStyle = fill
          ctx.fill()
        }
        if (stroke) {
          ctx.lineWidth = strokeWidth
          ctx.strokeStyle = stroke
          ctx.stroke()
        }
    }

    static fillPoly(posArray: Array<{x: number, y: number}>, stroke = Graphics.fg, fill = Graphics.fg) {
        if (Graphics.centreMode) {
            posArray = posArray.map(pos => ({
                x: pos.x + Graphics.centre.x,
                y: pos.y + Graphics.centre.y
            }));
        }

        if (Graphics.inverseY) {
            posArray = posArray.map(pos => ({
                x: pos.x,
                y: Graphics.height - pos.y
            }));
        }

        let ctx = Graphics.context;
        ctx.fillStyle = fill;
        ctx.beginPath();
        ctx.moveTo(posArray[0].x, posArray[0].y);
        posArray.forEach(pos => {
            ctx.lineTo(pos.x, pos.y);
        })
        ctx.fill();
    }
}