import React, { useState, useEffect } from "react";

import Modal from "react-modal";

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

Modal.setAppElement("#root"); // Replace '#root' with your app element ID

function formatCurrency(number, locale = "en-US", currency = "USD") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(number);
}

const ConfirmationModal = ({ isOpen, onRequestClose, onConfirm, balance }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="react-modal"
      // other props
    >
      <div className="react-modal-header">Confirm Deletion</div>
      <div className="react-modal-content">
        <p>
          Are you sure you want to delete this record? The balance is{" "}
          {formatCurrency(balance)}.
        </p>
      </div>
      <button
        className="react-modal-button react-modal-button-confirm"
        onClick={onConfirm}
      >
        Yes, Delete
      </button>
      <button
        className="react-modal-button react-modal-button-cancel"
        onClick={onRequestClose}
      >
        Cancel
      </button>
      <span className="close-button" onClick={onRequestClose}>
        X
      </span>
    </Modal>
  );
};

let pageoption = 90;

function ClientBankSegment(props) {
  const bankRateTypes = [
    { BANKACCOUNTTYPES: "Fixed", DESCRIPTION: "Fixed" },
    { BANKACCOUNTTYPES: "Variable", DESCRIPTION: "Variable" },
  ];

  const [dataSourcex, setDataSource] = useState(null);

  const [filterValue, setfilervalue] = useState("90");

  const [bankID, setBankID] = useState(props.bankAccountNumberID);
  const [bankUniqueid, setBankUniqueid] = useState(props.bankAccountUniqueID);

  const validateSegment = async (params) => {
    //console.log("params coming in ", params, "bankid: ", bankUniqueid);
    return await asyncValidation(params.value, bankUniqueid);
  };

  const [isModalOpen, setisModalOpen] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(0);

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

  deleteClick = (e) => {
    if (e.data.BANKBALANCE !== 0) {
      this.setState({ isModalOpen: true, currentBalance: e.data.BANKBALANCE });
      e.cancel = true; // Prevent immediate deletion
    } else {
      // Delete the row directly
      e.cancel = false;
    }
  };

  handleModalConfirm = () => {
    this.setState({ isModalOpen: false });
    // Add your deletion logic here
  };

  handleModalClose = () => {
    this.setState({ isModalOpen: false });
  };

  return (
    <>
      <ConfirmationModal
        isOpen={this.state.isModalOpen}
        onRequestClose={this.handleModalClose}
        onConfirm={this.handleModalConfirm}
        balance={this.state.currentBalance}
      />
      {dataSourcex ? (
        <div className="red-color">
          Segments for {bankID}
          <div>
            <DataGrid
              dataSource={dataSourcex}
              columnAutoWidth={true}
              width={"100%"}
              onEditorPreparing={onEditorPreparing}
              onRowRemoving={this.deleteClick.bind(this)}
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
                    colCount={3}
                    colSpan={2}
                    showBorders={true}
                  >
                    <Item dataField={"SEGMENTNUMBER"} />
                    <Item dataField={"DESCRIPTION"} />

                    <Item
                      dataField={"SEGMENTBALANCE"}
                      editorType={"dxNumberBox"}
                      editorOptions={{
                        format: {
                          type: "currency",
                          currency: "USD", // Specify the currency code as needed
                        },
                      }}
                    />
                    <Item dataField={"RATETYPE"} />
                    <Item dataField={"CURRENTBANKRATE"} />

                    <Item
                      dataField={"INTERESTRATE"}
                      editorType={"dxNumberBox"}
                      editorOptions={{
                        format: {
                          type: "fixedPoint",
                          precision: 2,
                        },
                      }}
                    />

                    <Item dataField={"MATURITYDATE"} />
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
                width={100}
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
                width={200}
              />
              <Column
                type="number"
                dataField={"SEGMENTBALANCE"}
                caption="Balance"
                allowEditing={true}
                format={"$###,###,###.00"}
                alignment="right"
              />

              <Column
                dataField={"RATETYPE"}
                caption={"Rate Type"}
                hidingPriority={7}
                allowEditing={true}
                visible={true}
              >
                <Lookup
                  dataSource={bankRateTypes}
                  valueExpr="BANKACCOUNTTYPES"
                  displayExpr="DESCRIPTION"
                />
              </Column>
              <Column
                dataField={"CURRENTBANKRATE"}
                caption={"Current Bank Interest Rate"}
                hidingPriority={7}
                allowEditing={false}
                format={"###.00"}
                alignment="right"
                visible={false}
              />
              <Column
                dataField={"INTERESTRATE"}
                caption={"Interest Rate"}
                hidingPriority={7}
                allowEditing={true}
                format={"###.00"}
                alignment="right"
              />
              <Column
                dataType="date"
                dataField={"MATURITYDATE"}
                caption={"Maturity Date"}
                hidingPriority={7}
                allowEditing={true}
              />
              {/* <Column
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
              /> */}
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
