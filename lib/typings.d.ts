import * as chevrotain from 'chevrotain';
declare module 'chevrotain' {
    export type IRule = <T>(idxInCallingRule?: number, ...args: any[]) => T | any;
    // TODO: type annotation should be after type name
    // export type IRule<T> = (idxInCallingRule?: number, ...args: any[]) => T | any;
}

import {ILexingResult, Lexer} from 'chevrotain';
import Parser from './Parser';
export interface IJsonInspectResult {
    lexer: Lexer;
    lexingResult: ILexingResult;
    parser: Parser;
    parserResult: Object;
}
