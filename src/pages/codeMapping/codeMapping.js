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

//import SelectBox from "devextreme-react/select-box";
import "devextreme-react/text-area";
//import BankTransactions from "./bankTransactions";
import "devextreme/data/data_source";
import { useAuth } from "../../contexts/auth";
import "./app.scss";
import {
  mystore,
  bankStore,
  customerStore,
  transactionTypesStore,
  getBanks,
} from "./codeMappingData.js";
//import { Button } from "devextreme-react";
//import { SelectBox } from "devextreme-react";
//import { Template } from "devextreme-react/core/template";

const allowedPageSizes = [8, 12, 20];

let pageoption = 90;

class CodeMappingx extends React.Component {
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
      clientCode: "",
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

  render() {
    if (this.state.isLoading) {
      return <div>Loading...</div>; // Show a loading message or spinner
    }
    return (
      <div className="content-block dx-card responsive-paddings">
        <h3>Mapping</h3>
        <DataGrid
          dataSource={mystore(this.state.companyCode)}
          keyExpr="UNIQUEID"
          showBorders={true}
          remoteOperations={false}
          onSelectionChanged={this.handleSelectionChanged.bind(this)} // add this line
          onEditingStart={this.handleEditingStart}
          onRowUpdating={this.onRowUpdating}
          onRowUpdated={this.onRowUpdated}
          onEditorPreparing={this.onEditorPreparing}
        >
          <FilterRow
            visible={this.state.showFilterRow}
            applyFilter={this.state.currentFilter}
          />
          <HeaderFilter visible={this.state.showHeaderFilter} />
          <SearchPanel visible={true} width={240} placeholder="Search..." />
          <Paging enabled={true} />
          <Editing
            mode="popup"
            allowUpdating={true}
            allowAdding={true}
            allowDeleting={true}
          >
            <Popup title="Map" showTitle={true} width={900} height={800} />
            <Form>
              <Item itemType="group" colCount={2} colSpan={2}>
                <Item dataField="CLIENTCODE" />
                <Item dataField="BANKCODE" />
                <Item dataField="BANKACCOUNTNUMBER" />
                <Item dataField="SEGMENTNUMBER" />
                <Item dataField="DESCRIPTION" />
                <Item dataField="DOLLARVALUE" />
                <Item dataField="FPTRANSACTIONCODE" />
                <Item dataField="SUBSEGMENTNUMBER" />
                <Item dataField="BANKACCOUNTTYPE" />
              </Item>
            </Form>
          </Editing>
          <Column dataField="CLIENTCODE" caption="Client" width={200}>
            <Lookup
              dataSource={this.state.clientNames}
              valueExpr="CLIENTCODES"
              displayExpr="CLIENTNAME"
            />
          </Column>

          <Column dataField="BANKCODE" caption="Bank" width={200}>
            <Lookup
              dataSource={this.state.bankAccount}
              valueExpr="BANKCODES"
              displayExpr="BANKNAME"
            />
          </Column>

          <Column dataField="BANKACCOUNTNUMBER" caption={"Bank Account"}>
            <Lookup
              dataSource={this.state.clientBankAccounts}
              valueExpr="BANKACCOUNTNUMBER"
              displayExpr={(item) =>
                item
                  ? `${item.BANKNAME} - ${item.BANKACCOUNTNUMBER} - ${item.ACCOUNTDESCRIPTION}`
                  : ""
              }
            />
          </Column>

          <Column dataField="SEGMENTNUMBER" caption={"Segment"} />
          <Column dataField="DESCRIPTION" caption={"Description"} />
          <Column dataField="DOLLARVALUE" caption={"Dollar Value"} />

          <Column
            dataField="FPTRANSACTIONCODE"
            caption="Transaction Type"
            width={200}
          >
            <Lookup
              dataSource={this.state.transactionTypes}
              valueExpr="FPTRANSACTIONCODE"
              displayExpr="DESCRIPTION"
            />
          </Column>

          <Column dataField="SUBSEGMENTNUMBER" caption={"Sub Segment"} />
          <Column dataField="BANKACCOUNTTYPE" caption={"Bank Account Type"} />
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
export default function CodeMapping() {
  const { user } = useAuth();
  //console.log({ user });
  return <CodeMappingx companyCode={user.companyCode} />;
}
