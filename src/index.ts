import {CstNode, ILexingResult} from 'chevrotain';
import lexer from './lexer';
import JsonInspectParser from './parsers/JsonInspectParser';
import {IJsonInspectResult} from './typings';
import JsonInspectVisitor from './visitor/JsonInspectVisitor';

const parser: JsonInspectParser = new JsonInspectParser();
const visitor: JsonInspectVisitor = new JsonInspectVisitor();
export default function jsonInspect (text: string): IJsonInspectResult  {
    const lexingResult: ILexingResult = lexer.tokenize(text);
    const cstNodes: CstNode | CstNode[] = parser.execute(lexingResult.tokens);
    const jsonInspectFn: (...args: any[]) => any = visitor.visit(cstNodes);
    return {
        lexer,
        lexingResult,
        parser,
        cstNodes,
        jsonInspectFn
    };
}
