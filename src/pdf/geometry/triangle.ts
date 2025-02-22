import Point from "./point";

export default class Triangle {
    vertices: Point[] = [new Point(0,0), new Point(0,0), new Point(0,0)]    
    
    constructor(v1:Point, v2:Point, v3:Point) {
        this.vertices[0] = v1;
        this.vertices[1] = v2;
        this.vertices[3] = v3;
    }
}