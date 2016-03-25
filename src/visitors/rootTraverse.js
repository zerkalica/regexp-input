/* @flow */
/* eslint-disable no-param-reassign */

import type {
    Anchor,
    Value,
    Disjunction,
    Dot,
    Reference,
    Group,
    Alternative,
    Quantifier,
    CharacterClass,
    CharacterClassEscape,
    CharacterClassRange,
    Traversable,
    RegType
} from 'regexp-input/i/parserInterfaces'

export type ValueState = {
    stop: boolean;
    current: string;
    input: string;
    output: string;
} // flow generates error

type RootTraverser = (node: RegType, acc: ValueState) => void;

function getMatches(node: RegType, acc: ValueState): {
    normalMatch: ?Array<string>,
    strictMatch: ?Array<string>
} {
    let normalMatch: ?Array<string> = null;
    let strictMatch: ?Array<string> = null;
    if (acc.current) {
        const sum: string = acc.current + acc.input;
        strictMatch = sum.match(node.strictMask)
        if (!strictMatch) {
            normalMatch = acc.current.match(node.mask);
        }
    }

    return {
        normalMatch,
        strictMatch
    }
}

function baseReduce(node: RegType, acc: ValueState): boolean {
    const {strictMatch, normalMatch} = getMatches(node, acc)
    if (strictMatch) {
        // console.log(`strict matched ${node.raw} with ${strictMatch[0]}`)
        acc.output += acc.input
        acc.stop = true
    } else if (normalMatch) {
        // console.log(`matched ${node.raw} with ${normalMatch[0]}`)
        acc.current = acc.current.substring(normalMatch[0].length)
    } else {
        return true
    }

    return false
}

function valueReduce(node: RegType, acc: ValueState): void {
    const {normalMatch} = getMatches(node, acc)
    const inputMatch = acc.input.match(node.mask)
    // console.log(`inputMatch: ${inputMatch ? inputMatch[0] : null}`)
    if (inputMatch && !normalMatch) {
        acc.output += inputMatch[0]
    }
    acc.stop = true
}

function processChilds(
    traverse: (node: RegType, acc: ValueState) => void,
    node: Traversable,
    acc: ValueState
): void {
    const {body} = node
    for (let i = 0, l = body.length; i < l; i++) {
        traverse(body[i], acc)
        if (acc.stop) {
            break
        }
    }
}

export default function rootTraverse(node: RegType, acc: ValueState): void {
    switch (node.type) {
        case 'value':
            if (!baseReduce(node, acc)) {
                acc.output += node.raw
            }
            break
        case 'alternative':
            processChilds(rootTraverse, node, acc)
            break
        case 'disjunction':
        case 'group':
        case 'quantifier':
            if (!baseReduce(node, acc)) {
                processChilds(rootTraverse, node, acc)
            }
            break

        case 'characterClass':
        case 'dot':
        case 'characterClassEscape':
        case 'anchor':
            if (!acc.stop && !acc.current) {
                valueReduce(node, acc)
            }
            break
        default:
            break
    }

    return

    // console.log(`begin ${node.type}, ${node.raw}, acc: ${JSON.stringify(acc, 0, '  ')}`)
    const {strictMatch, normalMatch} = getMatches(node, acc)

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
