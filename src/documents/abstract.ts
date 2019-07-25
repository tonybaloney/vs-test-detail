import {NunitProperty, NunitTestCase, NunitTestSuite} from "./nunit";
import { ITaskItem } from "../ui/testCasePropertiesList";

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

export abstract class ITestCase {
    element: Element;
    name: string;

    abstract getPropertiesList(): ITaskItem[];

    abstract getTestSuite(): ITestSuite;

    abstract getProperties(): Array<NunitProperty>;

    abstract getOutput(): string;
}

export interface ITestResultDocument {
    document: XMLDocument;

    getCases(): NodeListOf<Element>;

    getCase(name: string): NunitTestCase;
}