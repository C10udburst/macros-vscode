import { MacroContext, StepType } from "../types";
import * as vscode from "vscode";

export function executeCommandCommand(context: MacroContext) {
    if (context.macro === undefined || !context.recording) { return; }
    vscode.commands.getCommands(true).then((commands) => {
        let filteredCommands = commands.filter((command) => {
            if (command === "noop") { return false; }
            if (command.startsWith("macros.")) { return false; }
            return true;
        });
        vscode.window.showQuickPick(filteredCommands).then((command) => {
            if (command === undefined) { return; }
            context.macro?.steps.push({
                text: command,
                type: StepType.command
            });
            vscode.commands.executeCommand(command);
        });
    });
}