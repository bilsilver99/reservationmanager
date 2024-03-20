import React, { useState } from "react";
import { useAuth } from "../../../contexts/auth";
import DataGrid, {
  Column,
  Editing,
  Paging,
  FilterRow,
  HeaderFilter,
} from "devextreme-react/data-grid";

import { mystore12 } from "./clientInvestmentsData";
import "devextreme-react/text-area";
import "devextreme/data/data_source";
import "./debtSummaryStyles.scss";

function ClientInvestmentsSummary(props) {
  //console.log("props", props);
  //const [StockID, setStockID] = React.useState(props.stockID);
  //console.log("stockID", props.StockID);

  const [refreshKey, setRefreshKey] = useState(props.refreshKey);

  const onInitNewRow = (e) => {
    e.data.INVESTMENTNAME = props.StockName;
    e.data.CLIENTCODE = props.ClientCode;
  };

  const updatekey = (e) => {
    props.onRefresh();
  };

  return (
    <div className="red-color">
      <p>Stock Summary By Period</p>
      <DataGrid
        dataSource={mystore12(props.StockID)}
        //keyExpr="UNIQUEID"
        key={refreshKey}
        showBorders={true}
        remoteOperations={false}
        //onSelectionChanged={handleSelectionChanged.bind(this)} // add this line
        //onEditingStart={handleEditingStart}
        width={"100%"}
        columnAutoWidth={true}
        //height={300}
        paging={{ pageSize: 10 }}
        colCount={1}
        colSpan={1}
        onInitNewRow={onInitNewRow}
        onRowUpdated={updatekey}
        onRowRemoved={updatekey}
        style={{ border: "1px solid black" }}
      >
        <Editing
          mode="row"
          allowUpdating={true}
          allowAdding={true}
          allowDeleting={true}
        ></Editing>
        <Column
          dataField="CLIENTCODE"
          width={100}
          caption={"Client Code"}
          hidingPriority={8}
          allowEditing={false}
          visible={true}
        />
        <Column
          dataField={"INVESTMENTNAME"}
          width={150}
          caption={"Account #"}
          hidingPriority={8}
          allowEditing={false}
          visible={true}
        />
        <Column
          dataType="date"
          dataField={"TRANSACTIONDATE"}
          width={150}
          caption={"Date (mm/dd/yyyy)"}
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
    </div>
  );
}

export default ClientInvestmentsSummary;
