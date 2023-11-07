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
import { mystore } from "./bankaccountTypesDataTypesData";
import { mystore2 } from "./bankaccountTypesData";
import "whatwg-fetch";
//import CustomStore from "devextreme/data/custom_store";
//import SelectBox from "devextreme-react/select-box";

const allowedPageSizes = [8, 12, 24];

//let pageoption = 90;

class BankaccountTypesx extends React.Component {
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

  componentDidMount() {
    mystore2() // call the function to fetch data
      .then((data) => {
        //console.log("data", data);
        this.setState({ transactionGroupData: data.data }); // store the data in state
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the transaction group data:",
          error
        );
      });
  }

  handleSelectionChanged(e) {
    this.setState({ selectedRowKeys: e.selectedRowKeys });
    if (e.selectedRowKeys.length > 0) {
      this.setState({ currentRow: e.selectedRowKeys[0] }); // update the current row
    }
  }

  handleEditingStart(e) {
    console.log("Editing is starting for row", e.data);

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
        <h3>Bank Account Types</h3>
        <DataGrid
          dataSource={mystore(this.props.companyCode)}
          keyExpr="UNIQUEID"
          showBorders={true}
          remoteOperations={false}
          onSelectionChanged={this.handleSelectionChanged.bind(this)} // add this line
          onEditingStart={this.handleEditingStart}
        >
          <FilterRow
            visible={this.state.showFilterRow}
            applyFilter={this.state.currentFilter}
          />
          <HeaderFilter visible={this.state.showHeaderFilter} />
          <SearchPanel visible={true} width={240} placeholder="Search..." />
          <Paging enabled={true} />
          <Editing
            mode="popup"
            allowUpdating={true}
            allowAdding={true}
            allowDeleting={true}
          >
            <Popup
              title="Type Info"
              showTitle={true}
              width={900}
              height={800}
            />
            <Form>
              <Item
                itemType="group"
                colCount={2}
                colSpan={2}
                showBorders={true}
              >
                <Item dataField="BANKACCOUNTTYPE" />
                <Item dataField="DESCRIPTION" />

                <Item
                  dataField="REPORTINGSEQUENCE"
                  label={{ text: "Reporting Sequence" }}
                />
              </Item>

              <Item
                itemType="group"
                caption="Options"
                colCount={2}
                colSpan={2}
                showBorders={true}
              >
                <Item dataField={"ASSET"} />
                <Item dataField={"LIABILITY"} />
                <Item dataField={"PERSONALACCOUNT"} />
                <Item dataField={"LOC"} />
                <Item dataField={"INVESTMENT"} />
                <Item dataField={"SAVINGS"} />
                <Item dataField={"INVESTMENTLOANS"} />
                <Item dataField={"PERSONALLOANS"} />
                <Item dataField={"HOUSE"} />
                <Item dataField={"REALESTATEINVESTMENT"} />
                <Item dataField={"CFM"} />
                <Item dataField={"REALESTATERENTALMORTGAGE"} />
                <Item dataField={"SINGLELINESUMMARY"} />
                <Item dataField={"BUSINESSLOAN"} />
              </Item>
            </Form>
          </Editing>
          <Column
            dataField={"FPTRANSACTIONCODE"}
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

          <Column dataField="TRANSACTIONGROUP" caption="Group" width={125}>
            <Lookup
              dataSource={this.state.transactionGroupData}
              valueExpr="CODE"
              displayExpr="DESCRIPTION"
            />
          </Column>

          <Column
            dataField={"CHANGEINNETWORTHCODE"}
            caption={"Change in Net Worth Code"}
            hidingPriority={8}
            visible={true}
            //onCellClick={this.handleActionRequiredClick}
          />

          <Column
            dataType="boolean"
            dataField={"INTERESTCHARGE"}
            caption={"Interest Charge"}
            hidingPriority={8}
            visible={true}
            editorType="dxCheckBox"
          />
          <Column
            dataType="boolean"
            dataField={"INTERESTPAYMENT"}
            caption={"Interest Payment"}
            hidingPriority={8}
            visible={true}
            //onCellClick={this.handleActionRequiredClick}
          />
          <Column
            dataType="boolean"
            dataField={"DIRECTINTERESTPAYMENT"}
            caption={"Direct Interest Payment"}
            hidingPriority={8}
            visible={true}
            //onCellClick={this.handleActionRequiredClick}
          />
          <Column
            dataType="boolean"
            dataField={"COMPOUNDINTERESTTYPE"}
            caption={"Compound Interest Type"}
            hidingPriority={8}
            visible={false}
            //onCellClick={this.handleActionRequiredClick}
          />
          <Column
            dataType="boolean"
            dataField={"CLIENTTRANSACTION"}
            caption={"Compound Interest Rest Type"}
            hidingPriority={8}
            visible={false}
            //onCellClick={this.handleActionRequiredClick}
          />
          <Column
            dataType="boolean"
            dataField={"TRANSFERTRANSACTIONS"}
            caption={"Transfer Transactions"}
            hidingPriority={8}
            visible={false}
            //onCellClick={this.handleActionRequiredClick}
          />
          <Column
            dataType="boolean"
            dataField={"PERSONALINTERESTPAYMENT"}
            caption={"Personal Interest Payment"}
            hidingPriority={8}
            visible={false}
            //onCellClick={this.handleActionRequiredClick}
          />
          <Column
            dataType="boolean"
            dataField={"DEDUCTIBLEINTERESTPAYMENT"}
            caption={"Deductible Interest Payment"}
            hidingPriority={8}
            visible={false}
            //onCellClick={this.handleActionRequiredClick}
          />
          <Column
            dataType="boolean"
            dataField={"INCLUDEINCOMPOUNDVALUE"}
            caption={"Deductible Interest Payment"}
            hidingPriority={8}
            visible={false}
            //onCellClick={this.handleActionRequiredClick}
          />
          <Column
            dataType="boolean"
            dataField={"INTERESTALLOCATION"}
            caption={"Interest Allocation"}
            hidingPriority={8}
            visible={false}
            //onCellClick={this.handleActionRequiredClick}
          />
          <Column
            dataType="boolean"
            dataField={"CARRYINGCHARGEINTERESTPAID"}
            caption={"Carrying Charge Interest Paid"}
            hidingPriority={8}
            visible={false}
            //onCellClick={this.handleActionRequiredClick}
          />
          <Column
            dataType="boolean"
            dataField={"CARRYINGCHARGEDEDUCTIBLEPAYMENT"}
            caption={"Carrying Charge Deductible Payment"}
            hidingPriority={8}
            visible={false}
            //onCellClick={this.handleActionRequiredClick}
          />
          <Column
            dataType="boolean"
            dataField={"TAXSHELTERPAYMENT"}
            caption={"Tax Shelter Payment"}
            hidingPriority={8}
            visible={false}
            //onCellClick={this.handleActionRequiredClick}
          />
          <Column
            dataType="boolean"
            dataField={"CARRYINGCHARGEDEDUCTIBLEINTEREST"}
            caption={"Carrying Charge Deductible Interest"}
            hidingPriority={8}
            visible={false}
            //onCellClick={this.handleActionRequiredClick}
          />
          <Column
            dataField={"REPORTINGROW"}
            width={190}
            caption={"Reporting Row"}
            hidingPriority={8}
            visible={false}
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

export default function BankaccountTypes() {
  const { user } = useAuth();
  //console.log({ user });
  return <BankaccountTypesx companyCode={user.companyCode} />;
}
