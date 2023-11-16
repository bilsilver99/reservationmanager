import React, { useState, useEffect, useCallback } from "react";
//import { Popup, Position, ToolbarItem } from "devextreme-react/popup";
import DataGrid, {
  Column,
  Editing,
  Sorting,
  Lookup,
  //MasterDetail,
  //Popup,
  //Form,
  HeaderFilter,
  FilterRow,
  //SearchPanel,
  Paging,
  Item,
  AsyncRule,
  //ValidationRule,
} from "devextreme-react/data-grid";

import { Validator, RequiredRule } from "devextreme-react/validator";

import "devextreme-react/text-area";
import "./app.scss";
import { useAuth } from "../../../contexts/auth";

import "devextreme/data/data_source";

//import DataSource from "devextreme/data/data_source";
import { mystore5, getTransactionTypes, getBanks } from "./segmentData";
//import { myStore5 } from "./clientBanksAccountsData";

//let pageoption = 90;

function ClientTransactionsx(props) {
  //const [dataSourcex, setDataSource] = useState(null);
  const [transTypes, setTransTypes] = useState(null);
  const [bankAccounts, setBankAccounts] = useState(null);
  const [lastBankAccountNumber, setLastBankAccountNumber] = useState("");
  const [lastSegmentNumbmer, setLastSegmentNumber] = useState("");
  const [clientCode, setClientCode] = useState(props.clientCode);

  const onEditorPreparing = (e) => {
    // Check if the row is not new
    if (e.parentType === "dataRow" && !e.row.isNewRow) {
      //Disable editing for a specific field
      if (e.dataField === "SEGMENTNUMBER") {
        e.editorOptions.disabled = true;
      }
      if (e.dataField === "BANKACCOUNTNUMBER") {
        e.editorOptions.disabled = true;
      }
      if (e.dataField === "DESCRIPTION") {
        e.editorOptions.disabled = true;
      }
    }
  };

  const onRowInserted = useCallback(
    (e) => {
      setLastBankAccountNumber(e.data.BANKACCOUNTNUMBER);
      //console.log(e);
      setLastSegmentNumber(e.data.SEGMENTNUMBER);
      //console.log("last bank account number", lastBankAccountNumber);
    },
    [lastBankAccountNumber]
  );

  // old version const onRowInserted = (e) => {
  //   setLastBankAccountNumber(e.data.BANKACCOUNTNUMBER);
  //   console.log(e);
  //   console.log("last bank account number", lastBankAccountNumber);
  // };

  const validateSegment = async (params) => {
    if (!params.data.SEGMENTNUMBER) {
      return true;
    }
    // console.log(
    //   "params coming in ",
    //   params.data.SEGMENTNUMBER,
    //   params.data.BANKACCOUNTNUMBER,
    //   clientCode
    // ); // , "bankid: ", bankUniqueid);
    return await asyncValidation(
      params.data.BANKACCOUNTNUMBER,
      clientCode,
      params.data.SEGMENTNUMBER
    );
  };

  const onInitNewRow = (e) => {
    console.log("last bank account number", lastBankAccountNumber);
    e.data.BANKACCOUNTNUMBER = lastBankAccountNumber;
    e.data.SEGMENTNUMBER = lastSegmentNumbmer;
  };

  useEffect(() => {
    getTransactionTypes() // call the function to fetch data
      .then((data) => {
        //console.log("types", data.data);
        setTransTypes(data.data); // store the data in state
        //console.log("new types", transTypes);
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the transaction Types data:",
          error
        );
      });
    getBanks(props.clientCode) // call the function to fetch data
      .then((data) => {
        console.log("bank numbers", data);
        setBankAccounts(data.data); // store the data in state
        //console.log("new types", transTypes);
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the transaction Types data:",
          error
        );
      });
  }, []);

  return (
    <>
      <div className="red-color">
        {/* className="content-block dx-card responsive-paddings red-color">*/}
        Bank Transaction Details for {props.thisClientcode}
        <div className="custom-container">
          <DataGrid
            dataSource={mystore5(props.clientCode)}
            columnAutoWidth={true}
            onEditorPreparing={onEditorPreparing}
            onInitNewRow={onInitNewRow}
            onRowInserted={onRowInserted}
            width={"100%"}
            paging={{ pageSize: 10 }}
            pagingEnabled={true}
            remoteOperations={true}
          >
            <Sorting mode="single" />
            <Sorting mode="single" />
            <FilterRow visible />
            <HeaderFilter visible />
            <Editing
              mode="row"
              allowUpdating={true}
              allowAdding={true}
              allowDeleting={true}
              selectionMode="single"
            >
              {/* <Popup
                  title="Transaction Info"
                  showTitle={true}
                  width={600}
                  height={400}
                />
                <Form>
                  <Item itemType="group" colCount={2} colSpan={2}>
                    <Item
                      dataField="BANKACCOUNTNUMBER"
                      editorOptions={{ disabled: true }}
                    />
                    <Item
                      dataField="SEGMENTNUMBER"
                      editorOptions={{ disabled: true }}
                    />
                    <Item dataField="DESCRIPTION" />
                    <Item dataField="SECONDDESCRIPTION" />
                    <Item dataField="FPTRANSACTIONCODE" />
                    <Item dataField="TRANSACTIONDATE" />
                    <Item dataField="TRANSACTIONAMOUNT" />
                  </Item>
                </Form> */}
            </Editing>

            <Column
              dataField={"BANKACCOUNTNUMBER"}
              caption={"Bank Account Number"}
              hidingPriority={7}
              allowEditing={true}
            >
              <Lookup
                dataSource={bankAccounts}
                valueExpr="BANKACCOUNTNUMBER"
                displayExpr="BANKACCOUNTNUMBER"
              />
            </Column>
            <Column
              dataField={"SEGMENTNUMBER"}
              caption={"Segment"}
              hidingPriority={7}
              allowEditing={true}
            >
              <AsyncRule
                message="Segment Does Not Exists"
                validationCallback={validateSegment}
              />
            </Column>
            <Column
              dataField={"DESCRIPTION"}
              caption="DESCRIPTION"
              allowEditing={true}
            />
            <Column
              dataField={"SECONDDESCRIPTION"}
              caption="DESCRIPTION"
              allowEditing={true}
            />
            <Column
              dataField={"FPTRANSACTIONCODE"}
              caption={"Type"}
              hidingPriority={7}
              allowEditing={true}
            >
              <RequiredRule message="A Transaction Code is required" />
              <Lookup
                dataSource={transTypes}
                valueExpr="FPTRANSACTIONCODE"
                displayExpr="DESCRIPTIONTWO"
              />
            </Column>
            <Column
              dataType="date"
              dataField={"TRANSACTIONDATE"}
              caption={"Date"}
              hidingPriority={7}
              allowEditing={true}
            >
              <RequiredRule message="A Date is required" />
            </Column>
            <Column
              dataField={"TRANSACTIONAMOUNT"}
              caption={"Amount"}
              hidingPriority={7}
              allowEditing={true}
              format="$###,###,###.00"
            />
            <Column
              dataField={"UNIQUEID"}
              caption={"Amount"}
              hidingPriority={7}
              allowEditing={true}
              visible={false}
            />
          </DataGrid>
        </div>
      </div>
    </>
  );
}

async function asyncValidation(bankAccountNumber, clientCode, segmentNumber) {
  var requestoptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json;",
    },
    body: JSON.stringify({
      sentBankAccountNumber: bankAccountNumber,
      sentSegment: segmentNumber,
      sentClientCode: clientCode,
    }),
  };
  //console.log("bankID", bankID, "segment", segmentNumber);
  const url = `${process.env.REACT_APP_BASE_URL}/fetchThisClientSegment`;

  const response = await fetch(url, requestoptions);
  if (!response.ok) {
    throw new Error("System did not respond");
  }
  const data = await response.json();
  console.log("data from fetch", data.user_response.response);
  if (data.user_response.response === "ERROR") {
    return true; // Validation successful
  } else if (data.user_response.response === "OK") {
    return false; // Validation failed
  } else {
    throw new Error("Unexpected response");
  }
}

//export default ClientTransactions;

export default function ClientTransactions() {
  const { user } = useAuth();
  //console.log("my user stuff", { user });
  return <ClientTransactionsx clientCode={user.thisClientcode} />;
}

// async function getTasks(key, masterField) {
//   //console.log("call to datasource2", key, "range is", masterField);
//   // const store = mystore3(key, masterField);
//   // const loadResult = await store.load();
//   return new DataSource(mystore3(key));
// }

/////////////////////////////
// async function getTasks(key, masterField) {
//   console.log("call to datasource2", key, "range is", masterField);

//   const store = mystore3(key, masterField);
//   const loadResult = await store.load();
//   return new DataSource({ store, load: () => loadResult });
// }

// <Column
//   dataField={"TOTALSERVICECOST"}
//   caption={"Total Service Cost"}
//   hidingPriority={7}
//   allowEditing={false}
//   format="##.00"
//   calculateCellValue={this.calculateSalary}
// />

//<Item dataField="TOTALSERVICECOST" />
//className="content-block dx-card responsive-paddings">

//const { DESCRIPTION } = this.props.data;
//const dateoptions = 60;
//const { rowData, masterField } = this.props;
//console.log("props ", this.props);
//this.dataSource = getTasks(props.rowid, props.sendit);
//console.log(this.dataSource);

//const { selectedItem, onItemClicked } = this.props;

// handleDataChanged(e) {
//   e.component.repaintRows();
// }

// async componentDidMount() {
//   const dataSource = await getTasks(this.props.rowid, this.props.sendit);
//   this.setState({ dataSource });
// }
