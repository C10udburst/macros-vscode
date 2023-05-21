import { Disposable, OutputChannel, Position, StatusBarItem, TextEditor, TextEditorEdit } from "vscode";

export enum StepType {
    edit = 1,
    insert = 2
}

export type PosDelta = number[];

export type Macro = {
    steps: Step[],
    cursor: {
        origin: Position,
        selection?: {
            anchor: PosDelta,
            active: PosDelta
        }
    }
};

export type Step = {
    text: string;
    type: StepType;
    location: {
        start: PosDelta;
        end: PosDelta;
    };
};

export type MacroContext = {
    macro?: Macro,
    recording: Boolean,
    listeners: Disposable[],
    textEditor?: TextEditor,
    textEditorEdit?: TextEditorEdit,
    statusBar?: StatusBarItem,
    output?: OutputChannel
};