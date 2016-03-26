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
type Match = {
    normalMatch: ?Array<string>,
    strictMatch: ?Array<string>
}

function getMatches(node: RegType, acc: ValueState): Match {
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

function baseReduce({strictMatch, normalMatch}: Match, acc: ValueState): boolean {
    if (strictMatch) {
        // console.log(`strict matched ${node.raw} with ${strictMatch[0]}`)
        acc.output += acc.input
        acc.stop = true
    } else if (normalMatch) {
        // console.log(`matched ${node.raw} with ${normalMatch[0]}`)
        acc.current = acc.current.substring(normalMatch[0].length)
    } else {
        return false
    }

    return true
}

function valueReduce(match: Match, node: RegType, acc: ValueState): void {
    if (!acc.stop && !acc.current) {
        const inputMatch = acc.input.match(node.mask)
        // console.log(`inputMatch: ${inputMatch ? inputMatch[0] : null}`)
        if (inputMatch && !match.normalMatch) {
            acc.output += inputMatch[0]
        }
        acc.stop = true
    }
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
    let match: Match;
    switch (node.type) {
        case 'value':
            match = getMatches(node, acc)
            if (!baseReduce(match, acc)) {
                acc.output += node.raw
            }
            break
        case 'alternative':
            processChilds(rootTraverse, node, acc)
            break
        case 'disjunction':
        case 'group':
        case 'quantifier':
            match = getMatches(node, acc)
            if (!baseReduce(match, acc)) {
                processChilds(rootTraverse, node, acc)
            }
            break

        case 'characterClass':
        case 'dot':
        case 'characterClassEscape':
        case 'anchor':
            match = getMatches(node, acc)
            baseReduce(match, acc)
            valueReduce(match, node, acc)
            break
        default:
            break
    }
    // console.log(`end ${node.type}, ${node.raw}, acc: ${JSON.stringify(acc, 0, '  ')}`)
}
