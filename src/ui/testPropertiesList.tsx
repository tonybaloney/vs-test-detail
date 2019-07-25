import * as React from "react";
import { ScrollableList, IListItemDetails, ListSelection, ListItem } from "azure-devops-ui/List";
import { ArrayItemProvider, IItemProvider } from "azure-devops-ui/Utilities/Provider";
import { Icon, IconSize } from "azure-devops-ui/Icon";
import {IPropertiesListProvider} from "../documents/abstract";

export interface ITaskItem {
    value: string;
    iconName: string;
    name: string;
}

interface TestPropertiesListProps {
    provider: IPropertiesListProvider
}

interface TestPropertiesListState {
    properties: IItemProvider<any>
}

export default class TestPropertiesList extends React.Component<TestPropertiesListProps, TestPropertiesListState>  {
    private selection = new ListSelection(true);

    constructor(props) {
        super(props);
        
        this.state = { 
            properties: new ArrayItemProvider(props.provider.getPropertiesList())
        }
    }

    public render(): JSX.Element {
        return (
            <div className="flex-column">
                <ScrollableList
                    itemProvider={this.state.properties}
                    renderRow={this.renderRow}
                    selection={this.selection}
                    width="100%"
                />
            </div>
        );
    }

    private renderRow = (
        index: number,
        item: ITaskItem,
        details: IListItemDetails<ITaskItem>,
        key?: string
    ): JSX.Element => {
        return (
            <ListItem key={key || "list-item" + index} index={index} details={details}>
                <div className="list-example-row flex-row h-scroll-hidden">
                    <Icon iconName={item.iconName} size={IconSize.medium} />
                    <div
                        style={{ marginLeft: "10px", padding: "10px 0px" }}
                        className="flex-column h-scroll-hidden"
                    >
                        <span className="text-ellipsis">{item.name}</span>
                        <span className="fontSizeMS font-size-ms text-ellipsis secondary-text">
                            {item.value}
                        </span>
                    </div>
                </div>
            </ListItem>
        );
    };
}