import {ILexingResult} from 'chevrotain';
import lexer from './lexer';
import Parser from './Parser';
import {IJsonInspectResult} from './typings';

const parser: Parser = new Parser();
export default function jsonInspect (text: string): IJsonInspectResult  {
    const lexingResult: ILexingResult = lexer.tokenize(text);
    const parserResult: Object = parser.parse(lexingResult.tokens);
    return {
        lexer,
        lexingResult,
        parser,
        parserResult
    };
}
