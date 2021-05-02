import * as Script from "./script";

const script = Script.sequence(Script.wait(50), Script.animate("x", 0, 1, 50));

test("duration", () => {
    expect(Script.computeDuration(script)).toStrictEqual(100);
});

test("computation", () => {
    expect(Script.computeState({}, script, 0)).toStrictEqual({});
    expect(Script.computeState({}, script, 50)).toStrictEqual({ x: { set: 0 } });
    expect(Script.computeState({}, script, 100)).toStrictEqual({ x: { set: 1 } });
});

test("callbacks", () => {
    const count = { a: 0, b: 0 };

    const a = () => count.a++;
    const b = () => count.b++;

    const script = Script.sequence(Script.call(() => a()), Script.wait(50), Script.call(() => b()));

    expect(count).toStrictEqual({ a: 0, b: 0 });

    Script.computeState({}, script, 0);

    expect(count).toStrictEqual({ a: 1, b: 0 });

    Script.computeState({}, script, 49);

    expect(count).toStrictEqual({ a: 1, b: 0 });

    Script.computeState({}, script, 50);

    expect(count).toStrictEqual({ a: 1, b: 1 });

    Script.computeState({}, script, 51);

    expect(count).toStrictEqual({ a: 1, b: 1 });
});
