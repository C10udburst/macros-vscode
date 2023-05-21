import { TextEditor, TextEditorEdit } from "vscode";
import { MacroContext } from "../types";
import { stopMacro } from "../actions/stop";
import { record } from "../actions/record";

export function recordCommand(context: MacroContext, textEditor: TextEditor, edit: TextEditorEdit) {
    context.textEditor = textEditor;
    context.textEditorEdit = edit;
    if (context.recording) {
        stopMacro(context);
    } else {
        record(context);
    }
    context.textEditor = undefined;
    context.textEditorEdit = undefined;
}