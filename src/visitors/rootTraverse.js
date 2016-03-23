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
    let normalMatch: ?Array<string> = null;
    let strictMatch: ?Array<string> = null;
    if (acc.current && node.type !== 'alternative') {
        const sum: string = acc.current + acc.input;
        strictMatch = sum.match(node.strictMask)
        if (!strictMatch) {
            normalMatch = acc.current.match(node.mask);
        }
    }

    if (strictMatch) {
        // console.log(`strict matched ${node.raw} with ${strictMatch[0]}`)
        acc.output += acc.input
        acc.stop = true
    } else if (normalMatch) {
        // console.log(`matched ${node.raw} with ${normalMatch[0]}`)
        acc.current = acc.current.substring(normalMatch[0].length)
    } else {
        switch (node.type) {
            case 'value':
                acc.output += node.raw
                break
            case 'disjunction':
            case 'group':
            case 'alternative':
            case 'quantifier': {
                const body = node.body
                for (let i = 0, l = body.length; i < l; i++) {
                    rootTraverse(body[i], acc)
                    if (acc.stop) {
                        break
                    }
                }
                break
            }
            default:
                break
        }
    }

    if (!acc.stop && !acc.current) {
        switch (node.type) {
            case 'characterClass':
            case 'dot':
            case 'characterClassEscape':
            case 'anchor': {
                const inputMatch = acc.input.match(node.mask)
                // console.log(`inputMatch: ${inputMatch ? inputMatch[0] : null}`)
                if (inputMatch && !normalMatch) {
                    acc.output += inputMatch[0]
                }
                acc.stop = true
                break
            }

            default:
                break
        }
    }
    // console.log(`end ${node.type}, ${node.raw}, acc: ${JSON.stringify(acc, 0, '  ')}`)
}
