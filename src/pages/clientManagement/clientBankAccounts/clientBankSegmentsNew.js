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
//import ClientBankSegmentTransactions from "./clientBankSegmentTransactions";

import { mystore3, getTransactionTypes } from "./segmentData";

//import { json } from "react-router-dom";
//import myStore from "./clientSegmentBankData";
let pageoption = 90;

function ClientBankSegment(props) {
  const [dataSourcex, setDataSource] = useState(null);
  const [filterValue, setfiltervalue] = useState("90");

  const [bankID, setBankID] = useState(props.bankAccountNumberID);
  const [bankUniqueid, setBankUniqueid] = useState(props.bankAccountUniqueID);
  const [dataChanged, setDataChanged] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  const validateSegment = async (params) => {
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

  const handleDataChange = () => {
    setDataChanged(true);
  };
  useEffect(() => {
    if (dataChanged) {
      fetchData(); // Refetch data when a change is detected
      setDataChanged(false); // Reset the flag after refetching
      setRefreshKey((oldKey) => oldKey + 1); // Update the key to force a re-render
    }
  }, [dataChanged]);

  async function fetchData() {
    const data = await getTasks(props.rowid, props.sendit);
    setDataSource(data);
  }

  useEffect(() => {
    if (dataChanged) {
      fetchData();
      setDataChanged(false);
      setRefreshKey((oldKey) => oldKey + 1); // Update key to force re-render
    }
  }, [dataChanged]);

  ////////////////////////////////////////////////////////////////

  async function asyncValidation(segmentNumber, bankID) {
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

  async function getTasks(key, masterField) {
    return new DataSource(mystore2(key));
  }

  const onMasterDetailExpanded = (e) => {
    setExpandedRowKeys([...expandedRowKeys, e.key]);
  };

  const onMasterDetailCollapsed = (e) => {
    setExpandedRowKeys(expandedRowKeys.filter((key) => key !== e.key));
  };

  function renderDetail(props) {
    const uniqueid = props.data.UNIQUEID;
    const bankAccountNumber = props.data.BANKACCOUNTNUMBER;
    const segmentNumber = props.data.SEGMENTNUMBER;
    const segmentUniqueID = props.data.UNIQUEID;

    return (
      <ClientBankSegmentTransactions
        onRowChange={handleDataChange}
        rowid={uniqueid}
        sendit={pageoption}
        bankAccountNumber={bankAccountNumber}
        segmentNumber={segmentNumber}
        segmentUniqueID={segmentUniqueID}
      />
    );
  }

  return (
    <>
      {dataSourcex ? (
        <div className="red-color">
          Segments (new) for {bankID}
          <div>
            <DataGrid
              dataSource={dataSourcex}
              columnAutoWidth={true}
              width={"100%"}
              onEditorPreparing={onEditorPreparing}
              key={refreshKey} // Use the refreshKey here
              expandedRowKeys={expandedRowKeys}
              onRowExpanding={onMasterDetailExpanded}
              onRowCollapsing={onMasterDetailCollapsed}
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

export default ClientBankSegment;

function ClientBankSegmentTransactions(props) {
  const [dataSourcex, setDataSource] = useState(null);
  const [transTypes, setTransTypes] = useState(null);
  //const [filterValue, setfilervalue] = useState("90");

  //const thisID = props.uniqueid;

  useEffect(() => {
    async function fetchData() {
      const data = await getTasks2(props.rowid, props.sendit);
      setDataSource(data);
    }

    fetchData();
  }, [props.rowid, props.sendit]);

  const handleRowAdded = (e) => {
    // Logic for row addition
    props.onRowChange();
  };

  const handleRowUpdated = (e) => {
    // Logic for row update
    props.onRowChange();
  };

  const handleRowRemoved = (e) => {
    // Logic for row removal
    props.onRowChange();
  };

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
      if (e.dataField === "BANKACCOUNTNUMBER") {
        e.editorOptions.disabled = true;
      }
      if (e.dataField === "DESCRIPTION") {
        e.editorOptions.disabled = true;
      }
    }
  };

  const onInitNewRow = (e) => {
    e.data.BANKACCOUNTNUMBER = props.bankAccountNumber;
    e.data.SEGMENTNUMBER = props.segmentNumber;
  };

  useEffect(() => {
    getTransactionTypes() // call the function to fetch data
      .then((data) => {
        console.log("types", data.data);
        setTransTypes(data.data); // store the data in state
        console.log("new types", transTypes);
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
      {dataSourcex ? (
        <div className="red-color">
          {/* className="content-block dx-card responsive-paddings red-color">*/}
          Bank Transaction Details for bank account {props.bankAccountNumber}{" "}
          segment {props.segmentNumber}
          <div className="custom-container">
            <DataGrid
              dataSource={dataSourcex}
              columnAutoWidth={true}
              onEditorPreparing={onEditorPreparing}
              onInitNewRow={onInitNewRow}
              width={"100%"}
              onRowInserted={handleRowAdded}
              onRowUpdated={handleRowUpdated}
              onRowRemoved={handleRowRemoved}
            >
              <FilterRow visible={true} />
              <Sorting mode="single" />
              <Editing
                mode="cell"
                allowUpdating={true}
                allowAdding={true}
                allowDeleting={true}
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
                allowEditing={false}
              />
              <Column
                dataField={"SEGMENTNUMBER"}
                caption={"Segment"}
                hidingPriority={7}
                allowEditing={false}
              />
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
              />
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
      ) : (
        <div>loading data...</div>
      )}
    </>
  );
}

async function getTasks2(key, masterField) {
  //console.log("call to datasource2", key, "range is", masterField);
  // const store = mystore3(key, masterField);
  // const loadResult = await store.load();
  return new DataSource(mystore3(key));
}
