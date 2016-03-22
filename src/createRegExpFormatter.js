/* @flow */

import createRootNode from 'regexp-input/createRootNode'
import rootTraverse from 'regexp-input/visitors/rootTraverse'
import type {Formatter} from 'regexp-input/i/interfaces'
import type {RegType} from 'regexp-input/i/parserInterfaces'
import type {ValueState} from 'regexp-input/visitors/rootTraverse'

export default function createRegExpFormatter(
    mask: string
): Formatter {
    if (!mask) {
        throw new Error('RegExp mask is empty')
    }
    const node: RegType = createRootNode(mask);
    if (node.type !== 'alternative') {
        throw new Error(`RegExp must by traversable, ${node.type} given`)
    }

    return function formatter(current: string, input: string): string {
        let result: string = current;
        let output: string = '';
        for (let i = 0, l = input.length; i < l; i++) {
            const acc: ValueState = {
                stop: false,
                current: result,
                input: input[i],
                output: ''
            };
            rootTraverse(node, acc)
            result += acc.output
            output += acc.output
        }

        return output
    }
}
