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
import { mystore, ClientList } from "./newClientData";
//import { Button } from "devextreme-react";
//import { SelectBox } from "devextreme-react";
//import { Template } from "devextreme-react/core/template";

const allowedPageSizes = [8, 12, 20];

let pageoption = 90;

class NewClientsx extends React.Component {
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
      assetGroupsCodes: [],
      currentFilter: this.applyFilterTypes[0].key,
      isLoading: true, // Add a loading state
    };
  }

  componentDidMount() {
    ClientList() // call the function to fetch data
      .then((data) => {
        console.log("client codes returned", data);
        this.setState({ ClientCodes: data.data }); // store the data in state
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the clients group data:",
          error
        );
      });
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
        {/* <h3>Asset Types</h3> */}
        <DataGrid
          dataSource={mystore(this.state.companyCode)}
          //keyExpr="UNIQUEID"
          showBorders={true}
          remoteOperations={false}
          onSelectionChanged={this.handleSelectionChanged.bind(this)} // add this line
          onEditingStart={this.handleEditingStart}
          width={"60%"}
        >
          <FilterRow
            visible={this.state.showFilterRow}
            applyFilter={this.state.currentFilter}
          />
          <HeaderFilter visible={this.state.showHeaderFilter} />
          <SearchPanel visible={true} width={240} placeholder="Search..." />
          <Paging enabled={true} />
          <Editing
            mode="row"
            allowUpdating={true}
            allowAdding={true}
            allowDeleting={true}
          ></Editing>
          <Column dataField="EMAIL" caption="Email" />

          <Column dataField="CLIENTCODE" caption="Client">
            <Lookup
              dataSource={this.state.ClientCodes}
              valueExpr="CLIENTCODE"
              displayExpr="CLIENTCODE"
            />
          </Column>
          <Column
            dataField={"NAME"}
            width={180}
            caption={"Name"}
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
export default function NewClients() {
  const { user } = useAuth();
  //console.log({ user });
  return <NewClientsx companyCode={user.companyCode} />;
}
