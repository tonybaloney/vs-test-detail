import * as React from "react";
import { MessageCard, MessageCardSeverity } from "azure-devops-ui/MessageCard";
import { IButtonProps } from "azure-devops-ui/Button";

interface ErrorMessageProps {
    message: string;
}

export default class ErrorMessage extends React.Component<ErrorMessageProps> {
    private buttonProps: IButtonProps[] = [
        {
            text: "Documentation",
            onClick: () => {
                window.open("https://github.com/tonybaloney/vs-nunit/", "_new");
            }
        },
    ];
    private message: string;
    constructor(props){
        super(props)
        this.message = props.message;
    }

    public render(): JSX.Element {
        return (
            <MessageCard
                buttonProps={this.buttonProps}
                className="flex-self-stretch"
                severity={MessageCardSeverity.Warning}
            >
                {this.message}
            </MessageCard>
        );
    }
}