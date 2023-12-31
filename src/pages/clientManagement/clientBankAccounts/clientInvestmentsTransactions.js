import React, { useEffect } from "react";
import { useAuth } from "../../../contexts/auth";
import DataGrid, {
  Column,
  Paging,
  FilterRow,
  HeaderFilter,
  Editing,
  Lookup,
} from "devextreme-react/data-grid";

import { mystore13, getStockTypes } from "./clientInvestmentsData";
import "devextreme-react/text-area";
import "devextreme/data/data_source";
import "./debtSummaryStyles.scss";

function ClientInvestmentsSummary(props) {
  //console.log("props", props.StockID);
  //const [StockID, setStockID] = React.useState(props.stockID);
  //console.log("stockID", StockID);

  const [investmentTypes, setInvestmentTypes] = React.useState([]);

  useEffect(() => {
    getStockTypes()
      .then((data) => {
        setInvestmentTypes(data.data);
      })
      .catch((error) => {
        console.error("Error fetching investment types:", error);
      });
  }, []);

  return (
    <div className="red-color">
      <p>Stock Transactions</p>
      <DataGrid
        dataSource={mystore13(props.StockID)}
        //keyExpr="UNIQUEID"
        showBorders={true}
        remoteOperations={false}
        //onSelectionChanged={handleSelectionChanged.bind(this)} // add this line
        //onEditingStart={handleEditingStart}
        width={"100%"}
        columnAutoWidth={true}
        //height={800}
        paging={{ pageSize: 10 }}
        colCount={10}
        colSpan={20}
        style={{ border: "1px solid black" }}
      >
        <Editing
          mode="row"
          allowUpdating={true}
          allowAdding={true}
          allowDeleting={false}
        ></Editing>
        <Column
          dataField={"NONCASHTRANSACTION"}
          caption="Non Cash"
          dataType="boolean"
          visible={true}
          allowEditing={false}
          width={150}
        />
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
          width={150}
          caption={"Stock"}
          hidingPriority={8}
          visible={true}
        />
        <Column dataField={"TRANSACTIONTYPE"}>
          caption={"Transaction Type"}
          width={550}
          <Lookup
            dataSource={investmentTypes}
            valueExpr="STOCKTRANSACTIONCODE"
            displayExpr="STOCKTRANSACTIONCODE"
          />
        </Column>
        <Column
          dataType="date"
          dataField={"TRANSACTIONDATE"}
          width={200}
          caption={"Date"}
          hidingPriority={8}
          visible={true}
        />
        <Column
          dataField={"DESCRIPTION"}
          width={500}
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
    </div>
  );
}

export default ClientInvestmentsSummary;
