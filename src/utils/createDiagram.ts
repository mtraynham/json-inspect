import {createSyntaxDiagramsCode, gast, Parser} from 'chevrotain';
import {buildSyntaxDiagramsText} from 'chevrotain/diagrams/src/diagrams_builder';
import {serializeGrammarToFile} from 'chevrotain/diagrams/src/diagrams_serializer';
import {writeFile} from 'fs';
// tslint:disable-next-line:no-require-imports
import open = require('open');
import {tmpName} from 'tmp';

export default function createDiagram (parserInstance: Parser): void {
    const serializedGasts: gast.ISerializedGast[] = parserInstance.getSerializedGastProductions();
    const html: string = createSyntaxDiagramsCode(serializedGasts);
    tmpName({postfix: '.html'}, (tmpNameError: Error, path: string): void => {
        writeFile(path, html, (): void => {
            open(path);
        });
    });
}
