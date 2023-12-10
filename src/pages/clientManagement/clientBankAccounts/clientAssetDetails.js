import React, { useState, useEffect, useRef } from "react";

//import { Popup, Position, ToolbarItem } from "devextreme-react/popup";
import DataGrid, {
  Column,
  Editing,
  Sorting,
  Lookup,
  MasterDetail,
  Popup,
  Form,
  HeaderFilter,
  FilterRow,
  SearchPanel,
  Paging,
  Item,
  AsyncRule,
} from "devextreme-react/data-grid";
import "devextreme-react/text-area";
import "./app.scss";

import "devextreme/data/data_source";

import DataSource from "devextreme/data/data_source";
import { mystore7 } from "./clientAssetsData";
//import ClientBankSegmentTransactions from "./clientBankSegmentTransactions";
//import { json } from "react-router-dom";
//import myStore from "./clientSegmentBankData";
let pageoption = 90;

function ClientAssetDetails(props) {
  const [dataSourcex, setDataSource] = useState(null);
  const [filterValue, setfilervalue] = useState("90");

  const [bankID, setBankID] = useState(props.bankAccountNumberID);
  const [bankUniqueid, setBankUniqueid] = useState(props.bankAccountUniqueID);

  // const validateSegment = async (params) => {
  //   //console.log("params coming in ", params, "bankid: ", bankUniqueid);
  //   return await asyncValidation(params.value, bankUniqueid);
  // };

  const onEditorPreparing = (e) => {
    // Check if the row is not new
    if (e.parentType === "dataRow" && !e.row.isNewRow) {
      // Disable editing for a specific field
      if (e.dataField === "SEGMENTNUMBER") {
        e.editorOptions.disabled = true;
      }
    }
  };

  const onInitNewRow = (e) => {
    console.log("client", props.clientCode, "asset", props.assetName);
    e.data.CLIENTCODE = props.clientCode;
    e.data.ASSETNAME = props.assetName;
    e.data.CURRENCY = props.currency;
  };

  const onRowUpdated = (e) => {};

  useEffect(() => {
    async function fetchData() {
      const data = await getTasks(props.rowid, props.sendit);
      setDataSource(data);
    }

    fetchData();
  }, [props.rowid, props.sendit]);

  return (
    <>
      {dataSourcex ? (
        <div className="red-color">
          Transactions
          <div>
            <DataGrid
              dataSource={dataSourcex}
              columnAutoWidth={true}
              width={"50%"}
              onEditorPreparing={onEditorPreparing}
              onInitNewRow={onInitNewRow}
              onRowUpdated={onRowUpdated}
            >
              <Sorting mode="single" />

              <Paging enabled={true} />
              <Editing
                mode="popup"
                allowUpdating={true}
                allowAdding={true}
                allowDeleting={true}
              >
                <Popup
                  title="Transaction Info"
                  showTitle={true}
                  width={900}
                  height={500}
                />
                <Form>
                  <Item
                    itemType="group"
                    colCount={2}
                    colSpan={2}
                    showBorders={true}
                  >
                    <Item dataField={"CLIENTCODE"} />
                    <Item dataField={"ASSETNAME"} />

                    <Item dataField={"CURRENCY"} />
                    <Item
                      dataField={"AMOUNT"}
                      editorType={"dxNumberBox"}
                      editorOptions={{
                        format: {
                          type: "currency",
                          currency: "USD", // Specify the currency code as needed
                        },
                      }}
                    />
                    <Item dataField={"TRANSACTIONDATE"} />
                  </Item>
                </Form>
              </Editing>

              <Column
                dataField={"UNIQUEID"}
                caption={"Unique ID"}
                hidingPriority={7}
                allowEditing={true}
                visible={false}
              />
              <Column
                dataField={"CLIENTCODE"}
                caption={"Client"}
                hidingPriority={7}
                allowEditing={false}
                visible={false}
              />
              <Column
                dataField={"ASSETNAME"}
                caption={"Asset"}
                hidingPriority={7}
                allowEditing={false}
                visible={false}
              />
              <Column
                dataField={"CURRENCY"}
                caption={"Currency"}
                hidingPriority={7}
                allowEditing={false}
              ></Column>
              <Column
                dataType="date"
                dataField={"TRANSACTIONDATE"}
                caption={"Transaction Date"}
                hidingPriority={7}
                allowEditing={true}
              />
              <Column
                type="number"
                dataField={"AMOUNT"}
                caption="Value"
                allowEditing={true}
                format={"$###,###,###.00"}
                alignment="right"
              />
            </DataGrid>
          </div>
        </div>
      ) : (
        <div>loading data...</div>
      )}
    </>
  );
}

async function asyncValidation(segmentNumber, bankID) {
  //const bankIDsent = this.state.bankAccountNumberID;
  // console.log(
  //   "bankid sent to asyncValidation",
  //   bankID,
  //   "segmentNumber",
  //   segmentNumber
  // );

  var requestoptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json;",
    },
    body: JSON.stringify({
      SentBankID: bankID,
      SentSegment: segmentNumber,
    }),
  };
  //console.log("bankID", bankID, "segment", segmentNumber);
  const url = `${process.env.REACT_APP_BASE_URL}/fetchThisSegment`;

  const response = await fetch(url, requestoptions);
  if (!response.ok) {
    throw new Error("System did not respond");
  }
  const data = await response.json();
  //console.log("data from fetch", data.user_response.response);
  if (data.user_response.response === "OK") {
    return true; // Validation successful
  } else if (data.user_response.response === "ERROR") {
    return false; // Validation failed
  } else {
    throw new Error("Unexpected response");
  }
}

export default ClientAssetDetails;

async function getTasks(key, masterField) {
  //console.log("call to datasource", key, "range is", masterField);
  return new DataSource(mystore7(key));
  // const store = mystore2(key, masterField);
  // const loadResult = await store.load();
  // return new DataSource({ store, load: () => loadResult });
}

// function renderDetail(props) {
//   //console.log("unique2", props.data.UNIQUEID, "range: ", pageoption);
//   // console.log(
//   //   "props being sent - i think",
//   //   props,
//   //   "unique",
//   //   props.data.UNIQUEID,
//   //   "range: ",
//   //   pageoption
//   // );

//   const uniqueid = props.data.UNIQUEID;
//   const bankAccountNumber = props.data.BANKACCOUNTNUMBER;
//   const segmentNumber = props.data.SEGMENTNUMBER;
//   const segmentUniqueID = props.data.UNIQUEID;

//   return (
//     <ClientBankSegmentTransactions
//       rowid={uniqueid}
//       sendit={pageoption}
//       bankAccountNumber={bankAccountNumber}
//       segmentNumber={segmentNumber}
//       segmentUniqueID={segmentUniqueID}
//     />
//   );
// }

// ///////////////////////////////////////////////
// function asyncValidation(params) {
//   const segmentNumber = params.value;
//   console.log("params", params);
//   try {
//     const result = fetchSegment(params.bankID, segmentNumber);
//     return result === "OK"; // Return true if the segment already exists
//   } catch (error) {
//     //console.error("Validation error:", error);
//     return false;
//   }
// }

// function fetchSegment(bankID, segment) {
//   var requestoptions = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Accept: "application/json;",
//     },
//     body: JSON.stringify({
//       sentbankid: bankID,
//       sentSegment: segment,
//     }),
//   };
//   console("bankID", bankID, "segment", segment);
//   const url = `${process.env.REACT_APP_BASE_URL}/fetchThisSegmment`;

//   return fetch(url, requestoptions).then((response) => {
//     if (!response.ok) {
//       throw new Error("System did not respond");
//     }
//     return response.json().then((data) => data === "OK"); // Resolve to true or false
//   });
// }
