import {NunitProperty, NunitTestCase, NunitTestSuite} from "./nunit";

export interface ITestSuite {
    element: Element;
    name: string;
    runState: string;

    getProperties(): Array<NunitProperty>;
}

export interface IProperty {
    name: string;
    value: string;
}

export interface ITestCase {
    element: Element;
    name: string;
    className: string;
    methodName: string;
    runState: string;
    seed: string;

    getTestSuite(): NunitTestSuite;

    getProperties(): Array<NunitProperty>;

    getOutput(): string;
}

export interface ITestResultDocument {
    document: XMLDocument;

    getCases(): NodeListOf<Element>;

    getCase(name: string): NunitTestCase;
}