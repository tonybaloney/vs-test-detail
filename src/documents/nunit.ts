import {IProperty, ITestCase, ITestPlan, ITestResultDocument, ITestSuite} from "./abstract";
import { ITaskItem } from "../ui/testPropertiesList";
import {Nunit2TestPlan} from "./nunit2";

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
                value: this.element.getAttribute("label"),
                iconName: "TestPlan",
                name: "Docstring"
            },
            {
                value: this.element.getAttribute("duration"),
                iconName: "NumberSymbol",
                name: "Duration"
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
            value: this.element.getAttribute("label"),
            iconName: "TestPlan",
            name: "Docstring"
        },
        {
            value: this.element.getAttribute("duration"),
            iconName: "NumberSymbol",
            name: "Duration"
        },
        {
            value: this.element.getAttribute("methodname"),
            iconName: "TestStep",
            name: "Method"
        },
        {
            value: this.element.getAttribute("classname"),
            iconName: "TestStep",
            name: "Module/Class"
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
        if (!this.element.getElementsByTagName('property'))
            return results;
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
        return [{
            value: "NUnit 3.0 XML Result",
            iconName: "TestPlan",
            name: "Type"
        }];
    };

    getPlan(): NunitTestPlan {
        return new NunitTestPlan(this.document.getElementsByTagName('test-run')[0]);
    }


    getCases(): NodeListOf<Element> {
        return this.document.getElementsByTagName('test-case');
    }

    getCase(name: string): ITestCase {
        // @ts-ignore
        for (let testCase of this.getCases()) {
            const caseName: string = testCase.getAttribute('fullname');
            if (caseName === name) {
                return new NunitTestCase(testCase);
            }
        }
    }
}

export class NunitTestPlan implements ITestPlan {
    element: Element;
    name: string;

    constructor(element: Element){
        this.element = element;
        this.name = element.getAttribute("name");
    }

    getPropertiesList(): ITaskItem[] {
        let f = [
            {
                value: this.name,
                iconName: "TestPlan",
                name: "Name"
            },
            {
                value: this.element.getAttribute('total'),
                iconName: "TestPlan",
                name: "Total Tests"
            },
            {
                value: this.element.getAttribute('duration'),
                iconName: "NumberSymbol",
                name: "Duration"
            }
        ];
        if (this.element.getElementsByTagName('command-line')[0]) {
            f.push({
                value: this.element.getElementsByTagName('command-line')[0].textContent,
                iconName: "TestPlan",
                name: "Command Line"
            });
        }

        if (this.element.getElementsByTagName('filter')[0]){
            let filter_element = this.element.getElementsByTagName('filter')[0];
            if (filter_element.getElementsByTagName("name")){
                // @ts-ignore
                for (let el of filter_element.getElementsByTagName('name')) {
                    f.push({
                        value: el.textContent,
                        iconName: "Filter",
                        name: "Keyword Filter"
                    })
                }
            }
            if (filter_element.getElementsByTagName("namespace")){
                // @ts-ignore
                for (let el of filter_element.getElementsByTagName('namespace')) {
                    f.push({
                        value: el.textContent,
                        iconName: "Filter",
                        name: "Marker Filter"
                    })
                }
            }
            if (filter_element.getElementsByTagName("test")){
                // @ts-ignore
                for (let el of filter_element.getElementsByTagName('test')) {
                    f.push({
                        value: el.textContent,
                        iconName: "Filter",
                        name: "Path Filter"
                    })
                }
            }
        }
        return f;
    };
}