import { MacroContext } from "../types";
import * as vscode from "vscode";
import { stopListeners } from "./stopListeners";

export function stopMacro(context: MacroContext) {
    if (context.macro !== undefined) {
        const cursor = context.textEditor?.selection;
        if (cursor !== undefined) {
            context.macro.cursor.selection = {
                active: [
                    cursor.active.line - context.macro.cursor.origin.line,
                    cursor.active.character - context.macro.cursor.origin.character
                ],
                anchor: [
                    cursor.active.line - context.macro.cursor.origin.line,
                    cursor.active.character - context.macro.cursor.origin.character
                ]
            };
        }

        const steps = context.macro.steps.length + ((context.macro.cursor.selection !== undefined) ? 1 : 0);

        vscode.window.showInformationMessage(
            `Recorded ${steps} step${
                steps !== 1 ? "s" : ""
            }`
        );

        vscode.commands.executeCommand("setContext", "macros:recorded_macro", true);
        vscode.commands.executeCommand("setContext", "macros:recording_macro", false);
    }
    stopListeners(context);
    context.statusBar?.dispose();
    context.recording = false;
}