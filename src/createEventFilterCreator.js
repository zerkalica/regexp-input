/* @flow */

import EventFilter from 'regexp-input/EventFilter'
import DefaultMaskedEvent from 'regexp-input/DefaultMaskedEvent'
import RegExpInput from 'regexp-input/RegExpInput'
import type {MaskedEvent} from 'regexp-input/i/interfaces'

type EventFilterProps = {
    onChange: (val: string) => void;
    mask: string;
    value: string;
};

export default function createEventFilterCreator(
    win: Object
): (options: EventFilterProps) => EventFilter {
    function createEvent(e: Event): MaskedEvent {
        return new DefaultMaskedEvent(e, win)
    }

    return function createEventFilter(options: EventFilterProps): EventFilter {
        return new EventFilter(
            createEvent,
            options.onChange,
            new RegExpInput(options.mask, options.value)
        )
    }
}
