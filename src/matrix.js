import { Sprite } from "./framework";

export class Matrix {
    constructor({ width, height, defaultValue }) {
        this.width = width;
        this.height = height;
        this.entries = [];
        this.defaultValue = defaultValue;
        for (let y = 0; y < height; y++) {
            this.entries[y] = [];
            for (let x = 0; x < width; x++) {
                this.entries[y][x] = { value: null, x, y };
            }
        }
    }

    clear() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                this.set({ x, y, value: null });
            }
        }
    }

    move(c) {
        for (let line of this.entries) {
            for (let e of line) {
                if (e.sprite && e.sprite.move) {
                    e.sprite.move(c);
                }
            }
        }
    }

    draw(c) {
        for (let line of this.entries) {
            for (let e of line) {
                if (e.sprite && e.sprite.draw) {
                    e.sprite.draw(c);
                }
            }
        }
    }

    getSprite({ x, y }) {
        return (x >= 0) && (y >= 0) && (x < this.width) && (y < this.height) ? this.entries[y][x].sprite : null;
    }

    get({ x, y }) {
        return (x >= 0) && (y >= 0) && (x < this.width) && (y < this.height) ? this.entries[y][x].value : this.defaultValue;
    }

    set({ x, y, value }) {
        this.entries[y][x] = {
            ...this.entries[y][x],
            sprite: value != null ? new Sprite({ image: value, x: 30 + x * 52, y: y * 52 + 24 }) : null,
            value
        };
    }

    flattenEntries() {
        return this.entries.reduce((a, b) => [...a, ...b], []).map(e => ({ ...e }));
    }
}
