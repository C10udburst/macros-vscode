import { Step } from "./types";

export function fixStep(step: Step) {
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
