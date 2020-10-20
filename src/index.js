import "./index.css";

import GraphicsSheet from "./graphics/graphics-sheet.png";
import { init } from "./framework";

const testScreen = new class {
    x = 500;
    y = 50;
    dx = 0;

    move({ keyboard }) {
        if (keyboard["ArrowRight"]) this.dx += 1;
        if (keyboard["ArrowLeft"]) this.dx -= 1;
        this.x += this.dx;
        if (keyboard["ArrowDown"]) this.y += 1;
        if (keyboard["ArrowUp"]) this.y -= 1;
    }

    draw({ width, height, images }) {
        images.draw({ image: "green", x: (width / 1000.5) * this.x, y: (height / 100.5) * this.y, rotate: this.dx * 0.1 });
    }
};

init({
    graphics: {
        red: { image: GraphicsSheet, x: 0, y: 0, w: 128, h: 128, scale: 0.4 },
        "red-falling": { image: GraphicsSheet, x: 0, y: 128, w: 128, h: 128, scale: 0.4 },
        blue: { image: GraphicsSheet, x: 128, y: 0, w: 128, h: 128, scale: 0.4 },
        "blue-falling": { image: GraphicsSheet, x: 128, y: 128, w: 128, h: 128, scale: 0.4 },
        yellow: { image: GraphicsSheet, x: 256, y: 0, w: 128, h: 128, scale: 0.4 },
        "yellow-falling": { image: GraphicsSheet, x: 256, y: 128, w: 128, h: 128, scale: 0.4 },
        green: { image: GraphicsSheet, x: 384, y: 0, w: 128, h: 128, scale: 0.4 },
        "green-falling": { image: GraphicsSheet, x: 384, y: 128, w: 128, h: 128, scale: 0.4 },
        purple: { image: GraphicsSheet, x: 512, y: 0, w: 128, h: 128, scale: 0.4 },
        "purple-falling": { image: GraphicsSheet, x: 512, y: 128, w: 128, h: 128, scale: 0.4 },
        black: { image: GraphicsSheet, x: 640, y: 0, w: 128, h: 128, scale: 0.4 },
        "black-falling": { image: GraphicsSheet, x: 640, y: 128, w: 128, h: 128, scale: 0.4 },
        rainbow: { image: GraphicsSheet, x: 768, y: 0, w: 128, h: 128, scale: 0.4 },
        "rainbow-falling": { image: GraphicsSheet, x: 768, y: 128, w: 128, h: 128, scale: 0.4 }
    },
    start: testScreen
});
