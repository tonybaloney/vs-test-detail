import { ITaskItem } from "../ui/testPropertiesList";

export interface IPropertiesListProvider {
    getPropertiesList(): ITaskItem[];
}

export abstract class ITestSuite implements IPropertiesListProvider {
    element: Element;
    name: string;

    abstract getPropertiesList(): ITaskItem[];

    abstract getProperties(): Array<IProperty>;
}

export interface IProperty {
    name: string;
    value: string;
}

export abstract class ITestCase implements IPropertiesListProvider {
    element: Element;
    name: string;

    abstract getPropertiesList(): ITaskItem[];

    abstract getTestSuite(): ITestSuite;

    abstract getProperties(): Array<IProperty>;

    abstract hasOutput(): boolean;

    abstract getOutput(): string;
}

export abstract class ITestResultDocument implements IPropertiesListProvider {
    document: XMLDocument;

    abstract getPropertiesList(): ITaskItem[];

    abstract getCases(): NodeListOf<Element>;

    abstract getCase(name: string): ITestCase;
}

export abstract class ITestPlan implements IPropertiesListProvider {
    element: Element;
    name: string;

    abstract getPropertiesList(): ITaskItem[];
}
