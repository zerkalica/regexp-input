/* @flow */

/* eslint-disable no-param-reassign */

import type {
    RegType
} from 'regexp-input/i/parserInterfaces'

export type ValueState = {
    stop: boolean;
    current: string;
    input: string;
    output: string;
}

// mask: \d{2,3}--\d{2}-\d
// {current: '', input: '1', output: '1'}
// {current: '1', input: '1', output: '1'}
// {current: '11', input: '1', output: '--1'}
// {current: '11--1', input: '1', output: '1'}
// {current: '11-', input: '1', output: '-1'}

export default function rootTraverse(node: RegType, acc: ValueState): void {
    if (!acc.current && !node.body) {
        if (node.type === 'value') {
            acc.output += node.raw
        } else if (node.mask) {
            const match = acc.input.match(node.mask)
            if (match) {
                acc.output += match[0]
            } else {
                acc.stop = true
            }
        }
        return
    }

    const match = (acc.current && node.mask) ? acc.current.match(node.mask) : null
    if (match) {
        acc.current = acc.current.substring(match[0].length)
    } else if (node.body) {
        const body = node.body
        for (let i = 0, l = body.length; i < l; i++) {
            rootTraverse(body[i], acc)
            if (acc.stop) {
                break
            }
        }
    }
}
