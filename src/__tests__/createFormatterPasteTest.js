/* @flow */
/* eslint-env mocha */

import type {Format} from 'regexp-input/i/interfaces'
import createFormatter from 'regexp-input/createFormatter'
import assert from 'power-assert'

describe('createFormatterPasteTest', () => {
    let format: Format;

    beforeEach(() => {
        format = createFormatter('111-111')
    })

    it('should not move cursor, if garbage pasted at end', () => {
        const result = format('1', 'qew', 1)
        assert.deepEqual(result, {
            cursorPos: 1,
            newValue: '1'
        })
    })

    it('should not move cursor, if garbage pasted at middle', () => {
        const result = format('123', 'qew', 1)
        assert.deepEqual(result, {
            cursorPos: 1,
            newValue: '123'
        })
    })

    it('should add one of three matched symbols', () => {
        const result = format('1', 'q2w', 1)
        assert.deepEqual(result, {
            cursorPos: 2,
            newValue: '12'
        })
    })

    it('should add string with separators, matched symbols and garbage', () => {
        const result = format('1', 'q2w3wer4q-123qw231q123', 1)
        assert.deepEqual(result, {
            cursorPos: 7,
            newValue: '123-412'
        })
    })

    it('should add string with garbage with separator replace', () => {
        const result = format('1', '2q3www', 1)
        assert.deepEqual(result, {
            cursorPos: 4,
            newValue: '123-'
        })
    })

    it('should add string with garbage before separator', () => {
        const result = format('1', 'qqq2w3', 1)
        assert.deepEqual(result, {
            cursorPos: 3,
            newValue: '123'
        })
    })
})
