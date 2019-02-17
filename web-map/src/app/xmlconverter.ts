import { Parser, parseString } from 'xml2js';

export class XmlConverter {
    convert() {
        const parser = new Parser();
        parseString('<root>Hello xml2js!</root>', (err, result) => console.log('js:' + JSON.stringify(result)));
    }
}
