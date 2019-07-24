export function isNunitXml(document: Document) : boolean {
    return (document.firstElementChild.tagName === "test-run")
}

export class NunitProperty {
    name: string;
    value: string;
    constructor(element: Element){
        this.name = element.getAttribute('name');
        this.value = element.getAttribute('value');
    }
}

export class NunitTestSuite {
    element: Element;
    constructor(element: Element){
        this.element = element;
    }

    getProperties() : Array<NunitProperty> {
        let results = new Array();
        // @ts-ignore
        for (let el of this.element.getElementsByTagName('property')) {
            results.push(new NunitProperty(el));
        }
        return results;
    }
}


export class NunitTestCase {
    element: Element;
    constructor(element: Element){
        this.element = element;
    }

    getTestSuite() : NunitTestSuite {
        return new NunitTestSuite(this.element.parentElement);
    }

    getProperties() : Array<NunitProperty> {
        let results = new Array();
        // @ts-ignore
        for (let el of this.element.getElementsByTagName('property')) {
            results.push(new NunitProperty(el));
        }
        return results;
    }

    getOutput() : string {
        return this.element.getElementsByTagName('output')[0].textContent;
    }
}

export class NunitXMLDocument {
    document: XMLDocument;
    constructor(document: XMLDocument){
        if (!isNunitXml(document))
            throw new DOMException("Invalid NUnit XML document", document.firstElementChild.tagName);

        this.document = document;
    }

    private getCases() : NodeListOf<Element> {
        return this.document.getElementsByTagName('test-case');
    }

    getCase(name: string) :NunitTestCase {
        // @ts-ignore
        for (let testCase of this.getCases()) {
            const caseName: string = testCase.getAttribute('name');
            if (caseName === name) {
                return new NunitTestCase(testCase);
            }
        }
    }
}