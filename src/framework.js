import { computeDuration, computeState } from "./script";

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
    }, 20);
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

const findZIndex = o => typeof o == "object" && o.zIndex ? o.zIndex : 0;

const sortNodes = nodes => nodes.sort((a, b) => findZIndex(a) - findZIndex(b));

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
        for (let e of sortNodes(this.elements)) if (e.draw) e.draw(c);
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

export const init = ({ graphics, start }) => {
    images.init(graphics);
    context.images = images;
    context.scene = scene;
    context.show(start);
};
