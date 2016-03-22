/* @flow */

import regjsparser from 'regjsparser'

import type {RegType} from 'regexp-input/i/parserInterfaces'


/* eslint-disable no-param-reassign */
function normalize(item: RegType, acc: Object, parent?: RegType): void {
    if (parent) {
        item.parent = parent
    }
    switch (item.type) {
        case 'disjunction':
        case 'alternative':
        case 'quantifier':
        case 'group':
        case 'characterClass': {
            item.mask = new RegExp(item.raw)
            const body = item.body
            for (let i = 0, l = body.length; i < l; i++) {
                normalize(body[i], acc, item)
            }
        }
            break
        case 'characterClassEscape':
        case 'characterClassRange':
            item.mask = new RegExp(item.raw)
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
