/* @flow */

export type MaskedEvent = {
    preventDefault(): void;
    getClipboardData(): string;
    getCursor(): number;
    setValue(val: string, cursor?: number): void;
}

export type CreateEvent = (e: Event) => MaskedEvent;

export type MaskedInput = {
    value: string;
    cursor: number;

    delete(count?: number): boolean;
    bs(count?: number): boolean;
    paste(input: string, isInsert?: boolean): ?string;
}

export type EventFilter = {
    onPaste: (e: Event) => void;
    onChange: (e: Event) => void;
    onKeypress: (e: KeyboardEvent) => void;
    onKeyDown: (e: KeyboardEvent) => void;
}

export type EventFilterProps = {
    onChange: (val: string) => void;
    pattern: string;
    value: string;
}

export type CreateEventFilter = (options: EventFilterProps) => EventFilter;
