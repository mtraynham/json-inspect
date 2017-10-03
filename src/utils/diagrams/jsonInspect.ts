import createDiagram from '../createDiagram';

import JsonInspectParser from '../../parsers/JsonInspectParser';
const jsonInspectParser: JsonInspectParser = new JsonInspectParser();
createDiagram(jsonInspectParser);
