import jsonInspect from '../index';
import {IJsonInspectResult} from '../lib/typings';

describe('jsonInspect', () => {
    it ('Parser', () => {
        function validate ({name, inputText}: {name: string, inputText: string}): void {
            it (name, () => {
                const jsonInspectResult: IJsonInspectResult = jsonInspect(inputText);
                expect(jsonInspectResult.lexingResult.errors.length).toBe(0);
                expect(jsonInspectResult.parser.errors.length).toBe(0);
            });
        }
        const tests: {name: string, inputText: string}[] = [
            {name: 'should handle simple text', inputText: ':foo('}
        ];
        tests.forEach(validate);
    });
});
