/* @flow */
/* eslint-env mocha */

import type {Format} from 'regexp-input/i/interfaces'
import createFormatter from 'regexp-input/createFormatter'
import assert from 'power-assert'

describe('createFormatterAddingTest', () => {
    let format: Format;

    beforeEach(() => {
        format = createFormatter('111-111')
    })
    it('should not add not matched symbol at start', () => {
        const result = format('', 'a', 0)
        assert.deepEqual(result, {
            cursorPos: 0,
            newValue: ''
        })
    })

    it('should not add not matched symbol in the middle', () => {
        const result = format('1', 'a', 1)
        assert.deepEqual(result, {
            cursorPos: 1,
            newValue: '1'
        })
    })

    it('should add matched symbol at start and move cursor pos', () => {
        const result = format('', '3', 0)
        assert.deepEqual(result, {
            cursorPos: 1,
            newValue: '3'
        })
    })

    it('should add matched symbol before separator and move cursor pos at two positions', () => {
        const result = format('123', '4', 3)
        assert.deepEqual(result, {
            cursorPos: 5,
            newValue: '123-4'
        })
    })

    it('should not add non-matched symbol before separator, but add separator', () => {
        const result = format('123', 'q', 3)
        assert.deepEqual(result, {
            cursorPos: 4,
            newValue: '123-'
        })
    })

    it('should add separator and move cursor pos', () => {
        const result = format('123', '-', 3)
        assert.deepEqual(result, {
            cursorPos: 4,
            newValue: '123-'
        })
    })

    it('should not add matched symbol if max length reached', () => {
        const result = format('123-321', '1', 7)
        assert.deepEqual(result, {
            cursorPos: 7,
            newValue: '123-321'
        })
    })
})
