/* @flow */
/* eslint-env mocha */

import type {Format} from 'regexp-input/i/interfaces'
import createFormatter from 'regexp-input/createFormatter'
import assert from 'power-assert'

describe('createFormatterReplaceTest', () => {
    let format: Format;

    beforeEach(() => {
        format = createFormatter('111-111')
    })

    it('should replace one of three matched symbols', () => {
        const result = format('123-333', '7', 1)
        assert.deepEqual(result, {
            cursorPos: 2,
            newValue: '173-333'
        })
    })

    it('should replace two of three matched symbols', () => {
        const result = format('123-333', '74', 1)
        assert.deepEqual(result, {
            cursorPos: 3,
            newValue: '174-333'
        })
    })
})
