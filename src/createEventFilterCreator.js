/* @flow */

import DefaultEventFilter from 'regexp-input/DefaultEventFilter'
import DefaultMaskedEvent from 'regexp-input/DefaultMaskedEvent'
import RegExpInput from 'regexp-input/RegExpInput'
import type {
    EventFilter,
    MaskedEvent,
    EventFilterProps,
    CreateEventFilter
} from 'regexp-input/i/interfaces'

export default function createEventFilterCreator(
    win: Object
): CreateEventFilter {
    function createEvent(e: Event): MaskedEvent {
        return new DefaultMaskedEvent(e, win)
    }

    return function createEventFilter(options: EventFilterProps): EventFilter {
        return new DefaultEventFilter(
            createEvent,
            options.onChange,
            new RegExpInput(options.pattern, options.value)
        )
    }
}
