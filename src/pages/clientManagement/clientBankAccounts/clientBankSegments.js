import React, { useState, useEffect } from "react";

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
import { mystore2 } from "./segmentData";
import ClientBankSegmentTransactions from "./clientBankSegmentTransactions";
//import { json } from "react-router-dom";
//import myStore from "./clientSegmentBankData";
let pageoption = 90;

function ClientBankSegment(props) {
  //console.log("client Bank Segment props", props);
  const [dataSourcex, setDataSource] = useState(null);
  // const [thisID,setthisID]= useState(props.uniqueid);
  // const [currentRow, setCurrentRow] = useState(0);
  const [filterValue, setfilervalue] = useState("90");
  // const [selectedRowKeys,setselectedRowkeys] = useState ([]);
  // const [settransactionGroupData]= useState([]); // add new state variable
  // const [companyCode,setcompanyCode] = useState(1);
  // const [showFilterRow,setshowFilterRow] = useState(true);
  // const [showHeaderFilter,setshowHeaderFilter]= useState(true);
  //currentFilter: this.applyFilterTypes[0].key,

  const [bankID, setBankID] = useState(props.bankAccountNumberID);
  const [bankUniqueid, setBankUniqueid] = useState(props.bankAccountUniqueID);

  // const [formData, setFormData] = useState({
  //   dateField: new Date(), // Initialize with the current date or a specific date
  //   // ... other form fields ...
  // });

  // const onDateValueChanged = (data) => {
  //   setFormData({ ...formData, dateField: data.value });
  // };

  const validateSegment = async (params) => {
    //console.log("params coming in ", params, "bankid: ", bankUniqueid);
    return await asyncValidation(params.value, bankUniqueid);
  };

  const onEditorPreparing = (e) => {
    // Check if the row is not new
    if (e.parentType === "dataRow" && !e.row.isNewRow) {
      // Disable editing for a specific field
      if (e.dataField === "SEGMENTNUMBER") {
        e.editorOptions.disabled = true;
      }
    }
  };

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
          Segments for {bankID}
          <div>
            <DataGrid
              dataSource={dataSourcex}
              columnAutoWidth={true}
              width={"100%"}
              onEditorPreparing={onEditorPreparing}
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
                  title="Segment Info"
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
                    <Item dataField={"SEGMENTNUMBER"} />

                    <Item dataField={"DESCRIPTION"} />
                    <Item dataField={"SEGMENTBALANCE"} />
                    <Item dataField={"INTERESTRATE"} />
                    <Item dataField={"MATURITYDATE"} />
                  </Item>
                  <Item
                    itemType="group"
                    colCount={2}
                    colSpan={2}
                    showBorders={true}
                  >
                    <Item dataField={"FIXED"} />
                    <Item dataField={"VARIABLE"} />
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
                dataField={"BANKACCOUNTNUMBER"}
                caption={"Bank Account Number"}
                hidingPriority={7}
                allowEditing={false}
                visible={false}
              />
              <Column
                dataField={"SEGMENTNUMBER"}
                caption={"Segment"}
                hidingPriority={7}
                allowEditing={true}
              >
                <AsyncRule
                  message="Segment Already Exists"
                  validationCallback={validateSegment}
                />
              </Column>

              <Column
                dataField={"DESCRIPTION"}
                caption={"Description"}
                hidingPriority={7}
                allowEditing={true}
              />
              <Column
                dataField={"SEGMENTBALANCE"}
                caption="Balance"
                allowEditing={false}
                format={"$###,###,###.00"}
                alignment="right"
              />

              <Column
                dataField={"INTERESTRATE"}
                caption={"Interest Rate"}
                hidingPriority={7}
                allowEditing={true}
                format={"###,###,###.00"}
                alignment="right"
              />
              <Column
                dataType="date"
                dataField={"MATURITYDATE"}
                caption={"Maturity Date"}
                hidingPriority={7}
                allowEditing={true}
              />
              <Column
                dataType="boolean"
                dataField={"FIXED"}
                caption={"Fixed Rate"}
                hidingPriority={7}
                allowEditing={true}
              />
              <Column
                dataType="boolean"
                dataField={"VARIABLE"}
                caption={"Variable Rate"}
                hidingPriority={7}
                allowEditing={true}
              />
              <MasterDetail
                enabled={true}
                render={renderDetail}
                sendor={filterValue}
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

export default ClientBankSegment;

async function getTasks(key, masterField) {
  //console.log("call to datasource", key, "range is", masterField);
  return new DataSource(mystore2(key));
  // const store = mystore2(key, masterField);
  // const loadResult = await store.load();
  // return new DataSource({ store, load: () => loadResult });
}

function renderDetail(props) {
  //console.log("unique2", props.data.UNIQUEID, "range: ", pageoption);
  // console.log(
  //   "props being sent - i think",
  //   props,
  //   "unique",
  //   props.data.UNIQUEID,
  //   "range: ",
  //   pageoption
  // );

  const uniqueid = props.data.UNIQUEID;
  const bankAccountNumber = props.data.BANKACCOUNTNUMBER;
  const segmentNumber = props.data.SEGMENTNUMBER;
  const segmentUniqueID = props.data.UNIQUEID;

  return (
    <ClientBankSegmentTransactions
      rowid={uniqueid}
      sendit={pageoption}
      bankAccountNumber={bankAccountNumber}
      segmentNumber={segmentNumber}
      segmentUniqueID={segmentUniqueID}
    />
  );
}

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
