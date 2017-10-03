import {IRule} from 'chevrotain';
import * as Tokens from '../tokens';
import ReusableChevrotainParser from './ReusableChevrotainParser';

export default abstract class JsonParser extends ReusableChevrotainParser {
    // json
    //      object | array
    public json: IRule<void> = this.RULE('json', (): void => {
        this.OR([
            {ALT: (): void => { this.SUBRULE(this.object); }},
            {ALT: (): void => { this.SUBRULE(this.array); }}
        ]);
    });
    // object
    //      LCurly objectItem? (Comma objectItem)* RCurly
    protected object: IRule<void> = this.RULE('object', (): void => {
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
    protected objectItem: IRule<void> = this.RULE('objectItem', (): void => {
        this.CONSUME(Tokens.StringLiteral);
        this.CONSUME(Tokens.Colon);
        this.SUBRULE(this.value);
    });
    // array
    //      LSquare value? (Comma value)* RSqaure
    protected array: IRule<void> = this.RULE('array', (): void => {
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
    protected value: IRule<void> = this.RULE('value', (): void => {
        this.OR([
            {ALT: (): void => { this.CONSUME(Tokens.Identifier); }},
            {ALT: (): void => { this.CONSUME(Tokens.StringLiteral); }},
            {ALT: (): void => { this.CONSUME(Tokens.Integer); }},
            {ALT: (): void => { this.CONSUME(Tokens.NumberLiteral); }},
            {ALT: (): void => { this.SUBRULE(this.object); }},
            {ALT: (): void => { this.SUBRULE(this.array); }},
            {ALT: (): void => { this.CONSUME(Tokens.True); }},
            {ALT: (): void => { this.CONSUME(Tokens.False); }},
            {ALT: (): void => { this.CONSUME(Tokens.Null); }}
        ]);
    });
}
