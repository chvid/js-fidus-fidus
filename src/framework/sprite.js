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
                s.deltas = {};
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

const applyAlpha = (color, alpha) => {
    let hex = (256 + Math.round(alpha * parseInt(color.substr(-2), 16))).toString(16).substr(-2);
    return color.substr(0, 7) + hex;
}

export class Label extends Sprite {
    constructor(properties) {
        super({
            fontFamily: "AvenirNext-Heavy, sans-serif",
            size: 20,
            scale: 1,
            alpha: 1,
            fillStyle: "#000000ff",
            textAlign: "center",
            textBaseline: "middle",
            strokeStyle: "#ffffffaa", ...properties
        });
    }

    draw({ graphics }) {
        let text = readProperty(this.text, arguments[0]);
        graphics.font = `${Math.round(this.size * this.scale)}px ${this.fontFamily}`;
        graphics.textAlign = this.textAlign;
        graphics.textBaseline = this.textBaseline;
        graphics.fillStyle = applyAlpha(this.fillStyle, this.alpha);
        graphics.fillText(text, this.x, this.y);
        graphics.strokeStyle = applyAlpha(this.strokeStyle, this.alpha);
        graphics.strokeText(text, this.x, this.y);
    }
}
