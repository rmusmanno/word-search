import Point from "./point";
import Polygon from "./polygon";
import Triangle from "./triangle";

export default class Rectangle extends Polygon {
    constructor(source:Point, size:Point) {
        let p2 = new Point(source.x + size.x, source.y);
        let p3 = new Point(source.x, + source.y + size.y);
        let p4 = new Point(source.x + size.x, source.y + size.y);

        let t1 = new Triangle(source, p2, p3);
        let t2 = new Triangle(p2, p3, p4);

        super([t1, t2]);
    }

    getTriangles():Triangle[] {
        if (this.triangles.length > 2)
            return [this.triangles[0], this.triangles[1]];
        else if (this.triangles.length == 2)
            return this.triangles;
        else
            return [];
    }
}