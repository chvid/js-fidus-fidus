import "./index.css";

import GraphicsSheet from "./graphics/graphics-sheet.png";

const testScreen = new (class {
    x = 500;
    y = 50;
    dx = 0;

    move({ keyboard }) {
        if (keyboard["ArrowRight"]) this.dx += 1;
        if (keyboard["ArrowLeft"]) this.dx -= 1;
        this.x += this.dx;
        if (keyboard["ArrowDown"]) this.y += 1;
        if (keyboard["ArrowUp"]) this.y -= 1;
    }

    draw({ width, height, images }) {
        images.draw({ image: "blue", x: (width / 1000.5) * this.x, y: (height / 100.5) * this.y, rotate: this.dx * 0.1 });
    }
})();

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

        context.graphics.clearRect(0, 0, context.width, context.height);
        if (context.screen && context.screen.draw) {
            context.screen.draw(context);
        }

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

const init = ({ graphics }) => {
    images.init(graphics);
    context.images = images;
};

init({
    graphics: {
        red: { image: GraphicsSheet, x: 0, y: 0, w: 128, h: 128, scale: 0.4 },
        "red-falling": { image: GraphicsSheet, x: 0, y: 128, w: 128, h: 128, scale: 0.4 },
        blue: { image: GraphicsSheet, x: 128, y: 0, w: 128, h: 128, scale: 0.4 },
        "blue-falling": { image: GraphicsSheet, x: 128, y: 128, w: 128, h: 128, scale: 0.4 },
        yellow: { image: GraphicsSheet, x: 256, y: 0, w: 128, h: 128, scale: 0.4 },
        "yellow-falling": { image: GraphicsSheet, x: 256, y: 128, w: 128, h: 128, scale: 0.4 },
        green: { image: GraphicsSheet, x: 384, y: 0, w: 128, h: 128, scale: 0.4 },
        "green-falling": { image: GraphicsSheet, x: 384, y: 128, w: 128, h: 128, scale: 0.4 },
        purple: { image: GraphicsSheet, x: 512, y: 0, w: 128, h: 128, scale: 0.4 },
        "purple-falling": { image: GraphicsSheet, x: 512, y: 128, w: 128, h: 128, scale: 0.4 },
        black: { image: GraphicsSheet, x: 640, y: 0, w: 128, h: 128, scale: 0.4 },
        "black-falling": { image: GraphicsSheet, x: 640, y: 128, w: 128, h: 128, scale: 0.4 },
        rainbow: { image: GraphicsSheet, x: 768, y: 0, w: 128, h: 128, scale: 0.4 },
        "rainbow-falling": { image: GraphicsSheet, x: 768, y: 128, w: 128, h: 128, scale: 0.4 }
    }
});

context.show(testScreen);
