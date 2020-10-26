const context = {
    // graphics
    // width
    // height
    // counter
    keyboard: {},
    show: screen => (context.nextScreen = screen)
};

window.onload = () => {
    const canvasElement = document.getElementById("canvas");

    context.graphics = canvasElement.getContext("2d");
    context.width = canvasElement.scrollWidth;
    context.height = canvasElement.scrollHeight;
    context.counter = 0;

    setInterval(() => {
        if (!context.images.checkLoadComplete()) {
            context.graphics.strokeText("loading ...", 20, 20);
            return;
        }

        if (context.nextScreen) {
            if (context.screen && context.screen.exit) {
                context.screen.exit(context);
            }

            context.screen = context.nextScreen;
            context.nextScreen = null;

            if (context.screen && context.screen.enter) {
                context.screen.enter(context);
            }
        }

        if (context.screen && context.screen.move) {
            context.screen.move(context);
        }

        context.scene.move(context);

        context.graphics.clearRect(0, 0, context.width, context.height);

        if (context.screen && context.screen.draw) {
            context.screen.draw(context);
        }

        context.scene.draw(context);

        context.counter += 1;
    }, 50);
};

document.addEventListener("keydown", e => (context.keyboard[e.key] = true));
document.addEventListener("keyup", e => delete context.keyboard[e.key]);

const images = new (class {
    entries = {};
    sourceImages = {};

    init(entries) {
        this.entries = entries;
        for (let e of Object.values(entries)) {
            var source = e.source;
            if (this.sourceImages[source] == null) {
                this.sourceImages[source] = new Image();
                this.sourceImages[source].src = source;
            }
        }
    }

    draw({ image, x, y, scale = 1, rotate = 0, alpha = 1, nudge = { x: 0, y: 0 }, compositeOperation = "source-over" }) {
        const entry = this.entries[image];
        const sourceImage = this.sourceImages[entry.source];
        const w = entry.w ? entry.w : sourceImage.width;
        const h = entry.h ? entry.h : sourceImage.height;

        scale *= entry.scale;

        nudge.x *= scale;
        nudge.y *= scale;

        context.graphics.save();
        context.graphics.translate(x + nudge.x, y + nudge.y);
        context.graphics.rotate(rotate);
        context.graphics.globalAlpha = alpha;
        context.graphics.globalCompositeOperation = compositeOperation;
        context.graphics.drawImage(sourceImage, entry.x ? entry.x : 0, entry.y ? entry.y : 0, w, h, (-w * scale) / 2, (-h * scale) / 2, w * scale, h * scale);
        context.graphics.restore();
    }

    checkLoadComplete() {
        let complete = true;
        for (let i of Object.values(this.sourceImages)) {
            complete = complete && i.complete;
        }
        return complete;
    }
})();

const scene = new (class {
    elements = [];

    elementsToAdd = [];
    elementsToRemove = [];

    add(element) {
        this.elementsToAdd.push(element);
    }

    remove(element) {
        this.elementsToRemove.push(element);
    }

    draw(c) {
        for (let e of this.elements) if (e.draw) e.draw(c);
    }

    move(c) {
        for (let e of this.elementsToAdd) {
            this.elements.push(e);
            if (e.enter) e.enter(c);
        }
        this.elementsToAdd = [];

        for (let e of this.elements) if (e.move) e.move(c);

        for (let e of this.elementsToRemove) {
            if (e.exit) e.exit(c);
            this.elements.splice(this.elements.indexOf(e), 1);
        }
        this.elementsToRemove = [];
    }
})();

export class Animation {
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

export const init = ({ graphics, start }) => {
    images.init(graphics);
    context.images = images;
    context.scene = scene;
    context.show(start);
};
