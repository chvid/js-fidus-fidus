import "./index.css";

import GraphicsSheet from "./graphics/graphics-sheet.png";
import Background from "./graphics/background.png";
import BigBlack from "./graphics/big-black.png";
import BigPurple from "./graphics/big-purple.png";
import BigRed from "./graphics/big-red.png";
import BigHalo from "./graphics/big-halo.png";
import TitleGreen from "./graphics/title-green.png";
import TitleRed from "./graphics/title-red.png";
import Cloud from "./graphics/cloud.png";
import { init, Sprite, Label } from "./framework";
import * as Script from "./framework/script";

class Matrix {
    constructor({ width, height }) {
        this.width = width;
        this.height = height;
        this.entries = [];
        for (let y = 0; y < height; y++) {
            this.entries[y] = [];
            for (let x = 0; x < width; x++) {
                this.entries[y][x] = { value: null, x, y };
            }
        }
    }

    move({ add, remove }) {
        for (let line of this.entries) {
            for (let e of line) {
                if (e.newValue !== undefined) {
                    if (e.sprite) {
                        remove(e.sprite);
                        e.sprite = undefined;
                    }
                    e.value = e.newValue;
                    e.newValue = undefined;
                    e.sprite = add(e);
                }
            }
        }
    }

    get({ x, y }) {
        return this.entries[y][x].value;
    }

    set({ x, y, value }) {
        this.entries[y][x] = { ...this.entries[y][x], newValue: value };
    }
}

const startScreen = new (class {
    enter({ scene }) {
        scene.add(
            "bigHalo",
            new Sprite({
                x: 125,
                y: 568 - 140,
                image: "bigHalo",
                zIndex: -1,
                script: Script.group(Script.animate("scale", 0, 1, 20), Script.animate("alpha", 0, 1, 10), Script.animate("rotate", 6.28, 0, 5000, Number.POSITIVE_INFINITY))
            })
        );
        scene.add(
            "bigRed",
            new Sprite({
                x: 230,
                y: 568 - 270,
                image: "bigRed",
                script: Script.sequence(Script.animate("scale", 1, 2, 5), Script.animate("scale", 2, 1, 10))
            })
        );
        scene.add(
            "bigPurple",
            new Sprite({
                x: 125,
                y: 568 - 140,
                image: "bigPurple",
                script: Script.sequence(Script.animate("scale", 1, 2, 5), Script.animate("scale", 2, 1, 10))
            })
        );
        scene.add(
            "bigBlack",
            new Sprite({
                x: 80,
                y: 568 - 300,
                image: "bigBlack",
                script: Script.sequence(Script.animate("scale", 1, 2, 5), Script.animate("scale", 2, 1, 10))
            })
        );
        scene.add(
            "titleRed",
            new Sprite({
                x: 140,
                y: 568 - 504,
                image: "titleRed",
                script: Script.sequence(Script.animate("scale", 1, 2, 5), Script.animate("scale", 2, 1.4, 10))
            })
        );
        scene.add(
            "titleGreen",
            new Sprite({
                x: 180,
                y: 568 - 414,
                image: "titleGreen",
                script: Script.sequence(Script.animate("scale", 1, 2, 5), Script.animate("scale", 2, 1.4, 10))
            })
        );
    }

    move({ keyboard, show, game, counter }) {
        if (keyboard[" "] === counter) {
            show(gameScreen);
            game.score++;
        }
    }

    exit({ scene }) {
        const removeScript = Script.sequence(
            Script.group(Script.animate("scale", 1, 2, 10), Script.animate("alpha", 1, 0, 10)),
            Script.call(({ scene, self }) => scene.remove(self))
        );

        scene.get("bigHalo").runScript(removeScript);
        scene.get("bigRed").runScript(removeScript);
        scene.get("bigPurple").runScript(removeScript);
        scene.get("bigBlack").runScript(removeScript);

        const removeScriptForTitle = Script.sequence(
            Script.group(Script.animate("scale", 1.4, 3, 10), Script.animate("alpha", 1, 0, 10)),
            Script.call(({ scene, self }) => scene.remove(self))
        );

        scene.get("titleRed").runScript(removeScriptForTitle);
        scene.get("titleGreen").runScript(removeScriptForTitle);
    }
})();

const checkKeyboard = (keyboardCounter, counter, interval, delay) =>
    ((counter - keyboardCounter) === 0 || (((counter - keyboardCounter) % interval) == 0 && (counter - keyboardCounter) >= delay));

const gameScreen = new (class {
    enter({ scene, game }) {
        game.playerBeanA = {
            x: 2, y: 0, sprite: new Sprite({ image: "red", x: 30 + 52 * 2, y: 24 })
        };
        game.playerBeanB = {
            x: 3, y: 0, sprite: new Sprite({ image: "blue", x: 30 + 52 * 3, y: 24 })
        };
        scene.add(game.playerBeanA.sprite);
        scene.add(game.playerBeanB.sprite);
        game.matrix.set({ x: 4, y: 10, value: "red" });
        game.matrix.set({ x: 3, y: 10, value: "yellow" });
    }

    exit({ scene }) {
        scene.remove(game.playerBeanA.sprite);
        scene.remove(game.playerBeanB.sprite);
    }

    move({ keyboard, show, scene, counter, counterSinceEnter, game }) {
        const movePlayer = ({ dx = 0, dy = 0 }) => {
            if (dy) {
                game.playerBeanA.sprite.runScript(Script.sequence(Script.animateBy("y", 52 * dy, 10, 1, "sigmoid")));
                game.playerBeanB.sprite.runScript(Script.sequence(Script.animateBy("y", 52 * dy, 10, 1, "sigmoid")));
                game.playerBeanA.y += dy;
                game.playerBeanB.y += dy;
            }

            if (dx) {
                game.playerBeanA.sprite.runScript(Script.sequence(Script.animateBy("x", 52 * dx, 10, 1, "sigmoid")));
                game.playerBeanB.sprite.runScript(Script.sequence(Script.animateBy("x", 52 * dx, 10, 1, "sigmoid")));
                game.playerBeanA.x += dx;
                game.playerBeanB.x += dx;
            }
        }

        if (checkKeyboard(keyboard["ArrowUp"], counter, 10, 30)) {
            movePlayer({ dy: -1 });
        } else if (checkKeyboard(keyboard["ArrowDown"], counter, 10, 30)) {
            movePlayer({ dy: 1 });
        } else if (checkKeyboard(keyboard["ArrowLeft"], counter, 10, 30)) {
            movePlayer({ dx: -1 });
        } else if (checkKeyboard(keyboard["ArrowRight"], counter, 10, 30)) {
            movePlayer({ dx: 1 });
        }

        if (counterSinceEnter % 30 == 0) {
            movePlayer({ dy: 1 });
        }

        if (keyboard[" "] === counter) {
            show(startScreen);
        }

        game.matrix.move({
            add: (e) => {
                scene.add(new Sprite({ image: e.value, x: 30 + e.x * 52, y: e.y * 52 + 24 }));
            },
            remove: (s) => scene.remove(s)
        })
    }
})();

const background = new (class {
    enter({ scene }) {
        scene.add(new Sprite({ image: "background", x: 160, y: 284, zIndex: -999 }));
    }

    move({ scene, width, height }) {
        if (Math.random() < 0.004) {
            let x1 = Math.random() * width * 2 - width / 2;
            let x2 = x1 + (Math.random() * width) / 2 - width / 4;
            let time = Math.round(5 * Math.random() * 20 + 25);
            let alpha = 0.1 + Math.random() * 0.3;

            let cloud = new Sprite({
                image: "cloud",
                compositeOperation: "lighter",
                x: Math.random() * width,
                y: 50 + height * Math.pow(Math.random(), 0.75),
                scale: Math.random() * 0.2 + 0.9,
                zIndex: -10
            });

            cloud.runScript(
                Script.group(
                    Script.sequence(
                        Script.animate("alpha", 0, alpha, time * 3),
                        Script.animate("alpha", alpha, 0, time * 7),
                        Script.call(({ self, scene }) => scene.remove(self))
                    ),
                    Script.animate("x", x1, x2, 10 * time)
                )
            );

            scene.add(cloud);
        }
    }
})();

init({
    graphics: {
        red: { source: GraphicsSheet, x: 0, y: 0, w: 128, h: 128, scale: 0.4 },
        redFalling: { source: GraphicsSheet, x: 0, y: 128, w: 128, h: 128, scale: 0.4 },
        blue: { source: GraphicsSheet, x: 128, y: 0, w: 128, h: 128, scale: 0.4 },
        blueFalling: { source: GraphicsSheet, x: 128, y: 128, w: 128, h: 128, scale: 0.4 },
        yellow: { source: GraphicsSheet, x: 256, y: 0, w: 128, h: 128, scale: 0.4 },
        yellowFalling: { source: GraphicsSheet, x: 256, y: 128, w: 128, h: 128, scale: 0.4 },
        green: { source: GraphicsSheet, x: 384, y: 0, w: 128, h: 128, scale: 0.4 },
        greenFalling: { source: GraphicsSheet, x: 384, y: 128, w: 128, h: 128, scale: 0.4 },
        purple: { source: GraphicsSheet, x: 512, y: 0, w: 128, h: 128, scale: 0.4 },
        purpleFalling: { source: GraphicsSheet, x: 512, y: 128, w: 128, h: 128, scale: 0.4 },
        black: { source: GraphicsSheet, x: 640, y: 0, w: 128, h: 128, scale: 0.4 },
        blackFalling: { source: GraphicsSheet, x: 640, y: 128, w: 128, h: 128, scale: 0.4 },
        rainbow: { source: GraphicsSheet, x: 768, y: 0, w: 128, h: 128, scale: 0.4 },
        rainbowFalling: { source: GraphicsSheet, x: 768, y: 128, w: 128, h: 128, scale: 0.4 },
        background: { source: Background, scale: 0.5 },
        bigRed: { source: BigRed, scale: 0.5 },
        bigPurple: { source: BigPurple, scale: 0.5 },
        bigBlack: { source: BigBlack, scale: 0.5 },
        bigHalo: { source: BigHalo, scale: 0.5 },
        titleRed: { source: TitleRed, scale: 0.5 },
        titleGreen: { source: TitleGreen, scale: 0.5 },
        cloud: { source: Cloud, scale: 0.5 }
    },
    start: startScreen,
    scene: {
        score: new Label({ text: ({ game }) => ("" + (game.score + 1000000)).substring(2), x: 244, y: 20 }),
        hiscore: new Label({ text: ({ game }) => ("" + (game.hiscore + 1000000)).substring(2), x: 8, y: 20 }),
        background // new Sprite({ image: "background", x: 160, y: 284, zIndex: -999 })
    },
    game: {
        score: 42,
        hiscore: 9999,
        matrix: new Matrix({ width: 6, height: 12 })
    }
});
