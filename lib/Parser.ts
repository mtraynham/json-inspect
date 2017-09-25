import {IRule, IToken, Parser as ChevrotainParser} from 'chevrotain';
import allTokens, {
    Colon,
    Comma,
    False,
    LCurly,
    LSquare,
    Null,
    NumberLiteral,
    RCurly,
    RSquare,
    StringLiteral,
    True
} from './tokens';

export default class Parser extends ChevrotainParser {
    private inspect: IRule = this.RULE('inspect', (): void => {
        this.OR([
            {ALT: (): void => { this.SUBRULE(this.object); }},
            {ALT: (): void => { this.SUBRULE(this.array); }}
        ]);
    });
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
    private objectItem: IRule = this.RULE('objectItem', (): void => {
        this.CONSUME(StringLiteral);
        this.CONSUME(Colon);
        this.SUBRULE(this.value);
    });
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

    constructor () {
        super ([], allTokens);
        Parser.performSelfAnalysis(this);
    }

    public parse (tokens: IToken[]): Object {
        this.input = tokens;
        return <Object> <any> this.inspect();
    }
}
