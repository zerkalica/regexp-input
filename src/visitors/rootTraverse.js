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

    const currentMatch = (acc.current && node.mask) ? acc.current.match(node.mask) : null
    if (currentMatch) {
        // console.log(`matched ${node.raw} with ${currentMatch[0]}`)
        acc.current = acc.current.substring(currentMatch[0].length)
        if (node.type === 'value') {
            return
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

    if (!acc.current && !node.body) {
        if (node.type === 'value') {
            acc.output += node.raw
        } else if (node.mask) {
            const inputMatch = acc.input.match(node.mask)
            if (inputMatch) {
                acc.output += inputMatch[0]
                acc.stop = true
            } else {
                acc.stop = true
            }
        }
        return
    }

    // console.log(`end ${node.type}, ${node.raw}, acc: ${JSON.stringify(acc, 0, '  ')}`)
}
