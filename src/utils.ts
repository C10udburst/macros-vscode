import { Position } from "vscode";
import { PosDelta, Step } from "./types";

export function fixStep(step: Step) {
    if (step.location === undefined) { return step; }
    if (
        step.location.start[0] > step.location.end[0] ||
        step.location.start[1] > step.location.end[1]
    ) {
        const tmp = step.location.start;
        step.location.start = step.location.end;
        step.location.end = tmp;
    }
    return step;
}

export function translate(position: Position, delta: PosDelta) {
    return new Position(
        Math.max(0, position.line + delta[0]),
        Math.max(0, position.character + delta[1])
    );
}