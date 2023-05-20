import * as vscode from "vscode";
import { Position, Range } from "vscode";
import { Disposable } from "vscode";

type PosDelta = number[];

type Macro = {
    steps: Step[],
    cursor: {
        origin: Position,
        selection?: {
            anchor: PosDelta,
            active: PosDelta
        }
    }
};

type Step = {
    text: string;
    type: "edit" | "insert";
    location: {
        start: PosDelta;
        end: PosDelta;
    };
};

export function activate(context: vscode.ExtensionContext) {
    let macro: Macro | undefined = undefined;
    let listener: Disposable | undefined = undefined;

    function playMacro() {
        vscode.window.activeTextEditor?.edit((builder) => {
            const offset = vscode.window.activeTextEditor?.selection.active;
            if (offset === undefined) { return; }
            for (const step of macro?.steps || []) {
                if (step.type === "edit") {
                    builder.replace(
                        new Range(
                            offset.translate(...step.location.start),
                            offset.translate(...step.location.end)
                        ),
                        step.text
                    );
                } else if (step.type === "insert") {
                    builder.insert(
                        offset.translate(...step.location.start),
                        step.text
                    );
                }
            }
            if (vscode.window.activeTextEditor !== undefined && macro?.cursor.selection !== undefined) {
                vscode.window.activeTextEditor.selection = new vscode.Selection(
                    vscode.window.activeTextEditor.selection.anchor.translate(...macro.cursor.selection.anchor),
                    vscode.window.activeTextEditor.selection.active.translate(...macro.cursor.selection.active)
                );
            }
        });
    }

    function stopMacro() {
        if (macro !== undefined) {
            const cursor = vscode.window.activeTextEditor?.selection;
            if (cursor !== undefined) {
                macro.cursor.selection = {
                    active: [
                        cursor.active.line - macro.cursor.origin.line,
                        cursor.active.character - macro.cursor.origin.character
                    ],
                    anchor: [
                        cursor.active.line - macro.cursor.origin.line,
                        cursor.active.character - macro.cursor.origin.character
                    ]
                };
            }

            const steps = macro.steps.length + ((macro.cursor.selection !== undefined) ? 1 : 0);

            vscode.window.showInformationMessage(
                `Recorded ${macro.steps?.length} step${
                    steps !== 1 ? "s" : ""
                }`
            );
            console.log(macro);
        }
    }

    function startMacro() {
        const origin = vscode.window.activeTextEditor?.selection?.active;
        if (!origin) { return; }
        macro = {
            cursor: { origin },
            steps: []
        };
        listener = vscode.workspace.onDidChangeTextDocument((e) => {
            if (!origin) { return; }
            for (const step of e.contentChanges) {
                macro?.steps.push({
                    text: step.text,
                    type: step.rangeLength > 0 ? "edit" : "insert",
                    location: {
                        start: [
                            step.range.start.line - origin.line,
                            step.range.start.character - origin.character,
                        ],
                        end: [
                            step.range.end.line - origin.line,
                            step.range.end.character - origin.character,
                        ],
                    },
                });
            }
        });
        vscode.window.showInformationMessage("Started recording a macro.");
    }

    context.subscriptions.push(
        vscode.commands.registerCommand("macros.record", () => {
            if (listener) {
                listener.dispose();
                listener = undefined;
                stopMacro();
            } else {
                startMacro();
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand("macros.replay", () => {
            if (listener !== undefined) {
                vscode.commands.executeCommand("macros.record");
            }
            playMacro();
        })
    );
}

export function deactivate() {}
