import { context } from "./index";

export const images = new (class {
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
