import {IProperty, ITestCase, ITestResultDocument, ITestSuite, ITestPlan} from "./abstract";
import { ITaskItem } from "../ui/testPropertiesList";

export function isJunitXml(document: Document) : boolean {
    return (document && document.firstElementChild && (document.firstElementChild.tagName === "testsuites" || document.firstElementChild.tagName === "testsuite"))
}

export class JunitProperty implements IProperty {
    name: string;
    value: string;
    constructor(element: Element){
        this.name = element.getAttribute('name');
        this.value = element.getAttribute('value');
    }
}

export class JunitTestSuite implements ITestSuite {
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
                value: this.element.getAttribute("hostname"),
                iconName: "TestPlan",
                name: "Hostname"
            },
            {
                value: this.element.getAttribute("package"),
                iconName: "TestPlan",
                name: "Package"
            },
            {
                value: this.element.getAttribute("tests"),
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
                    results.push(new JunitProperty(el));
                }
            }
        }
        return results;
    }
}


export class JunitTestCase implements ITestCase {
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
            value: this.element.getAttribute("classname"),
            iconName: "TestStep",
            name: "Class"
        },
        {
            value: this.element.getAttribute("status"),
            iconName: "TestAutoSolid",
            name: "Status"
        },
        {
            value: this.element.getElementsByTagName('skipped').length > 0 ? this.element.getElementsByTagName('skipped')[0].getAttribute('message') : null,
            iconName: "TestAutoSolid",
            name: "Skipped Message"
        },
        {
            value: this.element.getElementsByTagName('error').length > 0 ? this.element.getElementsByTagName('error')[0].getAttribute('message') : null,
            iconName: "TestAutoSolid",
            name: "Error Message"
        },
        ,
        {
            value: this.element.getElementsByTagName('failure').length > 0 ? this.element.getElementsByTagName('failure')[0].getAttribute('message') : null,
            iconName: "TestAutoSolid",
            name: "Failure Message"
        }
        ]
    };

    getTestSuite(): ITestSuite {
        return new JunitTestSuite(this.element.parentElement);
    }

    getProperties(): Array<IProperty> {
        let results = new Array();
        if (this.element.getElementsByTagName('property').length == 0)
            return results;
        // @ts-ignore
        for (let el of this.element.getElementsByTagName('property')) {
            results.push(new JunitProperty(el));
        }
        return results;
    }

    hasOutput(): boolean {
        return (this.element.getElementsByTagName('system-out') !== undefined && this.element.getElementsByTagName('system-out').length > 0);
    }

    getOutput(): string {
        return this.element.getElementsByTagName('system-out')[0].textContent;
    }
}

export class JunitXMLDocument implements ITestResultDocument {
    document: XMLDocument;
    constructor(document: XMLDocument){
        if (!isJunitXml(document))
            throw new DOMException("Invalid JUnit XML document", document.firstElementChild.tagName);

        this.document = document;
    }

    getPropertiesList(): ITaskItem[] {
        return [{
            value: "JUnit XML Result",
            iconName: "TestPlan",
            name: "Type"
        }];
    };

    getPlan(): JunitTestPlan {
        return new JunitTestPlan(this.document.getElementsByTagName('testsuites')[0]);
    }

    getCases(): NodeListOf<Element> {
        return this.document.getElementsByTagName('testcase');
    }

    getCase(name: string): ITestCase {
        // @ts-ignore
        for (let testCase of this.getCases()) {
            const caseName: string = testCase.getAttribute('name');
            if (caseName === name) {
                return new JunitTestCase(testCase);
            }
        }
    }
}

export class JunitTestPlan implements ITestPlan {
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
                value: this.element.getAttribute("tests"),
                iconName: "NumberSymbol",
                name: "Tests"
            },
            {
                value: this.element.getAttribute("failures"),
                iconName: "NumberSymbol",
                name: "Failures"
            },
            {
                value: this.element.getAttribute("time"),
                iconName: "NumberSymbol",
                name: "Time"
            },
        ];
    }
}