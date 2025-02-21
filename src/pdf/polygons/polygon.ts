import Triangle from "./triangle";

export default class Polygon {
    triangles: Triangle[] = [];

    constructor(triangles: Triangle[]) {
        this.triangles = triangles;
    }
}