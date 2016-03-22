/* @flow */

import createRootNode from 'regexp-input/createRootNode'
import rootTraverse from 'regexp-input/visitors/rootTraverse'

import type {RegType} from 'regexp-input/i/parserInterfaces'
import type {ValueState} from 'regexp-input/visitors/rootTraverse'

export default function createRegExpFormatter(
    mask: string
): (current: string, input: string) => string {
    if (!mask) {
        throw new Error('RegExp mask is empty')
    }
    const node: RegType = createRootNode(mask);
    if (node.type !== 'alternative') {
        throw new Error(`RegExp must by traversable, ${node.type} given`)
    }

    return function stateChange(current: string, input: string): string {
        const acc: ValueState = {
            stop: false,
            current,
            input,
            output: ''
        };
        rootTraverse(node, acc)

        return acc.output
    }
}
