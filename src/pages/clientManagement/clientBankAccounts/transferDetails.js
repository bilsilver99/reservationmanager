import React, { useState, useEffect, useRef } from "react";
import DataGrid, {
  Column,
  Selection,
  Summary,
  TotalItem,
  Lookup,
  Editing,
} from "devextreme-react/data-grid";
import { Button } from "devextreme-react/button";
import {
  returnTransferDetailsIn,
  returnTransferDetailsOut,
  updateBankTransfers,
} from "./transferData";
import {
  getTransactionTypes,
  //fetchThisClientData,
} from "./segmentData";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

function TransferDetailsx(props) {
  const [myClientCode, setClientCode] = useState(props.clientCode);
  const [transferInData, setTransferInData] = useState(props.transfersin);
  const [transferOutData, setTransferOutData] = useState(props.transfersout);
  const [skipbuild, setSkipBuild] = useState(props.skipbuildx);
  const [transTypes, setTransTypes] = useState(null);

  const [transferBalance, setTransferBalance] = useState(props.transferBalance);
  const [postedValue, setPostedValue] = useState(0);
  const [balanceToPost, setBalanceToPost] = useState(0);

  const [effectiveDate, setEffectiveDate] = useState(props.effectiveDate);

  const dataGridRef = useRef(null);
  const MySwal = withReactContent(Swal);

  //console.log("skip:", skipbuild, "sent", props.skipbuildx);

  useEffect(() => {
    //setSkipBuild(true);
    console.log("skip:", skipbuild);
    getTransactionTypes() // call the function to fetch data
      .then((data) => {
        ////console.log("types", data.data);
        setTransTypes(data.data); // store the data in state
        ////console.log("new types", transTypes);
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the transaction Types data:",
          error
        );
      });
  }, []);

  useEffect(() => {
    setSkipBuild(false);
  }, [props.resetkey]);

  const handleRowValidating = (e) => {
    console.log("validating", e.newData);
    const { EDITVALUE } = e.newData;
    const TRANSACTIONAMOUNT = e.oldData.TRANSACTIONAMOUNT;
    const formattedBalance = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(transferBalance - (postedValue - EDITVALUE));

    // if (EDITVALUE > TRANSACTIONAMOUNT * -1) {
    //   e.isValid = false; // Prevents the row from being saved
    //   //e.newData.EDITVALUE = e.oldData.EDITVALUE;
    //   e.errorText =
    //     "Edit value cannot be greater than the value of Transaction Amount.";
    // } else {
    // if (EDITVALUE + (postedValue - EDITVALUE) > transferBalance) {
    //   e.isValid = false; // Prevents the row from being saved
    //   //e.newData.EDITVALUE = e.oldData.EDITVALUE;
    //   e.errorText = `Values cannot exceed the total to be posted of ${formattedBalance}`;
    // }
    //}
  };

  const formattedTotalAmountOut = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(transferBalance);

  const formattedPosted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(postedValue);

  const formattedBalanceToPost = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(balanceToPost);

  const handleEditorPreparing = (e) => {
    if (e.parentType === "dataRow" && e.dataField === "EDITVALUE") {
      console.log("preparing", e.value, "transfer balance:", transferBalance);
      const transactionAmount = e.row.data.TRANSACTIONAMOUNT;
      const thisbalance = parseFloat(balanceToPost).toFixed(2);
      e.editorOptions.value = e.row.data.TRANSACTIONAMOUNT * -1;
      if (e.editorOptions.value > thisbalance) {
        e.editorOptions.value = thisbalance;
        e.setValue(thisbalance);
        e.row.data.EDITVALUE = thisbalance;
      } else {
        e.editorOptions.value = e.row.data.TRANSACTIONAMOUNT * -1;
        e.setValue(transactionAmount * -1);
      }
    }
  };

  const handleRowUpdating = (e) => {
    setSkipBuild(true);
  };

  const calculateSelectedRow = (options) => {
    //console.log("options", options);
    if (options.name === "SelectedRowsSummary") {
      if (options.summaryProcess === "start") {
        options.totalValue = 0;
        setBalanceToPost(transferBalance - options.totalValue);
        setPostedValue(options.totalValue);
        setSkipBuild(true);
      } else if (options.summaryProcess === "calculate") {
        options.totalValue += options.value.EDITVALUE;
        setPostedValue(options.totalValue);
        setBalanceToPost(transferBalance - options.totalValue);
      }
    }
  };

  const processActualTransfers = () => {
    if (balanceToPost !== 0) {
      MySwal.fire({
        icon: "error",
        title: "Transfer Error",
        text: `The balance to post must = 0`,
      });
    } else {
      updateBankTransfers(myClientCode, transferOutData, transferInData)
        .then((response) => {
          console.log("Transfer response:", response);
          props.onRefreshGrid();
          return MySwal.fire({
            icon: "success",
            title: "Transfer",
            text: `Transfer Complete`,
          });
        })
        .catch((error) => {
          MySwal.fire({
            icon: "error",
            title: "Transfer Error",
            text: `An error occurred: ${error.message}`,
          });
        });
    }
  };

  return (
    <React.Fragment>
      <div className="flex-container">
        <div className="flex-item">
          <p className="red-color">
            &nbsp;&nbsp;Summary - Posting Amount: {formattedTotalAmountOut}
            &nbsp;&nbsp;Posted : {formattedPosted}
            &nbsp;&nbsp;Balance : {formattedBalanceToPost}
          </p>
          <DataGrid
            ref={dataGridRef}
            id="gridContainerdetailtransfers"
            dataSource={returnTransferDetailsIn(
              transferInData,
              myClientCode,
              skipbuild
            )}
            //key={props.resetkey}
            //keyExpr="ID"
            showBorders={true}
            width={"100%"}
            onRowUpdating={handleRowUpdating} // Attach the handler here
            onRowValidating={handleRowValidating}
            onEditorPreparing={handleEditorPreparing}
            //onRowUpdated={handleRowUpdated}
            //onSelectionChanged={onSelectionChanged}
          >
            <Editing
              mode="row"
              allowUpdating={true}
              allowAdding={false}
              allowDeleting={false}
              selectionMode="single"
            ></Editing>

            <Selection mode="single" />
            <Column
              dataField={"FPTRANSACTIONCODE"}
              caption={"Type"}
              hidingPriority={7}
              allowEditing={false}
            >
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
              allowEditing={false}
              format="$###,###,###.00"
            />
            <Column
              dataField={"EDITVALUE"}
              caption={"Posted Value"}
              hidingPriority={7}
              allowEditing={true}
              format="$###,###,###.00"
            />
            <Column
              dataField={"UNIQUEID"}
              caption={"Amount"}
              hidingPriority={7}
              allowEditing={false}
              visible={false}
            />
            <Summary
              recalculateWhileEditing={false}
              calculateCustomSummary={calculateSelectedRow}
            >
              <TotalItem
                name="SelectedRowsSummary"
                summaryType="custom"
                valueFormat="currency"
                displayFormat="Total Posted: {0}"
                showInColumn="EDITVALUE"
              />
            </Summary>
          </DataGrid>
        </div>
        <div className="flex-item">
          <p className="red-color">Sum of Funding From </p>
          <DataGrid
            ref={dataGridRef}
            id="gridContainerdetailtransfers"
            dataSource={returnTransferDetailsOut(
              transferOutData,
              myClientCode,
              skipbuild
            )}
            //key={props.resetkey}
            //keyExpr="ID"
            showBorders={true}
            width={"60%"}
            onRowUpdating={handleRowUpdating} // Attach the handler here
            onRowValidating={handleRowValidating}
            onEditorPreparing={handleEditorPreparing}
            //onRowUpdated={handleRowUpdated}
            //onSelectionChanged={onSelectionChanged}
          >
            <Selection mode="single" />
            <Column
              dataField={"FPTRANSACTIONCODE"}
              caption={"Type"}
              hidingPriority={7}
              allowEditing={false}
            >
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
              allowEditing={false}
              format="$###,###,###.00"
            />
            <Column
              dataField={"UNIQUEID"}
              caption={"Amount"}
              hidingPriority={7}
              allowEditing={false}
              visible={false}
            />
            {/* <Summary
              recalculateWhileEditing={false}
              calculateCustomSummary={calculateSelectedRow}
            >
              <TotalItem
                name="SelectedRowsSummary"
                summaryType="custom"
                valueFormat="currency"
                displayFormat="Total Posted: {0}"
                showInColumn="EDITVALUE"
              />
            </Summary> */}
          </DataGrid>
        </div>
      </div>
      <div className="red-color">
        <p></p>
        &nbsp;&nbsp;
        <Button text="Process Transfers" onClick={processActualTransfers} />
      </div>
    </React.Fragment>
  );
}

export default function TransfersDetails(props) {
  console.log(
    "in",
    props.transfersin,
    "out",
    props.transfersout,
    "bal",
    props.transferBalance,
    "skip",
    props.skipbuild,
    "reset",
    props.resetkey
  );
  return (
    <TransferDetailsx
      clientCode={props.myClientCode}
      transfersin={props.transfersin}
      transfersout={props.transfersout}
      transferBalance={props.transferBalance}
      skipbuildx={props.skipbuild}
      resetkey={props.resetkey}
      effectiveDate={props.effectiveDate}
      onRefreshGrid={props.onRefreshGrid}
    />
  );
}
