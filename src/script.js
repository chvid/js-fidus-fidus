export const group = (...items) => ({ type: "group", items });
export const sequence = (...items) => ({ type: "sequence", items });
export const set = (property, value) => ({ type: "set", property, value });
export const animate = (property, from, to, duration, loop = 1) => ({ type: "animate", property, from, to, duration, loop });
export const wait = (duration) => ({ type: "wait", duration });
export const call = (value) => ({ type: "call", value });

export const computeDuration = (script) => {
    switch (script.type) {
        case "sequence": {
            let result = 0;
            for (let i of script.items) {
                result += computeDuration(i);
            }
            return result;
        }
        case "group": {
            let result = 0;
            for (let i of script.items) {
                result = Math.max(result, computeDuration(i));
            }
            return result;
        }
        case "animate":
            return script.duration * script.loop;
        case "wait":
            return script.duration;
        default:
            return 0;
    }
}

export const computeState = (context, script, time) => {
    switch (script.type) {
        case "sequence": {
            let result = {};
            let pointer = 0;
            for (let i of script.items) {
                let start = pointer;
                pointer += computeDuration(i);
                if (start <= time) {
                    result = { ...result, ...computeState(context, i, time - start) };
                }
            }
            return result;
        }
        case "group": {
            let result = {};
            for (let i of script.items) {
                result = { ...result, ...computeState(context, i, time) };
            }
            return result;
        }
        case "set": {
            let result = {};
            result[script.property] = script.value;
            return result;
        }
        case "animate": {
            let result = {};
            let delta = time / script.duration;

            if (script.loop && delta < script.loop) {
                delta = delta - Math.floor(delta);
            } else {
                delta = Math.min(1, delta);
            }

            result[script.property] = script.to * delta + script.from * (1 - delta);
            return result;
        }
        case "call":
            if (time == 0) script.value(context);
            return {};
        case "wait":
            return {};
    }
}

