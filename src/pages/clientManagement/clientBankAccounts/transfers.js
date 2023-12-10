import React, { useState, useEffect, useCallback } from "react";
import { Button } from "devextreme-react/button";
import DateBox from "devextreme-react/date-box";

//import { Popup, Position, ToolbarItem } from "devextreme-react/popup";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Validator, RequiredRule } from "devextreme-react/validator";

import TransferDetails from "./transferDetails";
//import DetailTransfer from "./testfolder";
import { TransferIn, TransferOut } from "./transferData";
import "./transfers.scss";
import {
  getTransactionTypes,
  getBanks,
  //fetchThisClientData,
} from "./segmentData";

import DataGrid, {
  Column,
  Lookup,
  Editing,
  //MasterDetail,
  //Popup,
  //Form,
  //SearchPanel,
  //ValidationRule,
} from "devextreme-react/data-grid";
//import { sk } from "date-fns/locale";
//import { set } from "date-fns";
//import { set } from "date-fns";

//let pageoption = 90;

function Transfersx(props) {
  //const [refreshing, setRefreshing] = useState(props.refreshKey);
  const [transferInData, setTransferInData] = useState([]);
  const [transferOutData, setTransferOutData] = useState([]);
  const [myClientCode, setClientCode] = useState(props.clientCode);
  const [bankAccounts, setBankAccounts] = useState(null);
  const [transTypes, setTransTypes] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRowKeys2, setSelectedRowKeys2] = useState([]);
  const [totalAmountOut, setTotalAmountOut] = useState(0);
  const [totalAmountIn, setTotalAmountIn] = useState(0);
  const MySwal = withReactContent(Swal);
  const [showdetailtransfer, setShowDetailTransfer] = useState(false);
  const [selectedUniqueIDsOut, setSelectedUniqueIDsOut] = useState([]);
  const [selectedUniqueIDsIn, setSelectedUniqueIDsIn] = useState([]);
  const [skipbuild, setSkipBuild] = useState(false);
  const [startdate, setStartdate] = useState(null);

  const [refreshKey, setRefreshKey] = useState(0);

  /////////////////////////////////////////
  //  date validation ///
  const [selectedInTransactionDate, setSelectedInTransactionDate] =
    useState(null);
  const [selectedOutTransactionDate, setSelectedOutTransactionDate] =
    useState(null);

  //const [bankAccounts, setBankAccounts] = useState(null);

  useEffect(() => {
    setShowDetailTransfer(false);
    //console.log("my client code", myClientCode);
    const transferInStore = TransferIn(myClientCode);
    //console.log("transfer in store", transferInStore);
    setTransferInData(transferInStore);
    getTransactionTypes().then((data) => {
      //console.log("transaction types", data);
      setTransTypes(data);
    });

    const transferOutStore = TransferOut(myClientCode);
    console.log("transfer out store", transferOutStore);
    setTransferOutData(transferOutStore);

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
  }, [props.clientCode]);

  ////////////////////////////////////  change out /////////////////////////////

  const handleSelectionChangeOut = (e) => {
    setSelectedRowKeys(e.selectedRowKeys);

    // Extract UNIQUEIDs from the selected rows
    const selectedIds = e.selectedRowsData.map((row) => row.UNIQUEID);

    if (e.selectedRowsData.length > 0) {
      setSelectedOutTransactionDate(e.selectedRowsData[0].TRANSACTIONDATE);
    }
    // Store the extracted UNIQUEIDs in state
    setSelectedUniqueIDsOut(selectedIds);

    // Calculate total amount
    const totalAmount = e.selectedRowsData.reduce((sum, row) => {
      return sum + row.TRANSACTIONAMOUNT; // Replace TRANSACTIONAMOUNT with your amount field name
    }, 0);

    // Optionally, set the total amount in state or another variable
    setTotalAmountOut(totalAmount);
  };

  ///////////////////////////////////// change in   /////////////////////////////

  const handleSelectionChangeIn = (e) => {
    setSelectedRowKeys2(e.selectedRowKeys);

    // Extract UNIQUEIDs from the selected rows
    const selectedIds = e.selectedRowsData.map((row) => row.UNIQUEID);

    if (e.selectedRowsData.length > 0) {
      setSelectedInTransactionDate(e.selectedRowsData[0].TRANSACTIONDATE);
    }

    // Store the extracted UNIQUEIDs in state
    setSelectedUniqueIDsIn(selectedIds);
    // Calculate total amount
    const totalAmountIn = e.selectedRowsData.reduce((sum, row) => {
      return sum + row.TRANSACTIONAMOUNT; // Replace TRANSACTIONAMOUNT with your amount field name
    }, 0);

    // Optionally, set the total amount in state or another variable
    setTotalAmountIn(totalAmountIn);
  };

  //totalAmountIn !== 0 &&

  ///////////////////////////// processing transactions ////////////////////////

  const processTransfers = () => {
    // Check if both selections have been made
    if (selectedRowKeys.length === 0 || selectedRowKeys2.length === 0) {
      MySwal.fire({
        icon: "error",
        title: "Selection Error",
        text: "Please select at least one row from each grid.",
      });
      return;
    }

    if (selectedInTransactionDate !== selectedOutTransactionDate) {
      MySwal.fire({
        icon: "error",
        title: "Date Mismatch",
        text: "The transaction dates in the selected rows do not match.",
      });
      return;
    }

    // Proceed with the transfer process if dates match
    if (totalAmountIn + totalAmountOut === 0) {
      setRefreshKey((oldKey) => oldKey + 1);
      setShowDetailTransfer(true);
    } else {
      const thistotal = totalAmountIn + totalAmountOut;
      setShowDetailTransfer(false);
      MySwal.fire({
        icon: "error",
        title: "Transfer Error",
        text: `The Input value must equal the Output and at least one line must be selected (It is out of Balance by ${thistotal})`,
      });
    }
  };

  // else if (totalAmountIn === 0) {
  //   // Show an error message using SweetAlert2
  //   setShowDetailTransfer(false);
  //   MySwal.fire({
  //     icon: "error",
  //     title: "Transfer Error",
  //     text: `At least one line must be selected`,
  //   });

  const resetTransfers = () => {
    if (totalAmountIn + totalAmountOut === 0) {
      setRefreshKey((oldKey) => oldKey + 1);
      setSkipBuild(false);
      setShowDetailTransfer(true);
      console.log("skipbuild", skipbuild);
      //setRefreshKey((prevKey) => prevKey + 1);
    } else {
      // Show an error message using SweetAlert2
      const thistotal = totalAmountIn + totalAmountOut;
      setShowDetailTransfer(false);
      MySwal.fire({
        icon: "error",
        title: "Transfer Error",
        text: `The Input value must equal the Output (It is out of Balance by ${thistotal})`,
      });
    }
  };

  const formattedTotalAmountOut = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(totalAmountOut);

  const formattedTotalAmountIn = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(totalAmountIn);

  const handleStartDateChange = (e) => {
    setStartdate(e.value);
  };

  ////////////////////////////////////////////
  //   my key reset routine
  ////////////////////////////////////////////

  const [resetkey, setResetKey] = useState(0);

  // Callback for DetailPost to trigger data refresh
  const refreshDataGrid = () => {
    setResetKey((prevKey) => prevKey + 1); // Increment key to trigger re-render
    setShowDetailTransfer(false);
  };

  return (
    <>
      <div className="custom-container" width={"100%"}>
        <p></p>

        <div className="flex-container">
          <div className="flex-item">
            <p className="red-color">
              Account(s) To Be Cleared: &nbsp;&nbsp;Total Amount: &nbsp;&nbsp;
              {formattedTotalAmountIn}
            </p>

            <DataGrid
              id="gridContainerIntransfers"
              dataSource={transferInData}
              columnAutoWidth={true}
              selection={{
                mode: "single",
                showCheckBoxesMode: "always", // Show checkboxes always
              }}
              selectedRowKeys2={selectedRowKeys2}
              onSelectionChanged={handleSelectionChangeIn}
            >
              <Editing
                mode="row"
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
                caption={"Seg"}
                hidingPriority={7}
                allowEditing={true}
                width={50}
              ></Column>
              {/* <Column
                dataField={"DESCRIPTION"}
                caption="Description"
                allowEditing={true}
              /> */}

              <Column
                dataType="date"
                dataField={"TRANSACTIONDATE"}
                caption={"Date"}
                hidingPriority={7}
                allowEditing={true}
              >
                <RequiredRule message="A Date is required" />
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

          <div className="flex-item">
            <p className="red-color">
              Funding From:&nbsp;&nbsp;Total Amount: &nbsp;&nbsp;
              {formattedTotalAmountOut}
            </p>

            <DataGrid
              id="gridContainerOuttransfers"
              dataSource={transferOutData}
              columnAutoWidth={true}
              selection={{
                mode: "single",
                showCheckBoxesMode: "always", // Show checkboxes always
              }}
              selectedRowKeys={selectedRowKeys}
              onSelectionChanged={handleSelectionChangeOut}
              key={resetkey}
            >
              <Editing
                mode="row"
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
                caption={"Seg"}
                hidingPriority={7}
                allowEditing={true}
                width={50}
              ></Column>
              {/* <Column
                dataField={"DESCRIPTION"}
                caption="Description"
                allowEditing={true}
              /> */}

              <Column
                dataType="date"
                dataField={"TRANSACTIONDATE"}
                caption={"Date"}
                hidingPriority={7}
                allowEditing={true}
              >
                <RequiredRule message="A Date is required" />
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
        <div className="red-color">
          <p></p>
          &nbsp;&nbsp;
          <Button text="Process Transfers" onClick={processTransfers} />
          &nbsp;&nbsp;
          <Button text="Reset" onClick={resetTransfers} />
          <p></p>
        </div>
        {showdetailtransfer && (
          <TransferDetails
            myClientCode={myClientCode}
            transfersin={selectedUniqueIDsIn}
            transfersout={selectedUniqueIDsOut}
            transferBalance={totalAmountIn}
            skipbuild={skipbuild}
            resetkey={refreshKey}
            effectiveDate={startdate}
            onRefreshGrid={refreshDataGrid}
          />
        )}
      </div>
    </>
  );
}

export default function Transfers(props) {
  //console.log("my client", props.clientCode);
  return <Transfersx clientCode={props.clientCode} />;
}
