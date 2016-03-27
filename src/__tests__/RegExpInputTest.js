/* @flow */
/* eslint-env mocha */

import RegExpInput from 'regexp-input/RegExpInput'
import assert from 'power-assert'

function declareTests(
    regExp: string,
    allTests: Array<{
        method: string;
        value: string;
        cursor: number;
        input?: string;
        count?: number;
        isInsert?: boolean;
        newValue: string;
        newCursor: number
    }>
): void {
    describe(`regexp ${regExp}`, () => {
        const ri = new RegExpInput(regExp)
        allTests.forEach((test) => {
            it(`${test.method}${test.input
                ? ` '${test.input}'`
                : ''} in '${test.value}' at ${test.cursor} should produce '${test.newValue}' at ${test.newCursor}`,
            () => {
                ri.value = test.value
                ri.cursor = test.cursor
                switch (test.method) {
                    case 'paste':
                        if (!test.input) {
                            throw new Error('Not found test.input in paste')
                        }
                        ri.paste(test.input, !!test.isInsert)
                        break
                    case 'delete':
                        if (!test.count) {
                            throw new Error('No delete count provided')
                        }
                        ri.delete(test.count)
                        break
                    case 'bs':
                        if (!test.count) {
                            throw new Error('No bs count provided')
                        }
                        ri.breakSpace(test.count)
                        break
                    default:
                        break
                }
                assert(ri.cursor === test.newCursor)
                assert(ri.value === test.newValue)
            })
        })
    })
}

describe('RegExpInputTest', () => {
    declareTests('[0-9]{1,2}--\\d', [
        {method: 'paste', value: '', cursor: 0, input: 'a', newValue: '', newCursor: 0},
        {method: 'paste', value: '', cursor: 0, input: '-', newValue: '', newCursor: 0},
        {method: 'paste', value: '', cursor: 0, input: '1', newValue: '1', newCursor: 1},

        {method: 'paste', value: '1', cursor: 0, input: 'a', newValue: '1', newCursor: 0},
        {method: 'paste', value: '1', cursor: 0, input: '-', newValue: '1', newCursor: 0},
        {method: 'paste', value: '1', cursor: 0, input: '2', newValue: '2', newCursor: 1},
        {method: 'paste', value: '1', cursor: 1, input: 'a', newValue: '1--', newCursor: 3},
        {method: 'paste', value: '1', cursor: 1, input: '-', newValue: '1--', newCursor: 3},
        {method: 'paste', value: '1', cursor: 1, input: '2', newValue: '12', newCursor: 2},

        {method: 'paste', value: '1', cursor: 0, input: 'a', newValue: '1', newCursor: 0, isInsert: true},
        {method: 'paste', value: '1', cursor: 0, input: '-', newValue: '1', newCursor: 0, isInsert: true},
        {method: 'paste', value: '1', cursor: 0, input: '2', newValue: '21', newCursor: 1, isInsert: true},
        {method: 'paste', value: '1', cursor: 1, input: 'a', newValue: '1--', newCursor: 3, isInsert: true},
        {method: 'paste', value: '1', cursor: 1, input: '-', newValue: '1--', newCursor: 3, isInsert: true},
        {method: 'paste', value: '1', cursor: 1, input: '2', newValue: '12', newCursor: 2, isInsert: true},

        {method: 'paste', value: '12', cursor: 0, input: 'a', newValue: '12', newCursor: 0},
        {method: 'paste', value: '12', cursor: 0, input: '-', newValue: '12', newCursor: 0},
        {method: 'paste', value: '12', cursor: 0, input: '3', newValue: '32', newCursor: 1},
        {method: 'paste', value: '12', cursor: 1, input: 'a', newValue: '1--', newCursor: 3},
        {method: 'paste', value: '12', cursor: 1, input: '-', newValue: '1--', newCursor: 3},
        {method: 'paste', value: '12', cursor: 1, input: '2', newValue: '12', newCursor: 2},
        {method: 'paste', value: '12', cursor: 2, input: 'a', newValue: '12--', newCursor: 4},
        {method: 'paste', value: '12', cursor: 2, input: '-', newValue: '12--', newCursor: 4},
        {method: 'paste', value: '12', cursor: 2, input: '3', newValue: '12--3', newCursor: 5},

        {method: 'paste', value: '12--3', cursor: 0, input: 'a', newValue: '12--3', newCursor: 0},
        {method: 'paste', value: '12--3', cursor: 0, input: '-', newValue: '12--3', newCursor: 0},
        {method: 'paste', value: '12--3', cursor: 0, input: '4', newValue: '42--3', newCursor: 1},
        {method: 'paste', value: '12--3', cursor: 1, input: 'a', newValue: '1--3', newCursor: 3},
        {method: 'paste', value: '12--3', cursor: 1, input: '-', newValue: '1--3', newCursor: 3},
        {method: 'paste', value: '12--3', cursor: 1, input: '4', newValue: '14--3', newCursor: 2},
        {method: 'paste', value: '12--3', cursor: 2, input: 'a', newValue: '12--3', newCursor: 4},
        {method: 'paste', value: '12--3', cursor: 2, input: '-', newValue: '12--3', newCursor: 4},
        {method: 'paste', value: '12--3', cursor: 2, input: '4', newValue: '12--4', newCursor: 5},
        {method: 'paste', value: '12--3', cursor: 3, input: 'a', newValue: '12--', newCursor: 4},
        {method: 'paste', value: '12--3', cursor: 3, input: '-', newValue: '12--', newCursor: 4},
        {method: 'paste', value: '12--3', cursor: 3, input: '4', newValue: '12--4', newCursor: 5},
        {method: 'paste', value: '12--3', cursor: 4, input: 'a', newValue: '12--3', newCursor: 4},
        {method: 'paste', value: '12--3', cursor: 4, input: '-', newValue: '12--3', newCursor: 4},
        {method: 'paste', value: '12--3', cursor: 4, input: '4', newValue: '12--4', newCursor: 5},
        {method: 'paste', value: '12--3', cursor: 5, input: 'a', newValue: '12--3', newCursor: 5},
        {method: 'paste', value: '12--3', cursor: 5, input: '-', newValue: '12--3', newCursor: 5},
        {method: 'paste', value: '12--3', cursor: 5, input: '5', newValue: '12--3', newCursor: 5},
    ])
})
