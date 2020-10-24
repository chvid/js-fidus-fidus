import "./index.css";

import GraphicsSheet from "./graphics/graphics-sheet.png";
import { init } from "./framework";

class Animation {
    computed = {};

    constructor(properties) {
        this.properties = properties;
    }

    enter({ counter }) {
        this.enterAt = counter;
    }

    move({ counter, scene }) {
        let maxDuration = 0;
        for (let k of Object.keys(this.properties)) {
            let v = this.properties[k];
            if (typeof v == "object") {
                let delta = (counter - this.enterAt) / v.duration;

                maxDuration = Math.max(maxDuration, v.duration);

                if (v.loop) {
                    delta = delta - Math.floor(delta);
                } else {
                    delta = Math.min(1, delta);
                }

                this.computed[k] = v.to * delta + v.from * (1 - delta);
            } else {
                this.computed[k] = v;
            }
        }

        if (counter > maxDuration + this.enterAt) {
            scene.remove(this);
        }
    }

    draw({ images }) {
        images.draw(this.computed);
    }
}

const testScreen = new (class {
    x = 500;
    y = 50;
    dx = 0;

    createSprite() {
        return new Animation({
            image: "red",
            x: { from: this.x, to: 200, duration: 20 },
            y: this.y,
            scale: { from: 1, to: 0, duration: 100 },
            rotate: { from: 6.28, to: 0, duration: 10, loop: true }
        });
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

    draw({ width, height, images }) {
        images.draw({ image: "green", x: this.x, y: this.y, rotate: this.dx * 0.1 });
    }
})();

init({
    graphics: {
        red: { image: GraphicsSheet, x: 0, y: 0, w: 128, h: 128, scale: 0.4 },
        redFalling: { image: GraphicsSheet, x: 0, y: 128, w: 128, h: 128, scale: 0.4 },
        blue: { image: GraphicsSheet, x: 128, y: 0, w: 128, h: 128, scale: 0.4 },
        blueFalling: { image: GraphicsSheet, x: 128, y: 128, w: 128, h: 128, scale: 0.4 },
        yellow: { image: GraphicsSheet, x: 256, y: 0, w: 128, h: 128, scale: 0.4 },
        yellowFalling: { image: GraphicsSheet, x: 256, y: 128, w: 128, h: 128, scale: 0.4 },
        green: { image: GraphicsSheet, x: 384, y: 0, w: 128, h: 128, scale: 0.4 },
        greenFalling: { image: GraphicsSheet, x: 384, y: 128, w: 128, h: 128, scale: 0.4 },
        purple: { image: GraphicsSheet, x: 512, y: 0, w: 128, h: 128, scale: 0.4 },
        purpleFalling: { image: GraphicsSheet, x: 512, y: 128, w: 128, h: 128, scale: 0.4 },
        black: { image: GraphicsSheet, x: 640, y: 0, w: 128, h: 128, scale: 0.4 },
        blackFalling: { image: GraphicsSheet, x: 640, y: 128, w: 128, h: 128, scale: 0.4 },
        rainbow: { image: GraphicsSheet, x: 768, y: 0, w: 128, h: 128, scale: 0.4 },
        rainbowFalling: { image: GraphicsSheet, x: 768, y: 128, w: 128, h: 128, scale: 0.4 }
    },
    start: testScreen
});
