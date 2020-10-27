import "./index.css";

import GraphicsSheet from "./graphics/graphics-sheet.png";
import Background from "./graphics/background.png";
import BigBlack from "./graphics/big-black.png";
import BigPurple from "./graphics/big-purple.png";
import BigRed from "./graphics/big-red.png";
import BigHalo from "./graphics/big-halo.png";
import TitleGreen from "./graphics/title-green.png";
import TitleRed from "./graphics/title-red.png";
import { init, Animation } from "./framework";

const startScreen = new (class {
    bigHalo = new Animation(
        Animation.group(
            Animation.set("image", "bigHalo"),
            Animation.set("x", 125),
            Animation.set("y", 568 - 140),
            Animation.animate("rotate", 6.28, 0, 4000, Number.POSITIVE_INFINITY)
        )
    );

    bigRed = new Animation(
        Animation.group(
            Animation.set("image", "bigRed"),
            Animation.set("x", 230),
            Animation.set("y", 568 - 270),
            Animation.sequence(
                Animation.animate("scale", 1, 2, 5),
                Animation.animate("scale", 2, 1, 10)
            )
        )
    );

    bigPurple = new Animation(
        Animation.group(
            Animation.set("image", "bigPurple"),
            Animation.set("x", 125),
            Animation.set("y", 568 - 140),
            Animation.sequence(
                Animation.animate("scale", 1, 2, 5),
                Animation.animate("scale", 2, 1, 10)
            )
       )
    );

    bigBlack = new Animation(
        Animation.group(
            Animation.set("image", "bigBlack"),
            Animation.set("x", 80),
            Animation.set("y", 568 - 300),
            Animation.sequence(
                Animation.animate("scale", 1, 2, 5),
                Animation.animate("scale", 2, 1, 10)
            )
        )
    );

    titleRed = new Animation(
        Animation.group(
            Animation.set("image", "titleRed"),
            Animation.set("x", 140),
            Animation.set("y", 568 - 504),
            Animation.sequence(
                Animation.animate("scale", 1, 2, 5),
                Animation.animate("scale", 2, 1.4, 10)
            )
        )
    );

    titleGreen = new Animation(
        Animation.group(
            Animation.set("image", "titleGreen"),
            Animation.set("x", 180),
            Animation.set("y", 568 - 414),
            Animation.sequence(
                Animation.animate("scale", 1, 2, 5),
                Animation.animate("scale", 2, 1.4, 10)
            )
        )
    )

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
            scene.add(this.createSprite());
        }
    }

    exit({scene}) {
        scene.remove(this.titleGreen);
        scene.remove(this.titleRed);
    }

    draw({ images }) {
        images.draw({ image: "background", x: 160, y: 284 })
    }
})();

const nextScreen = {

}

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
