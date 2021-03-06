import {IProperty, ITestCase, ITestResultDocument, ITestSuite, ITestPlan} from "./abstract";
import { ITaskItem } from "../ui/testPropertiesList";
import {JunitTestPlan} from "./junit";

export function isNunit2Xml(document: Document) : boolean {
    return (document && document.firstElementChild && document.firstElementChild.tagName === "test-results")
}

export class Nunit2Property implements IProperty {
    name: string;
    value: string;
    constructor(element: Element){
        this.name = element.getAttribute('name');
        this.value = element.getAttribute('value');
    }
}

export class Nunit2TestSuite implements ITestSuite {
    element: Element;
    name: string;
    runState: string;

    constructor(element: Element){
        this.element = element;
        this.name = element.getAttribute("name");
        this.runState = "";
    }
    
    getPropertiesList(): ITaskItem[] {
        return [
        {
            value: this.name,
            iconName: "TestPlan",
            name: "Name"
        },
        {
            value: this.element.getAttribute('description'),
            iconName: "TestPlan",
            name: "Description"
        },
        {
            value: this.element.getAttribute('executed'),
            iconName: "TestAutoSolid",
            name: "Executed"
        },
        {
            value: this.element.getAttribute('result'),
            iconName: "TestPlan",
            name: "Result"
        }
        ]
    };

    getProperties(): Array<IProperty> {
        let results = new Array();
        // @ts-ignore
        for (let child of this.element.childNodes) {
            if (child.nodeName === "properties") {
                for (let el of child.getElementsByTagName('property')) {
                    results.push(new Nunit2Property(el));
                }
            }
        }
        return results;
    }
}


export class Nunit2TestCase implements ITestCase {
    element: Element;
    name: string;

    constructor(element: Element){
        this.element = element;
        this.name = element.getAttribute("name");
    }

    getPropertiesList(): ITaskItem[] {
        return [
        {
            value: this.name,
            iconName: "TestPlan",
            name: "Name"
        },
        {
            value: this.element.getAttribute('description'),
            iconName: "TestPlan",
            name: "Description"
        },
        {
            value: this.element.getAttribute('executed'),
            iconName: "TestAutoSolid",
            name: "Executed"
        },
        {
            value: this.element.getAttribute('result'),
            iconName: "TestBeaker",
            name: "Result"
        }
        ]
    };

    getTestSuite(): ITestSuite {
        return new Nunit2TestSuite(this.element.parentElement.parentElement); // results->test-suite
    }

    getProperties(): Array<IProperty> {
        // No properties in NUnit 2
        return new Array();
    }

    hasOutput(): boolean {
        return false;
    }

    getOutput(): string {
        return "unsupported";
    }
}

export class Nunit2XMLDocument implements ITestResultDocument {
    document: XMLDocument;
    constructor(document: XMLDocument){
        if (!isNunit2Xml(document))
            throw new DOMException("Invalid NUnit 2 XML document", document.firstElementChild.tagName);

        this.document = document;
    }

    getPropertiesList(): ITaskItem[] {
        return [{
            value: "NUnit 3.0 XML Result",
            iconName: "TestPlan",
            name: "Type"
        }];
    };

    getPlan(): Nunit2TestPlan {
        return new Nunit2TestPlan(this.document.getElementsByTagName('test-results')[0]);
    }

    getCases(): NodeListOf<Element> {
        return this.document.getElementsByTagName('test-case');
    }

    getCase(name: string): ITestCase {
        // @ts-ignore
        for (let testCase of this.getCases()) {
            const caseName: string = testCase.getAttribute('name');
            if (caseName === name) {
                return new Nunit2TestCase(testCase);
            }
        }
    }
}

export class Nunit2TestPlan implements ITestPlan {
    element: Element;
    name: string;

    constructor(element: Element){
        this.element = element;
        this.name = element.getAttribute("name");
    }

    getPropertiesList(): ITaskItem[] {
        return [
            {
                value: this.name,
                iconName: "TestPlan",
                name: "Name"
            },
            {
                value: this.element.getAttribute('total'),
                iconName: "TestPlan",
                name: "Total"
            },
            {
                value: this.element.getAttribute('failures'),
                iconName: "TestAutoSolid",
                name: "Failures"
            },
            {
                value: this.element.getAttribute('time'),
                iconName: "NumberSymbol",
                name: "Time"
            }
        ]
    };
}