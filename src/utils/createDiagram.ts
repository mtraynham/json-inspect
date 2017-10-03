import {gast, Parser} from 'chevrotain';
import {buildSyntaxDiagramsText} from 'chevrotain/diagrams/src/diagrams_builder';
import {serializeGrammarToFile} from 'chevrotain/diagrams/src/diagrams_serializer';
import {writeFile} from 'fs';
// tslint:disable-next-line:no-require-imports
import open = require('open');
import {resolve} from 'path';
import {tmpName} from 'tmp';

type DiagramsTextBuilder = (serializedGasts: gast.ISerializedGast[]) => string;

export default function createDiagram (parserInstance: Parser): void {
    const links: string[] = [
        resolve(__dirname, '../../node_modules/chevrotain/diagrams/diagrams.css')
    ];
    const scripts: string[] = [
        resolve(__dirname, '../../node_modules/chevrotain/diagrams/src/diagrams_behavior.js')
    ];
    const serializedGasts: gast.ISerializedGast[] = parserInstance.getSerializedGastProductions();
    const innerHtml: string = (<DiagramsTextBuilder> buildSyntaxDiagramsText)(serializedGasts);
    // tslint:disable-next-line:no-multiline-string
    const html: string = `
        <!DOCTYPE html>
        <meta charset="utf-8">
        <head>
            ${links.map((link: string) => `<link rel='stylesheet' href="${link}"/>`).join('\n\t')}
        </head>
        <body>
            <div id="diagrams" align="center">
                ${innerHtml}
            </div>
            ${scripts.map((script: string) => `<script src="${script}"></script>`).join('\n\t')}

            <script type="text/javascript">
                diagrams_behavior.initDiagramsBehavior();
            </script>
        </body>
    `;
    tmpName({postfix: '.html'}, (tmpNameError: Error, path: string): void => {
        writeFile(path, html, (): void => {
            open(path);
        });
    });
}
