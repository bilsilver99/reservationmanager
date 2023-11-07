import React, { useEffect, useState } from "react";
//import { Popup, Position, ToolbarItem } from "devextreme-react/popup";
//import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//import { faCheckSquare, faSquare } from "@fortawesome/free-solid-svg-icons";
//import { getTransactionGroups } from "../../api/MyOwnServices";
import DataGrid, {
  Column,
  Paging,
  Pager,
  Sorting,
  Editing,
  FilterRow,
  Item,
  Lookup,
  Popup,
  Form,
  MasterDetail,
  HeaderFilter,
  Search,
  SearchPanel,
} from "devextreme-react/data-grid";

import { TextBox } from "devextreme-react/text-box";

//import SelectBox from "devextreme-react/select-box";
import "devextreme-react/text-area";
//import BankTransactions from "./bankTransactions";
import "devextreme/data/data_source";
import { useAuth } from "../../contexts/auth";
import "./app.scss";
import { mystore } from "./assetGroupMappingData.js";
//import { Button } from "devextreme-react";
//import { SelectBox } from "devextreme-react";
//import { Template } from "devextreme-react/core/template";

const allowedPageSizes = [8, 12, 20];

let pageoption = 90;

class AssetTypeGroupsx extends React.Component {
  constructor(props) {
    super(props);
    this.applyFilterTypes = [
      {
        key: "auto",
        name: "Immediately",
      },
      {
        key: "onClick",
        name: "On Button Click",
      },
    ];
    this.state = {
      //myClient: this.props.clientCode,
      currentRow: 0,
      filterValue: "90",
      selectedRowKeys: [],
      showFilterRow: true,
      showHeaderFilter: true,
      companyCode: 1,
      currentFilter: this.applyFilterTypes[0].key,
      isLoading: true, // Add a loading state
    };
  }

  // handleFilterChange = (e) => {
  //   this.setState({ filterValue: e.value }, () => {
  //     //console.log("New filter value:", this.state.filterValue);
  //     pageoption = this.state.filterValue;
  //   });
  // };

  handleSelectionChanged(e) {
    this.setState({ selectedRowKeys: e.selectedRowKeys });
    if (e.selectedRowKeys.length > 0) {
      this.setState({ currentRow: e.selectedRowKeys[0] }); // update the current row
    }
  }

  handleEditingStart(e) {
    console.log("Editing is starting for row", e.data);

    // You can access the data of the row that is being edited
    const rowToBeEdited = e.data;

    // Perform any checks or logic you want here.
    // For example, you might want to prevent editing if a certain condition is met:
    if (rowToBeEdited.someField === "someValue") {
      e.cancel = true; // Prevents the editing from starting
    }
  }

  render() {
    return (
      <div className="content-block dx-card responsive-paddings">
        <h3>Asset Groups</h3>
        <DataGrid
          dataSource={mystore(this.state.companyCode)}
          keyExpr="UNIQUEID"
          showBorders={true}
          remoteOperations={false}
          onSelectionChanged={this.handleSelectionChanged.bind(this)} // add this line
          onEditingStart={this.handleEditingStart}
        >
          <FilterRow
            visible={this.state.showFilterRow}
            applyFilter={this.state.currentFilter}
          />
          <HeaderFilter visible={this.state.showHeaderFilter} />
          <SearchPanel visible={true} width={240} placeholder="Search..." />
          <Paging enabled={true} />
          <Editing
            mode="cell"
            allowUpdating={true}
            allowAdding={true}
            allowDeleting={true}
          ></Editing>
          <Column dataField="ASSETTYPEGROUP" caption="Asset Type" />
          <Column dataField="DESCRIPTION" caption="Description" />
          <Column dataField="REPORTSEQUENCE" caption="Report Sequence" />
          <Column
            dataField="SHOWASSETGROUPTOTALSINNETASSETSHEET"
            caption="Show Group Total In Net Asset Sheet"
            dataType="string"
            lookup={{
              dataSource: [
                { id: "Y", name: "Yes" },
                { id: "N", name: "No" },
                { id: null, name: "(Blank)" }, // or use '' for a truly empty string
              ],
              valueExpr: "id",
              displayExpr: "name",
              allowClearing: true, // This enables the blank (null) option
            }}
          />

          <Column
            dataField={"UNIQUEID"}
            width={90}
            hidingPriority={8}
            dataType="Number"
            visible={false}
            allowEditing={false}
          />

          <Paging defaultPageSize={8} />
          <Pager
            showPageSizeSelector={true}
            allowedPageSizes={allowedPageSizes}
          />
        </DataGrid>
      </div>
    );
  }
}
export default function AssetTypeGroups() {
  const { user } = useAuth();
  //console.log({ user });
  return <AssetTypeGroupsx companyCode={user.companyCode} />;
}

// <Popup
// title="Type Info"
// showTitle={true}
// width={900}
// height={800}
// />
// <Form>
// <Item itemType="group" colCount={2} colSpan={2}>
//   <Item dataField="ASSETTYPEGROUP" />
//   <Item dataField="DESCRIPTION" />
//   <Item dataField="REPORTSEQUENCE" />
//   <Item dataField="SHOWASSETGROUPTOTALSINNETASSETSHEET" />
// </Item>
// </Form>
