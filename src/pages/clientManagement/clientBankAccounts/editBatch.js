import React, { useEffect, useState } from "react";
//import { Popup, Position, ToolbarItem } from "devextreme-react/popup";
//import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//import { faCheckSquare, faSquare } from "@fortawesome/free-solid-svg-icons";
//import { getTransactionGroups } from "../../api/MyOwnServices";
import { Button } from "devextreme-react/button";
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

import "devextreme-react/text-area";
import "devextreme/data/data_source";
import "./app.scss";

import {
  mystore5,
  mystoreGraph,
  relatedData,
  relatedData2,
  relatedData3,
  getTransactionTypes,
} from "./segmentData";

import {
  mystore,
  bankStore,
  customerStore,
  transactionTypesStore,
  getBanks,
} from "./clientCodeMappingData.js";
//import { Button } from "devextreme-react";
//import { SelectBox } from "devextreme-react";
//import { Template } from "devextreme-react/core/template";

const allowedPageSizes = [8, 12, 20];

let pageoption = 90;

export class EditBatch extends React.Component {
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
      clientCode: this.props.clientCode,
      currentRow: 0,
      filterValue: "90",
      selectedRowKeys: [],
      showFilterRow: true,
      showHeaderFilter: true,
      companyCode: 1,
      currentFilter: this.applyFilterTypes[0].key,
      bankAccount: [],
      clientNames: [],
      transactionTypes: [],
      isLoading: true, // Add a loading state
      clientBankAccounts: [],
      mappingoff: false,
      showAllClients: false,
      selectedRowData: null,
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

  async componentDidMount() {
    //console.log("clientCode: ", this.state.clientCode);
    try {
      const [customersData, transactionTypesData, bankAccountsData] =
        await Promise.all([
          this.fetchCustomers(),
          this.fetchTransactionTypes(),
          this.fetchBankAccounts(),
        ]);

      this.setState({
        clientNames: customersData.data,
        transactionTypes: transactionTypesData.data,
        bankAccount: bankAccountsData.data,
        isLoading: false,
      });
    } catch (error) {
      console.error("There was an error fetching the data:", error);
      this.setState({ isLoading: false });

      // Handle error for getBanks if needed here
    }
    getTransactionTypes() // call the function to fetch data
      .then((data) => {
        this.setState({ transactionTypes: data.data }); // store the data in state
        //setTransTypes(data.data); // store the data in state
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the transaction Types data:",
          error
        );
      });
  }

  fetchClientBankAccounts = async () => {
    // if (this.state.clientCode) {
    //   try {
    //     const bankData = await getBanks(this.state.clientCode);
    //     this.setState({ clientBankAccounts: bankData.data });
    //   } catch (error) {
    //     console.error("Error fetching client bank accounts:", error);
    //   }
    // }
  };

  fetchCustomers = async () => {
    try {
      const response = await customerStore(); // Assume customerStore is an async function or returns a promise
      return response; // Return the data for usage in Promise.all
    } catch (error) {
      throw error; // Rethrow the error to be caught by the Promise.all catch block
    }
  };

  fetchTransactionTypes = async () => {
    try {
      const response = await transactionTypesStore(); // Assume transactionTypesStore is an async function or returns a promise
      return response; // Return the data for usage in Promise.all
    } catch (error) {
      throw error; // Rethrow the error to be caught by the Promise.all catch block
    }
  };

  fetchBankAccounts = async () => {
    try {
      const response = await bankStore(); // Assume bankStore is an async function or returns a promise
      return response; // Return the data for usage in Promise.all
    } catch (error) {
      throw error; // Rethrow the error to be caught by the Promise.all catch block
    }
  };

  // onRowUpdating = (e) => {
  //   if (e.newData.CLIENTCODE) {
  //     this.setState({ clientCode: e.newData.CLIENTCODE });
  //     console.log("updating");
  //   }
  //   // Handle other fields as needed
  // };

  // onRowUpdated = async (e) => {
  //   if ("CLIENTCODE" in e.newData) {
  //     console.log("updating");
  //     await this.setState({ clientCode: e.newData.CLIENTCODE });
  //     await this.fetchClientBankAccounts();
  //   }
  // };

  onEditorPreparing = (e) => {
    if (e.dataField === "CLIENTCODE" && e.parentType === "dataRow") {
      e.editorOptions.onValueChanged = async (args) => {
        // Update client code and fetch bank accounts only if the value has changed
        if (args.value !== this.state.clientCode) {
          await this.handleClientCodeChange(args.value);
        }
      };
    }
  };

  handleClientCodeChange = async (newClientCode) => {
    await this.setState({ clientCode: newClientCode });
    console.log("client: ", this.state.clientCode);
    await this.fetchClientBankAccounts();
  };

  ProcessComplete = () => {
    this.setState({ mappingoff: false });
    this.props.onMappingUpdated(true);
  };

  handleShowAll = (value) => {
    this.setState((prevState) => ({
      showAllClients: !prevState.showAllClients,
    }));
    // Do something with the value, like updating the state
  };

  render() {
    if (this.state.isLoading) {
      return <div>Loading...</div>; // Show a loading message or spinner
    }
    return (
      <div className="content-block dx-card responsive-paddings">
        <Button
          text="Complete"
          onClick={this.ProcessComplete}
          style={{ marginRight: "30px" }} // Add right margin to the button
        />
        <h3>Edit Batch</h3>
        <div className="content-block2 dx-card responsive-paddings">
          {/* <p>rownumber{this.props.rownumber}</p> */}

          <div className="custom-container">
            <DataGrid
              dataSource={relatedData(
                this.props.clientCode,
                0,
                this.props.rownumber
              )}
              rowHeight={"10px"} // Set the row height to 70px>
              onCellPrepared={this.onCellPrepared}
              width={"70%"}
            >
              <Editing
                mode="cell"
                allowUpdating={true}
                allowAdding={false}
                allowDeleting={false}
                selectionMode="single"
              ></Editing>
              <Column
                dataField="CLIENTCODE"
                caption="Client Code"
                width={200}
                visible={false}
              />
              <Column
                dataField="BANKNAME"
                caption="Description"
                width={200}
                visible={true}
                allowEditing={false}
              />
              <Column
                dataField="BANKACCOUNTNUMBER"
                caption="Bank Account"
                width={150}
                visible={true}
                allowEditing={false}
              />

              <Column
                dataField={"FPTRANSACTIONCODE"}
                caption={"Type"}
                hidingPriority={7}
                allowEditing={true}
              >
                <Lookup
                  dataSource={this.state.transactionTypes}
                  valueExpr="FPTRANSACTIONCODE"
                  displayExpr="LONGDESCRIPTION"
                />
              </Column>

              <Column
                dataType="date"
                caption={"Date (MM/DD/YYYY)"}
                dataField="TRANSACTIONDATE"
                width={100}
                visible={true}
              />
              <Column
                dataField="TRANSACTIONAMOUNT"
                caption="Amount"
                format={"$###,###,###"}
                alignment="right"
                width={200}
                visible={true}
              />
              <Column
                dataField="UNIQUEID2"
                caption="ID"
                width={200}
                visible={false}
                allowEditing={false}
              />
            </DataGrid>
          </div>
        </div>
      </div>
    );
  }
}
