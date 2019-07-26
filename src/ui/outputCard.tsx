import * as React from "react";
import { Card } from "azure-devops-ui/Card";

interface IOutputCardProps {
    text: string
}

interface IOutputCardState {
    text: string
}

export class OutputCard extends React.Component<IOutputCardProps, IOutputCardState> {
    constructor(props) {
        super(props);
        
        this.state = {
            "text": props.text,
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