import {ILexingResult} from 'chevrotain';
import lexer from './lexer';
import JsonInspectParser from './parsers/JsonInspectParser';
import {IJsonInspectResult} from './typings';

const parser: JsonInspectParser = new JsonInspectParser();
export default function jsonInspect (text: string): IJsonInspectResult  {
    const lexingResult: ILexingResult = lexer.tokenize(text);
    const parserResult: Object = parser.execute(lexingResult.tokens);
    return {
        lexer,
        lexingResult,
        parser,
        parserResult
    };
}
