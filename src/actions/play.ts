import { Range } from "vscode";
import { MacroContext, StepType } from "../types";
import * as vscode from "vscode";
import { translate } from "../utils";

export async function play(context: MacroContext) {
    if (context.textEditorEdit === undefined || context.textEditor === undefined) {
        return;
    }
    let offset = context.textEditor.selection.active;
    if (offset === undefined) { return; }
    for (const step of context.macro?.steps || []) {
        offset = context.textEditor.selection.active || offset; // update offset
        if (step.type === StepType.edit && step.location !== undefined) {
            context.textEditorEdit.replace(
                new Range(
                    translate(offset, step.location.start),
                    translate(offset, step.location.end)
                ),
                step.text
            );
        } else if (step.type === StepType.insert && step.location !== undefined) {
            context.textEditorEdit.insert(
                translate(offset, step.location.start),
                step.text
            );
        } else if (step.type === StepType.command) {
            await vscode.commands.executeCommand(step.text);
        }
    }
    if (context.macro?.cursor.selection !== undefined) {
        context.textEditor.selection = new vscode.Selection(
            translate(context.textEditor.selection.anchor, context.macro.cursor.selection.anchor),
            translate(context.textEditor.selection.active, context.macro.cursor.selection.active)
        );
    }
}