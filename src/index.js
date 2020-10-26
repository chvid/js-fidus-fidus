import "./index.css";

import GraphicsSheet from "./graphics/graphics-sheet.png";
import { init, Animation } from "./framework";

const testScreen = new (class {
    x = 500;
    y = 50;
    dx = 0;

    createSprite() {
        return new Animation(
            Animation.group(
                Animation.sequence(
                    Animation.group(Animation.set("image", "red"), Animation.animate("x", this.x, 20, 20), Animation.set("y", this.y)),
                    Animation.group(Animation.set("image", "redFalling"), Animation.animate("x", 20, this.x, 20)),
                    Animation.wait(10),
                    Animation.call(({ scene, self }) => scene.remove(self))
                ),
                Animation.animate("rotate", 0, 6.28, 10, 5),
                Animation.animate("scale", 1, 0.3, 40)
            )
        );
    }

    enter({ scene }) {
        scene.add(this.createSprite());
    }

    move({ keyboard, scene }) {
        if (keyboard["ArrowRight"]) this.dx += 1;
        if (keyboard["ArrowLeft"]) this.dx -= 1;
        if (keyboard["ArrowDown"]) this.y += 1;
        if (keyboard["ArrowUp"]) this.y -= 1;
        if (keyboard[" "]) {
            scene.add(this.createSprite());
        }
        this.x += this.dx;
    }

    draw({ images }) {
        images.draw({ image: "green", x: this.x, y: this.y, rotate: this.dx * 0.1 });
    }
})();

init({
    graphics: {
        red: { source: GraphicsSheet, x: 0, y: 0, w: 128, h: 128, scale: 0.4 },
        redFalling: { source: GraphicsSheet, x: 0, y: 128, w: 128, h: 128, scale: 0.4 },
        blue: { source: GraphicsSheet, x: 128, y: 0, w: 128, h: 128, scale: 0.4 },
        blueFalling: { source: GraphicsSheet, x: 128, y: 128, w: 128, h: 128, scale: 0.4 },
        yellow: { source: GraphicsSheet, x: 256, y: 0, w: 128, h: 128, scale: 0.4 },
        yellowFalling: { source: GraphicsSheet, x: 256, y: 128, w: 128, h: 128, scale: 0.4 },
        green: { source: GraphicsSheet, x: 384, y: 0, w: 128, h: 128, scale: 0.4 },
        greenFalling: { source: GraphicsSheet, x: 384, y: 128, w: 128, h: 128, scale: 0.4 },
        purple: { source: GraphicsSheet, x: 512, y: 0, w: 128, h: 128, scale: 0.4 },
        purpleFalling: { source: GraphicsSheet, x: 512, y: 128, w: 128, h: 128, scale: 0.4 },
        black: { source: GraphicsSheet, x: 640, y: 0, w: 128, h: 128, scale: 0.4 },
        blackFalling: { source: GraphicsSheet, x: 640, y: 128, w: 128, h: 128, scale: 0.4 },
        rainbow: { source: GraphicsSheet, x: 768, y: 0, w: 128, h: 128, scale: 0.4 },
        rainbowFalling: { source: GraphicsSheet, x: 768, y: 128, w: 128, h: 128, scale: 0.4 }
    },
    start: testScreen
});
