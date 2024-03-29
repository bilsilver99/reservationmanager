import React from "react";

//import React, { useEffect, useState } from "react";
//import { Popup, Position, ToolbarItem } from "devextreme-react/popup";
//import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//import { faCheckSquare, faSquare } from "@fortawesome/free-solid-svg-icons";
//import { getTransactionGroups } from "../../api/MyOwnServices";
//
import DataGrid, {
  Column,
  Editing,
  Popup,
  Paging,
  Lookup,
  Form,
  Pager,
  FilterRow,
  HeaderFilter,
  Search,
  SearchPanel,
} from "devextreme-react/data-grid";
import { Item } from "devextreme-react/form";
import "devextreme-react/text-area";
import "devextreme/data/data_source";
import { useAuth } from "../../contexts/auth";
import "./app.scss";
//import { mystore } from "./stockTransactionTypesData";
import { mystore2 } from "./stockTransactionTypesData";
import "whatwg-fetch";
import CustomStore from "devextreme/data/custom_store";
import SelectBox from "devextreme-react/select-box";

const allowedPageSizes = [8, 12, 24];

//let pageoption = 90;

class StockTransactionTypesx extends React.Component {
  constructor(props) {
    super(props);
    this.applyFilterTypes = [
      {
        key: "auto",
        name: "Immediately",
      },
      {
        key: "onClick",
        name: "On Button Click",
      },
    ];
    this.state = {
      //myClient: this.props.clientCode,
      currentRow: 0,
      filterValue: "90",
      selectedRowKeys: [],
      transactionGroupData: [], // add new state variable
      companyCode: 1,
      showFilterRow: true,
      showHeaderFilter: true,
      currentFilter: this.applyFilterTypes[0].key,
      //bankNameToAuthorize: "", // add new state variable
    };
  }

  handleSelectionChanged(e) {
    this.setState({ selectedRowKeys: e.selectedRowKeys });
    if (e.selectedRowKeys.length > 0) {
      this.setState({ currentRow: e.selectedRowKeys[0] }); // update the current row
    }
  }

  handleEditingStart(e) {
    //console.log("Editing is starting for row", e.data);

    // You can access the data of the row that is being edited
    const rowToBeEdited = e.data;

    // Perform any checks or logic you want here.
    // For example, you might want to prevent editing if a certain condition is met:
    if (rowToBeEdited.someField === "someValue") {
      e.cancel = true; // Prevents the editing from starting
    }
  }

  handleInitNewRow = (e) => {
    // Setting default values for the new row
    e.data.PURCHASE = false;
    e.data.SALE = false;
    e.data.COST = false;
    e.data.NONCASH = false;
  };

  render() {
    return (
      <div className="content-block dx-card responsive-paddings">
        <DataGrid
          dataSource={mystore2(this.props.companyCode)}
          keyExpr="UNIQUEID"
          showBorders={true}
          remoteOperations={false}
          onSelectionChanged={this.handleSelectionChanged.bind(this)} // add this line
          onEditingStart={this.handleEditingStart}
          onInitNewRow={this.handleInitNewRow}
        >
          <FilterRow
            visible={this.state.showFilterRow}
            applyFilter={this.state.currentFilter}
          />
          <HeaderFilter visible={this.state.showHeaderFilter} />
          <SearchPanel visible={true} width={240} placeholder="Search..." />
          <Paging enabled={true} />
          <Editing
            mode="cell"
            allowUpdating={true}
            allowAdding={true}
            allowDeleting={true}
          >
            <Popup
              title="Type Info"
              showTitle={true}
              width={900}
              height={500}
            />
            <Form>
              <Item
                itemType="group"
                colCount={2}
                colSpan={2}
                showBorders={true}
              >
                <Item dataField="STOCKTRANSACTIONCODE" />
                <Item dataField="DESCRIPTION" />
              </Item>

              <Item
                itemType="group"
                caption="Options"
                colCount={6}
                colSpan={6}
                showBorders={true}
              >
                <Item
                  dataField={"PURCHASE"}
                  editorType="dxCheckBox"
                  cssClass="tight-spacing"
                  label={{ text: "Purchase", location: "right" }}
                />
                <Item
                  dataField={"SALE"}
                  editorType="dxCheckBox"
                  cssClass="tight-spacing"
                  label={{ text: "Sale", location: "right" }}
                />
                <Item
                  dataField={"COST"}
                  editorType="dxCheckBox"
                  cssClass="tight-spacing"
                  label={{ text: "Cost", location: "right" }}
                />
                <Item
                  dataField={"NONCASH"}
                  editorType="dxCheckBox"
                  cssClass="tight-spacing"
                  label={{ text: "Noncash", location: "right" }}
                />
              </Item>
            </Form>
          </Editing>
          <Column
            dataField={"STOCKTRANSACTIONCODE"}
            width={190}
            caption={"Transaction Code"}
            hidingPriority={8}
            visible={true}
          />
          <Column
            dataField={"DESCRIPTION"}
            width={190}
            caption={"Description"}
            hidingPriority={8}
            visible={true}
          />

          <Column
            dataType="boolean"
            dataField={"PURCHASE"}
            caption={"Purchase"}
            hidingPriority={8}
            visible={true}
            editorType="dxCheckBox"
          />
          <Column
            dataType="boolean"
            dataField={"SALE"}
            caption={"Sales"}
            hidingPriority={8}
            visible={true}
            //onCellClick={this.handleActionRequiredClick}
          />
          <Column
            dataType="boolean"
            dataField={"COST"}
            caption={"Cost"}
            hidingPriority={8}
            visible={true}
            //onCellClick={this.handleActionRequiredClick}
          />
          <Column
            dataType="boolean"
            dataField={"NONCASH"}
            caption={"Non Cash"}
            hidingPriority={8}
            visible={true}
            //onCellClick={this.handleActionRequiredClick}
          />
          <Column
            dataField={"UNIQUEID"}
            width={90}
            hidingPriority={8}
            dataType="Number"
            visible={false}
            allowEditing={false}
          />
          <Paging defaultPageSize={8} />
          <Pager
            showPageSizeSelector={true}
            allowedPageSizes={allowedPageSizes}
          />
        </DataGrid>
      </div>
    );
  }
}
// function cellRender(data) {
//   //console.log("wtf", data.row.data.IMAGE);
//   if (data.row.data.IMAGE || 0)
//     return (
//       <img
//         src={imagetoshow[data.row.data.IMAGE - 1]}
//         alt={data.row.data.BANKNAME}
//         height={40}
//       />
//       // <img src={cibc} alt={`${data.row.data.IMAGE}`} height={40} />
//     );
// }

// function cellRender(data) {
//   console.log("sent", data);
//   return <img src={`${data}`} alt="BANK" height={40} />;
// }

export default function StockTransactionTypes() {
  const { user } = useAuth();
  //console.log({ user });
  return <StockTransactionTypesx companyCode={user.companyCode} />;
}

//{
/* <SimpleItem
dataField="TRANSACTIONGROUP"
editorType="dxLookup"
editorOptions={{
  dataSource: this.state.transactionGroupData,
  displayExpr: "CODE",
  //valueExpr: "CODE",
  
}}
/> */
//}

// dataField={"TRANSACTIONGROUP"}
//             width={190}
//             caption={"Transaction Group"}
//             hidingPriority={8}
//             visible={true}
//           />
