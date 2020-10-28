import "./index.css";

import GraphicsSheet from "./graphics/graphics-sheet.png";
import Background from "./graphics/background.png";
import BigBlack from "./graphics/big-black.png";
import BigPurple from "./graphics/big-purple.png";
import BigRed from "./graphics/big-red.png";
import BigHalo from "./graphics/big-halo.png";
import TitleGreen from "./graphics/title-green.png";
import TitleRed from "./graphics/title-red.png";
import { init, Sprite } from "./framework";
import * as Script from "./framework/script";

const startScreen = new (class {
    bigHalo = new Sprite({
        x: 125,
        y: 568 - 140,
        image: "bigHalo",
        script: Script.group(
            Script.animate("scale", 0, 1, 20),
            Script.animate("alpha", 0, 1, 10),
            Script.animate("rotate", 6.28, 0, 5000, Number.POSITIVE_INFINITY)
        )
    });

    bigRed = new Sprite({
        x: 230,
        y: 568 - 270,
        image: "bigRed",
        script: Script.sequence(Script.animate("scale", 1, 2, 5), Script.animate("scale", 2, 1, 10))
    });

    bigPurple = new Sprite({
        x: 125,
        y: 568 - 140,
        image: "bigPurple",
        script: Script.sequence(Script.animate("scale", 1, 2, 5), Script.animate("scale", 2, 1, 10))
    });

    bigBlack = new Sprite({
        x: 80,
        y: 568 - 300,
        image: "bigBlack",
        script: Script.sequence(Script.animate("scale", 1, 2, 5), Script.animate("scale", 2, 1, 10))
    });

    titleRed = new Sprite({
        x: 140,
        y: 568 - 504,
        image: "titleRed",
        script: Script.sequence(Script.animate("scale", 1, 2, 5), Script.animate("scale", 2, 1.4, 10))
    });

    titleGreen = new Sprite({
        x: 180,
        y: 568 - 414,
        image: "titleGreen",
        script: Script.sequence(Script.animate("scale", 1, 2, 5), Script.animate("scale", 2, 1.4, 10))
    });

    enter({ scene }) {
        scene.add(this.bigHalo);
        scene.add(this.bigRed);
        scene.add(this.bigPurple);
        scene.add(this.bigBlack);
        scene.add(this.titleRed);
        scene.add(this.titleGreen);
    }

    move({ keyboard, show }) {
        if (keyboard[" "]) {
            show(nextScreen);
        }
    }

    exit() {
        const removeScript = Script.sequence(
            Script.group(Script.animate("scale", 1, 2, 10), Script.animate("alpha", 1, 0, 10)),
            Script.call(({ scene, self }) => { scene.remove(self) })
        );

        this.bigHalo.runScript(removeScript);
        this.bigRed.runScript(removeScript);
        this.bigPurple.runScript(removeScript);
        this.bigBlack.runScript(removeScript);

        const removeScriptForTitle = Script.sequence(
            Script.group(Script.animate("scale", 1.4, 3, 10), Script.animate("alpha", 1, 0, 10)),
            Script.call(({ scene, self }) => { scene.remove(self) })
        );

        this.titleRed.runScript(removeScriptForTitle);
        this.titleGreen.runScript(removeScriptForTitle);
    }

    draw({ images }) {
        images.draw({ image: "background", x: 160, y: 284 });
    }
})();

const nextScreen = {};

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
        titleGreen: { source: TitleGreen, scale: 0.5 }
    },
    start: startScreen
});
