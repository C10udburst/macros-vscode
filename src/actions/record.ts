import { MacroContext, StepType } from "../types";
import * as vscode from "vscode";
import { stopMacro } from "./stop";
import { fixStep } from "../utils";

export function record(context: MacroContext) {
    if (context.textEditor === undefined) { return; }

    context.recording = true;

    const origin = context.textEditor.selection.active;
    context.macro = {
        cursor: { origin },
        steps: []
    };

    context.statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
    context.statusBar.command = "macros.record";
    context.statusBar.color = "var(--vscode-terminal-ansiRed)";
    context.statusBar.tooltip = "Click to stop recording.";
    context.statusBar.show();
    renderStatusBar(context);

    registerListeners(context);

    vscode.window.showInformationMessage(`Started recording a macro.`);
    vscode.commands.executeCommand("setContext", "macros:recording_macro", true);
}

function renderStatusBar(context: MacroContext) {
    if (context.statusBar === undefined) { return; }
    context.statusBar.text = `$(keybindings-record-keys) Recording a macro (${context.macro?.steps.length ?? 0} step${context.macro?.steps.length !== 1 ? 's' : ''}.)`;
}

function registerListeners(context: MacroContext) {
    context.listeners.push(vscode.workspace.onDidChangeTextDocument((e) => {
        for (const step of e.contentChanges) {
            context.macro?.steps.push(fixStep(
                {
                    text: step.text,
                    type: step.rangeLength > 0 ? StepType.edit : StepType.insert,
                    location: {
                        start: [
                            step.range.start.line - context.macro.cursor.origin.line,
                            step.range.start.character - context.macro.cursor.origin.character,
                        ],
                        end: [
                            step.range.end.line - context.macro.cursor.origin.line,
                            step.range.end.character - context.macro.cursor.origin.character,
                        ],
                    },
                }
            ));
        }
        renderStatusBar(context);
    }));

    context.listeners.push(vscode.window.onDidChangeActiveTextEditor((e) => {
        stopMacro(context);
    }));
}