import {IRule, IToken, Parser as ChevrotainParser} from 'chevrotain';
import allTokens, {
    Colon,
    Comma,
    Dot,
    Equal,
    False,
    GreaterThan,
    GreaterThanOrEqual,
    Identifier,
    LCurly,
    LessThan,
    LessThanOrEqual,
    LParen,
    LSquare,
    NotEqual,
    Null,
    NumberLiteral,
    RCurly,
    RParen,
    RSquare,
    SelectAll,
    StringLiteral,
    True
} from './tokens';

export default class Parser extends ChevrotainParser {
    // (select arrayFilter?)*
    public inspect: IRule = this.RULE('inspect', (): void => {
        this.MANY((): void => {
            this.SUBRULE(this.select);
            this.OPTION(() => { this.SUBRULE(this.arrayFilter); });
        });
    });
    // selectValue | selectFunction
    private select: IRule = this.RULE('select', (): void => {
        this.OR([
            {ALT: (): void => { this.SUBRULE(this.selectValue); }},
            {ALT: (): void => { this.SUBRULE(this.selectFunction); }}
        ]);
    });
    // Identifier (Dot Identifier)*
    private selectValue: IRule = this.RULE('selectValue', (): void => {
        this.CONSUME(Identifier);
        this.MANY((): void => {
            this.CONSUME(Dot);
            this.CONSUME2(Identifier);
        });
    });
    // Colon functionInvocation
    private selectFunction: IRule = this.RULE('selectFunction', (): void => {
        this.CONSUME(Colon);
        this.SUBRULE(this.functionInvocation);
    });
    // LSquare NumberLiteral RSquare
    private arrayIndex: IRule = this.RULE('arrayIndex', (): void => {
        this.CONSUME(LSquare);
        this.CONSUME(NumberLiteral);
        this.CONSUME(RSquare);
    });
    // LSquare SelectAll? filterArgument* RSquare
    private arrayFilter: IRule = this.RULE('arrayFilter', (): void => {
        this.CONSUME(LSquare);
        this.OPTION((): void => { this.CONSUME(SelectAll); });
        this.MANY((): void => { this.SUBRULE(this.filterArgument); });
        this.CONSUME(RSquare);
    });
    // selectValue operator value
    private filterArgument: IRule = this.RULE('filterArgument', (): void => {
        this.SUBRULE(this.selectValue);
        this.SUBRULE(this.operator);
        this.SUBRULE(this.value);
    });
    // Identifier LParen functionArgument? (Comma functionArgument)* RParen
    private functionInvocation: IRule = this.RULE('functionInvocation', (): void => {
        this.CONSUME(Identifier);
        this.CONSUME(LParen);
        this.OPTION((): void => {
            this.SUBRULE(this.functionArgument);
            this.MANY((): void => {
                this.CONSUME(Comma);
                this.SUBRULE2(this.functionArgument);
            });
        });
        this.CONSUME(RParen);
    });
    // functionInvocation | value
    private functionArgument: IRule = this.RULE('functionArgument', (): void => {
        this.OR([
            {ALT: (): void => { this.SUBRULE(this.functionInvocation); }},
            {ALT: (): void => { this.SUBRULE(this.value); }}
        ]);
    });
    // LCurly objectItem? (Comma objectItem)* RCurly
    private object: IRule = this.RULE('object', (): void => {
        this.CONSUME(LCurly);
        this.OPTION((): void => {
            this.SUBRULE(this.objectItem);
            this.MANY((): void => {
                this.CONSUME(Comma);
                this.SUBRULE2(this.objectItem);
            });
        });
        this.CONSUME(RCurly);
    });
    // StringLiteral Colon value
    private objectItem: IRule = this.RULE('objectItem', (): void => {
        this.CONSUME(StringLiteral);
        this.CONSUME(Colon);
        this.SUBRULE(this.value);
    });
    // LSquare value? (Comma value)* RSqaure
    private array: IRule = this.RULE('array', (): void => {
        this.CONSUME(LSquare);
        this.OPTION((): void => {
            this.SUBRULE(this.value);
            this.MANY((): void => {
                this.CONSUME(Comma);
                this.SUBRULE2(this.value);
            });
        });
        this.CONSUME(RSquare);
    });
    // StringLiteral | NumberLiteral | object | array | True | False | null
    private value: IRule = this.RULE('value', (): void => {
        this.OR([
            {ALT: (): void => { this.CONSUME(StringLiteral); }},
            {ALT: (): void => { this.CONSUME(NumberLiteral); }},
            {ALT: (): void => { this.SUBRULE(this.object); }},
            {ALT: (): void => { this.SUBRULE(this.array); }},
            {ALT: (): void => { this.CONSUME(True); }},
            {ALT: (): void => { this.CONSUME(False); }},
            {ALT: (): void => { this.CONSUME(Null); }}
        ]);
    });
    // Equal | NotEqual | LessThan | LessThanOrEqual | GreaterThan | GreaterThanOrEqual
    private operator: IRule = this.RULE('operator', (): void => {
        this.OR([
            {ALT: (): void => { this.CONSUME(Equal); }},
            {ALT: (): void => { this.CONSUME(NotEqual); }},
            {ALT: (): void => { this.CONSUME(LessThan); }},
            {ALT: (): void => { this.CONSUME(LessThanOrEqual); }},
            {ALT: (): void => { this.CONSUME(GreaterThan); }},
            {ALT: (): void => { this.CONSUME(GreaterThanOrEqual); }}
        ]);
    });

    constructor () {
        super ([], allTokens);
        Parser.performSelfAnalysis(this);
    }

    public parse (tokens: IToken[]): Object {
        this.input = tokens;
        return <Object> <any> this.inspect();
    }
}
