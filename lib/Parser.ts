import {IRule, IToken, Parser as ChevrotainParser} from 'chevrotain';
import * as Tokens from './tokens';

abstract class JsonParser extends ChevrotainParser {
    // json
    //      object | array
    public json: IRule = this.RULE('json', (): void => {
        this.OR([
            {ALT: (): void => { this.SUBRULE(this.object); }},
            {ALT: (): void => { this.SUBRULE(this.array); }}
        ]);
    });
    // object
    //      LCurly objectItem? (Comma objectItem)* RCurly
    protected object: IRule = this.RULE('object', (): void => {
        this.CONSUME(Tokens.LCurly);
        this.OPTION((): void => {
            this.SUBRULE(this.objectItem);
            this.MANY((): void => {
                this.CONSUME(Tokens.Comma);
                this.SUBRULE2(this.objectItem);
            });
        });
        this.CONSUME(Tokens.RCurly);
    });
    // objectItem
    //      StringLiteral Colon value
    protected objectItem: IRule = this.RULE('objectItem', (): void => {
        this.CONSUME(Tokens.StringLiteral);
        this.CONSUME(Tokens.Colon);
        this.SUBRULE(this.value);
    });
    // array
    //      LSquare value? (Comma value)* RSqaure
    protected array: IRule = this.RULE('array', (): void => {
        this.CONSUME(Tokens.LSquare);
        this.OPTION((): void => {
            this.SUBRULE(this.value);
            this.MANY((): void => {
                this.CONSUME(Tokens.Comma);
                this.SUBRULE2(this.value);
            });
        });
        this.CONSUME(Tokens.RSquare);
    });
    // value
    //      StringLiteral | NumberLiteral | object | array | True | False | null
    protected value: IRule = this.RULE('value', (): void => {
        this.OR([
            {ALT: (): void => { this.CONSUME(Tokens.StringLiteral); }},
            {ALT: (): void => { this.CONSUME(Tokens.NumberLiteral); }},
            {ALT: (): void => { this.SUBRULE(this.object); }},
            {ALT: (): void => { this.SUBRULE(this.array); }},
            {ALT: (): void => { this.CONSUME(Tokens.True); }},
            {ALT: (): void => { this.CONSUME(Tokens.False); }},
            {ALT: (): void => { this.CONSUME(Tokens.Null); }}
        ]);
    });
}

export default class Parser extends JsonParser {
    // inspect
    //      (select | selectFilter)*
    public inspect: IRule = this.RULE('inspect', (): void => {
        this.MANY((): void => {
            this.OR([
                {ALT: (): void => { this.SUBRULE(this.select); }},
                {ALT: (): void => { this.SUBRULE(this.selectFilter); }}
            ]);
        });
    });
    // select
    //      selectValue | selectFunction
    private select: IRule = this.RULE('select', (): void => {
        this.OR([
            {ALT: (): void => { this.SUBRULE(this.selectValue); }},
            {ALT: (): void => { this.SUBRULE(this.selectFunction); }}
        ]);
    });
    // selectValue
    //      ((Dot Identifier) | Identifier) (Dot Identifier)*
    private selectValue: IRule = this.RULE('selectValue', (): void => {
        this.OR([
            {ALT: (): void => { this.CONSUME(Tokens.Identifier); }},
            {ALT: (): void => {
                this.CONSUME(Tokens.Dot);
                this.CONSUME2(Tokens.Identifier);
            }}
        ]);
        this.MANY((): void => {
            this.CONSUME2(Tokens.Dot);
            this.CONSUME3(Tokens.Identifier);
        });
    });
    // selectFunction
    //      Colon Identifier functionArguments?
    private selectFunction: IRule = this.RULE('selectFunction', (): void => {
        this.CONSUME(Tokens.Colon);
        this.CONSUME(Tokens.Identifier);
        this.OPTION((): void => { this.SUBRULE(this.functionArguments); });
    });
    // functionInvocation
    //      Identifier functionArguments
    private functionInvocation: IRule = this.RULE('functionInvocation', (): void => {
        this.CONSUME(Tokens.Identifier);
        this.SUBRULE(this.functionArguments);
    });
    // functionArguments
    //      LParen (functionArgument (Comma functionArgument)*)? RParen
    private functionArguments: IRule = this.RULE('functionArguments', (): void => {
        this.CONSUME(Tokens.LParen);
        this.OPTION((): void => {
            this.SUBRULE(this.functionArgument);
            this.MANY((): void => {
                this.CONSUME(Tokens.Comma);
                this.SUBRULE2(this.functionArgument);
            });
        });
        this.CONSUME(Tokens.RParen);
    });
    // functionArgument
    //      functionInvocation | value
    private functionArgument: IRule = this.RULE('functionArgument', (): void => {
        this.OR([
            {ALT: (): void => { this.SUBRULE(this.functionInvocation); }},
            {ALT: (): void => { this.SUBRULE(this.value); }}
        ]);
    });
    // selectFilter
    //      LSquare (Integer | selectArrayFilter) RSquare
    private selectFilter: IRule = this.RULE('selectFilter', (): void => {
        this.CONSUME(Tokens.LSquare);
        this.OR([
            {ALT: (): void => { this.CONSUME(Tokens.Integer); }},
            {ALT: (): void => { this.SUBRULE(this.selectArrayFilter); }}
        ]);
        this.CONSUME(Tokens.RSquare);
    });
    // selectArrayFilter
    //      selectAll? (filterArgument (booleanOperator filterArgument)*)?
    private selectArrayFilter: IRule = this.RULE('selectArrayFilter', (): void => {
        this.OPTION((): void => { this.CONSUME(Tokens.SelectAll); });
        this.OPTION2((): void => {
            this.SUBRULE(this.filterArgument);
            this.MANY((): void => {
                this.SUBRULE(this.booleanOperator);
                this.SUBRULE2(this.filterArgument);
            });
        });
    });
    // filterArgument
    //      selectValue comparisonOperator value
    private filterArgument: IRule = this.RULE('filterArgument', (): void => {
        this.SUBRULE(this.selectValue);
        this.SUBRULE(this.comparisonOperator);
        this.SUBRULE(this.filterValue);
    });
    // booleanOperator
    //      Or | And
    private booleanOperator: IRule = this.RULE('booleanOperator', (): void => {
        this.OR([
            {ALT: (): void => { this.CONSUME(Tokens.Or); }},
            {ALT: (): void => { this.CONSUME(Tokens.And); }}
        ]);
    });
    // comparisonOperator
    //      Equal | NotEqual | LessThan | LessThanOrEqual | GreaterThan | GreaterThanOrEqual | Matches | NotMatches
    private comparisonOperator: IRule = this.RULE('comparisonOperator', (): void => {
        this.OR([
            {ALT: (): void => { this.CONSUME(Tokens.Equal); }},
            {ALT: (): void => { this.CONSUME(Tokens.NotEqual); }},
            {ALT: (): void => { this.CONSUME(Tokens.LessThan); }},
            {ALT: (): void => { this.CONSUME(Tokens.LessThanOrEqual); }},
            {ALT: (): void => { this.CONSUME(Tokens.GreaterThan); }},
            {ALT: (): void => { this.CONSUME(Tokens.GreaterThanOrEqual); }},
            {ALT: (): void => { this.CONSUME(Tokens.Matches); }},
            {ALT: (): void => { this.CONSUME(Tokens.NotMatches); }}
        ]);
    });
    // filterValue
    //      StringLiteralNoQuotes | NumberLiteral | True | False | null | RegExpLiteral
    private filterValue: IRule = this.RULE('filterValue', (): void => {
        this.OR([
            {ALT: (): void => { this.CONSUME(Tokens.StringLiteral); }},
            {ALT: (): void => { this.CONSUME(Tokens.NumberLiteral); }},
            {ALT: (): void => { this.CONSUME(Tokens.True); }},
            {ALT: (): void => { this.CONSUME(Tokens.False); }},
            {ALT: (): void => { this.CONSUME(Tokens.Null); }},
            {ALT: (): void => { this.CONSUME(Tokens.RegExpLiteral); }}
        ]);
    });

    constructor () {
        super ([], Object.values(Tokens));
        Parser.performSelfAnalysis(this);
    }

    public parse (tokens: IToken[]): Object {
        this.input = tokens;
        return <Object> <any> this.inspect();
    }
}
