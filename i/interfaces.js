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
