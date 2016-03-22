/* @flow */

export type Anchor = {
    type: 'anchor';
    kind: 'start' | 'end' | 'boundary' | 'not-boundary';
    mask: RegExp;
    raw: string;
}

export type Value = {
    type: 'value';
    kind: 'symbol' | 'singleEscape' | 'octal' | 'null' | 'controlLetter'
        | 'hexadecimalEscape' | 'unicodeEscape' | 'unicodeCodePointEscape' | 'identifier';
    codePoint: number;
    raw: string;
    mask: RegExp;
}

export type Disjunction = {
    type: 'disjunction';
    body: Array<RegType>;
    mask: RegExp;
    raw: string;
};

export type Dot = {
    type: 'dot';
    mask: RegExp;
    raw: string;
}

export type Reference = {
    type: 'reference';
    matchingIndex: number;
    raw: string;
    mask: RegExp;
}

export type Group = {
    type: 'group';
    behavior: 'normal' | 'ignore' | 'lookahead' | 'negativeLookahead';
    body: Array<RegType>;
    mask: RegExp;
    raw: string;
}

export type Alternative = {
    type: 'alternative';
    parent: RegType;
    body: Array<RegType>;
    mask: RegExp;
    raw: string;
}

export type Quantifier = {
    type: 'quantifier';
    body: Array<RegType>;
    min: number;
    max: number;
    greedy: boolean;
    mask: RegExp;
    raw: string;
}

export type CharacterClass = {
    type: 'characterClass';
    body: Array<RegType>;
    negative: boolean;
    mask: RegExp;
    raw: string;
}

export type CharacterClassEscape = {
    type: 'characterClassEscape';
    value: string;
    mask: RegExp;
    raw: string;
}

export type CharacterClassRange = {
    type: 'characterClassRange';
    mask: RegExp;
    raw: string;
    min: number;
    max: number;
}

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
