import { computeState, computeDuration } from "./script";

const readProperty = (property, context) => (typeof property == "function" ? property(context) : property);

export class Sprite {

    constructor(properties) {
        for (let i of Object.keys(properties)) {
            this[i] = properties[i];
        }
        this.scripts = [];
        if (this.script) {
            this.runScript(this.script);
            delete this.script;
        }
    }

    move({ counter }) {
        for (let s of this.scripts) {
            if (s.addedAt === undefined) {
                s.addedAt = counter;
                s.deltas = { };
            }

            let delta = counter - s.addedAt;

            if (computeDuration(s.script) >= delta) {
                let computed = computeState({ ...arguments[0], self: this }, s.script, delta);

                for (let i of Object.keys(computed)) {
                    let oldDelta = s.deltas[i] ? s.deltas[i] : 0;
                    let value = computed[i].set !== undefined ? computed[i].set : this[i];
                    let delta = computed[i].delta ? computed[i].delta : 0;
                    value = value + delta - oldDelta;
                    this[i] = value;
                    s.deltas[i] = delta;
                }
            }
        }
    }

    draw({ images }) {
        images.draw(this);
    }

    runScript(script) {
        this.scripts.push({ script });
    }
}

export class Label {
    fontFamily = "AvenirNext-Heavy, sans-serif";
    size = 20;
    fillStyle = "#000000ff";
    strokeStyle = "#ffffffaa";

    constructor(properties) {
        for (let i of Object.keys(properties)) {
            this[i] = properties[i];
        }
    }

    draw({ graphics }) {
        let text = readProperty(this.text, arguments[0]);

        graphics.font = `${this.size}px ${this.fontFamily}`;
        graphics.fillStyle = this.fillStyle;
        graphics.fillText(text, this.x, this.y);
        graphics.strokeStyle = this.strokeStyle;
        graphics.strokeText(text, this.x, this.y);
    }
}
