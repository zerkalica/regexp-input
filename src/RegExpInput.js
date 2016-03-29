/* @flow */
import Traverser from 'regexp-input/Traverser'
import createRootNode from 'regexp-input/createRootNode'
import type {
    MaskedInput // eslint-disable-line
} from 'regexp-input/i/interfaces'

import type {
    RegType
} from 'regexp-input/i/parserInterfaces'

// implements MaskedInput
export default class RegExpInput {
    _node: RegType;

    value: string;
    cursor: number;

    constructor(
        mask: string,
        value: string = '',
        cursor: number = 0
    ) {
        if (!mask) {
            throw new Error('RegExp mask is empty')
        }
        this._node = createRootNode(mask);
        if (this._node.type !== 'alternative') {
            throw new Error(`RegExp must by traversable, ${this._node.type} given`)
        }
        this.value = value
        this.cursor = cursor
    }

    _format(current: string, input: string): string {
        const traverser = new Traverser(current, input)

        console.log((new Traverser('', '1')).traverse(this._node))
        console.log((new Traverser('1', '2')).traverse(this._node))
        console.log((new Traverser('12', '3')).traverse(this._node))

        return traverser.traverse(this._node)
    }

    delete(count: number = 1): boolean {
        const prevCursor = this.cursor
        const current = this.value

        let value: string = '';
        for (let i = 0; i < prevCursor; i++) {
            value += this._format(value, current[i]);
        }
        for (let i = prevCursor + count; i < current.length; i++) {
            value += this._format(value, current[i]);
        }
        const isChanged: boolean = this.value !== value;
        this.value = value

        return isChanged
    }

    bs(count: number = 1): boolean {
        const prevCursor = this.cursor
        const current = this.value
        let value: string = '';
        let cursor: number = 0;
        for (let i = 0, l = Math.max(0, prevCursor - count); i < l; i++) {
            const addStr: string = this._format(value, current[i]);
            value += addStr;
            cursor = cursor + addStr.length
        }

        for (let i = prevCursor; i < current.length; i++) {
            value += this._format(value, current[i]);
        }

        const isChanged: boolean = this.value !== value;
        this.value = value
        this.cursor = Math.min(cursor, value.length)

        return isChanged
    }

    paste(input: string, isInsert: boolean = false): ?string {
        const prevCursor = this.cursor
        const current = this.value
        let cursorDelta: number = 0;
        let value: string = '';
        if (current.length < prevCursor) {
            throw new Error(`current string '${current}' length (${current.length}) < prevCursor (${prevCursor})`)
        }
        for (let i = 0; i < prevCursor; i++) {
            const addStr: string = this._format(value, current[i]);
            value += addStr
            if (value.length > prevCursor) {
                cursorDelta = cursorDelta + addStr.length
            }
        }

        let pasteValue: string = '';
        for (let i = 0; i < input.length; i++) {
            const addStr: string = this._format(value, input[i]);
            value += addStr
            pasteValue += addStr
            cursorDelta = cursorDelta + addStr.length
        }

        const cursor: number = prevCursor + cursorDelta;
        for (let i = isInsert ? prevCursor : cursor; i < current.length; i++) {
            value += this._format(value, current[i])
        }

        const isChanged: boolean = this.value !== value;
        this.value = value
        this.cursor = Math.min(cursor, value.length)

        return isChanged ? pasteValue : null
    }
}
