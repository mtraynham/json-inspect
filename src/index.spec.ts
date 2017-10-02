import {exceptions, ILexingError, IToken} from 'chevrotain';
import jsonInspect from '../index';
import {IJsonInspectResult} from './typings';

describe('jsonInspect', () => {
    describe ('Parser', () => {
        function validate ({name, inputText, tokens}: {name: string, inputText: string, tokens: string[]}): void {
            test (name, (): void => {
                const {lexingResult, parser}: IJsonInspectResult = jsonInspect(inputText);
                const lexingErrors: ILexingError[] = lexingResult.errors;
                expect(lexingErrors.length).toBe(0);
                const lexingTokens: string[] = lexingResult.tokens.map((token: IToken) => token.image);
                expect(lexingTokens).toEqual(tokens);
                const parserErrors: exceptions.IRecognitionException[] = parser.errors;
                expect(parserErrors.length).toBe(0);
            });
        }
        const tests: {name: string, inputText: string, tokens: string[]}[] = [
            {
                name: 'simple selector',
                inputText: 'items[id=1].name',
                tokens: ['items', '[', 'id', '=', '1', ']', '.', 'name']
            },
            {
                name: 'nested selector',
                inputText: 'items[*country="NZ"].name',
                tokens: ['items', '[', '*', 'country', '=', '"NZ"', ']', '.', 'name']
            },
            {
                name: 'function selector',
                inputText: 'items[*]',
                tokens: ['items', '[', '*', ']']
            },
            {
                name: 'function selector',
                inputText: 'items[*][*stars>=3]',
                tokens: ['items', '[', '*', ']', '[', '*', 'stars', '>=', '3', ']']
            },
            {
                name: 'function selector',
                inputText: '[* stars >= 3 & stars <= 10]',
                tokens: ['[', '*', 'stars', '>=', '3', '&', 'stars', '<=', '10', ']']
            },
            {
                name: 'function selector',
                inputText: 'items[*][*stars:gte(3)]',
                tokens: ['items', '[', '*', ']', '[', '*', 'stars', ':', 'gte', '(', '3', ')', ']']
            },
            {
                name: 'function selector',
                inputText: 'items[*][*:isCool]',
                tokens: ['items', '[', '*', ']', '[', '*', ':', 'isCool', ']']
            },
            {
                name: 'simple selector',
                inputText: 'items[*name!~/^t/i].name',
                tokens: ['items', '[', '*', 'name', '!~', '/^t/i', ']', '.', 'name']
            },
            {
                name: 'nested selector',
                inputText: 'items[*name!~test].name',
                tokens: ['items', '[', '*', 'name', '!~', 'test', ']', '.', 'name']
            },
            {
                name: 'function selector',
                inputText: 'items[*name!~{param}].name',
                tokens: ['items', '[', '*', 'name', '!~', '{', 'param', '}', ']', '.', 'name']
            },
            {
                name: 'whitespace',
                inputText: ' items[id=1]\n  .name ',
                tokens: ['items', '[', 'id', '=', '1', ']', '.', 'name']
            },
            {
                name: 'whitespace 2',
                inputText: ' items[id=1]\n  .name:not ',
                tokens: ['items', '[', 'id', '=', '1', ']', '.', 'name', ':', 'not']
            },
            {
                name: 'OR operator',
                inputText: '.title|.value.name',
                tokens: ['.', 'title', '|', '.', 'value', '.', 'name']
            },
            {
                name: 'function selector',
                inputText: 'items[id=?].name',
                tokens: ['items', '[', 'id', '=', '?', ']', '.', 'name']
            },
            {
                name: 'function selector',
                inputText: 'items[parent_id={workitem.id}].name',
                tokens: ['items', '[', 'parent_id', '=', '{', 'workitem', '.', 'id', '}', ']', '.', 'name']
            },
            {
                name: 'function selector',
                inputText: '.name:titleize',
                tokens: ['.', 'name', ':', 'titleize']
            },
            {
                name: 'function selector',
                inputText: '.name:titleize(test,1)',
                tokens: ['.', 'name', ':', 'titleize', '(', 'test', ',', '1', ')']
            },
            {
                name: 'function selector',
                inputText: '.name:titleize(test,{.name})',
                tokens: ['.', 'name', ':', 'titleize', '(', 'test', ',', '{', '.', 'name', '}', ')']
            },
            {
                name: 'function selector',
                inputText: '.name:titleize(test,{.name:filter(3)})',
                tokens: ['.', 'name', ':', 'titleize', '(', 'test', ',', '{', '.', 'name', ':', 'filter', '(', '3', ')', '}', ')']
            },
            {
                name: 'function selector',
                inputText: '.name:split(,)',
                tokens: ['.', 'name', ':', 'split', '(', ',', ')']
            },
            {
                name: 'function selector',
                inputText: 'items[id={.id}].name',
                tokens: ['items', '[', 'id', '=', '{', '.', 'id', '}', ']', '.', 'name']
            },
            {
                name: 'function selector',
                inputText: 'items[parent_id={workitems[{.id}=?]}].contacts[?={.items[?]}].name',
                tokens: ['items', '[', 'parent_id', '=', '{', 'workitems', '[', '{', '.', 'id', '}', '=', '?', ']', '}', ']',
                    '.', 'contacts', '[', '?', '=', '{', '.', 'items', '[', '?', ']', '}', ']', '.', 'name']
            },
            {
                name: 'function selector',
                inputText: ':filter/subfilter',
                tokens: [':', 'filter', '/', 'subfilter']
            }
        ];
        tests.forEach(validate);
    });
});
