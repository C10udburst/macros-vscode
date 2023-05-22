import * as vscode from "vscode";

import { MacroContext } from "./types";
import { recordCommand } from "./commands/record";
import { replayCommand } from "./commands/replay";
import { displayStepsCommand } from "./commands/displaySteps";
import { executeCommandCommand } from "./commands/executeCommand";

export function activate(context: vscode.ExtensionContext) {
    let macroContext: MacroContext = { listeners: [], recording: false };

    context.subscriptions.push(
        vscode.commands.registerTextEditorCommand("macros.record", (editor, editorEdit) => recordCommand(macroContext, editor, editorEdit))
    );

    context.subscriptions.push(
        vscode.commands.registerTextEditorCommand("macros.replay", (editor, editorEdit) => replayCommand(macroContext, editor, editorEdit))
    );

    context.subscriptions.push(
        vscode.commands.registerCommand("macros.executeCommand", () => executeCommandCommand(macroContext))
    );

    context.subscriptions.push(
        vscode.commands.registerCommand("macros.displaySteps", () => displayStepsCommand(macroContext))
    );
}

export function deactivate() {}
