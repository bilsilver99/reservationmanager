import React, { useState } from "react";
import { useAuth } from "../../../contexts/auth";
import DataGrid, {
  Column,
  Paging,
  FilterRow,
  HeaderFilter,
  Editing,
} from "devextreme-react/data-grid";

import {
  Validator,
  RequiredRule,
  CompareRule,
  EmailRule,
  PatternRule,
  StringLengthRule,
  RangeRule,
  AsyncRule,
  CustomRule,
} from "devextreme-react/validator";

//import { fetchQuote } from "./getStockData";

import { mystore14, checkStocks } from "./clientInvestmentsData";
import "devextreme-react/text-area";
import "devextreme/data/data_source";
import "./debtSummaryStyles.scss";

function ClientInvestmentsStocks(props) {
  //console.log("props in ClientInvestmentsStocks", props.StockID);
  //const [StockID, setStockID] = React.useState(props.stockID);
  //console.log("stockID", StockID);

  const [refreshKey, setRefreshKey] = useState(props.sharedValue);

  const onEditorPreparing = (e) => {
    // Check if the row is not new
    if (e.parentType === "dataRow" && !e.row.isNewRow) {
      // Disable editing for a specific field
      if (e.dataField === "STOCKCODE") {
        //console.log("e.value", e.value);
        //        fetchQuote(e.value);

        e.editorOptions.disabled = true;
      }
    }
  };

  const validateSegment = async (params) => {
    console.log(
      "params coming in stock code: ",
      params.value,
      "stockid",
      props.StockID
    );

    //return await fetchLastClosePrice(params.value, props.StockID);
  };

  // const [stock, setStock] = useState("");
  // const [lastClose, setLastClose] = useState(null);

  // const fetchLastClosePrice = () => {
  //   const API_KEY = process.env.REACT_APP_API_KEY; // Replace with your Finnhub API key
  //   const url = `https://finnhub.io/api/v1/quote?symbol=${stock}&token=${API_KEY}`;

  //   fetch(url)
  //     .then((response) => response.json())
  //     .then((data) => setLastClose(data.c))
  //     .catch((error) => console.error("Error fetching data: ", error));
  // };

  // // const refreshData = () => {
  // //   setRefreshKey((oldKey) => oldKey + 1);
  // // };

  return (
    <div className="red-color">
      <p>Stocks&nbsp;&nbsp;{props.StockID}</p>
      <DataGrid
        dataSource={mystore14(props.StockID)}
        showBorders={true}
        remoteOperations={false}
        width={"100%"}
        columnAutoWidth={true}
        paging={{ pageSize: 5 }}
        colCount={10}
        colSpan={20}
        onEditorPreparing={onEditorPreparing}
        key={refreshKey}
        style={{ border: "1px solid black" }}
      >
        <Editing
          mode="row"
          allowUpdating={true}
          allowAdding={true}
          allowDeleting={false}
        ></Editing>
        <Column
          dataField={"INVESTMENTNAME"}
          width={150}
          caption={"Investment"}
          hidingPriority={8}
          visible={false}
          allowEditing={false}
        />

        <Column
          dataField={"STOCKCODE"}
          caption={"Stock"}
          hidingPriority={8}
          allowEditing={true}
          width={100}
        >
          <AsyncRule
            message="Stock Code Already Exists in this Investment"
            validationCallback={validateSegment}
          />
        </Column>
        <Column
          dataType="date"
          dataField={"TRANSACTIONDATE"}
          width={150}
          caption={"Purchase Date "}
          hidingPriority={8}
          visible={true}
        />
        <Column
          dataField={"DESCRIPTION"}
          width={100}
          caption={"Description"}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={"QUANTITY"}
          width={140}
          caption={"Units"}
          hidingPriority={8}
          visible={true}
          format={"###,###,###.0000"}
        />
        <Column
          dataField={"UNITPRICE"}
          width={140}
          caption={"Price/Per"}
          hidingPriority={8}
          visible={true}
          format={"$###,###,###.0000"}
        />
        <Column
          dataField={"AMOUNT"}
          width={140}
          caption={"Value"}
          hidingPriority={8}
          visible={true}
          format={"$###,###,###.00"}
        />
        <Column
          dataField={"TOTALUNITSPURCHASED"}
          width={140}
          caption={"Units Purchased"}
          hidingPriority={8}
          visible={true}
          format={"###,###,###.0000"}
        />
        <Column
          dataField={"TOTALUNITSSOLD"}
          width={140}
          caption={"Units Sold"}
          hidingPriority={8}
          visible={true}
          format={"###,###,###.0000"}
        />
        <Column
          dataField={"TOTALPURCHASECOST"}
          width={140}
          caption={"Total Purchase Cost"}
          hidingPriority={8}
          visible={true}
          format={"$###,###,###.00"}
        />
        <Column
          dataField={"TOTALSALESVALUE"}
          width={140}
          caption={"Total Sales Value"}
          hidingPriority={8}
          visible={true}
          format={"$###,###,###.00"}
        />
        {/* <Column
          dataField={"TOTALCOMMISSIONCOSTS"}
          width={140}
          caption={"Commission Costs"}
          hidingPriority={8}
          visible={true}
          format={"$###,###,###.00"}
        />
        <Column
          dataField={"TOTALCOMMISSIONCOSTSREMOVED"}
          width={140}
          caption={"Commission Costs Removed"}
          hidingPriority={8}
          visible={true}
          format={"$###,###,###.00"}
        /> */}
        <Column
          dataField={"CURRENTACBVALUE"}
          width={140}
          caption={"Current ACB Value"}
          hidingPriority={8}
          visible={true}
          format={"$###,###,###.00"}
        />
        <Column
          dataField={"CURRENTSTOCKUNITPRICE"}
          width={140}
          caption={"Current Unit Price"}
          hidingPriority={8}
          visible={true}
          format={"$###,###,###.00"}
        />
        <Column
          dataField={"TOTALSTOCKCURRENTPRICE"}
          width={140}
          caption={"Current Market Value"}
          hidingPriority={8}
          visible={true}
          format={"$###,###,###.00"}
        />
        <Column
          dataField={"NETPROFIT"}
          width={140}
          caption={"Gain/Loss"}
          hidingPriority={8}
          visible={true}
          format={"$###,###,###.00"}
        />

        {/* <Column
          dataField={"TOTALSTOCKCURRENTPRICE"}
          width={140}
          caption={"Total Market Value"}
          hidingPriority={8}
          visible={true}
          format={"$###,###,###.00"}
        /> */}
      </DataGrid>
    </div>
  );
}

export default ClientInvestmentsStocks;
