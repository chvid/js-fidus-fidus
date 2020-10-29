import { computeState, computeDuration } from "./script";

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
            }

            let delta = counter - this.scriptAddedAt;

            if (computeDuration(this.script) >= delta) {
                let computed = computeState({ ...arguments[0], self: this }, this.script, delta);

                for (let i of Object.keys(computed)) {
                    this[i] = computed[i];
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
        graphics.font = `${this.size}px ${this.fontFamily}`;

        graphics.fillStyle = this.fillStyle;
        graphics.fillText(this.text, this.x, this.y);
        graphics.strokeStyle = this.strokeStyle;
        graphics.strokeText(this.text, this.x, this.y);
    }
}

