import { images } from "./images";
import { scene } from "./scene";
import { Sprite, Label } from "./sprite";

export { Sprite, Label };

export const context = {
    // graphics
    // width
    // height
    // counter
    counter: 0,
    counterSinceEnter: 0,
    images,
    scene,
    keyboard: {},
    show: (screen, after = 0) => {
        if ((context.nextScreenAt == null) || (context.nextScreenAt >= context.counter + after)) {
            context.nextScreen = screen;
            context.nextScreenAt = context.counter + after;
        }
    }
};

window.onload = () => {
    const canvasElement = document.getElementById("canvas");

    context.graphics = canvasElement.getContext("2d");
    context.width = canvasElement.scrollWidth;
    context.height = canvasElement.scrollHeight;

    setInterval(() => {
        if (!context.images.checkLoadComplete()) {
            context.graphics.strokeText("loading ...", 20, 20);
            return;
        }

        while (context.nextScreen && (context.counter >= context.nextScreenAt)) {
            if (context.screen && context.screen.exit) {
                context.screen.exit(context);
            }

            context.screen = context.nextScreen;
            context.nextScreen = null;
            context.nextScreenAt = null;
            context.counterSinceEnter = 0;

            if (context.screen && context.screen.enter) {
                context.screen.enter(context);
            }
        }

        if (context.game && context.game.move) {
            context.game.move(context);
        }

        if (context.screen && context.screen.move) {
            context.screen.move(context);
        }

        context.scene.move(context);

        context.graphics.clearRect(0, 0, context.width, context.height);

        if (context.game && context.game.draw) {
            context.game.draw(context);
        }

        if (context.screen && context.screen.draw) {
            context.screen.draw(context);
        }

        context.scene.draw(context);

        context.counter += 1;
        context.counterSinceEnter += 1;
    }, 20);
};

document.addEventListener("keydown", e => (context.keyboard[e.key] = context.keyboard[e.key] === undefined ? context.counter : context.keyboard[e.key]));
document.addEventListener("keyup", e => delete context.keyboard[e.key]);

export const init = ({ graphics, scene, start, game }) => {
    context.images.init(graphics);
    if (scene) {
        for (let name of Object.keys(scene)) {
            context.scene.add(name, scene[name]);
        }
    }
    context.show(start);
    context.game = game;
};
