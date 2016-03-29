import type {
    Traversable,
    RegType
} from 'regexp-input/i/parserInterfaces'

type Match = {
    normalMatch: ?Array<string>,
    strictMatch: ?Array<string>
}

export default class Traverser {
    _stop: boolean;
    _current: string;
    _input: string;
    _output: string;
    _node: RegType;

    constructor(
        current: string,
        input: string
    ) {
        this._stop = false
        this._output = ''
        if (current === undefined) {
            throw new Error('current is undefined')
        }
        if (input === undefined) {
            throw new Error('input is undefined')
        }
        this._input = input
        this._current = current
    }

    _getMatches(node: RegType): Match {
        let normalMatch: ?Array<string> = null;
        let strictMatch: ?Array<string> = null;
        if (this._current) {
            const sum: string = this._current + this._input;
            strictMatch = sum.match(node.strictMask)
            if (!strictMatch) {
                normalMatch = this._current.match(node.mask);
            }
        }

        return {
            normalMatch,
            strictMatch
        }
    }

    _baseReduce(match: Match): boolean {
        if (match.strictMatch) {
            console.log(`strictMatch: ${match.strictMatch[0]}`)
            this._output += this._input
            this._stop = true
        } else if (match.normalMatch) {
            console.log(`normalMatch: ${match.normalMatch[0]}`)
            this._current = this._current.substring(match.normalMatch[0].length)
        } else {
            return false
        }

        return true
    }

    _valueReduce(match: Match, node: RegType): void {
        if (!this._stop && !this._current) {
            const inputMatch = this._input.match(node.mask)
            console.log(`inputMatch: ${inputMatch ? inputMatch[0] : null}`)
            if (inputMatch && !match.normalMatch) {
                this._output += inputMatch[0]
            }
            this._stop = true
        }
    }

    _processChilds(node: Traversable): void {
        const {body} = node
        for (let i = 0, l = body.length; i < l; i++) {
            this.traverse(body[i])
            if (this._stop) {
                break
            }
        }
    }

    traverse(node: RegType): string {
        let match: Match;
        console.log(`begin ${node.type}, ${node.raw}, cur:${this._current}, out: ${this._output}, stop: ${this._stop}`)
        switch (node.type) {
            case 'value':
                match = this._getMatches(node)
                if (!this._baseReduce(match)) {
                    this._output += node.raw
                }
                break
            case 'alternative':
                this._processChilds(node)
                break
            case 'disjunction':
            case 'group':
            case 'quantifier':
                match = this._getMatches(node)
                if (!this._baseReduce(match)) {
                    this._processChilds(node)
                }
                break

            case 'characterClass':
            case 'dot':
            case 'characterClassEscape':
            case 'anchor':
                match = this._getMatches(node)
                this._baseReduce(match)
                this._valueReduce(match, node)
                break
            default:
                break
        }
        console.log(`end ${node.type}, ${node.raw}, cur: ${this._current}, out: ${this._output}, stop: ${this._stop}`)

        return this._output
    }
}
