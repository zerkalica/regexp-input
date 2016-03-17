/* @flow */

type RegExpInputProps = {
    pattern: string;
    map?: MaskCharsBuilderMap;
    value?: string;
    pos?: number;
}

export default class RegExpInput {
    _formatStr: (oldValue: string, addValue: string, oldCursorPos: number) => FormatterResult;
    _value: string;
    _pos: number;

    constructor(rec: RegExpInputProps) {
        this._formatStr = createFormatter(rec.pattern, rec.map)
        this._value = rec.value || ''
        this._pos = rec.pos || 0
    }

    setValue(value: string): void {
        this._value = value
    }

    setCursorPos(pos: number): void {
        this._pos = pos
    }

    _getValue(part: string): string {
        return this._value.substring(0, this._pos) + part + this._value.substring(this._pos)
    }

    isSeparator(char: string): boolean {

    }

    isMatched(part: string): boolean {
        return !!this._getValue(part).match(this._mask)
    }
}
