/* @flow */

export type MaskCharConfig = [
    // regexp string
    string,
    'regexp' | 'separator'
];

export type MaskCharsBuilderMap = {
    [value: string]: MaskCharConfig;
}


export type FormatterResult = {
    newValue: string;
    cursorPos: number;
}


export type Format = (oldValue: string, addValue: string, oldCursorPos: number) => FormatterResult;
