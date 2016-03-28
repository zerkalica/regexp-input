/* @flow */

function fallbackAnimationFrame(fn: Function): void {
    setTimeout(fn, 0)
}

function createAnimationFrame(window: ?Object): (fn: Function) => void {
    const win: Object = window || {};

    return win.requestAnimationFrame
        || win.webkitRequestAnimationFrame
        || win.mozRequestAnimationFrame
        || fallbackAnimationFrame;
}

export default class DefaultMaskedEvent {
    _event: Event;
    _document: Document;
    _window: Object;
    _animationFrame: (fn: Function) => void;

    constructor(event: Event, window: Object) {
        this._event = event
        this._window = window
        this._document = window.document
        this._animationFrame = createAnimationFrame(window)
    }

    preventDefault(): void {
        this._event.preventDefault()
    }

    getClipboardData(): string {
        const {_event: event, _window: win} = this
        let text: string = '';
        if (win.clipboardData && win.clipboardData.getData) { // IE
            text = win.clipboardData.getData('Text')
        } else if (event.clipboardData && event.clipboardData.getData) {
            text = event.clipboardData.getData('text/plain')
        }

        return text
    }

    getCursor(): number {
        const {_event: event, _window: win} = this
        const doc = win.document
        const input: Object = event.target;
        if (!input) {
            throw new Error(`Can't get selection`)
        }
        let cursor: number = 0;
        if (input.selectionStart !== undefined && input.selectionEnd !== undefined) {
            cursor = input.selectionStart
        } else if (doc.selection) {
            const range = doc.selection.createRange();
            if (range.parentElement() === input) {
                cursor = -range.moveStart('character', -input.value.length)
            }
        }

        return cursor
    }

    _setCursor(cursor: number): void {
        const input: Object = this._event.target;
        if (!input) {
            return
        }

        if (input.selectionStart !== undefined && input.selectionEnd !== undefined) {
            input.selectionStart = cursor
            input.selectionEnd = cursor
        } else {
            const range = input.createTextRange();
            range.collapse(true)
            range.moveStart('character', cursor)
            range.moveEnd('character', 0)
            range.select()
        }
    }

    _setValue(val: string): void {
        const target: EventTarget = this._event.target;
        if (target.value === undefined) {
            throw new Error(`Not an input: ${target.toString()}`)
        }
        (target: any).value = val // eslint-disable-line
    }

    setValue(
        val: string,
        cursor: number = 0
    ): void {
        this._setValue(val)
        this._animationFrame(() => this._setCursor(cursor))
    }
}
