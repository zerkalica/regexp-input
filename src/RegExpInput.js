/* @flow */
import createFormatter from 'regexp-input/createFormatter'
import type {
    Format,
    MaskCharsBuilderMap
} from 'regexp-input/i/interfaces'

type RegExpInputProps = {
    pattern: string;
    map?: MaskCharsBuilderMap;
    value?: string;
    pos?: number;
}

export default class RegExpInput {
    _formatStr: Format;
    _value: string;
    _pos: number;

    constructor(rec: RegExpInputProps) {
        this._formatStr = createFormatter(rec.pattern, rec.map)
        this._value = rec.value || ''
        this._pos = rec.pos || 0
    }
}
