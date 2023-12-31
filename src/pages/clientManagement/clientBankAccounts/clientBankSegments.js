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

import Swal from "sweetalert2";

import "devextreme/data/data_source";
import withReactContent from "sweetalert2-react-content";
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

const ConfirmationModal = ({ isOpen, onRequestClose, onConfirm, balance }) => (
  <Modal
    isOpen={isOpen}
    onRequestClose={onRequestClose}
    className="react-modal"
  >
    <div className="react-modal-header">Confirm Deletion</div>
    <div className="react-modal-content">
      <p>
        Are you sure you want to delete this record? The balance is&nbsp;&nbsp;
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

let pageoption = 90;

function ClientBankSegment(props) {
  //console.log(props);
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(0);

  const MySwal = withReactContent(Swal);

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
      const data = await getTasks(props.rowid, props.sendit, props.activeOnly);
      setDataSource(data);
    }

    fetchData();
  }, [props.rowid, props.sendit]);

  const deleteClick = (e) => {
    if (e.data.SEGMENTBALANCE !== 0) {
      setIsModalOpen(true);
      setCurrentBalance(e.data.SEGMENTBALANCE);
      e.cancel = true; // Prevent immediate deletion
    } else {
      e.cancel = false; // Delete the row directly
    }
  };

  const handleModalConfirm = () => {
    setIsModalOpen(false);
    // Add your deletion logic here
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const onRowUpdating = (e) => {
    const { oldData, newData } = e;
    console.log(e);
    if (newData.ACTIVE === false) {
      // Assuming BANKBALANCE is a field in your data
      if (
        oldData.SEGMENTBALANCE !== undefined &&
        oldData.SEGMENTBALANCE !== 0
      ) {
        // Preventing the update
        e.cancel = true;

        // Displaying an error message
        MySwal.fire({
          icon: "error",
          title: "Segment Error",
          text: "This segment balance is not zero and cannot be set to inactive.",
          customClass: {
            container: "high-z-index",
          },
        });
      }
    }
  };

  const onInitNewRow = (e) => {
    e.data.ACTIVE = true;
  };

  return (
    <>
      <ConfirmationModal
        isOpen={isModalOpen}
        onRequestClose={handleModalClose}
        onConfirm={handleModalConfirm}
        balance={currentBalance}
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
              onRowRemoving={deleteClick}
              style={{ border: "1px solid blue" }}
              onRowUpdating={onRowUpdating}
              onInitNewRow={onInitNewRow}
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
                    <Item
                      dataField={"ACTIVE"}
                      Caption="Active"
                      editorType="dxCheckBox"
                      cssClass="tight-spacing"
                      label={{ text: "Active", location: "left" }}
                    />
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
                allowEditing={false}
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
                caption={"Current Prime Interest Rate"}
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
              <Column
                dataType="boolean"
                dataField={"ACTIVE"}
                caption={"Active"}
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

async function getTasks(key, masterField, activeOnly) {
  console.log("call to getTask - active only", activeOnly);
  return new DataSource(mystore2(key, activeOnly));
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
