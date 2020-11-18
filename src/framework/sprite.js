import { computeState, computeDuration } from "./script";

const readProperty = (property, context) => (typeof property == "function" ? property(context) : property);

export class Sprite {
    constructor(properties) {
        for (let i of Object.keys(properties)) {
            this[i] = properties[i];
        }
    }

    move({ counter }) {
        if (this.script) {
            if (this.scriptAddedAt === undefined) {
                this.scriptAddedAt = counter;
                this.scriptAddedAtState = { ...this };
            }

            let delta = counter - this.scriptAddedAt;

            if (computeDuration(this.script) >= delta) {
                let computed = computeState({ ...arguments[0], self: this }, this.script, delta);

                for (let i of Object.keys(computed)) {
                    let value = computed[i].set !== undefined ? computed[i].set : this.scriptAddedAtState[i];
                    value = computed[i].delta !== undefined ? value + computed[i].delta : value;
                    this[i] = value;
                }
            } else {
                this.script = undefined;
            }
        }
    }

    draw({ images }) {
        images.draw(this);
    }

    runScript(script) {
        this.script = script;
        this.scriptAddedAt = undefined;
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
