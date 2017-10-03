import {CstNode, IMultiModeLexerDefinition, IParserConfig, IToken, Parser, TokenConstructor} from 'chevrotain';

export default abstract class ReusableChevrotainParser extends Parser {
    constructor (tokensDictionary: {[fqn: string]: TokenConstructor} | TokenConstructor[] | IMultiModeLexerDefinition,
                 config?: IParserConfig) {
        super ([], tokensDictionary, config);
    }

    public abstract execute (tokens: IToken[]): CstNode | CstNode[];
}
