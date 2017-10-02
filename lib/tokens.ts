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

export class LParen extends Token {
    public static PATTERN: RegExp = /\(/;
}

export class RParen extends Token {
    public static PATTERN: RegExp = /\)/;
}

export class Comma extends Token {
    public static PATTERN: RegExp = /,/;
}

export class Colon extends Token {
    public static PATTERN: RegExp = /:/;
}

export class Dot extends Token {
    public static PATTERN: RegExp = /\./;
}

export class GreaterThan extends Token {
    public static PATTERN: RegExp = />[^=]/;
}

export class GreaterThanOrEqual extends Token {
    public static PATTERN: RegExp = />=/;
}

export class LessThan extends Token {
    public static PATTERN: RegExp = /<[^=]/;
}

export class LessThanOrEqual extends Token {
    public static PATTERN: RegExp = /<=/;
}

export class Equal extends Token {
    public static PATTERN: RegExp = /==?/;
}

export class NotEqual extends Token {
    public static PATTERN: RegExp = /!==?/;
}

export class SelectAll extends Token {
    public static PATTERN: RegExp = /\*[^*]/;
}

export class SelectAllExtended extends Token {
    public static PATTERN: RegExp = /\*\*/;
}

export class Identifier extends Token {
    // https://stackoverflow.com/a/2008444
    // https://github.com/SAP/chevrotain/blob/master/docs/resolving_lexer_errors.md#-unexpected-regexp-anchor-error
    public static PATTERN: RegExp = /[_\$a-zA-Z\xA0-\uFFFF][_\$a-zA-Z0-9\xA0-\uFFFF]*/;
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
    LParen,
    RParen,
    Comma,
    Colon,
    Dot,
    GreaterThan,
    GreaterThanOrEqual,
    LessThan,
    LessThanOrEqual,
    Equal,
    NotEqual,
    SelectAll,
    SelectAllExtended,
    Identifier,
    StringLiteral,
    NumberLiteral,
    WhiteSpace
];
export default allTokens;
