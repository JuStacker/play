export function round(value: number, roundLine = 1) {
    const roundUp = 10 ** roundLine;
    return Math.round(value * roundUp) / roundUp;
}