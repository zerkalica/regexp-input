/* @flow */
/* eslint-env mocha */

import createRegExpFormatter from 'regexp-input/createRegExpFormatter'
import assert from 'power-assert'
import type {Formatter} from 'regexp-input/i/interfaces'

function declareTests(
    regExp: string,
    allTests: Array<{current: string, input: string, output: string}>
): void {
    describe(`regexp ${regExp}`, () => {
        allTests.forEach((test) => {
            it(`with input '${test.current}' + '${test.input}' should produce '${test.output}'`,
            () => {
                const formatter: Formatter = createRegExpFormatter(regExp);
                const result: string = formatter(test.current, test.input);
                // console.log(`result='${result}'`)
                assert(result === test.output)
            })
        })
    })
}

describe('createRegExpFormatterBase', () => {
    declareTests('\\d{2,3}--\\d{2}-\\d', [
        {current: '', input: 'a', output: ''},
        {current: '', input: '-', output: ''},
        {current: '', input: '1', output: '1'},

        {current: '1', input: 'a', output: ''},
        {current: '1', input: '-', output: ''},
        {current: '1', input: '1', output: '1'},
        {current: '1', input: '2', output: '2'},

        // is it ok ?
        {current: '12', input: 'a', output: '--'},
        {current: '12', input: '-', output: '--'},

        {current: '12', input: '2', output: '2'},
        {current: '12', input: '3', output: '3'},

        {current: '123', input: 'a', output: '--'},
        {current: '123', input: '-', output: '--'},
        {current: '123', input: '3', output: '--3'},
        {current: '123', input: '4', output: '--4'},

        {current: '12-', input: 'a', output: '-'},
        {current: '12-', input: '-', output: '-'},
        {current: '12-', input: '3', output: '-3'},
        {current: '12-', input: '4', output: '-4'},

        {current: '12--', input: 'a', output: ''},
        {current: '12--', input: '-', output: ''},
        {current: '12--', input: '3', output: '3'},
        {current: '12--', input: '4', output: '4'},

        {current: '123-', input: 'a', output: '-'},
        {current: '123-', input: '-', output: '-'},
        {current: '123-', input: '3', output: '-3'},
        {current: '123-', input: '4', output: '-4'},

        {current: '123--', input: 'a', output: ''},
        {current: '123--', input: '-', output: ''},
        {current: '123--', input: '3', output: '3'},
        {current: '123--', input: '4', output: '4'},

        {current: '123--4', input: 'a', output: ''},
        {current: '123--4', input: '-', output: ''},
        {current: '123--4', input: '4', output: '4'},
        {current: '123--4', input: '5', output: '5'},

        {current: '123--45', input: 'a', output: '-'},
        {current: '123--45', input: '-', output: '-'},
        {current: '123--45', input: '5', output: '-5'},
        {current: '123--45', input: '6', output: '-6'},

        {current: '123--45-', input: 'a', output: ''},
        {current: '123--45-', input: '-', output: ''},
        {current: '123--45-', input: '5', output: '5'},
        {current: '123--45-', input: '6', output: '6'},

        {current: '123--45-6', input: 'a', output: ''},
        {current: '123--45-6', input: '-', output: ''},
        {current: '123--45-6', input: '6', output: ''},
        {current: '123--45-6', input: '7', output: ''}
    ])
})
