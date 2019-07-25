import * as React from "react";
import * as NUnit from "../documents/nunit"
import { Header, TitleSize } from "azure-devops-ui/Header";
import { Page } from "azure-devops-ui/Page";
import {PropertyTable} from "./propertyTable"
import TestCasePropertiesList from "./testCasePropertiesList";


interface CardProps {
    testCase: NUnit.NunitTestCase,
    testSuite: NUnit.NunitTestSuite
}

interface CardState {
    testCase: NUnit.NunitTestCase
    testSuite: NUnit.NunitTestSuite
}


export default class NUnitCard extends React.Component<CardProps, CardState> {
    constructor(props) {
        super(props);
        
        this.state = {
            "testSuite": props.testSuite,
            "testCase": props.testCase
        }
    }

    public render(): JSX.Element {
        return (
            <Page>
                <Header
                    title={"Test Suite"}
                    titleSize={TitleSize.Medium}
                    titleIconProps={{ iconName: "OpenSource" }}
                />
                <div className="page-content page-content-top">

                    <PropertyTable properties={this.state.testSuite.getProperties()}/>
                </div>

                <Header
                    title={"Test Suite"}
                    titleSize={TitleSize.Medium}
                    titleIconProps={{ iconName: "OpenSource" }}
                />
                <div className="page-content page-content-top">
                    <TestCasePropertiesList testCase={this.state.testCase} />
                    <PropertyTable properties={this.state.testCase.getProperties()}/>
                </div>
            </Page>
        );
    }
}