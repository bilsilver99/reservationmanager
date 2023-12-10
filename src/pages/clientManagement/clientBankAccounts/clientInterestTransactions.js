import React, { useState, useEffect, useCallback } from "react";
//import { Popup, Position, ToolbarItem } from "devextreme-react/popup";
import DataGrid, {
  Column,
  Lookup,
  //MasterDetail,
  //Popup,
  //Form,
  //SearchPanel,
  //ValidationRule,
} from "devextreme-react/data-grid";

import "devextreme-react/text-area";
import "./app.scss";

import "devextreme/data/data_source";

//import DataSource from "devextreme/data/data_source";
import {
  getTransactionTypes,
  getBanks,
  fetchThisClientData,
} from "./segmentData";
import { getInterest } from "./segmentData2";

let pageoption = 90;

function ClientInterestTransactionsx(props) {
  const [refreshing, setRefreshing] = useState(props.refreshKey);
  const [transTypes, setTransTypes] = useState(null);
  const [bankAccounts, setBankAccounts] = useState(null);
  const [clientCode, setClientCode] = useState(props.clientCode);
  const [interestData, setInterestData] = useState([]);

  const [refreshKey, setRefreshKey] = useState(0); // for dates to refresh grid when date changed

  useEffect(() => {
    getInterest(props.clientCode)
      .then((data) => {
        setInterestData(data.data); // assuming data is the array of records
        console.log("interest data", data);
        setRefreshKey((prevKey) => prevKey + 1);
      })
      .catch((error) => {
        console.error("Error fetching interest data:", error);
      });
  }, [props.clientCode, refreshing]);

  useEffect(() => {
    fetchThisClientData(props.clientCode) // call the function to fetch data
      .then((data) => {
        console.log("bank numbers", data);
        setBankAccounts(data.data); // store the data in state
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

  // Rest of your component

  return (
    <div className="red-color responsive-paddingsx">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Interest Transaction Details</span>
      </div>
      <p> </p>
      <div className="custom-container">
        <DataGrid
          dataSource={interestData}
          key={refreshKey} // This key will force a refresh when it changes
          columnAutoWidth={true}
          width={"100%"}
          // paging={{ pageSize: 10 }}
          // pagingEnabled={true}
          remoteOperations={true}
        >
          <Column
            allowFiltering={true}
            dataField={"BANKACCOUNTNUMBER"}
            caption={"Bank Account Number"}
            hidingPriority={7}
            allowEditing={true}
          >
            {/* <Lookup
              dataSource={bankAccounts}
              valueExpr="BANKACCOUNTNUMBER"
              //displayExpr="BANKACCOUNTNUMBER"
              displayExpr={(item) =>
                item
                  ? `${item.BANKNAME} - ${item.BANKACCOUNTNUMBER} - ${item.ACCOUNTDESCRIPTION}`
                  : ""
              }
            /> */}
          </Column>
          <Column
            dataField={"SEGMENTNUMBER"}
            caption={"Segment"}
            hidingPriority={7}
            allowEditing={true}
          ></Column>
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
          ></Column>
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
  );
}

export default function ClientInterestTransactions(myClient) {
  //const { user } = useAuth();
  //console.log("my user stuff", { user });
  return <ClientInterestTransactionsx clientCode={myClient} />;
}
