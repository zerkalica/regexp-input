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
    // console.log(`begin ${node.type}, ${node.raw}, acc: ${JSON.stringify(acc, 0, '  ')}`)
    let currentMatch: ?Array<string> = null;
    let isStrict: boolean = true;
    if (acc.current) {
        const sum: string = acc.current + acc.input;
        currentMatch = sum.match(node.strictMask)
        if (!currentMatch) {
            isStrict = false
            currentMatch = acc.current.match(node.mask);
        }
    }

    if (currentMatch) {
        // console.log(`matched ${node.raw} with ${currentMatch[0]}`)
        acc.current = acc.current.substring(currentMatch[0].length)
        if (isStrict) {
            acc.output += acc.input
            acc.stop = true
        }
    } else if (node.body) {
        const body = node.body
        for (let i = 0, l = body.length; i < l; i++) {
            rootTraverse(body[i], acc)
            if (acc.stop) {
                break
            }
        }
    }

    if (acc.stop || acc.current) {
        return
    }

    switch (node.type) {
        case 'value':
            if (!currentMatch) {
                acc.output += node.raw
            }
            break
        case 'characterClassRange':
        case 'dot':
        case 'characterClassEscape':
        case 'anchor': {
            const inputMatch = acc.input.match(node.mask)
            if (inputMatch) {
                acc.output += inputMatch[0]
            }
            acc.stop = true
            break
        }

        default:
            break
    }

    // console.log(`end ${node.type}, ${node.raw}, acc: ${JSON.stringify(acc, 0, '  ')}`)
}
