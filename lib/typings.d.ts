import * as chevrotain from 'chevrotain';
declare module 'chevrotain' {
    export type IRule = <T>(idxInCallingRule?: number, ...args: any[]) => T | any;

    // export class Parser {
    //     protected CONSUME<T>(ruleToCall: (idx: number) => T, args?: any[]): T;
    //     protected CONSUME1<T>(ruleToCall: (idx: number) => T, args?: any[]): T;
    //     protected CONSUME2<T>(ruleToCall: (idx: number) => T, args?: any[]): T;
    //     protected CONSUME3<T>(ruleToCall: (idx: number) => T, args?: any[]): T;
    //     protected CONSUME4<T>(ruleToCall: (idx: number) => T, args?: any[]): T;
    //     protected CONSUME5<T>(ruleToCall: (idx: number) => T, args?: any[]): T;
    // }
}
