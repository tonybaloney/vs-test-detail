export function isNunitXml(document: Document) : boolean {
    return (document && document.firstElementChild && document.firstElementChild.tagName === "test-run")
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
    name: string;
    runState: string;

    constructor(element: Element){
        this.element = element;
        this.name = element.getAttribute("name");
        this.runState = element.getAttribute("runstate");
    }

    getProperties() : Array<NunitProperty> {
        let results = new Array();
        // @ts-ignore
        for (let child of this.element.childNodes){
            if (child.nodeName === "properties") {
                for (let el of child.getElementsByTagName('property')) {
                    results.push(new NunitProperty(el));
                }
            }
        }
        return results;
    }
}


export class NunitTestCase {
    element: Element;
    name: string;
    className: string;
    methodName: string;
    runState: string;
    seed: string;

    constructor(element: Element){
        this.element = element;
        this.name = element.getAttribute("name");
        this.className = element.getAttribute("classname");
        this.methodName = element.getAttribute("methodname");
        this.runState = element.getAttribute("runstate");
        this.seed = element.getAttribute("seed");
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