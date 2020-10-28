import { computeState, computeDuration } from "./script";

export class Sprite {
    zIndex = 0;

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
                let computed = computeState(arguments[0], this.script, delta);

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
