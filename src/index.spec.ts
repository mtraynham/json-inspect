import {exceptions, ILexingError, IToken} from 'chevrotain';
import jsonInspect from './index';
import {IJsonInspectResult} from './typings';

interface IJsonInspectTest {
    name: string;
    inputText: string;
    expectedTokens: string[];
}

describe('jsonInspect', () => {
    function validate ({name, inputText, expectedTokens}: IJsonInspectTest): void {
        test (name, (): void => {
            const {
                lexingResult,
                parser
            }: IJsonInspectResult = jsonInspect(inputText);
            const lexingErrors: ILexingError[] = lexingResult.errors;
            expect(lexingErrors.length).toBe(0);
            const lexingTokens: string[] = lexingResult.tokens.map((token: IToken) => token.image);
            expect(lexingTokens).toEqual(expectedTokens);
            const parserErrors: exceptions.IRecognitionException[] = parser.errors;
            expect(parserErrors.length).toBe(0);
        });
    }
    const tests: IJsonInspectTest[] = [
        {
            name: 'function selector',
            inputText: ':function',
            expectedTokens: [':', 'function']
        },
        {
            name: 'function with argument selector',
            inputText: ':function(3)',
            expectedTokens: [':', 'function', '(', '3', ')']
        },
        {
            name: 'selector matching one condition and get path',
            inputText: 'items[id=1].name',
            expectedTokens: ['items', '[', 'id', '=', '1', ']', '.', 'name']
        },
        {
            name: 'array selector matching one condition and get path',
            inputText: 'items[*country=NZ].name',
            expectedTokens: ['items', '[', '*', 'country', '=', 'NZ', ']', '.', 'name']
        },
        {
            name: 'array selector',
            inputText: 'items[*]',
            expectedTokens: ['items', '[', '*', ']']
        },
        {
            name: 'selector matching single condition',
            inputText: 'items[*][*stars>=3]',
            expectedTokens: ['items', '[', '*', ']', '[', '*', 'stars', '>=', '3', ']']
        },
        {
            name: 'selector matching multiple conditions',
            inputText: '[* stars >= 3 & stars <= 10]',
            expectedTokens: ['[', '*', 'stars', '>=', '3', '&', 'stars', '<=', '10', ']']
        },
        {
            name: 'selector matching function',
            inputText: 'items[*][*:isCool]',
            expectedTokens: ['items', '[', '*', ']', '[', '*', ':', 'isCool', ']']
        },
        {
            name: 'selector matching function with argument',
            inputText: 'items[*][*stars:gte(3)]',
            expectedTokens: ['items', '[', '*', ']', '[', '*', 'stars', ':', 'gte', '(', '3', ')', ']']
        },
        {
            name: 'not regex array filter matching regex',
            inputText: 'items[*name!~/^t/i].name',
            expectedTokens: ['items', '[', '*', 'name', '!~', '/^t/i', ']', '.', 'name']
        },
        {
            name: 'not regex array filter matching text',
            inputText: 'items[*name!~test].name',
            expectedTokens: ['items', '[', '*', 'name', '!~', 'test', ']', '.', 'name']
        },
        {
            name: 'regex filter with reference replacement',
            inputText: 'items[*name!~{param}].name',
            expectedTokens: ['items', '[', '*', 'name', '!~', '{', 'param', '}', ']', '.', 'name']
        },
        {
            name: 'whitespace',
            inputText: ' items[id=1]\n  .name ',
            expectedTokens: ['items', '[', 'id', '=', '1', ']', '.', 'name']
        },
        {
            name: 'whitespace 2',
            inputText: ' items[id=1]\n  .name:not ',
            expectedTokens: ['items', '[', 'id', '=', '1', ']', '.', 'name', ':', 'not']
        },
        {
            name: 'OR operator',
            inputText: '.title|.value.name',
            expectedTokens: ['.', 'title', '|', '.', 'value', '.', 'name']
        },
        {
            name: 'filter with params',
            inputText: 'items[id=?].name',
            expectedTokens: ['items', '[', 'id', '=', '?', ']', '.', 'name']
        },
        {
            name: 'filter with replacement',
            inputText: 'items[parent_id={workitem.id}].name',
            expectedTokens: ['items', '[', 'parent_id', '=', '{', 'workitem', '.', 'id', '}', ']', '.', 'name']
        },
        {
            name: 'function no arguments',
            inputText: '.name:titleize',
            expectedTokens: ['.', 'name', ':', 'titleize']
        },
        {
            name: 'function arguments',
            inputText: '.name:titleize(test,1)',
            expectedTokens: ['.', 'name', ':', 'titleize', '(', 'test', ',', '1', ')']
        },
        {
            name: 'function argument with reference replacement',
            inputText: '.name:titleize(test,{.name})',
            expectedTokens: ['.', 'name', ':', 'titleize', '(', 'test', ',', '{', '.', 'name', '}', ')']
        },
        {
            name: 'function argument with reference replacement & function',
            inputText: '.name:titleize(test,{.name:filter(3)})',
            expectedTokens: ['.', 'name', ':', 'titleize', '(', 'test', ',', '{', '.', 'name', ':', 'filter', '(', '3', ')', '}', ')']
        },
        {
            name: 'function argument',
            inputText: '.name:split(,)',
            expectedTokens: ['.', 'name', ':', 'split', '(', ',', ')']
        },
        {
            name: 'filter with reference replacement',
            inputText: 'items[id={.id}].name',
            expectedTokens: ['items', '[', 'id', '=', '{', '.', 'id', '}', ']', '.', 'name']
        },
        {
            name: 'all features',
            inputText: 'items[parent_id={workitems[{.id}=?]}].contacts[?={.items[?]}].name',
            expectedTokens: ['items', '[', 'parent_id', '=', '{', 'workitems', '[', '{', '.', 'id', '}', '=', '?', ']', '}', ']',
                '.', 'contacts', '[', '?', '=', '{', '.', 'items', '[', '?', ']', '}', ']', '.', 'name']
        },
        {
            name: 'subfilter',
            inputText: ':filter/subfilter',
            expectedTokens: [':', 'filter', '/', 'subfilter']
        }
    ];
    tests.forEach(validate);
});
