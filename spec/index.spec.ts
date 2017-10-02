import jsonInspect from '../index';
import {IJsonInspectResult} from '../lib/typings';

describe('jsonInspect', () => {
    describe ('Parser', () => {
        function validate ({name, inputText}: {name: string, inputText: string}): void {
            it (name, () => {
                const jsonInspectResult: IJsonInspectResult = jsonInspect(inputText);
                expect(jsonInspectResult.lexingResult.errors.length).toBe(0, jsonInspectResult.lexingResult.errors);
                expect(jsonInspectResult.parser.errors.length).toBe(0, jsonInspectResult.parser.errors);
            });
        }
        const tests: {name: string, inputText: string}[] = [
            {name: 'simple selector', inputText: 'items[id=1].name'},
            {name: 'nested selector', inputText: 'items[*country="NZ"].name'},
            {name: 'function selector', inputText: 'items[*]'}
            // {name: 'function selector', inputText: 'items[*][*stars>=3]'},
            // {name: 'function selector', inputText: '[* stars >= 3 & stars <= 10]'},
            // {name: 'function selector', inputText: 'items[*][*stars:gte(3)]'},
            // {name: 'function selector', inputText: 'items[*][*:isCool()]'},
            // {name: 'simple selector', inputText: 'items[*name!~/^t/i].name'},
            // {name: 'nested selector', inputText: 'items[*name!~test].name'},
            // {name: 'function selector', inputText: 'items[*name!~{param}].name'},
            // {name: 'function selector', inputText: ' items[id=1]\n  .name '},
            // {name: 'function selector', inputText: ' items[id=1]\\n  .name:not '},
            // {name: 'function selector', inputText: '.title|.value.name'},
            // {name: 'function selector', inputText: 'items[id=?].name'},
            // {name: 'function selector', inputText: 'items[parent_id={workitem.id}].name'},
            // {name: 'function selector', inputText: '.name:titleize'},
            // {name: 'function selector', inputText: '.name:titleize(test,1)'},
            // {name: 'function selector', inputText: '.name:titleize(test,{.name})'},
            // {name: 'function selector', inputText: '.name:titleize(test,{.name:filter(3)})'},
            // {name: 'function selector', inputText: '.name:split(,)'},
            // {name: 'function selector', inputText: 'items[id={.id}].name'},
            // {name: 'function selector', inputText: 'items[parent_id={workitems[{.id}=?]}].contacts[?={.items[?]}].name'},
            // {name: 'function selector', inputText: ':filter/subfilter'}
        ];
        tests.forEach(validate);
    });
});
