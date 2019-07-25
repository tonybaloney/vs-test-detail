import * as React from "react";
import { Header, TitleSize } from "azure-devops-ui/Header";
import { Table } from "azure-devops-ui/Table";
import { IItemProvider } from "azure-devops-ui/Utilities/Provider";
import { ObservableValue } from "azure-devops-ui/Core/Observable";
import {
    renderSimpleCell,
    TableColumnLayout
} from "azure-devops-ui/Table";
import {IProperty} from "../documents/abstract";


class PropertyItemProvider implements IItemProvider<any> {
    constructor(items:Array<IProperty>){
        this.value = items;
        this.length = items.length;
    }
    readonly length: number;
    readonly value: Array<IProperty>;
}

interface PropertyTableProps {
    properties: Array<IProperty>
}

interface PropertyTableState{
    propertiesProvider: IItemProvider<any>
}

const fixedPropertyColumns = [
    {
        columnLayout: TableColumnLayout.singleLinePrefix,
        id: "name",
        name: "Name",
        readonly: true,
        renderCell: renderSimpleCell,
        width: new ObservableValue(200)
    },
    {
        id: "value",
        name: "Value",
        readonly: true,
        renderCell: renderSimpleCell,
        width: -100
    }
];

export class PropertyTable extends React.Component<PropertyTableProps, PropertyTableState> {
    constructor(props) {
        super(props);
        
        this.state = {
            "propertiesProvider": new PropertyItemProvider(props.properties),
        }
    }

    public render(): JSX.Element {
        return (
            <div>
                <div className="flex-column">
                    <Header
                        title={"Properties"}
                        titleSize={TitleSize.Small}
                        titleIconProps={{ iconName: "TestParameter" }}
                    />
                </div>
                <div className="flex-column">
                    <Table columns={fixedPropertyColumns} itemProvider={this.state.propertiesProvider} role="table" />
                </div>
            </div>
        );
    }
};