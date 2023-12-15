import React from "react";
import { useAuth } from "../../../contexts/auth";
import DataGrid, {
  Column,
  Paging,
  FilterRow,
  HeaderFilter,
} from "devextreme-react/data-grid";

import { mystore12 } from "./clientInvestmentsData";
import "devextreme-react/text-area";
import "devextreme/data/data_source";
import "./debtSummaryStyles.scss";

function ClientInvestmentsSummary(props) {
  console.log("props", props.StockID);
  //const [StockID, setStockID] = React.useState(props.stockID);
  //console.log("stockID", StockID);

  return (
    <>
      <h4>Stock Summary By Period</h4>
      <DataGrid
        dataSource={mystore12(props.StockID)}
        //keyExpr="UNIQUEID"
        showBorders={true}
        remoteOperations={false}
        //onSelectionChanged={handleSelectionChanged.bind(this)} // add this line
        //onEditingStart={handleEditingStart}
        width={"60%"}
        columnAutoWidth={true}
        //height={300}
        paging={{ pageSize: 5 }}
        colCount={10}
        colSpan={20}
      >
        <Column
          dataField={"INVESTMENTNAME"}
          width={100}
          caption={"Investment"}
          hidingPriority={8}
          visible={true}
        />
        <Column
          dataField={"TRANSACTIONDATE"}
          width={150}
          caption={"Date"}
          hidingPriority={8}
          visible={true}
        />
        <Column
          dataField={"CURRENTVALUE"}
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

export default ClientInvestmentsSummary;
