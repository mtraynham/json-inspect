import {ICstVisitor} from 'chevrotain';
import JsonInspectParser from '../parsers/JsonInspectParser';

const instance: JsonInspectParser = new JsonInspectParser();
const cstConstructor: new (...args: any[]) => ICstVisitor<void, (...args: any[]) => any> =
    // instance.getBaseCstVisitorConstructor();
    instance.getBaseCstVisitorConstructorWithDefaults();

class JsonInspectVisitor extends cstConstructor {
    constructor () {
        super();
        this.validateVisitor();
    }
}

export default JsonInspectVisitor;
