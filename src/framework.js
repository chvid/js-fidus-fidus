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

// TODO: image i inputstruktur -> source
// TODO: image default w & h

const images = new (class {
    entries = {};
    sourceImages = {};

    init(entries) {
        this.entries = entries;
        for (let e of Object.values(entries)) {
            var src = e.image;
            if (this.sourceImages[src] == null) {
                this.sourceImages[src] = new Image();
                this.sourceImages[src].src = src;
            }
        }
    }

    draw({ image, x, y, scale = 1, rotate = 0, alpha = 1, nudge = { x: 0, y: 0 }, compositeOperation = "source-over" }) {
        const entry = this.entries[image];
        const sourceImage = this.sourceImages[entry.image];

        scale *= entry.scale;

        nudge.x *= scale;
        nudge.y *= scale;

        context.graphics.save();
        context.graphics.translate(x + nudge.x, y + nudge.y);
        context.graphics.rotate(rotate);
        context.graphics.globalAlpha = alpha;
        context.graphics.globalCompositeOperation = compositeOperation;
        context.graphics.drawImage(sourceImage, entry.x, entry.y, entry.w, entry.h, (-entry.w * scale) / 2, (-entry.h * scale) / 2, entry.w * scale, entry.h * scale);
        context.graphics.restore();
    }
})();

const scene = new class {
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
}

export const init = ({ graphics, start }) => {
    images.init(graphics);
    context.images = images;
    context.scene = scene;
    context.show(start);
};
