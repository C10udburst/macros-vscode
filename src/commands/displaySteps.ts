import { MacroContext, Step, StepType } from "../types";
import * as vscode from "vscode";

export function displayStepsCommand(context: MacroContext) {
    if (context.output === undefined) {
        context.output = vscode.window.createOutputChannel("Macro");
    }
    context.output.clear();
    context.output.show();
    for (const step of context.macro?.steps ?? []) {
        context.output.appendLine(formatStep(step));
    }
    if (context.macro?.cursor.selection !== undefined) {
        context.output.appendLine(`Cursor selection: ${formatLoc(context.macro.cursor.selection.anchor)} to ${formatLoc(context.macro.cursor.selection.active)}.`);
    }
}

function formatStep(step: Step) {
    if (step.type === StepType.insert) {
        return `Insert ${JSON.stringify(step.text)} at ${formatLoc(step.location?.start)}.`;
    } else if (step.type === StepType.edit) {
        if (step.text === "") {
            return `Delete from ${formatLoc(step.location?.start)} to ${formatLoc(step.location?.end)}.`;
        } else {
            return `Replace from ${formatLoc(step.location?.start)} to ${formatLoc(step.location?.end)} with ${JSON.stringify(step.text)}.`;
        }
    } else if (step.type === StepType.command) {
        return `Execute ${JSON.stringify(step.text)}.`;
    }
    return `Action: ${step}.`;
}

function formatLoc(loc?: number[]) {
    if (loc === undefined) { return "?"; }
    return `ln ${loc[0]}, col ${loc[1]}`;
}
