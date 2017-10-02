import * as chevrotain from 'chevrotain';
declare module 'chevrotain' {
    export type IRule<T> = (idxInCallingRule?: number, ...args: any[]) => T | any;
}

import {ILexingResult, Lexer, Parser} from 'chevrotain';
export interface IJsonInspectResult {
    lexer: Lexer;
    lexingResult: ILexingResult;
    parser: Parser;
    parserResult: Object;
}
