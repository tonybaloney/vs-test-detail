import {IProperty, ITestCase, ITestResultDocument, ITestSuite} from "./abstract";
import { ITaskItem } from "../ui/testPropertiesList";

export function isNunitXml(document: Document) : boolean {
    return (document && document.firstElementChild && document.firstElementChild.tagName === "test-run")
}

export class NunitProperty implements IProperty {
    name: string;
    value: string;
    constructor(element: Element){
        this.name = element.getAttribute('name');
        this.value = element.getAttribute('value');
    }
}

export class NunitTestSuite implements ITestSuite {
    element: Element;
    name: string;
    runState: string;

    constructor(element: Element){
        this.element = element;
        this.name = element.getAttribute("name");
        this.runState = element.getAttribute("runstate");
    }

    getPropertiesList(): ITaskItem[] {
        return [
            {
                value: this.name,
                iconName: "TestPlan",
                name: "Name"
            },
            {
                value: this.element.getAttribute("fullname"),
                iconName: "TestPlan",
                name: "Full Name"
            },
            {
                value: this.element.getAttribute("type"),
                iconName: "TestPlan",
                name: "Type"
            },
            {
                value: this.element.getAttribute("methodname"),
                iconName: "TestStep",
                name: "Method"
            },
            {
                value: this.element.getAttribute("classname"),
                iconName: "TestStep",
                name: "Class"
            },
            {
                value: this.element.getAttribute("runstate"),
                iconName: "TestAutoSolid",
                name: "Run State"
            },
            {
                value: this.element.getAttribute("testcasecount"),
                iconName: "NumberSymbol",
                name: "Test Cases"
            },
            ];
    }

    getProperties(): Array<IProperty> {
        let results = new Array();
        // @ts-ignore
        for (let child of this.element.childNodes) {
            if (child.nodeName === "properties") {
                for (let el of child.getElementsByTagName('property')) {
                    results.push(new NunitProperty(el));
                }
            }
        }
        return results;
    }
}


export class NunitTestCase implements ITestCase {
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
            value: this.element.getAttribute("fullname"),
            iconName: "TestPlan",
            name: "Full Name"
        },
        {
            value: this.element.getAttribute("methodname"),
            iconName: "TestStep",
            name: "Method"
        },
        {
            value: this.element.getAttribute("classname"),
            iconName: "TestStep",
            name: "Class"
        },
        {
            value: this.element.getAttribute("seed"),
            iconName: "NumberSymbol",
            name: "Seed"
        },
        {
            value: this.element.getAttribute("runstate"),
            iconName: "TestAutoSolid",
            name: "Run State"
        }
        ]
    };

    getTestSuite(): ITestSuite {
        return new NunitTestSuite(this.element.parentElement);
    }

    getProperties(): Array<IProperty> {
        let results = new Array();
        // @ts-ignore
        for (let el of this.element.getElementsByTagName('property')) {
            results.push(new NunitProperty(el));
        }
        return results;
    }

    hasOutput(): boolean {
        return (this.element.getElementsByTagName('output') !== undefined && this.element.getElementsByTagName('output').length > 0);
    }

    getOutput(): string {
        return this.element.getElementsByTagName('output')[0].textContent;
    }
}

export class NunitXMLDocument implements ITestResultDocument {
    document: XMLDocument;
    constructor(document: XMLDocument){
        if (!isNunitXml(document))
            throw new DOMException("Invalid NUnit XML document", document.firstElementChild.tagName);

        this.document = document;
    }

    getPropertiesList(): ITaskItem[] {
        return [];
    };

    getCases(): NodeListOf<Element> {
        return this.document.getElementsByTagName('test-case');
    }

    getCase(name: string): ITestCase {
        // @ts-ignore
        for (let testCase of this.getCases()) {
            const caseName: string = testCase.getAttribute('name');
            if (caseName === name) {
                return new NunitTestCase(testCase);
            }
        }
    }
}