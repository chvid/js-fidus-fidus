export const group = (...items) => ({ type: "group", items });
export const sequence = (...items) => ({ type: "sequence", items });
export const set = (property, value) => ({ type: "set", property, value });
export const animate = (property, from, to, duration, loop = 1) => ({ type: "animate", property, from, to, duration, loop });
export const wait = duration => ({ type: "wait", duration });
export const call = value => ({ type: "call", value });
export const animateBy = (property, delta, duration, loop = 1, shape = "linear") => ({ type: "animateBy", property, delta, duration, loop, shape });
export const loop = (count, item) => ({ type: "loop", count, item });

const sigmoidFactor = 10;
const sigmoid = x => (1 / (1 + Math.exp(sigmoidFactor * (x - 0.5))) - 1 / (1 + Math.exp(sigmoidFactor * -0.5))) / (1 - 2 * (1 / (1 + Math.exp(sigmoidFactor * -0.5))));

export const computeDuration = script => {
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
        case "animateBy":
            return script.duration * script.loop;
        case "loop":
            return script.count < 0 ? Number.POSITIVE_INFINITY : computeDuration(script.item) * script.count;
        default:
            return 0;
    }
};

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
            result[script.property] = { ...result[script.property], set: script.value };
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

            if (script.shape == "linear") {
            } else if (script.shape == "sigmoid") {
                delta = sigmoid(delta);
            }

            result[script.property] = { ...result[script.property], set: script.to * delta + script.from * (1 - delta) };
            return result;
        }
        case "animateBy": {
            let result = {};
            let delta = time / script.duration;

            if (script.loop && delta < script.loop) {
                delta = delta - Math.floor(delta);
            } else {
                delta = Math.min(1, delta);
            }

            if (script.shape == "linear") {
            } else if (script.shape == "sigmoid") {
                delta = sigmoid(delta);
            }

            let current = result[script.property] ? (result[script.property].delta ? result[script.property].delta : 0) : 0;

            result[script.property] = { ...result[script.property], delta: current + script.delta * delta };
            return result;
        }
        case "call":
            if (Math.floor(time) == 0) script.value(context);
            return {};
        case "wait":
            return {};
        case "loop": {
            const duration = computeDuration(script.item);
            const fraction = time - Math.floor(time / duration) * duration;
            if (time >= duration && fraction == 0) {
                computeState(context, script.item, duration);
            } 
            return computeState(context, script.item, fraction);
        }
    }
};
