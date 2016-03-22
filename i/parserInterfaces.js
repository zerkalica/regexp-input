/* @flow */

export type Anchor = {
    type: 'anchor';
    parent: RegType;
    kind: 'start' | 'end' | 'boundary' | 'not-boundary';
}

export type Value = {
    type: 'value';
    parent: RegType;
    kind: 'symbol' | 'singleEscape' | 'octal' | 'null' | 'controlLetter'
        | 'hexadecimalEscape' | 'unicodeEscape' | 'unicodeCodePointEscape' | 'identifier';
    codePoint: number;
    raw: string;
}

export type Disjunction = {
    type: 'disjunction';
    parent: RegType;
    body: Array<RegType>;
    traverse: Traverse;
    mask: RegExp;
    raw: string;
};

export type Dot = {
    type: 'dot';
    parent: RegType;
}

export type Reference = {
    type: 'reference';
    parent: RegType;
    matchingIndex: number;
}

export type Group = {
    type: 'group';
    parent: RegType;
    behavior: 'normal' | 'ignore' | 'lookahead' | 'negativeLookahead';
    body: Array<RegType>;
    traverse: Traverse;
    mask: RegExp;
    raw: string;
}

export type Alternative = {
    type: 'alternative';
    parent: RegType;
    body: Array<RegType>;
    traverse: Traverse;
    mask: RegExp;
    raw: string;
}

export type Quantifier = {
    type: 'quantifier';
    parent: RegType;
    body: Array<RegType>;
    traverse: Traverse;
    min: number;
    max: number;
    greedy: boolean;
    mask: RegExp;
    raw: string;
}

export type CharacterClass = {
    type: 'characterClass';
    parent: RegType;
    body: Array<RegType>;
    traverse: Traverse;
    negative: boolean;
    mask: RegExp;
    raw: string;
}

export type CharacterClassEscape = {
    type: 'characterClassEscape';
    parent: RegType;
    value: string;
    mask: RegExp;
    raw: string;
}

export type CharacterClassRange = {
    type: 'characterClassRange';
    parent: RegType;
    mask: RegExp;
    raw: string;
    min: number;
    max: number;
}

export type TraversableType =
    CharacterClass
    | Quantifier
    | Alternative
    | Group
    | Disjunction;

export type VisitorFn<T: RegType> = (item: T, acc: Object) => void;
export type RegTypeVisitor = {
    [type: string]: VisitorFn;
}
export type Traverse = (visitor: RegTypeVisitor, acc: Object, parent: ?RegType) => void;

export type RegType =
    Anchor
    | Value
    | Disjunction
    | Dot
    | CharacterClassEscape
    | Reference
    | Group
    | Alternative
    | Quantifier
    | CharacterClass
    | CharacterClassRange;
