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
  SearchPanel,
} from "devextreme-react/data-grid";

import SelectBox from "devextreme-react/select-box";
import DateBox from "devextreme-react/date-box";
import { Validator, RequiredRule } from "devextreme-react/validator";

import "devextreme-react/text-area";
import "./app.scss";
import { useAuth } from "../../../contexts/auth";

import "devextreme/data/data_source";

//import DataSource from "devextreme/data/data_source";
import {
  getTransactionTypes,
  getBanks,
  fetchThisClientData,
} from "./segmentData";
import { mystore5 } from "./segmentData2";
import { Button } from "devextreme-react";
//import { myStore5 } from "./clientBanksAccountsData";

let pageoption = 90;

function ClientTransactionsx(props) {
  //const [dataSourcex, setDataSource] = useState(null);
  const [transTypes, setTransTypes] = useState(null);
  const [bankAccounts, setBankAccounts] = useState(null);
  const [lastBankAccountNumber, setLastBankAccountNumber] = useState("");
  const [lastSegmentNumbmer, setLastSegmentNumber] = useState("");
  const [clientCode, setClientCode] = useState(props.clientCode);
  const [currentBankAccount, setCurrentBankAccount] = useState(null);

  const [filterValue, setFilterValue] = useState(0); // for dates - the actual number of days
  const [refreshKey, setRefreshKey] = useState(0); // for dates to refresh grid when date changed
  const [filterOption, setFilterOption] = useState(90); // for dates - passed to mydate5
  const [startdate, setStartdate] = useState(null);
  const [enddate, setEnddate] = useState(null);

  const handleStartDateChange = (e) => {
    setStartdate(e.value);
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const handleEndDateChange = (e) => {
    setEnddate(e.value);
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const [showFilterRow, setShowFilterRow] = useState(true);

  const applyFilterTypes = [
    {
      key: "auto",
      name: "Immediately",
    },
    {
      key: "onClick",
      name: "On Button Click",
    },
  ];

  const [currentFilter, setCurrentFilter] = useState(applyFilterTypes[0]);
  const [showHeaderFilter, setShowHeaderFilter] = useState(true);

  const dateFilterOptions = [
    { value: 30, text: "Last 30 days" },
    { value: 60, text: "Last 60 days" },
    { value: 90, text: "Last 90 days" },
    { value: 999999, text: "All Transactions" },
    { value: 0, text: "Processing Dates" },
  ];

  const handleFilterChange = (e) => {
    // Update the filterValue state
    setFilterValue(e.value);
  };

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

  useEffect(() => {
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
  }, [props]);

  // Use useEffect to perform actions when filterValue changes
  useEffect(() => {
    console.log("New filter value:", filterValue);
    setFilterOption(filterValue);
    setRefreshKey((prevKey) => prevKey + 1);
    console.log(refreshKey);
  }, [filterValue]); // Add filterValue as a dependency

  // Rest of your component

  const setAccountData = (e) => {
    setCurrentBankAccount(e.value);
  };
  const clearBankAccount = (e) => {
    setCurrentBankAccount("");
  };

  return (
    <>
      <div className="red-color responsive-paddingsx">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Bank Transactions</span>
          <div>
            <label>Bank Account:</label>
            <SelectBox
              style={{ width: "250px", height: "30px" }}
              items={bankAccounts}
              valueExpr="BANKACCOUNTNUMBER"
              displayExpr={(item) =>
                item
                  ? `${item.BANKNAME} - ${item.BANKACCOUNTNUMBER} - ${item.ACCOUNTDESCRIPTION}`
                  : ""
              }
              //displayExpr="BANKACCOUNTNUMBER"
              //displayExpr={(item) =>
              //  `${item.BANKACCOUNTNUMBER} - ${item.DESCRIPTION}`
              // }
              value={currentBankAccount}
              searchEnabled={true}
              //value={currentEmployeeName}
              onValueChanged={setAccountData}
              //onValueChanged={(e) => setCurrentEmployeeName(e.value)}
            />
          </div>

          <div>
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

          <SelectBox
            dataSource={dateFilterOptions}
            valueExpr="value"
            displayExpr="text"
            placeholder="Select date range"
            value={filterValue}
            onValueChanged={handleFilterChange}
            dropDownOptions={{
              width: 250, // Set the width of the dropdown menu
              height: 200, // Set the height of the dropdown menu
            }}
            width={250} // Set the width of the select box
          />
        </div>
        <Button text="Clear Bank Account" onClick={clearBankAccount} />

        {/* className="content-block dx-card responsive-paddings red-color">*/}

        <p> </p>
        <div className="custom-container">
          <DataGrid
            dataSource={mystore5(
              props.clientCode,
              filterOption,
              startdate,
              enddate,
              currentBankAccount
            )}
            key={refreshKey} // This key will force a refresh when it changes
            columnAutoWidth={true}
            onEditorPreparing={onEditorPreparing}
            onInitNewRow={onInitNewRow}
            onRowInserted={onRowInserted}
            width={"100%"}
            // paging={{ pageSize: 10 }}
            // pagingEnabled={true}
            remoteOperations={false}
          >
            <FilterRow visible={showFilterRow} applyFilter={currentFilter} />
            <HeaderFilter visible={showHeaderFilter} />
            <SearchPanel visible={false} width={240} placeholder="Search..." />
            <Editing
              mode="cell"
              allowUpdating={true}
              allowAdding={true}
              allowDeleting={true}
              selectionMode="single"
            ></Editing>

            <Column
              allowFiltering={true}
              dataField={"BANKACCOUNTNUMBER"}
              caption={"Bank Account Number"}
              hidingPriority={7}
              allowEditing={true}
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
              caption={"Date (MM/DD/YYYY)"}
              hidingPriority={7}
              allowEditing={true}
            >
              <RequiredRule message="A Date is required" />
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
                displayExpr="DESCRIPTIONTWO"
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
