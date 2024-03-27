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
  SetClientInterestFlag,
} from "./segmentData";
import { GetAuditTransactions } from "./segmentData2";
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

  const [showFilterRow, setShowFilterRow] = useState(true);
  console.log(props);

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

  // Rest of your component

  const ProcessComplete = () => {
    SetClientInterestFlag(props.clientCode);
    //this.setState({ mappingoff: false });
    props.mappingupdated(true);
  };

  return (
    <>
      {/* <div > className="red-color responsive-paddingsx"> */}
      <div
        style={{
          backgroundColor: "white",
          border: "1px solid #ccc",
          padding: "10px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Bank Transactions</span>
        </div>
        <Button text="Close" onClick={ProcessComplete} />

        <p> </p>
        <div className="custom-container">
          <DataGrid
            dataSource={GetAuditTransactions(
              props.clientCode,
              filterOption,
              startdate,
              enddate,
              currentBankAccount
            )}
            key={refreshKey} // This key will force a refresh when it changes
            columnAutoWidth={true}
            width={"100%"}
            paging={{ pageSize: 10 }}
            pagingEnabled={true}
            remoteOperations={false}
          >
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
            ></Column>
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

export default function ClientTransactions(props) {
  const { user } = useAuth();
  //console.log("my user stuff", { user });

  return (
    <ClientTransactionsx
      clientCode={user.thisClientcode}
      mappingupdated={props.onMappingUpdated}
    />
  );
}
