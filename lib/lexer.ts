import {Lexer} from 'chevrotain';
import allTokens from './tokens';

const lexer: Lexer = new Lexer(allTokens);
export default lexer;
