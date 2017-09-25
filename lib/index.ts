import {ILexingResult, Lexer} from 'chevrotain';
import lexer from './lexer';
import Parser from './Parser';

export interface IJsonInspectResult {
    lexer: Lexer;
    lexingResult: ILexingResult;
    parser: Parser;
    parserResult: Object;
}

const parser: Parser = new Parser();
export default function jsonInspect (text: string): IJsonInspectResult  {
    const lexingResult: ILexingResult = lexer.tokenize(text);
    parser.input = lexingResult.tokens;
    const parserResult: Object = parser.inspect();
    return {
        lexer,
        lexingResult,
        parser,
        parserResult
    };
}
