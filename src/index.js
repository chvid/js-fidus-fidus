import "./index.css";

import GraphicsSheet from "./graphics/graphics-sheet.png";
import { init } from "./framework";

class Animation {
    static group(...items) {
        return { type: "group", items };
    }

    static sequence(...items) {
        return { type: "sequence", items };
    }

    static set(property, value) {
        return { type: "set", property, value };
    }

    static animate(property, from, to, duration, loop = 1) {
        return { type: "animate", property, from, to, duration, loop };
    }

    static wait(duration) {
        return { type: "wait", duration };
    }

    static call(value) {
        return { type: "call", value };
    }

    computed = {};

    constructor(script) {
        this.script = script;
    }

    enter({ counter }) {
        this.enterAt = counter;
    }

    computeDuration(script) {
        let result = 0;
        switch (script.type) {
            case "sequence":
                for (let i of script.items) {
                    result += this.computeDuration(i);
                }
                break;
            case "group":
                for (let i of script.items) {
                    result = Math.max(result, this.computeDuration(i));
                }
                break;
            case "animate":
                if (script.loop) {
                    result = script.duration * script.loop;
                } else {
                    result = script.duration;
                }
                break;
            case "wait":
                result = script.duration;
                break;
        }
        return result;
    }

    computeState(context, script, time) {
        let result = {};
        switch (script.type) {
            case "sequence":
                let pointer = 0;
                for (let i of script.items) {
                    let start = pointer;
                    pointer += this.computeDuration(i);
                    if (start <= time) {
                        result = { ...result, ...this.computeState(context, i, time - start) };
                    }
                }
                break;
            case "group":
                for (let i of script.items) {
                    result = { ...result, ...this.computeState(context, i, time) };
                }
                break;
            case "set":
                result[script.property] = script.value;
                break;
            case "animate":
                let delta = time / script.duration;

                if (script.loop && delta < script.loop) {
                    delta = delta - Math.floor(delta);
                } else {
                    delta = Math.min(1, delta);
                }

                result[script.property] = script.to * delta + script.from * (1 - delta);
                break;
            case "call":
                if (time == 0) script.value(context);
                break;
            case "wait":
                break;
        }
        return result;
    }

    move({ counter }) {
        this.computed = this.computeState({ self: this, ...arguments[0] }, this.script, counter - this.enterAt);
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
