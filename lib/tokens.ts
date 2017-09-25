import {Lexer, Token, TokenConstructor} from 'chevrotain';

export class True extends Token {
    public static PATTERN: RegExp = /true/;
}

export class False extends Token {
    public static PATTERN: RegExp = /false/;
}

export class Null extends Token {
    public static PATTERN: RegExp = /null/;
}

export class LCurly extends Token {
    public static PATTERN: RegExp = /{/;
}

export class RCurly extends Token {
    public static PATTERN: RegExp = /}/;
}

export class LSquare extends Token {
    public static PATTERN: RegExp = /\[/;
}

export class RSquare extends Token {
    public static PATTERN: RegExp = /]/;
}

export class Comma extends Token {
    public static PATTERN: RegExp = /,/;
}

export class Colon extends Token {
    public static PATTERN: RegExp = /:/;
}

export class StringLiteral extends Token {
    public static PATTERN: RegExp = /"(?:[^\\"]|\\(?:[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*"/;
}

export class NumberLiteral extends Token {
    public static PATTERN: RegExp = /-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/;
}

export class WhiteSpace extends Token {
    public static PATTERN: RegExp = /\s+/;
    public static GROUP: string = Lexer.SKIPPED;
    public static LINE_BREAKS: boolean = true;
}

const allTokens: TokenConstructor[] = [
    True,
    False,
    Null,
    LCurly,
    RCurly,
    LSquare,
    RSquare,
    Comma,
    Colon,
    StringLiteral,
    NumberLiteral,
    WhiteSpace
];
export default allTokens;
