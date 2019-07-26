import * as React from "react";
import { Card } from "azure-devops-ui/Card";
import { ITestCase } from "../documents/abstract";

interface IOutputCardProps {
    testCase: ITestCase
}

interface IOutputCardState {
    text: string
}

export class OutputCard extends React.Component<IOutputCardProps, IOutputCardState> {
    constructor(props) {
        super(props);
        
        this.state = {
            "text": props.testCase.hasOutput() ? props.testCase.getOutput() : "No output provided"
        }
    }

    public render(): JSX.Element {
        return (
            <Card className="flex-column">
                <pre>
                    {this.state.text}
                </pre>
            </Card>
        );
    }
}