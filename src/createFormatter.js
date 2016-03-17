/* @flow */

import type {
    MaskCharConfig,
    MaskCharsBuilderMap,
    FormatterResult,
    Format
} from 'regexp-input/i/interfaces'

type MaskChar = {
    type: 'regexp';
    mask: RegExp;
} | {
    type: 'separator';
    mask: RegExp;
    value: string;
}

class Formatter {
    _maskChars: Array<MaskChar>;
    _isInsert: boolean;

    constructor(maskChars: Array<MaskChar>, isInsert: boolean = false) {
        this._maskChars = maskChars
        this._isInsert = isInsert
    }

    format(oldValue: string, addValue: string, oldCursorPos: number): FormatterResult {
        const {_maskChars: maskChars} = this
        let newValue: string = '';
        let cursorPos: number = Math.min(oldValue.length, oldCursorPos);

        let oldValuePos: number = 0;
        let addValuePos: number = 0;

        for (let i = 0, l = maskChars.length; i < l;) {
            const maskChar: MaskChar = maskChars[i];
            let isAddedValue: boolean;
            let char: ?string;

            if (oldValuePos < oldCursorPos || addValuePos >= addValue.length) {
                isAddedValue = false
                char = oldValue[oldValuePos]
            } else {
                isAddedValue = true
                char = addValue[addValuePos]
            }

            let isChanged: boolean = false;
            let matchedChar: ?string = null;
            switch (maskChar.type) {
                case 'regexp':
                    if (maskChar.mask.test(char)) {
                        matchedChar = char
                    }
                    isChanged = true
                    break

                case 'separator':
                    if (maskChar.mask.test(char)) {
                        isChanged = true
                        matchedChar = char
                    } else {
                        matchedChar = maskChar.value
                    }
                    break;

                default:
                    throw new Error(`Unknown mask char type: ${maskChar.type}`)
            }

            if (matchedChar) {
                if (isAddedValue) {
                    cursorPos++
                }
                newValue = newValue + matchedChar
                i++
            }

            if (isChanged) {
                if (isAddedValue) {
                    if (matchedChar) {
                        oldValuePos++
                    }
                    addValuePos++
                } else {
                    oldValuePos++
                }
                if (oldValuePos >= oldValue.length && addValuePos >= addValue.length) {
                    break
                }
            }
        }

        return {
            newValue,
            cursorPos: Math.min(cursorPos, newValue.length)
        }
    }
}

class MaskCharsBuilder {
    _builderMap: MaskCharsBuilderMap;

    constructor(builderMap: MaskCharsBuilderMap) {
        this._builderMap = builderMap
    }

    build(pattern: string): Array<MaskChar> {
        const {_builderMap: builderMap} = this
        const result: Array<MaskChar> = [];
        if (!pattern) {
            throw new Error('Pattern is empty')
        }
        for (let i = 0, l = pattern.length; i < l; i++) {
            const value: string = pattern.substring(i, i + 1);
            const config: ?MaskCharConfig = builderMap[value];
            if (!config) {
                throw new Error(`Not registered MaskChar for value ${value}`)
            }
            const [maskStr, type] = config
            let maskChar: MaskChar;
            const mask: RegExp = new RegExp('^' + maskStr + '$');
            switch (type) {
                case 'regexp':
                    maskChar = {type: 'regexp', mask}
                    break

                case 'separator':
                    maskChar = {type: 'separator', mask, value}
                    break

                default:
                    throw new Error(`Unknown MackChar type: ${type}`)
            }
            result.push(maskChar)
        }
        return result
    }
}

/* eslint-disable quote-props */
const defaultBuilderMap: MaskCharsBuilderMap = {
    '1': ['\\d', 'regexp'],
    '-': ['\\-|\\s', 'separator']
};
/* eslint-enable */

export default function createFormatter(
    pattern: string,
    map: MaskCharsBuilderMap = defaultBuilderMap
): Format {
    const maskCharsBuilder = new MaskCharsBuilder(map)
    const formatter = new Formatter(maskCharsBuilder.build(pattern))

    return function formatString(
        oldValue: string,
        addValue: string,
        oldCursorPos: number
    ): FormatterResult {
        return formatter.format(oldValue, addValue, oldCursorPos)
    }
}
