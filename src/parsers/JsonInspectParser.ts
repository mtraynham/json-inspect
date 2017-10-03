import {CstNode, IRule, IToken} from 'chevrotain';
import allTokens, * as Tokens from '../tokens';
import JsonParser from './JsonParser';

export default class JsonInspectParser extends JsonParser {
    // inspect
    //      inspectStatement (Or inspectStatement)*
    public inspect: IRule<void> = this.RULE('inspect', (): void => {
        this.SUBRULE(this.inspectStatement);
        this.MANY((): void => {
            this.CONSUME(Tokens.Or);
            this.SUBRULE2(this.inspectStatement);
        });
    });
    // inspectStatement
    //      (select | selectFilter)+
    public inspectStatement: IRule<void> = this.RULE('inspectStatement', (): void => {
        this.AT_LEAST_ONE((): void => {
            this.OR([
                {ALT: (): void => { this.SUBRULE(this.select); }},
                {ALT: (): void => { this.SUBRULE(this.selectFilter); }}
            ]);
        });
    });
    // select
    //      (selectValue | selectFunction)+
    private select: IRule<void> = this.RULE('select', (): void => {
        this.AT_LEAST_ONE((): void => {
            this.OR([
                {ALT: (): void => { this.SUBRULE(this.selectValue); }},
                {ALT: (): void => { this.SUBRULE(this.selectFunction); }}
            ]);
        });
    });
    // selectValue
    //      ((Dot Identifier) | Identifier) (Dot Identifier)*
    private selectValue: IRule<void> = this.RULE('selectValue', (): void => {
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
    private selectFunction: IRule<void> = this.RULE('selectFunction', (): void => {
        this.CONSUME(Tokens.Colon);
        this.CONSUME(Tokens.Identifier);
        this.OPTION((): void => { this.SUBRULE(this.functionArguments); });
    });
    // functionInvocation
    //      Identifier functionArguments
    private functionInvocation: IRule<void> = this.RULE('functionInvocation', (): void => {
        this.CONSUME(Tokens.Identifier);
        this.SUBRULE(this.functionArguments);
    });
    // functionArguments
    //      LParen (functionArgument (Comma functionArgument)*)? RParen
    private functionArguments: IRule<void> = this.RULE('functionArguments', (): void => {
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
    private functionArgument: IRule<void> = this.RULE('functionArgument', (): void => {
        this.OR([
            {ALT: (): void => { this.SUBRULE(this.functionInvocation); }},
            {ALT: (): void => { this.SUBRULE(this.filterValue); }}
        ]);
    });
    // selectFilter
    //      LSquare (Integer | Glob | selectArrayFilter) RSquare
    private selectFilter: IRule<void> = this.RULE('selectFilter', (): void => {
        this.CONSUME(Tokens.LSquare);
        this.OR([
            {ALT: (): void => { this.CONSUME(Tokens.Integer); }},
            {ALT: (): void => { this.CONSUME(Tokens.Glob); }},
            {ALT: (): void => { this.SUBRULE(this.selectArrayFilter); }}
        ]);
        this.CONSUME(Tokens.RSquare);
    });
    // selectArrayFilter
    //      selectAll? filterArguments?
    private selectArrayFilter: IRule<void> = this.RULE('selectArrayFilter', (): void => {
        this.OPTION((): void => { this.CONSUME(Tokens.Star); });
        this.OPTION2((): void => { this.SUBRULE(this.filterArguments); });
    });
    // filterArguments
    //      filterArgument (booleanOperator filterArgument)*
    private filterArguments: IRule<void> = this.RULE('filterArguments', (): void => {
        this.SUBRULE(this.filterArgument);
        this.MANY((): void => {
            this.SUBRULE(this.booleanOperator);
            this.SUBRULE2(this.filterArgument);
        });
    });
    // filterArgument
    //      selectValue comparisonOperator value
    private filterArgument: IRule<void> = this.RULE('filterArgument', (): void => {
        this.SUBRULE(this.select);
        this.OPTION((): void => {
            this.SUBRULE(this.comparisonOperator);
            this.SUBRULE(this.filterValue);
        });
    });
    // booleanOperator
    //      Or | And
    private booleanOperator: IRule<void> = this.RULE('booleanOperator', (): void => {
        this.OR([
            {ALT: (): void => { this.CONSUME(Tokens.Or); }},
            {ALT: (): void => { this.CONSUME(Tokens.And); }}
        ]);
    });
    // comparisonOperator
    //      Equal | NotEqual | LessThan | LessThanOrEqual | GreaterThan | GreaterThanOrEqual | Matches | NotMatches
    private comparisonOperator: IRule<void> = this.RULE('comparisonOperator', (): void => {
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
    //      RegExpLiteral | Identifier | String | Integer | value
    private filterValue: IRule<void> = this.RULE('filterValue', (): void => {
        this.OR([
            {ALT: (): void => { this.CONSUME(Tokens.RegExpLiteral); }},
            {ALT: (): void => { this.CONSUME(Tokens.Identifier); }},
            {ALT: (): void => { this.CONSUME(Tokens.String); }},
            {ALT: (): void => { this.CONSUME(Tokens.Integer); }},
            // {ALT: (): void => { this.SUBRULE(this.value); }},
            {ALT: (): void => { this.SUBRULE(this.nestedInspect); }}
        ]);
    });

    // nestedInspect
    //      LCurly Inspect? RCurly
    private nestedInspect: IRule<void> = this.RULE('nestedInspect', (): void => {
        this.CONSUME(Tokens.LCurly);
        this.OPTION((): void => { this.SUBRULE(this.inspectStatement); });
        this.CONSUME(Tokens.RCurly);
    });

    constructor () {
        super(allTokens, {outputCst: true});
        JsonInspectParser.performSelfAnalysis(this);
    }

    public execute (tokens: IToken[]): CstNode | CstNode[] {
        this.input = tokens;
        return <CstNode | CstNode[]> <any> this.inspect();
    }
}
