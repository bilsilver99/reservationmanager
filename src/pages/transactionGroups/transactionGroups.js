import React, { useEffect, useState } from "react";
//import { Popup, Position, ToolbarItem } from "devextreme-react/popup";
//import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//import { faCheckSquare, faSquare } from "@fortawesome/free-solid-svg-icons";
//import { getTransactionGroups } from "../../api/MyOwnServices";
import DataGrid, {
  Column,
  Paging,
  Pager,
  Sorting,
  Editing,
  FilterRow,
  Item,
  Popup,
  Form,
  MasterDetail,
} from "devextreme-react/data-grid";

//import SelectBox from "devextreme-react/select-box";
import "devextreme-react/text-area";
//import BankTransactions from "./bankTransactions";
import "devextreme/data/data_source";
import { useAuth } from "../../contexts/auth";
import "./app.scss";
import { mystore } from "./transactionData";
//import { Button } from "devextreme-react";
//import { SelectBox } from "devextreme-react";
//import { Template } from "devextreme-react/core/template";

const allowedPageSizes = [8, 12, 20];

let pageoption = 90;

class TransactionGroupsx extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //myClient: this.props.clientCode,
      currentRow: 0,
      filterValue: "90",
      selectedRowKeys: [],
      //bankNameToAuthorize: "", // add new state variable
    };
  }

  handleFilterChange = (e) => {
    this.setState({ filterValue: e.value }, () => {
      //console.log("New filter value:", this.state.filterValue);
      pageoption = this.state.filterValue;
    });
  };

  handleSelectionChanged(e) {
    this.setState({ selectedRowKeys: e.selectedRowKeys });
  }

  applyFilter = () => {
    //const { filterValue } = this.state;
    // Perform filter action with the selected filter value
    // You can pass the filterValue to your data source or perform any other filtering logic
    //console.log("Filter value:", filterValue);
  };

  render() {
    return (
      <div className="content-block dx-card responsive-paddings">
        <h3>Transaction Groups</h3>
        <DataGrid
          dataSource={mystore(this.state.companyCode)}
          showBorders={true}
        >
          <Editing mode="cell" allowUpdating={true} />
          <FilterRow visible={false} />
          <Sorting mode="single" />
          <Column
            dataField={"CODE"}
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
            dataField={"SEQUENCE"}
            width={190}
            caption={"Sequence"}
            hidingPriority={8}
            visible={true}
          />
          <Column
            dataType="boolean"
            dataField={"PERSONALACCOUNTS"}
            caption={"Personal Accounts"}
            hidingPriority={8}
            visible={true}
          />
          <Column
            dataType="boolean"
            dataField={"SHOWONNETWORTHDETAILS"}
            caption={"Show on Net Worth"}
            hidingPriority={8}
            width={150}
            visible={true}
            //onCellClick={this.handleActionRequiredClick}
          />
          <Column
            dataType="boolean"
            dataField={"SEPARATEDEDUCTIBLELINE"}
            caption={"Separate Deductible Line"}
            hidingPriority={8}
            width={150}
            visible={true}
            //onCellClick={this.handleActionRequiredClick}
          />

          <Column
            dataField={"UNIQUEID"}
            width={90}
            hidingPriority={8}
            dataType="Number"
            visible={false}
          />
          {/* <MasterDetail
            enabled={true}
            render={renderDetail}
            sendor={this.state.filterValue}
          />
          <Paging defaultPageSize={12} />
          <Pager
            showPageSizeSelector={true}
            allowedPageSizes={allowedPageSizes}
          /> */}
        </DataGrid>
      </div>
    );
  }
  // handleRowClick = (e) => {
  //   this.setState({ currentRow: e.row });
  //   console.log(this.state.currentRow);
  //   console.log("here");
  // };
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

export default function TransactionGroups() {
  const { user } = useAuth();
  //console.log({ user });
  return <TransactionGroupsx companyCode={user.companyCode} />;
}
