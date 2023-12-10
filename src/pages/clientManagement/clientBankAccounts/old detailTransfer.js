import React, { useState, useEffect, useCallback } from "react";

//import Swal from "sweetalert2";
//import withReactContent from "sweetalert2-react-content";
import { returnTransferDetails } from "./transferData";

import {
  getTransactionTypes,
  //fetchThisClientData,
} from "./segmentData";

import DataGrid, {
  Column,
  Lookup,
  Paging,
  Editing,
  Summary,
  TotalItem,
  Selection,
  //MasterDetail,
  //Popup,
  //Form,
  //SearchPanel,
  //ValidationRule,
} from "devextreme-react/data-grid";
//import { set } from "date-fns";

function DetailTransfersx(props) {
  //const [refreshing, setRefreshing] = useState(props.refreshKey);
  const [transferInData, setTransferInData] = useState(props.transfersin);
  const [summaryInData, setSummaryInData] = useState(null);
  const [selectedUniqueIDs, setSelectedUniqueIDs] = useState([]);
  //const [postedValue, setPostedValue] = useState(0);

  const [myClientCode, setClientCode] = useState(props.clientCode);
  const [transTypes, setTransTypes] = useState(null);
  const [skipbuild, setSkipBuild] = useState(props.skipbuild);
  const [transferBalance, setTransferBalance] = useState(props.transferBalance);
  const [postedValue, setPostedValue] = useState(0);

  //const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useEffect(() => {
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

  const formattedTotalAmountOut = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(transferBalance);

  const formattedPosted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(postedValue);

  // const handleEditorValueChanged = useCallback(
  //   (e) => {
  //     if (e.row && e.dataField === "EDITVALUE") {
  //       //console.log("the value keyed in", e.value);
  //       // Perform your logic here
  //     }
  //   },
  //   [
  //     /* dependencies if any */
  //   ]
  // );

  // const calculateTotalEditValue = () => {
  //   let total = 0;
  //   console.log("row", transferInData);
  //   transferInData.forEach((row) => {
  //     total += row.EDITVALUE || 0; // Add EDITVALUE if it exists, otherwise add 0
  //     console.log("row", row.EDITVALUE);
  //   });
  //   setPostedValue(total); // Update the postedValue state with the new total
  //   console.log("total", total);
  // };

  // const handleEditorPreparing = useCallback((e) => {
  //   if (e.parentType === "dataRow" && e.dataField === "EDITVALUE") {
  //     setSkipBuild(true);
  //     e.editorOptions.value = e.row.data.TRANSACTIONAMOUNT * -1;
  //     if (e.editorOptions.value > transferBalance) {
  //       e.editorOptions.value = transferBalance;
  //     } else {
  //       e.editorOptions.value = e.row.data.TRANSACTIONAMOUNT * -1;
  //     }

  //     e.row.data.EDITVALUE = e.editorOptions.value;
  //   }
  // }, []);

  //const oncellselected   = (e) => { if (e.dataField === "EDITVALUE") { setEditValue(e.value); }

  return (
    <div className="custom-container" width={"100%"}>
      <div className="flex-container">
        <div className="flex-item">
          <p className="red-color">
            Summary - Balance to Post: {formattedTotalAmountOut}
            &nbsp;&nbsp;posted - {formattedPosted}
          </p>
          <DataGrid
            id="gridContainer"
            dataSource={returnTransferDetails(
              transferInData,
              myClientCode,
              skipbuild
            )}
            keyExpr="UNIQUEID"
            //onEditorPreparing={handleEditorPreparing}
            //onSelectionChanged={onEditorValueChanged}
            width={"50%"}
            columnAutoWidth={true}
            remoteOperations={true}
            allowEditing={true}
            //selectedRowKeys2={selectedRowKeys}
            //onRowUpdated={calculateTotalEditValue}
          >
            <Selection mode="single" />
            <Editing
              mode="cell"
              allowUpdating={true}
              allowAdding={false}
              allowDeleting={false}
              selectionMode="single"
            ></Editing>
            <Paging enabled={false} />
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
              caption={"Post value"}
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

            <Summary>
              <TotalItem
                column="TRANSACTIONAMOUNT"
                summaryType="sum"
                valueFormat="currency"
              />
            </Summary>
          </DataGrid>
        </div>
      </div>
    </div>
  );
}

export default function DetailTransfers(props) {
  console.log(
    "in",
    props.transfersin,
    "out",
    props.transfersout,
    "bal",
    props.transferBalance,
    "skip",
    props.skipbuild
  );
  return (
    <DetailTransfersx
      clientCode={props.myClientCode}
      transfersin={props.transfersin}
      transfersout={props.transfersout}
      transferBalance={props.transferBalance}
      skipbuild={props.skipbuild}
    />
  );
}
