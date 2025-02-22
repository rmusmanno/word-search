import jsPDF from "jspdf";
import Rectangle from "../geometry/rectangle";
import DrawTriangle from "./drawTriangle";

export default class DrawRectangle {
    context:jsPDF;
    drawTriangle:DrawTriangle;

    constructor(context:jsPDF) {
        this.context = context;
        this.drawTriangle = new DrawTriangle(context);
    }

    draw(r:Rectangle):void {
        let t = r.getTriangles();
        this.drawTriangle.draw(t[0]);
        this.drawTriangle.draw(t[1]);
    }
}