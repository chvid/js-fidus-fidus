const findZIndex = o => (typeof o == "object" && o.zIndex ? o.zIndex : 0);

const sortNodes = nodes => nodes.sort((a, b) => findZIndex(a) - findZIndex(b));

export const scene = new (class {
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
