import React from "react";
import { useAuth } from "../../../contexts/auth";
import DataGrid, {
  Column,
  Paging,
  FilterRow,
  HeaderFilter,
} from "devextreme-react/data-grid";

import { mystore14 } from "./clientInvestmentsData";
import "devextreme-react/text-area";
import "devextreme/data/data_source";
import "./debtSummaryStyles.scss";

function ClientInvestmentsStocks(props) {
  console.log("props", props.StockID);
  //const [StockID, setStockID] = React.useState(props.stockID);
  //console.log("stockID", StockID);

  return (
    <>
      <h4>Stocks</h4>
      <DataGrid
        dataSource={mystore14(props.StockID)}
        //keyExpr="UNIQUEID"
        showBorders={true}
        remoteOperations={false}
        //onSelectionChanged={handleSelectionChanged.bind(this)} // add this line
        //onEditingStart={handleEditingStart}
        width={"100%"}
        columnAutoWidth={true}
        //height={300}
        paging={{ pageSize: 5 }}
        colCount={10}
        colSpan={20}
      >
        <Column
          dataField={"INVESTMENTNAME"}
          width={150}
          caption={"Investment"}
          hidingPriority={8}
          visible={false}
        />
        <Column
          dataField={"STOCKCODE"}
          width={100}
          caption={"Stock"}
          hidingPriority={8}
          visible={true}
        />
        <Column
          dataField={"TRANSACTIONDATE"}
          width={150}
          caption={"Purchase Date "}
          hidingPriority={8}
          visible={true}
        />
        <Column
          dataField={"DESCRIPTION"}
          width={200}
          caption={"Description"}
          hidingPriority={8}
          visible={true}
        />
        <Column
          dataField={"QUANTITY"}
          width={100}
          caption={"Units"}
          hidingPriority={8}
          visible={true}
          format={"###,###,###.0000"}
        />
        <Column
          dataField={"UNITPRICE"}
          width={150}
          caption={"Price/Per"}
          hidingPriority={8}
          visible={true}
          format={"$###,###,###.0000"}
        />
        <Column
          dataField={"AMOUNT"}
          width={150}
          caption={"Value"}
          hidingPriority={8}
          visible={true}
          format={"$###,###,###.00"}
        />
      </DataGrid>
    </>
  );
}

export default ClientInvestmentsStocks;
