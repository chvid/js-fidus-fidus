const findZIndex = o => (typeof o == "object" && o.zIndex ? o.zIndex : 0);

const sortNodes = nodes => nodes.sort((a, b) => findZIndex(a) - findZIndex(b));

let key = 0;

export const scene = new (class {
    elements = {};

    elementsToAdd = [];
    elementsToRemove = [];

    add(elementOrName, element) {
        if (typeof elementOrName == "string") {
            this.elementsToAdd.push({ name: elementOrName, element });
            return element;
        } else {
            this.elementsToAdd.push({ name: ++key, element: elementOrName });
            return elementOrName;
        }
    }

    remove(elementOrName) {
        if (typeof elementOrName == "string") {
            this.elementsToRemove.push(elementOrName);
        } else {
            for (let name of Object.keys(this.elements)) {
                if (this.elements[name] == elementOrName) {
                    this.elementsToRemove.push(name);
                }
            }
        }
    }

    draw(c) {
        for (let e of sortNodes(Object.values(this.elements))) if (e.draw) e.draw(c);
    }

    move(c) {
        for (let e of this.elementsToAdd) {
            this.elements[e.name] = e.element;
            if (e.element.enter) e.element.enter(c);
        }
        this.elementsToAdd = [];

        for (let e of Object.values(this.elements)) if (e.move) e.move(c);

        for (let name of this.elementsToRemove) {
            if (this.elements[name].exit) {
                this.elements[name].exit(c);
            }
            delete this.elements[name];
        }
        this.elementsToRemove = [];
    }

    get(name) {
        for (let e of this.elementsToAdd) {
            if (e.name == name) return e.element;
        }
        return this.elements[name];
    }
})();
