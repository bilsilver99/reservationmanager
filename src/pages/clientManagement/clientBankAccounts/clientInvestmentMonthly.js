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
  mystore,
  bankStore,
  customerStore,
  transactionTypesStore,
  //getBanks,
} from "./clientCodeMappingData.js";
import {
  returnInvestmentMonthly,
  CreateMonthlyTransactions,
  CreateInvestmentsFromMonthlyTransactions,
} from "./clientInvestmentsData.js";
import DateBox from "devextreme-react/date-box";

//import { Button } from "devextreme-react";
//import { SelectBox } from "devextreme-react";
//import { Template } from "devextreme-react/core/template";

const allowedPageSizes = [8, 12, 20];

let pageoption = 90;

export class ClientInvestmentMonthly extends React.Component {
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
      startdatex: null,
    };
  }

  handleStartDateChangex = (e) => {
    this.setState({ startdatex: e.value });
    //setRefreshKey((prevKey) => prevKey + 1);
  };

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

  CreateTransactions = async () => {
    await CreateMonthlyTransactions(
      this.state.clientCode,
      this.state.startdatex
    );
    this.setState((prevState) => ({
      showAllClients: !prevState.showAllClients,
    }));
  };

  CreateInvestmentsFromMonthlyTransactions = async () => {
    await CreateInvestmentsFromMonthlyTransactions(
      this.state.clientCode,
      this.state.startdatex
    );
    this.setState((prevState) => ({
      showAllClients: !prevState.showAllClients,
    }));
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
      <div
        className="content-block dx-card responsive-paddings"
        style={{ maxWidth: "1000px", margin: "0 auto" }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <label>
            Start Date (MM/DD/YYYY):
            <DateBox
              type="date"
              value={this.state.startdatex}
              onValueChanged={this.handleStartDateChangex}
            />
          </label>
          <Button
            text="Create Transactions"
            onClick={this.CreateTransactions}
            style={{
              marginRight: "20px",
              marginTop: "20px",
              marginLeft: "20px",
            }}
          />

          <Button
            text="Post  Transactions"
            onClick={this.CreateInvestmentsFromMonthlyTransactions}
            style={{
              marginRight: "20px",
              marginTop: "20px",
              marginLeft: "10px",
            }}
          />

          <Button
            text="Complete"
            onClick={this.ProcessComplete}
            style={{
              marginRight: "30px",
              marginTop: "20px",
              marginLeft: "5px",
            }}
          />
        </div>
        <h3>Monthly Investment Transactions</h3>
        <DataGrid
          key={this.state.showAllClients}
          dataSource={returnInvestmentMonthly(this.state.clientCode)}
          keyExpr="UNIQUEID"
          showBorders={true}
          remoteOperations={false}
          onSelectionChanged={this.handleSelectionChanged.bind(this)} // add this line
          onEditingStart={this.handleEditingStart}
          onRowUpdating={this.onRowUpdating}
          onRowUpdated={this.onRowUpdated}
          //onEditorPreparing={this.onEditorPreparing}
        >
          <FilterRow
            visible={this.state.showFilterRow}
            applyFilter={this.state.currentFilter}
          />
          <HeaderFilter visible={this.state.showHeaderFilter} />
          <SearchPanel visible={true} width={240} placeholder="Search..." />
          {/* <Paging enabled={true} /> */}
          <Editing
            mode="cell"
            allowUpdating={true}
            allowAdding={false}
            allowDeleting={false}
          >
            <Popup title="Map" showTitle={true} width={900} height={800} />
            <Form>
              <Item itemType="group" colCount={2} colSpan={2}>
                <Item dataField="CLIENTCODE" />
                <Item dataField="INVESTMENTNAME" />
                <Item dataField="CURRENCY" />
                <Item dataField="TRANSACTIONDATE" />
                <Item dataField="QUANTITY" />
                <Item dataField="UNITPRICE" />
                <Item dataField="AMOUNT" />
                <Item dataField="INVESTMENTID" />
              </Item>
            </Form>
          </Editing>
          <Column
            dataField="CLIENTCODE"
            caption="Client"
            width={200}
            visible={false}
          >
            <Lookup
              dataSource={this.state.clientNames}
              valueExpr="CLIENTCODES"
              displayExpr="CLIENTNAME"
            />
          </Column>

          <Column dataField="INVESTMENTNAME" caption="Account #" width={200} />

          <Column dataField="CURRENCY" caption={"Currency"}></Column>

          <Column dataField="TRANSACTIONDATE" caption={"Date"} />
          <Column dataField="QUANTITY" caption={"Quantity"} />
          <Column dataField="UNITPRICE" caption={"Unit Price"} />
          <Column dataField="AMOUNT" caption={"Amount"} />
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
// export function ClientCodeMapping(props) {
//   const clientCode = props.clientCode;
//   const handleMappingUpdated = props.handleMappingUpdated;
//   //console.log({ user });
//   return (
//     <ClientCodeMappingx
//       clientCode={clientCode}
//       onMappingUpdated={handleMappingUpdated}
//     />
//   );
// }
