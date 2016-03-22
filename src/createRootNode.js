/* @flow */

import regjsparser from 'regjsparser'

import type {RegType} from 'regexp-input/i/parserInterfaces'

/* eslint-disable no-param-reassign */
function normalize(item: RegType, acc: Object): void {
    if (item.type === 'reference') {
        throw new Error(`Can't support reference type: ${item.raw}`)
    }
    item.mask = new RegExp(item.raw)
    switch (item.type) {
        case 'disjunction':
        case 'alternative':
        case 'quantifier':
        case 'group':
        case 'characterClass': {
            const body = item.body
            for (let i = 0, l = body.length; i < l; i++) {
                normalize(body[i], acc)
            }
        }
            break
        default:
            break
    }
}

export default function createRootNode(mask: string): RegType {
    const item: RegType = regjsparser.parse(mask);
    normalize(item, {})

    return item
}
