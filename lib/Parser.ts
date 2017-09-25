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
    public inspect: IRule = this.RULE('inspect', () =>
        this.OR([
            {ALT: (): IRule => this.SUBRULE(this.object)},
            {ALT: (): IRule => this.SUBRULE(this.array)}
        ]));
    private object: IRule = this.RULE('object', () => {
        this.CONSUME(LCurly);
        this.OPTION(() => {
            this.SUBRULE(this.objectItem);
            this.MANY(() => {
                this.CONSUME(Comma);
                this.SUBRULE2(this.objectItem);
            });
        });
        this.CONSUME(RCurly);
    });
    private objectItem: IRule = this.RULE('objectItem', () => {
        this.CONSUME(StringLiteral);
        this.CONSUME(Colon);
        // this.CONSUME(this.value);
    });
    private array: IRule = this.RULE('array', () => {
        this.CONSUME(LSquare);
        this.OPTION(() => {
            this.SUBRULE(this.value);
            this.MANY(() => {
                this.CONSUME(Comma);
                this.SUBRULE2(this.value);
            });
        });
        this.CONSUME(RSquare);
    });
    private value: IRule = this.RULE('value', () =>
        this.OR([
            {ALT: (): IRule | IToken => this.CONSUME(StringLiteral)},
            {ALT: (): IRule | IToken => this.CONSUME(NumberLiteral)},
            {ALT: (): IRule | IToken => this.SUBRULE(this.object)},
            {ALT: (): IRule | IToken => this.SUBRULE(this.array)},
            {ALT: (): IRule | IToken => this.CONSUME(True)},
            {ALT: (): IRule | IToken => this.CONSUME(False)},
            {ALT: (): IRule | IToken => this.CONSUME(Null)}
        ])
    );

    constructor (input: IToken[] = []) {
        super (input, allTokens);
        Parser.performSelfAnalysis(this);
    }
}
