import * as React from "react";
import { Header, TitleSize } from "azure-devops-ui/Header";
import { Table } from "azure-devops-ui/Table";
import { IItemProvider } from "azure-devops-ui/Utilities/Provider";
import * as NUnit from "../documents/nunit"
import { ObservableValue } from "azure-devops-ui/Core/Observable";
import {
    renderSimpleCell,
    TableColumnLayout
} from "azure-devops-ui/Table";


class NUnitPropertyItemProvider implements IItemProvider<NUnit.NunitProperty> {
    constructor(items:Array<NUnit.NunitProperty>){
        this.value = items;
        this.length = items.length;
    }
    readonly length: number;
    readonly value: Array<NUnit.NunitProperty>;
}

interface PropertyTableProps {
    properties: Array<NUnit.NunitProperty>
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
            "propertiesProvider": new NUnitPropertyItemProvider(props.properties),
        }
    }

    public render(): JSX.Element {
        return (
            <div style={{ display: "flex" }}>
                <div className="flex-row">
                    <Header
                        title={"Properties"}
                        titleSize={TitleSize.Small}
                        titleIconProps={{ iconName: "TestParameter" }}
                    />
                </div>
                <div className="flex-row">
                    <Table columns={fixedPropertyColumns} itemProvider={this.state.propertiesProvider} role="table" />
                </div>
            </div>
        );
    }
};