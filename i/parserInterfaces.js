/* @flow */

export type Anchor = {
    type: 'anchor';
    raw: string;
    mask: RegExp;
    strictMask: RegExp;

    kind: 'start' | 'end' | 'boundary' | 'not-boundary';
}

export type Value = {
    type: 'value';
    raw: string;
    mask: RegExp;
    strictMask: RegExp;

    kind: 'symbol' | 'singleEscape' | 'octal' | 'null' | 'controlLetter'
        | 'hexadecimalEscape' | 'unicodeEscape' | 'unicodeCodePointEscape' | 'identifier';
    codePoint: number;
}

export type Disjunction = {
    type: 'disjunction';
    raw: string;
    mask: RegExp;
    strictMask: RegExp;

    body: Array<RegType>;
};

export type Dot = {
    type: 'dot';
    raw: string;
    mask: RegExp;
    strictMask: RegExp;
}

export type Reference = {
    type: 'reference';
    raw: string;
    mask: RegExp;
    strictMask: RegExp;

    matchingIndex: number;
}

export type Group = {
    type: 'group';
    raw: string;
    mask: RegExp;
    strictMask: RegExp;

    behavior: 'normal' | 'ignore' | 'lookahead' | 'negativeLookahead';
    body: Array<RegType>;
}

export type Alternative = {
    type: 'alternative';
    raw: string;
    mask: RegExp;
    strictMask: RegExp;

    parent: RegType;
    body: Array<RegType>;
}

export type Quantifier = {
    type: 'quantifier';
    raw: string;
    mask: RegExp;
    strictMask: RegExp;

    body: Array<RegType>;
    min: number;
    max: number;
    greedy: boolean;
}

export type CharacterClass = {
    type: 'characterClass';
    raw: string;
    mask: RegExp;
    strictMask: RegExp;

    body: Array<RegType>;
    negative: boolean;
}

export type CharacterClassEscape = {
    type: 'characterClassEscape';
    raw: string;
    mask: RegExp;
    strictMask: RegExp;

    value: string;
}

export type CharacterClassRange = {
    type: 'characterClassRange';
    raw: string;
    mask: RegExp;
    strictMask: RegExp;

    min: number;
    max: number;
}

export type Traversable =
    | Disjunction
    | Group
    | Alternative
    | Quantifier
    | CharacterClass;

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
