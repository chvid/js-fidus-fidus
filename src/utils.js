export const equals = (a, b) => [...Object.keys(a), ...Object.keys(b)].every(k => a[k] == b[k]);

export const range = (from, to) => {
    let result = [];
    for (let i = from; i < to; i++) {
        result.push(i);
    }
    return result;
};

export const average = list => list.reduce((a, b) => a + b, 0) / list.length;
