import { Range } from "vscode";
import { MacroContext, StepType } from "../types";
import * as vscode from "vscode";

export function play(context: MacroContext) {
    if (context.textEditorEdit === undefined || context.textEditor === undefined) {
        return;
    }
    const offset = context.textEditor.selection.active;
    if (offset === undefined) { return; }
    for (const step of context.macro?.steps || []) {
        if (step.type === StepType.edit) {
            context.textEditorEdit.replace(
                new Range(
                    offset.translate(...step.location.start),
                    offset.translate(...step.location.end)
                ),
                step.text
            );
        } else if (step.type === StepType.insert) {
            context.textEditorEdit.insert(
                offset.translate(...step.location.start),
                step.text
            );
        }
    }
    if (context.macro?.cursor.selection !== undefined) {
        context.textEditor.selection = new vscode.Selection(
            context.textEditor.selection.anchor.translate(...context.macro.cursor.selection.anchor),
            context.textEditor.selection.active.translate(...context.macro.cursor.selection.active)
        );
    }
}