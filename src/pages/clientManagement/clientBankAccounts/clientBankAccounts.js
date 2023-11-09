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
  MasterDetail,
} from "devextreme-react/data-grid";
import { Item } from "devextreme-react/form";
import "devextreme-react/text-area";
import "devextreme/data/data_source";
import { useAuth } from "../../../contexts/auth";
import "./app.scss";
import { mystore } from "./clientBanksAccountsData";
import { mystore2 } from "./clientBanksAccountsData";
import "whatwg-fetch";
import ClientBankSegments from "./clientBankSegments";
//import CustomStore from "devextreme/data/custom_store";
//import SelectBox from "devextreme-react/select-box";

const allowedPageSizes = [8, 12, 24];

let pageoption = 90;

class ClientBankAccountsx extends React.Component {
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

  // componentDidMount() {
  //   mystore2() // call the function to fetch data
  //     .then((data) => {
  //       //console.log("data", data);
  //       this.setState({ transactionGroupData: data.data }); // store the data in state
  //     })
  //     .catch((error) => {
  //       console.error(
  //         "There was an error fetching the transaction group data:",
  //         error
  //       );
  //     });
  // }

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

  render() {
    return (
      <div className="content-block dx-card responsive-paddings">
        <DataGrid
          dataSource={mystore(this.props.clientCode)}
          //keyExpr="UNIQUEID"
          showBorders={false}
          remoteOperations={false}
          onSelectionChanged={this.handleSelectionChanged.bind(this)} // add this line
          onEditingStart={this.handleEditingStart}
          width={"100%"}
        >
          <FilterRow
            visible={this.state.showFilterRow}
            applyFilter={this.state.currentFilter}
          />
          <HeaderFilter visible={this.state.showHeaderFilter} />
          <SearchPanel visible={true} width={240} placeholder="Search..." />
          <Paging enabled={true} />
          <Column
            dataField={"UNIQUEID"}
            width={190}
            caption={"ID"}
            hidingPriority={8}
            visible={false}
          />
          <Column
            dataField={"CLIENTCODE"}
            width={190}
            caption={"Client"}
            hidingPriority={8}
            visible={false}
          />
          <Column
            dataField={"BANKCODE"}
            width={40}
            caption={"Bank Code"}
            hidingPriority={8}
            visible={false}
          />
          <Column
            dataField={"BANKNAME"}
            width={100}
            caption={"Bank"}
            hidingPriority={8}
            visible={true}
          />
          <Column
            dataField={"BANKACCOUNTNUMBER"}
            width={200}
            caption={"Account"}
            hidingPriority={8}
            visible={true}
          />
          <Column
            dataField={"ACCOUNTDESCRIPTION"}
            width={400}
            caption={"Description"}
            hidingPriority={8}
            visible={true}
          />
          <Column
            dataField={"BANKBALANCE"}
            width={190}
            caption={"Balance"}
            hidingPriority={8}
            visible={true}
            format={"$###,###,###.00"}
            alignment="right"
          />
          <Column
            dataField={"AVAILABLEBALANCE"}
            width={190}
            caption={"Available Balance"}
            hidingPriority={8}
            visible={true}
            format={"$###,###,###.00"}
            alignment="right"
          />
          <Column
            dataField={"ACCOUNTLIMIT"}
            width={190}
            caption={"Account Limit"}
            hidingPriority={8}
            visible={true}
            format={"$###,###,###.00"}
            alignment="right"
          />
          <MasterDetail
            enabled={true}
            render={renderDetail}
            sendor={this.state.filterValue}
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

export default function ClientBankAccounts() {
  const { user } = useAuth();
  //console.log("my user stuff", { user });
  return <ClientBankAccountsx clientCode={user.thisClientcode} />;
}

function renderDetail(props) {
  //console.log("unique", props.data.UNIQUEID, "range: ", pageoption);
  const uniqueid = props.data.UNIQUEID;
  return <ClientBankSegments rowid={uniqueid} sendit={pageoption} />;
}
// {/* <Editing
// mode="popup"
// allowUpdating={true}
// allowAdding={true}
// allowDeleting={true}
// >
// <Popup
//   title="Type Info"
//   showTitle={true}
//   width={900}
//   height={800}
// />
// <Form>
//   <Item
//     itemType="group"
//     colCount={2}
//     colSpan={2}
//     showBorders={true}
//   >
//     <Item dataField="BANKACCOUNTTYPE" />
//     <Item dataField="DESCRIPTION" />

//     <Item
//       dataField="REPORTINGSEQUENCE"
//       label={{ text: "Reporting Sequence" }}
//     />
//   </Item>

//   <Item
//     itemType="group"
//     caption="Options"
//     colCount={2}
//     colSpan={2}
//     showBorders={true}
//   >
//     <Item dataField={"ASSET"} />
//     <Item dataField={"LIABILITY"} />
//     <Item dataField={"PERSONALACCOUNT"} />
//     <Item dataField={"LOC"} />
//     <Item dataField={"INVESTMENT"} />
//     <Item dataField={"SAVINGS"} />
//     <Item dataField={"INVESTMENTLOANS"} />
//     <Item dataField={"PERSONALLOANS"} />
//     <Item dataField={"HOUSE"} />
//     <Item dataField={"REALESTATEINVESTMENT"} />
//     <Item dataField={"CFM"} />
//     <Item dataField={"REALESTATERENTALMORTGAGE"} />
//     <Item dataField={"SINGLELINESUMMARY"} />
//     <Item dataField={"BUSINESSLOAN"} />
//   </Item>
// </Form>
// </Editing> */}
