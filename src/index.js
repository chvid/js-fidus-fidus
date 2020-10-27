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

const testScreen = new (class {
    x = 160;
    y = 50;
    dx = 0;

    createSprite() {
        return new Animation(
            Animation.group(
                Animation.sequence(
                    Animation.group(Animation.set("image", "red"), Animation.animate("x", this.x, 20, 20), Animation.set("y", this.y)),
                    Animation.group(Animation.set("image", "redFalling"), Animation.animate("x", 20, this.x, 20)),
                    Animation.wait(10),
                    Animation.call(({ scene, self }) => scene.remove(self))
                ),
                Animation.animate("rotate", 0, 6.28, 10, 5),
                Animation.animate("scale", 1, 0.3, 40),
                Animation.animate("alpha", 1, 0, 40)
            )
        );
    }

    enter({ scene }) {
        scene.add(this.createSprite());
        scene.add(new Animation(
            Animation.group(
                Animation.set("image", "bigHalo"),
                Animation.set("x", 125),
                Animation.set("y", 568 - 140),
                Animation.animate("rotate", 6.28, 0, 4000, Number.POSITIVE_INFINITY)
            )
        ));
        scene.add(new Animation(
            Animation.group(
                Animation.set("image", "bigRed"),
                Animation.set("x", 230),
                Animation.set("y", 568 - 270),
                Animation.sequence(
                    Animation.animate("scale", 1, 2, 5),
                    Animation.animate("scale", 2, 1, 10)
                )
            )
        ));
        scene.add(new Animation(
            Animation.group(
                Animation.set("image", "bigPurple"),
                Animation.set("x", 125),
                Animation.set("y", 568 - 140),
                Animation.sequence(
                    Animation.animate("scale", 1, 2, 5),
                    Animation.animate("scale", 2, 1, 10)
                )
           )
        ));
        scene.add(new Animation(
            Animation.group(
                Animation.set("image", "bigBlack"),
                Animation.set("x", 80),
                Animation.set("y", 568 - 300),
                Animation.sequence(
                    Animation.animate("scale", 1, 2, 5),
                    Animation.animate("scale", 2, 1, 10)
                )
            )
        ));
        scene.add(new Animation(
            Animation.group(
                Animation.set("image", "titleRed"),
                Animation.set("x", 140),
                Animation.set("y", 568 - 504),
                Animation.sequence(
                    Animation.animate("scale", 1, 2, 5),
                    Animation.animate("scale", 2, 1.4, 10)
                )
            )
        ));
        scene.add(new Animation(
            Animation.group(
                Animation.set("image", "titleGreen"),
                Animation.set("x", 180),
                Animation.set("y", 568 - 414),
                Animation.sequence(
                    Animation.animate("scale", 1, 2, 5),
                    Animation.animate("scale", 2, 1.4, 10)
                )
            )
        ));
    }

    move({ keyboard, scene }) {
        if (keyboard["ArrowRight"]) this.dx += 1;
        if (keyboard["ArrowLeft"]) this.dx -= 1;
        if (keyboard["ArrowDown"]) this.y += 1;
        if (keyboard["ArrowUp"]) this.y -= 1;
        if (keyboard[" "]) {
            scene.add(this.createSprite());
        }
        this.x += this.dx;
    }

    draw({ images }) {
        images.draw({ image: "background", x: 160, y: 284 })
        images.draw({ image: "green", x: this.x, y: this.y, rotate: this.dx * 0.1 });
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
        titleGreen: { source: TitleGreen, scale: 0.5 }
    },
    start: testScreen
});
