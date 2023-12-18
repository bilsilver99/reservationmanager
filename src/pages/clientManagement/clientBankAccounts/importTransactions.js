import React, { useState, useEffect, useCallback } from "react";
//import { Popup, Position, ToolbarItem } from "devextreme-react/popup";
import Popup from "devextreme-react/popup";
import Swal from "sweetalert2";
import DateBox from "devextreme-react/date-box";

import withReactContent from "sweetalert2-react-content";

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
  Form,
  //ValidationRule,
} from "devextreme-react/data-grid";

import { Validator, RequiredRule } from "devextreme-react/validator";
import { Button } from "devextreme-react/button";

import "devextreme-react/text-area";
import "./app.scss";
import { useAuth } from "../../../contexts/auth";
import "devextreme/data/data_source";

//import DataSource from "devextreme/data/data_source";
import {
  mystore6,
  getTransactionTypes,
  getBanks,
  validateImports,
  processImports,
  deleteImports,
  fetchThisClientData,
} from "./segmentData";

//import { myStore5 } from "./clientBanksAccountsData";

//let pageoption = 90;

function ImportTransactionsx(props) {
  //const [dataSourcex, setDataSource] = useState(null);
  const [transTypes, setTransTypes] = useState(null);
  const [bankAccounts, setBankAccounts] = useState(null);
  const [lastBankAccountNumber, setLastBankAccountNumber] = useState("");
  const [lastSegmentNumbmer, setLastSegmentNumber] = useState("");
  const [clientCode, setClientCode] = useState(props.clientCode);
  const [transactionsReady, setTransactionsReady] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [startdate, setStartdate] = useState(null);
  const [enddate, setEnddate] = useState(null);
  const MySwal = withReactContent(Swal);

  const ProcessImports = () => {
    validateImports(clientCode).then((data) => {
      console.log("data from validate imports", data.valid);
      if (data.valid === 1) {
        setTransactionsReady(true);
        processImports(props.clientCode, startdate, enddate).then(() => {
          // Show a success message using SweetAlert2
          MySwal.fire({
            icon: "success",
            title: "Import Processed",
            text: "The import has been processed successfully.",
          });
          setRefreshKey((prevKey) => prevKey + 1);
        });
      } else {
        // Show an error message using SweetAlert2
        MySwal.fire({
          icon: "error",
          title: "Import Error",
          text: "There are errors in the import file. Please correct them.",
        });
      }
    });
  };

  const DeleteImportsButton = () => {
    deleteImports(props.clientCode).then(() => {
      // Show a success message using SweetAlert2
      MySwal.fire({
        icon: "success",
        title: "Imports Deleted",
        text: "The imports has been removed",
      });
      setRefreshKey((prevKey) => prevKey + 1);
    });
  };

  useEffect(() => {
    // This function will run whenever sharedValue changes
    const refreshTransactions = () => {
      setRefreshKey((prevKey) => prevKey + 1);
      // Logic to refresh transactions
    };

    refreshTransactions();
  }, [props.sharedValue]);

  const onEditorPreparing = (e) => {
    // // Check if the row is not new
    // if (e.parentType === "dataRow" && !e.row.isNewRow) {
    //   //Disable editing for a specific field
    //   if (e.dataField === "SEGMENTNUMBER") {
    //     e.editorOptions.disabled = true;
    //   }
    //   if (e.dataField === "BANKACCOUNTNUMBER") {
    //     e.editorOptions.disabled = true;
    //   }
    //   if (e.dataField === "DESCRIPTION") {
    //     e.editorOptions.disabled = true;
    //   }
    // }
  };

  //const setFormImport = () => {};

  const onRowInserted = useCallback();
  //   (e) => {
  //     setLastBankAccountNumber(e.data.BANKACCOUNTNUMBER);
  //     //console.log(e);
  //     setLastSegmentNumber(e.data.SEGMENTNUMBER);
  //     //console.log("last bank account number", lastBankAccountNumber);
  //   },
  //   [lastBankAccountNumber]

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
    // console.log("last bank account number", lastBankAccountNumber);
    // e.data.BANKACCOUNTNUMBER = lastBankAccountNumber;
    // e.data.SEGMENTNUMBER = lastSegmentNumbmer;
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

    fetchThisClientData(props.clientCode) // call the function to fetch data
      .then((data) => {
        console.log("bank numbers", data);
        setStartdate(data.STARTDATE); // store the data in state
        setEnddate(data.ENDDATE); // store the data in state
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
  //  className="content-block dx-card responsive-paddings red-color"

  const handleStartDateChange = (e) => {
    setStartdate(e.value);
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const handleEndDateChange = (e) => {
    setEnddate(e.value);
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return (
    <>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Button
          text="Process Imports"
          onClick={ProcessImports}
          style={{ marginRight: "30px" }} // Add right margin to the button
        />
        <Button
          text="Delete All Imports"
          onClick={DeleteImportsButton}
          style={{ marginRight: "30px" }} // Add right margin to the button
        />

        <div style={{ marginRight: "40px" }}>
          {" "}
          {/* Add right margin to this div */}
          <label>
            Start Date (MM/DD/YYYY):
            <DateBox
              type="date"
              value={startdate}
              onValueChanged={handleStartDateChange}
            />
          </label>
        </div>
        <div>
          <label>
            End Date (MM/DD/YYYY):
            <DateBox
              type="date"
              value={enddate}
              onValueChanged={handleEndDateChange}
            />
          </label>
        </div>
      </div>
      <div className="red-color">
        <div className="custom-container">
          <DataGrid
            key={refreshKey} // This key will force a refresh when it changes
            dataSource={mystore6(props.clientCode)}
            columnAutoWidth={true}
            onEditorPreparing={onEditorPreparing}
            onInitNewRow={onInitNewRow}
            onRowInserted={onRowInserted}
            width={"100%"}
            //paging={{ pageSize: 10 }}
            //pagingEnabled={true}
            remoteOperations={false}
          >
            <Sorting mode="single" />

            <FilterRow visible />
            <HeaderFilter visible />
            <Editing
              mode="cell"
              allowUpdating={true}
              allowAdding={true}
              allowDeleting={true}
              //selectionMode="single"
            ></Editing>
            <Column
              dataType="boolean"
              dataField={"ERROR"}
              caption={"Error"}
              hidingPriority={7}
              allowEditing={true}
              width={100}
            ></Column>
            <Column
              dataField={"ERRORDESCRIPTION"}
              caption="Error"
              allowEditing={false}
            />
            <Column
              dataField={"BANKACCOUNTNUMBER"}
              caption="Bank Account"
              allowEditing={true}
            >
              <Lookup
                dataSource={bankAccounts}
                valueExpr="BANKACCOUNTNUMBER"
                displayExpr="BANKACCOUNTNUMBER"
              />
            </Column>

            <Column
              width={100}
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
              dataType="date"
              dataField={"TRANSACTIONDATE"}
              caption={"Date"}
              hidingPriority={7}
              allowEditing={true}
            >
              {/* <RequiredRule message="A Date is required" /> */}
            </Column>
            <Column
              dataField={"DESCRIPTION"}
              caption="Bank Description"
              allowEditing={true}
            />
            <Column
              dataField={"SECONDDESCRIPTION"}
              caption="Details"
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
                displayExpr="LONGDESCRIPTION"
              />
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

export default function ImportTransactions() {
  const { user } = useAuth();
  //console.log("my user stuff", { user });
  return <ImportTransactionsx clientCode={user.thisClientcode} />;
}
