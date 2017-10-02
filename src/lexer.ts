import {Lexer} from 'chevrotain';
import * as Tokens from './tokens';

const lexer: Lexer = new Lexer(Object.values(Tokens));
export default lexer;
