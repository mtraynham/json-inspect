import * as chevrotain from 'chevrotain';
declare module 'chevrotain' {
    export type IRule<T> = (idxInCallingRule?: number, ...args: any[]) => T | any;
}

import {CstNode, ILexingResult, Lexer, Parser} from 'chevrotain';
export interface IJsonInspectResult {
    lexer: Lexer;
    lexingResult: ILexingResult;
    parser: Parser;
    cstNodes: CstNode | CstNode[];
    jsonInspectFn (...args: any[]): any;
}
