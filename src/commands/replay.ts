import { TextEditor, TextEditorEdit } from "vscode";
import { MacroContext } from "../types";
import * as vscode from "vscode";
import { play } from "../actions/play";

export function replayCommand(context: MacroContext, textEditor: TextEditor, edit: TextEditorEdit) {
    if (context.recording === true) {
        vscode.commands.executeCommand("macros.record");
    }
    context.textEditor = textEditor;
    context.textEditorEdit = edit;
    play(context);
    context.textEditor = undefined;
    context.textEditorEdit = undefined;
}