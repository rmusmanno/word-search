export default class Point {
    x: number = 0;
    y: number = 0;

    constructor (x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    rotate(angle:number, origin: Point) {
        // rotation equation
        // X = x*cos(θ) - y*sin(θ)
        // Y = x*sin(θ) + y*cos(θ)
        
        // translate to origin
        let point = new Point(this.x - origin.x, this.y - origin.y);

        // rotate
        let x = Math.floor(point.x * Math.cos(angle) - point.y * Math.sin(angle));
        let y = Math.floor(point.x * Math.sin(angle) + point.y * Math.cos(angle));

        // translate back from origin
        this.x = x + origin.x;
        this.y = y + origin.y;
    }
}