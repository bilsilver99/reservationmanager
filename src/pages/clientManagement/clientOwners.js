import React from "react";

//import React, { useEffect, useState } from "react";
//import { Popup, Position, ToolbarItem } from "devextreme-react/popup";
//import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//import { faCheckSquare, faSquare } from "@fortawesome/free-solid-svg-icons";
//import { getTransactionGroups } from "../../api/MyOwnServices";
//
import DataGrid, {
  Column,
  Editing,
  Popup,
  Paging,
  Lookup,
  Form,
  Pager,
  FilterRow,
  HeaderFilter,
  Search,
  SearchPanel,
  MasterDetail,
} from "devextreme-react/data-grid";
import { Item } from "devextreme-react/form";
import "devextreme-react/text-area";
import "devextreme/data/data_source";
import "./app.scss";
import { mystore } from "./clientOwnersData";
import "whatwg-fetch";
import { useAuth } from "../../contexts/auth";
//import CustomStore from "devextreme/data/custom_store";
//import SelectBox from "devextreme-react/select-box";

const allowedPageSizes = [8, 12, 24];

let pageoption = 90;

class ClientOwnersx extends React.Component {
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
      transactionGroupData: [], // add new state variable
      companyCode: 1,
      showFilterRow: true,
      showHeaderFilter: true,
      currentFilter: this.applyFilterTypes[0].key,
      thisClient: this.props.clientCode,
      //bankNameToAuthorize: "", // add new state variable
    };
  }

  // componentDidMount() {
  //   mystore2() // call the function to fetch data
  //     .then((data) => {
  //       //console.log("data", data);
  //       this.setState({ transactionGroupData: data.data }); // store the data in state
  //     })
  //     .catch((error) => {
  //       console.error(
  //         "There was an error fetching the transaction group data:",
  //         error
  //       );
  //     });
  // }

  handleSelectionChanged(e) {
    this.setState({ selectedRowKeys: e.selectedRowKeys });
    if (e.selectedRowKeys.length > 0) {
      this.setState({ currentRow: e.selectedRowKeys[0] }); // update the current row
    }
  }

  handleEditingStart(e) {
    //console.log("Editing is starting for row", e.data);

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
      <div className="content-block2 dx-card responsive-paddings">
        <p>Distribution/Ownership</p>
        <DataGrid
          dataSource={mystore(this.props.clientCode)}
          //keyExpr="UNIQUEID"
          showBorders={true}
          remoteOperations={false}
          onSelectionChanged={this.handleSelectionChanged.bind(this)} // add this line
          onEditingStart={this.handleEditingStart}
          width={"100%"}
          columnAutoWidth={true}
        >
          <Paging enabled={true} />
          <Editing
            mode="cell"
            allowUpdating={true}
            allowAdding={true}
            allowDeleting={true}
          ></Editing>
          <Column
            dataField={"UNIQUEID"}
            width={190}
            caption={"ID"}
            hidingPriority={8}
            visible={false}
          />
          <Column
            dataField={"CLIENTCODE"}
            width={190}
            caption={"Client"}
            hidingPriority={8}
            visible={false}
          />
          <Column
            dataField={"NAME"}
            width={100}
            caption={"Name"}
            hidingPriority={8}
            visible={true}
          />
          <Column
            dataField={"SEQUENCE"}
            width={80}
            caption={"Sequence"}
            hidingPriority={8}
            visible={true}
          />
          <Column
            dataField={"ALLOCATIONPERCENTAGE"}
            width={180}
            caption={"Allocation %"}
            hidingPriority={8}
            visible={true}
          />
          <Column
            dataField={"EMAILADDRESS"}
            width={250}
            caption={"Email"}
            hidingPriority={8}
            visible={true}
          />

          <Column
            dataField={"USERNAME"}
            width={200}
            caption={"Username"}
            hidingPriority={8}
            visible={true}
          />
          <Column
            dataField={"PASSWORD"}
            width={200}
            caption={"Password"}
            hidingPriority={8}
            visible={true}
          />
          <Column
            dataType="boolean"
            dataField={"ADMIN"}
            caption={"Administrator"}
            hidingPriority={8}
            visible={true}
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

export default function ClientOwners() {
  const { user } = useAuth();
  //console.log("my user stuff", { user });
  return <ClientOwnersx clientCode={user.thisClientcode} />;
}
