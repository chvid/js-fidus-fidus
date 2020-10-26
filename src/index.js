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
                        result = { ...result, ... this.computeState(context, i, time - start) };
                    }
                }
                break;
            case "group":
                for (let i of script.items) {
                    result = { ...result, ... this.computeState(context, i, time) }
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

    move({ counter, scene }) {
        this.computed = this.computeState({ self: this, ...arguments[0] }, this.script, counter - this.enterAt);
        /*
        let maxDuration = 0;
        for (let k of Object.keys(this.script)) {
            let v = this.script[k];
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
        */

        if (counter > 200 + this.enterAt) {
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
        return new Animation(
            Animation.group(
                Animation.sequence(
                    Animation.group(
                        Animation.set("image", "red"),
                        Animation.animate("x", this.x, 20, 20),
                        Animation.set("y", this.y)
                    ),
                    Animation.group(
                        Animation.set("image", "red"),
                        Animation.animate("x", 20, this.x, 20),
                        Animation.set("y", this.y)
                    ),
                    Animation.wait(10),
                    Animation.call(({ scene, self }) => scene.remove(self))
                ),
                Animation.animate("rotate", 0, 6.28, 10, 4),
                Animation.animate("scale", 1, 0, 40)
            )
        );

        /*
        return new Animation(
            {
                type: "group",
                items: [
                    {
                        type: "sequence",
                        items: [
                            {
                                type: "group",
                                items: [
                                    { type: "set", property: "image", value: "red" },
                                    { type: "animate", property: "x", from: this.x, to: 20, duration: 20 },
                                    { type: "set", property: "y", value: this.y },
                                ]
                            },
                            {
                                type: "group",
                                items: [
                                    { type: "set", property: "image", value: "red" },
                                    { type: "animate", property: "x", from: 20, to: this.x, duration: 20 },
                                    { type: "set", property: "y", value: this.y },
                                ]
                            },
                            {
                                type: "wait",
                                duration: 10
                            },
                            {
                                type: "call",
                                value: ({ scene, self }) => scene.remove(self)
                            }
                        ]
                    },
                    {
                        type: "animate",
                        property: "rotate",
                        from: 0,
                        to: 6.28,
                        duration: 20,
                        loop: 50
                    },
                    {
                        type: "animate",
                        property: "scale",
                        from: 1,
                        to: 0,
                        duration: 40

                    }
                ]
            }
        )
        */
        /*
        return new Animation(
            {
                type: "group",
                items: [
                    { type: "set", property: "image", value: "red" },
                    { type: "animate", property: "x", from: this.x, to: 20, duration: 20 },
                    { type: "set", property: "y", value: this.y },
                    { type: "animate", property: "rotate", from: 6.28, to: 0, duration: 10, loop: 2 },
                    { type: "animate", property: "scale", from: 1, to: 0, duration: 100 }
                ]
            }
        )
        */
        /*
        return new Animation({
            image: "red",
            x: { from: this.x, to: 200, duration: 20 },
            y: this.y,
            scale: { from: 1, to: 0, duration: 100 },
            rotate: { from: 6.28, to: 0, duration: 10, loop: true }
        });
        */
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
