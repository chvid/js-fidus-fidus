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
import { Matrix } from "./matrix";

const colors = ["red", "blue", "yellow", "green", "purple"];

const countNeighbourhood = ({ matrix, x, y, value, seen = [] }) => {
    if (!seen.some(p => p.x == x && p.y == y)) {
        if (value == null) {
            value = matrix.get({ x, y });
        }
        if (value && matrix.get({ x, y }) == value) {
            seen.push({ x, y });
            countNeighbourhood({ matrix, value, x: x + 1, y, seen });
            countNeighbourhood({ matrix, value, x: x - 1, y, seen });
            countNeighbourhood({ matrix, value, x, y: y + 1, seen });
            countNeighbourhood({ matrix, value, x, y: y - 1, seen });
        }
    }
    return seen;
};

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

const checkKeyboard = (keyboardCounter, counter, interval, delay) => counter - keyboardCounter === 0 || ((counter - keyboardCounter) % interval == 0 && counter - keyboardCounter >= delay);

const gameOverSceen = new (class {
    enter({ scene, game, show }) {
        game.player.beans.forEach(bean => scene.remove(bean.sprite));

        const animation = Math.floor(3 * Math.random());
        const matrix = scene.get("matrix");

        for (let y = 0; y < matrix.height; y++) {
            for (let x = 0; x < matrix.width; x++) {
                const sprite = matrix.getSprite({ x, y });
                if (sprite) {
                    const wait = Math.floor(
                        [
                            () => 0.1 * (matrix.height - y) + 0.5,
                            () => 0.1 * (1 + y) + 0.5,
                            () => Math.pow(Math.pow(x - matrix.width / 2 + 0.5, 2) + Math.pow(y - matrix.height / 2 + 0.5, 2), 0.5) * 0.15 + 0.5
                        ][animation]() * 50
                    );
                    sprite.runScript(
                        Script.sequence(
                            Script.wait(wait),
                            Script.group(Script.animate("scale", 1.0, 1.5, 10), Script.animate("alpha", 1.0, 0.6, 10)),
                            Script.animate("scale", 1.5, 0.75, 50),
                            Script.group(Script.animate("scale", 0.75, 0.0, 5), Script.animate("alpha", 0.6, 0.0, 5))
                        )
                    );
                }
            }
        }
        show(startScreen, 3 * 50);
    }

    exit({ scene }) {
        scene.get("matrix").clear();
    }
})();

const moveBean = ({ bean, dx, dy, faster }) => {
    let scripts = [];
    if (dy) {
        scripts.push(Script.sequence(faster ? Script.animateBy("y", 52 * dy, 5, 1, "linear") : Script.animateBy("y", 52 * dy, 10, 1, "sigmoid")));
        bean.y += dy;
    }

    if (dx) {
        scripts.push(Script.sequence(faster ? Script.animateBy("x", 52 * dx, 5, 1, "linear") : Script.animateBy("x", 52 * dx, 10, 1, "sigmoid")));
        bean.x += dx;
    }
    bean.sprite.runScript(Script.group(...scripts));
};

const movePlayer = ({ dx, dy, player }) => player.beans.forEach(bean => moveBean({ bean, dx, dy }));

const canMoveBean = ({ dx, dy, bean, matrix }) => matrix.get({ x: bean.x + dx, y: bean.y + dy }) == null;

const canMovePlayer = ({ dx = 0, dy = 0, player, matrix }) => !player.beans.map(bean => canMoveBean({ dx, dy, bean, matrix })).includes(false);

const rotatePlayer = ({ direction, player, matrix }) => {
    const bean = player.beans[1];
    const rotations = [
        { dx: 1, dy: 1 },
        { dx: -1, dy: 1 },
        { dx: -1, dy: -1 },
        { dx: 1, dy: -1 }
    ];
    const rotation = rotations[direction == 1 ? (player.rotate + 1) % 4 : (player.rotate + 2) % 4];
    if (canMoveBean({ bean, ...rotation, matrix })) {
        moveBean({ bean, ...rotation });
        player.rotate = direction == 1 ? (player.rotate + 1) % 4 : (player.rotate + 3) % 4;
    }
};

const gameScreen = new (class {
    enter({ show, scene }) {
        scene.get("matrix").set({ x: 4, y: 10, value: "red" });
        scene.get("matrix").set({ x: 3, y: 10, value: "yellow" });
        show(gamePlayerEntersScreen, 25);
    }
})();

const gamePlayerEntersScreen = new (class {
    enter({ scene, game, show }) {
        game.player = {
            rotate: 0,
            beans: [2, 3].map(x => ({ x, y: 0, value: colors[Math.floor(Math.random() * 5)] })).map(b => ({ ...b, sprite: new Sprite({ image: b.value, x: 30 + 52 * b.x, y: 24 }) }))
        };
        game.player.beans.forEach(bean => bean.sprite.runScript(Script.sequence(
            Script.animate("scale", 1, 2, 0.2 * 50),
            Script.animate("scale", 2, 1, 0.3 * 50)
        )));
        game.player.beans.forEach(bean => scene.add(bean.sprite));
        show(gamePlayerMovesScreen, 25);
    }
})();

const gamePlayerMovesScreen = new (class {
    move({ keyboard, show, scene, counter, counterSinceEnter, game }) {
        const matrix = scene.get("matrix");
        const player = game.player;
        const faster = keyboard[" "];

        if (player.beans.length == 2) {
            if (checkKeyboard(keyboard["ArrowDown"], counter, 10, 30)) {
                rotatePlayer({ direction: 1, player, matrix });
            } else if (checkKeyboard(keyboard["ArrowUp"], counter, 10, 30)) {
                rotatePlayer({ direction: -1, player, matrix });
            } else if (checkKeyboard(keyboard["ArrowLeft"], counter, 10, 30) && canMovePlayer({ dx: -1, player, matrix })) {
                movePlayer({ dx: -1, player });
            } else if (checkKeyboard(keyboard["ArrowRight"], counter, 10, 30) && canMovePlayer({ dx: 1, player, matrix })) {
                movePlayer({ dx: 1, player });
            }
        }

        if (counterSinceEnter % 30 == 0 || (faster && counterSinceEnter % 5 == 0)) {
            [...player.beans]
                .sort((a, b) => b.y - a.y)
                .forEach(bean => {
                    if (canMoveBean({ bean, dy: 1, dx: 0, matrix })) {
                        moveBean({ bean, dy: 1, dx: 0, faster });
                        bean.sprite.image = bean.value + (faster ? "Falling" : "");
                    } else {
                        matrix.set(bean);
                        scene.remove(bean.sprite);
                        player.beans = player.beans.filter(other => other !== bean);
                        show(gameUpdateBeansScreen);
                    }
                });
        }
    }
})();

const gameUpdateBeansScreen = new (class {
    move({ show, scene, counterSinceEnter, game }) {
        const matrix = scene.get("matrix");
        const player = game.player;

        if (counterSinceEnter % 5 == 4) {
            [...player.beans]
                .sort((a, b) => b.y - a.y)
                .forEach(bean => {
                    if (canMoveBean({ bean, dy: 1, dx: 0, matrix })) {
                        moveBean({ bean, dy: 1, dx: 0, faster: true });
                    } else {
                        matrix.set(bean);
                        scene.remove(bean.sprite);
                        player.beans = [];
                    }
                });
        }
        if (player.beans.length == 0) {
            if (matrix.get({ x: 2, y: 0 }) || matrix.get({ x: 3, y: 0 })) {
                show(gameOverSceen);
            } else {
                show(gameCollapseBeansScreen);
            }
        }
    }
})();

const range = (from, to) => {
    let result = [];
    for (let i = from; i < to; i++) {
        result.push(i);
    }
    return result;
};

const gameCollapseBeansScreen = new (class {
    enter({ show, scene }) {
        const matrix = scene.get("matrix");

        const groups = matrix
            .flattenEntries()
            .map(e => countNeighbourhood({ matrix, x: e.x, y: e.y }))
            .filter(group => group.length >= 4);

        if (groups.length > 0) {
            groups.forEach(group => {
                group.forEach(e => matrix.set({ x: e.x, y: e.y, value: null }));
            });
            show(gameMarksBeansFallingScreen, 10);
        } else {
            show(gamePlayerEntersScreen, 10);
        }
    }
})();

const gameMarksBeansFallingScreen = new (class {
    enter({ show, scene }) {
        const matrix = scene.get("matrix");

        const beansInFreefall = matrix.flattenEntries().filter(e => e.value != null && range(e.y + 1, matrix.height).some(y => matrix.get({ x: e.x, y }) == null));

        if (beansInFreefall.length > 0) {
            beansInFreefall.forEach(e => {
                e.sprite.image = e.value + "Falling";
                e.sprite.runScript(Script.animate("y", e.sprite.y, e.sprite.y + 56, 5));
            });

            show(gameMoveFallingBeansDownScreen, 5);
        } else {
            show(gameCollapseBeansScreen, 10);
        }
    }
})();

const gameMoveFallingBeansDownScreen = new (class {
    enter({ show, scene }) {
        const matrix = scene.get("matrix");

        matrix
            .flattenEntries()
            .reverse()
            .forEach(e => {
                if (e.value != null && e.sprite.image == e.value + "Falling") {
                    matrix.set({ x: e.x, y: e.y + 1, value: e.value });
                    matrix.set({ x: e.x, y: e.y, value: null });
                }
            });

        show(gameMarksBeansFallingScreen);
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
        matrix: new Matrix({ width: 6, height: 11, defaultValue: "blocked" }),
        background
    },
    game: {
        score: 42,
        hiscore: 9999
    }
});
