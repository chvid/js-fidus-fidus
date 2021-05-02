import { Sprite } from "./sprite";
import * as Script from "./script";

test("scripting", () => {
    const sprite = new Sprite({
        x: 42,
        script: Script.sequence(Script.wait(50), Script.animate("x", 0, 100, 50))
    });

    sprite.move({ counter: 0 });

    expect(sprite.x).toStrictEqual(42);

    sprite.move({ counter: 50 });

    expect(sprite.x).toStrictEqual(0);

    sprite.move({ counter: 100 });

    expect(sprite.x).toStrictEqual(100);
});


test("callbacks", () => {
    const count = { a: 0, b: 0 }
    const a = () => count.a++;
    const b = () => count.b++;
    const sprite = new Sprite({
        script: Script.sequence(
            Script.wait(50), 
            Script.call(() => a()), 
            Script.animate("scale", 1, 1.8, 50),
            Script.call(() => a()), Script.call(() => b())
        )
    });

    sprite.move({ counter: 0 });

    expect(count).toStrictEqual({ a: 0, b: 0 });

    sprite.move({ counter: 50 });

    expect(count).toStrictEqual({ a: 1, b: 0 });

    sprite.move({ counter: 51 });

    expect(count).toStrictEqual({ a: 1, b: 0 });

    sprite.move({ counter: 100 });

    expect(count).toStrictEqual({ a: 2, b: 1 });

    sprite.move({ counter: 101 });

    expect(count).toStrictEqual({ a: 2, b: 1 });
});
