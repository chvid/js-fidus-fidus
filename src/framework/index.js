import { images } from "./images";
import { scene } from "./scene";
import { Sprite, Label } from "./sprite";

export { Sprite, Label };

export const context = {
    // graphics
    // width
    // height
    // counter
    images,
    scene,
    keyboard: {},
    show: screen => (context.nextScreen = screen)
};

window.onload = () => {
    const canvasElement = document.getElementById("canvas");

    context.graphics = canvasElement.getContext("2d");
    context.width = canvasElement.scrollWidth;
    context.height = canvasElement.scrollHeight;
    context.counter = 0;

    setInterval(() => {
        if (!context.images.checkLoadComplete()) {
            context.graphics.strokeText("loading ...", 20, 20);
            return;
        }

        if (context.nextScreen) {
            if (context.screen && context.screen.exit) {
                context.screen.exit(context);
            }

            context.screen = context.nextScreen;
            context.nextScreen = null;

            if (context.screen && context.screen.enter) {
                context.screen.enter(context);
            }
        }

        if (context.screen && context.screen.move) {
            context.screen.move(context);
        }

        context.scene.move(context);

        context.graphics.clearRect(0, 0, context.width, context.height);

        if (context.screen && context.screen.draw) {
            context.screen.draw(context);
        }

        context.scene.draw(context);

        context.counter += 1;
    }, 20);
};

document.addEventListener("keydown", e => (context.keyboard[e.key] = true));
document.addEventListener("keyup", e => delete context.keyboard[e.key]);

export const init = ({ graphics, start, scene }) => {
    context.images.init(graphics);
    if (scene) {
        for (let name of Object.keys(scene)) {
            context.scene.add(name, scene[name]);
        }
    }
    context.show(start);
};
