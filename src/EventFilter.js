/* @flow */
import type {
    CreateEvent,
    MaskedEvent,
    MaskedInput
} from 'regexp-input/i/interfaces'

export default class EventFilter {
    _createEvent: CreateEvent;
    _input: MaskedInput;
    _onChange: (val: string) => void;

    onKeypress: (e: KeyboardEvent) => void;
    onPaste: (e: Event) => void;
    onKeyDown: (e: KeyboardEvent) => void;

    constructor(
        createEvent: CreateEvent,
        onChange: (val: string) => void,
        input: MaskedInput
    ) {
        this._createEvent = createEvent
        this._input = input
        this._onChange = onChange
        this.onKeypress = this._onKeypress.bind(this)
        this.onPaste = this._onPaste.bind(this)
        this.onKeyDown = this._onKeyDown.bind(this)
    }

    _pasteValue(event: MaskedEvent, val: string, isPaste: boolean = false): void {
        const {_input: input} = this
        event.preventDefault()
        input.cursor = event.getCursor()
        const pasteValue: ?string = input.paste(val);
        if (pasteValue) {
            event.setValue(input.value, input.cursor, isPaste)
            this._onChange(input.value)
        }
    }

    _onKeyDown(e: KeyboardEvent): void {
        const {_input: input, _createEvent: createEvent} = this
        const event: MaskedEvent = createEvent(e);
        switch (e.key) {
            case 'Backspace':
                event.preventDefault()
                input.cursor = event.getCursor()
                if (input.bs()) {
                    event.setValue(input.value, input.cursor)
                }
                break
            case 'Delete':
                event.preventDefault()
                input.cursor = event.getCursor()
                if (input.delete()) {
                    event.setValue(input.value, input.cursor)
                }
                break
            default:
                break
        }
    }

    _onKeypress(e: KeyboardEvent): void {
        if (e.metaKey || e.altKey || e.ctrlKey) {
            return
        }
        this._pasteValue(this._createEvent(e), e.key)
    }

    _onPaste(e: Event): void {
        const event: MaskedEvent = this._createEvent(e);
        this._pasteValue(event, event.getClipboardData(), true)
    }
}
