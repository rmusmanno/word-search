import jsPDF from "jspdf";
import Triangle from "../geometry/triangle";
import Point from "../geometry/point";

export default class DrawTriangle {
    context:jsPDF;

    constructor(context:jsPDF) {
        this.context = context;
    }

    draw(t:Triangle):void {
        this.drawLine(t.vertices[0], t.vertices[1]);
        this.drawLine(t.vertices[0], t.vertices[2]);
        this.drawLine(t.vertices[1], t.vertices[2]);
    }

    drawLine(p1:Point, p2:Point, style?: string | null) {
        this.context.line(p1.x, p1.y, p2.x, p2.y, style);
    }
}