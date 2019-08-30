import * as React from "react";
import { Header, TitleSize } from "azure-devops-ui/Header";
import { Page } from "azure-devops-ui/Page";
import {PropertyTable} from "./propertyTable"
import TestPropertiesList from "./testPropertiesList";
import { Card } from "azure-devops-ui/Card";

import "./root.scss"
import {ITestCase, ITestSuite, ITestPlan} from "../documents/abstract";
import {OutputCard} from "./outputCard";

interface IPageProps {
    testCase: ITestCase,
    testSuite: ITestSuite,
    testPlan: ITestPlan
}

interface IPageState {
    testCase: ITestCase
    testSuite: ITestSuite
    testPlan: ITestPlan
}

export default class NUnitPage extends React.Component<IPageProps, IPageState> {
    constructor(props) {
        super(props);
        
        this.state = {
            "testSuite": props.testSuite,
            "testCase": props.testCase,
            "testPlan": props.testPlan
        }
    }

    public render(): JSX.Element {
        return (
            <Page className="flex-grow">
                <div className="page-content page-content-top">
                    <Header
                        title={"Test Run"}
                        titleSize={TitleSize.Medium}
                        titleIconProps={{ iconName: "TestPlan" }}
                    />
                    <Card>
                        <TestPropertiesList provider={this.state.testPlan} />
                    </Card>
                    <Header
                        title={"Test Suite"}
                        titleSize={TitleSize.Medium}
                        titleIconProps={{ iconName: "TestSuite" }}
                    />
                    <Card>
                        <TestPropertiesList provider={this.state.testCase} />
                        <PropertyTable properties={this.state.testSuite.getProperties()}/>
                    </Card>
                    <Header
                        title={"Test Case"}
                        titleSize={TitleSize.Medium}
                        titleIconProps={{ iconName: "TestStep" }}
                    />
                    <Card>
                        <TestPropertiesList provider={this.state.testCase} />
                        <PropertyTable properties={this.state.testCase.getProperties()}/>
                    </Card>
                    <Header
                        title={"Output"}
                        titleSize={TitleSize.Medium}
                        titleIconProps={{ iconName: "TextCallout" }}
                    />
                    <OutputCard testCase={this.state.testCase}/>
                </div>
            </Page>
        );
    }
}