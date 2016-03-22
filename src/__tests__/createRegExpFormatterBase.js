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
        {current: '', input: 'aaa', output: ''},
        {current: '', input: '1', output: '1'},
        {current: '', input: '1213465', output: '12--13-4'},

        {current: '1', input: '1', output: '1'},
        {current: '11', input: '1', output: '--1'},
        {current: '11--1', input: '1', output: '1'},
        {current: '11-', input: '1', output: '-1'}
    ])
})
