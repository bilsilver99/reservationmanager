//// getInvestmentRecords

import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import DateBox from "devextreme-react/date-box";
import TextBox from "devextreme-react/text-box";

import withReactContent from "sweetalert2-react-content";
import DropDownBox from "devextreme-react/drop-down-box";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

import DataGrid, {
  Column,
  Editing,
  Sorting,
  Lookup,
  Scrolling,
  Selection,
  HeaderFilter,
  FilterRow,
  Paging,
  AsyncRule,
  Form,
} from "devextreme-react/data-grid";

import { Validator, RequiredRule } from "devextreme-react/validator";
import { Button } from "devextreme-react/button";

import "devextreme-react/text-area";
import "./app.scss";
import { useAuth } from "../../../contexts/auth";
import "devextreme/data/data_source";
import { ClientCodeMapping } from "./clientCodeMapping";
//import DataSource from "devextreme/data/data_source";
import {
  mystore6,
  getTransactionTypes,
  getBanks,
  validateImports,
  processImports,
  deleteImports,
  remapImports,
  fetchThisClientData,
  getInvestmentRecords,
  updateMapping,
} from "./segmentData";
import { set } from "date-fns";

const dropDownOptions = { width: 500 };
const ownerLabel = { "aria-label": "Owner" };

function ImportTransactionsx(props) {
  //const [dataSourcex, setDataSource] = useState(null);
  const [transTypes, setTransTypes] = useState(null);
  const [bankAccounts, setBankAccounts] = useState(null);
  const [clientCode, setClientCode] = useState(props.clientCode);
  const [transactionsReady, setTransactionsReady] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [startdate, setStartdate] = useState(null);
  const [enddate, setEnddate] = useState(null);
  const [investmentlist, setInvestmentList] = useState(null);
  const dataGridRef = useRef(null);
  const [ShowMappings, setShowMappings] = useState(false);
  const [allClients, setAllClients] = useState(false);

  const [totalEntries, setTotalEntries] = useState(0);
  const [errorEntries, setErrorEntries] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const MySwal = withReactContent(Swal);

  const ProcessImports = async () => {
    try {
      const data = await validateImports(clientCode);
      if (data.valid === 1) {
        setTransactionsReady(true);
        await processImports(props.clientCode, startdate, enddate); // Wait for processing to complete
        // Show a success message using SweetAlert2
        await MySwal.fire({
          icon: "success",
          title: "Import Processed",
          text: "The import has been processed successfully.",
        });

        setRefreshKey((prevKey) => prevKey + 1); // Update key after processing
      } else {
        // Show an error message using SweetAlert2
        await MySwal.fire({
          icon: "error",
          title: "Import Error",
          text: "There are errors in the import file. Please correct them.",
        });
      }
    } catch (error) {
      console.error("An error occurred during the import process:", error);
      // Optionally, handle any errors that might occur during the import process
    }
  };

  const renderFPTransactionCell = (data) => {
    const { data: rowData } = data;

    let style = {};
    if (rowData.ERRORDESCRIPTION === "Transaction Type not found") {
      style = { backgroundColor: "lightblue" }; // Apply blue color
      const formattedTransactionAmount = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(rowData.TRANSACTIONAMOUNT);
      return <div style={style}>{formattedTransactionAmount}</div>;
    } else return <div style={style}>{rowData.TRANSACTIONAMOUNT}</div>;
  };

  const renderFPTransactionCellDate = (data) => {
    const { data: rowData } = data;

    let style = {};
    if (rowData.DATEERROR === true) {
      style = { backgroundColor: "red" }; // Apply blue color
    }
    return <div style={style}>{rowData.TRANSACTIONDATE}</div>;
  };

  const DeleteImportsButton = () => {
    deleteImports(props.clientCode).then(() => {
      // Show a success message using SweetAlert2
      MySwal.fire({
        icon: "success",
        title: "Imports Deleted",
        text: "The imports have been removed",
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

  // const onRowValidating = (e) => {
  //   const transactionCode =
  //     e.newData.FPTRANSACTIONCODE || e.oldData.FPTRANSACTIONCODE;
  //   const transactionType = transTypes.find(
  //     (type) => type.FPTRANSACTIONCODE === transactionCode
  //   );
  //   if (
  //     transactionType &&
  //     transactionType.INVESTMENTTRANSACTION &&
  //     !e.newData.INVESTMENTID
  //   ) {
  //     e.errorText = "Investment ID is required for this transaction type.";
  //     e.isValid = false;
  //   }
  // };

  const validateSegment = async (params) => {
    if (!params.data.SEGMENTNUMBER) {
      return true;
    }
    return await asyncValidation(
      params.data.BANKACCOUNTNUMBER,
      clientCode,
      params.data.SEGMENTNUMBER
    );
  };

  const onInitNewRow = (e) => {};

  useEffect(() => {
    getTransactionTypes() // call the function to fetch data
      .then((data) => {
        setTransTypes(data.data); // store the data in state
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the transaction Types data:",
          error
        );
      });
    getBanks(props.clientCode) // call the function to fetch data
      .then((data) => {
        setBankAccounts(data.data); // store the data in state
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the transaction Types data:",
          error
        );
      });

    fetchThisClientData(props.clientCode) // call the function to fetch data
      .then((data) => {
        setStartdate(data.STARTDATE); // store the data in state
        setEnddate(data.ENDDATE); // store the data in state
        setBankAccounts(data.data); // store the data in state
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the transaction Types data:",
          error
        );
      });
    getInvestmentRecords(props.clientCode) // call the function to fetch data
      .then((data) => {
        setInvestmentList(data.data); // store the data in state
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the transaction Types data:",
          error
        );
      });
    setRefreshKey((prevKey) => prevKey + 1);
  }, []);

  const handleStartDateChange = (e) => {
    setStartdate(e.value);
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const handleEndDateChange = (e) => {
    setEnddate(e.value);
    setRefreshKey((prevKey) => prevKey + 1);
  };
  const UpdateMappings = () => {
    setShowMappings(true);
  };

  const RefreshMappings = async () => {
    try {
      setIsLoading(true); // Start loading

      console.log("Refreshing mappings for client code:", clientCode);

      await remapImports(clientCode);

      MySwal.fire({
        icon: "success",
        title: "Remapping Complete",
        text: "The remapping process has been successfully completed.",
      });

      setRefreshKey((prevKey) => prevKey + 1);
    } catch (error) {
      // Handle any errors that occur during the update or remap process
      console.error("An error occurred during the remapping process:", error);
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred during the remapping process.",
      });
    }
    setIsLoading(false); // Stop loading
  };

  const handleMappingUpdated = (value) => {
    setShowMappings(false);
    // Do something with the value, like updating the state
  };

  const ClearableEditCell = (props) => {
    const { data, setValue } = props;
    const handleClear = () => setValue(undefined); // Or '' if your data structure expects a string

    return (
      <div>
        <TextBox value={data.value} onValueChanged={(e) => setValue(e.value)} />
        <Button
          icon="clear" // Use an appropriate icon
          onClick={handleClear}
        />
      </div>
    );
  };

  // const countRows = () => {
  //   const gridData = dataGridRef.current.instance.getDataSource().items();
  //   //console.log("grid", gridData);
  //   const total = gridData.length;
  //   const errorCount = gridData.filter((row) => row.ERROR === 1).length;

  //   setTotalEntries(total);
  //   setErrorEntries(errorCount);
  //   //console.log("total", total, "errors:", errorCount);
  // };

  // useEffect(() => {
  //   // Assuming you want to count rows whenever the grid is refreshed
  //   // You can call countRows here or in response to some grid event
  //   countRows();
  // }, [refreshKey]); // Dependency on refreshKey if needed

  return (
    <>
      {isLoading && (
        <div className="spinner-container">
          <>
            <p>Processing please wait &nbsp;&nbsp;</p>
            <FontAwesomeIcon icon={faSpinner} spin className="large-spinner" />
          </>
        </div>
      )}
      {ShowMappings !== true && (
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
            <div
              style={{
                backgroundColor: "lightblue",
                marginTop: "10px",
                marginLeft: "10px",
              }}
            >
              <p>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Amounts in blue indicate an
                invalid transaction type&nbsp;&nbsp;
              </p>
            </div>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;</p>
            <Button
              text="Update Mappings"
              onClick={UpdateMappings}
              style={{ marginRight: "30px" }} // Add right margin to the button
            />
            <Button
              text="Refresh Mappings"
              onClick={RefreshMappings}
              style={{ marginRight: "30px" }} // Add right margin to the button
            />
          </div>
          <div className="red-color">
            <div className="custom-container" style={{ height: "800px" }}>
              <DataGrid
                ref={dataGridRef}
                key={refreshKey} // This key will force a refresh when it changes
                dataSource={mystore6(props.clientCode)}
                columnAutoWidth={true}
                //onEditorPreparing={onEditorPreparing}
                //onRowValidating={onRowValidating}
                onInitNewRow={onInitNewRow}
                //onRowInserted={onRowInserted}
                width={"100%"}
                scrolling={{ mode: "virtual" }} // or 'standard', based on your preference
                //keyExpr="UNIQUEID"
                showBorders={true}
                height={"100%"}
                rowHeight={"70px"} // Set the row height to 70px
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
                  dataField={"BANKACCOUNTNUMBER"}
                  caption="Bank Account"
                  allowEditing={true}
                  //width={180}
                >
                  <Lookup
                    dataSource={bankAccounts}
                    valueExpr="BANKACCOUNTNUMBER"
                    //displayExpr="BANKACCOUNTNUMBER"
                    displayExpr={(item) =>
                      item
                        ? `${item.BANKNAME} - ${item.BANKACCOUNTNUMBER} - ${item.ACCOUNTDESCRIPTION}`
                        : ""
                    }
                  />
                </Column>

                <Column
                  width={70}
                  dataField={"SEGMENTNUMBER"}
                  caption={"Seg"}
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
                  dataField="TRANSACTIONDATE"
                  caption="Date"
                  hidingPriority={7}
                  allowEditing={true}
                  cellRender={renderFPTransactionCellDate}
                />
                <Column
                  dataType="boolean"
                  dataField={"DATEERROR"}
                  caption="Date Issue"
                  allowEditing={true}
                />

                {/* <RequiredRule message="A Date is required" /> */}

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
                  dataField={"INVESTMENTID"}
                  caption="id"
                  allowEditing={true}

                  //editCellComponent={PrepareInvestmentID}
                >
                  <Lookup
                    dataSource={investmentlist}
                    valueExpr="UNIQUEID"
                    displayExpr="INVESTMENTNAME"
                    allowClearing={true}
                  />
                </Column>

                <Column
                  dataField={"TRANSACTIONAMOUNT"}
                  caption={"Amount"}
                  hidingPriority={7}
                  allowEditing={true}
                  format="$###,###,###.00"
                  width={100}
                  cellRender={renderFPTransactionCell}
                />
                <Column
                  dataField={"UNIQUEID"}
                  caption={"ID"}
                  hidingPriority={7}
                  allowEditing={true}
                  visible={false}
                />
              </DataGrid>
            </div>
          </div>
        </>
      )}
      <div>
        {ShowMappings && (
          <div className="overlay">
            <ClientCodeMapping
              clientCode={clientCode}
              onMappingUpdated={handleMappingUpdated}
            />
          </div>
        )}
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
  const url = `${process.env.REACT_APP_BASE_URL}/fetchThisClientSegment`;

  const response = await fetch(url, requestoptions);
  if (!response.ok) {
    throw new Error("System did not respond");
  }
  const data = await response.json();
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
  return <ImportTransactionsx clientCode={user.thisClientcode} />;
}
