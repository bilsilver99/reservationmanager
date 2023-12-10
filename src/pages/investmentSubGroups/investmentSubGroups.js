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
import { mystore } from "./investmentSubGroupsData";
//import SelectBox from "devextreme-react/select-box";
import "devextreme-react/text-area";
//import BankTransactions from "./bankTransactions";
import "devextreme/data/data_source";
import { useAuth } from "../../contexts/auth";
import "./app.scss";
//import { mystore } from "./investmentBanksMappingData.js";
//import { Button } from "devextreme-react";
//import { SelectBox } from "devextreme-react";
//import { Template } from "devextreme-react/core/template";

const allowedPageSizes = [8, 12, 20];

let pageoption = 90;

class InvestmentSubGroupsx extends React.Component {
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
        {/* <h3>Investment Banks</h3> */}
        <DataGrid
          dataSource={mystore(this.state.companyCode)}
          keyExpr="UNIQUEID"
          showBorders={true}
          remoteOperations={false}
          onSelectionChanged={this.handleSelectionChanged.bind(this)} // add this line
          onEditingStart={this.handleEditingStart}
          width={"70%"}
        >
          <Paging enabled={true} />
          <Editing
            mode="row"
            allowUpdating={true}
            allowAdding={true}
            allowDeleting={true}
          ></Editing>
          <Column
            dataField="FPINVESTMENTSUBGROUP"
            caption="Subgroup Code"
            width={150}
          />
          <Column dataField="DESCRIPTION" caption="Description" />
          <Column
            dataField={"REPORTINGSEQUENCE"}
            width={190}
            caption={"Report Sequence"}
            hidingPriority={8}
            visible={true}
          />
          <Column
            dataField={"REQUIREFLINKSUSER"}
            width={190}
            caption={"Owner Required"}
            hidingPriority={8}
            visible={true}
            editorType="dxCheckBox"
            dataType="boolean"
          />
          <Column
            dataField={"OWNERCODESEQUENCE"}
            width={190}
            caption={"Owner"}
            hidingPriority={8}
            visible={true}
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
export default function InvestmentSubGroups() {
  const { user } = useAuth();
  //console.log({ user });
  return <InvestmentSubGroupsx companyCode={user.companyCode} />;
}
