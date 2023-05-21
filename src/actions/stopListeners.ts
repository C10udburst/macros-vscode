import { MacroContext } from "../types";

export function stopListeners(context: MacroContext) {
    for (const listener of context.listeners) {
        listener.dispose();
    }
    context.listeners = [];
}