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
import { getTransactionTypes, getBanks } from "./segmentData";
import { unpostedInterest } from "./segmentData2";

let pageoption = 90;

function ClientUnpostedInterestx(props) {
  //const [refreshing, setRefreshing] = useState(props.refreshKey);
  const [transTypes, setTransTypes] = useState(null);
  const [bankAccounts, setBankAccounts] = useState(null);
  const [clientCode, setClientCode] = useState(props.clientCode);
  //const [interestData, setInterestData] = useState([]);

  const [refreshKey, setRefreshKey] = useState(props.refreshKey); // for dates to refresh grid when date changed

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

  // Rest of your component

  return (
    <div className="red-color responsive-paddingsx">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Unposted Interest Transactions</span>
      </div>
      <p> </p>
      <div className="custom-container" style={{ height: "800px" }}>
        <DataGrid
          key={refreshKey} // This key will force a refresh when it changes
          dataSource={unpostedInterest(clientCode, props.bankaccount)}
          columnAutoWidth={true}
          // onEditorPreparing={onEditorPreparing}
          // onInitNewRow={onInitNewRow}
          // onRowInserted={onRowInserted}
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

export default function ClientUnpostedInterest(props) {
  //const { user } = useAuth();
  console.log("my user stuff", props);
  return (
    <ClientUnpostedInterestx
      clientCode={props.myClient}
      bankaccount={props.bankaccount}
      refreshKey={props.Key}
    />
  );
}
