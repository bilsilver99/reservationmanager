import React, { useEffect, useState } from "react";
//import { Popup, Position, ToolbarItem } from "devextreme-react/popup";
//import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//import { faCheckSquare, faSquare } from "@fortawesome/free-solid-svg-icons";
//import { getTransactionGroups } from "../../api/MyOwnServices";
import DataGrid, {
  Column,
  Editing,
  Popup,
  Paging,
  Lookup,
  Form,
  Pager,
} from "devextreme-react/data-grid";
import { Item, SimpleItem } from "devextreme-react/form";
import "devextreme-react/text-area";
import "devextreme/data/data_source";
import { useAuth } from "../../contexts/auth";
import "./app.scss";
import { mystore } from "./transactionTypesData";
import { mystore2 } from "./transactionGroupData";

//import SelectBox from "devextreme-react/select-box";
//import { Button } from "devextreme-react";
//import { SelectBox } from "devextreme-react";
//import { Template } from "devextreme-react/core/template";

const allowedPageSizes = [8, 12, 20];

//let pageoption = 90;

class TransactionTypesx extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //myClient: this.props.clientCode,
      currentRow: 0,
      filterValue: "90",
      selectedRowKeys: [],
      transactionGroupData: [],

      //bankNameToAuthorize: "", // add new state variable
    };
  }

  componentDidMount() {
    mystore2() // call the function to fetch data
      .then((data) => {
        this.setState({ transactionGroupData: data.data }); // store the data in state
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the transaction group data:",
          error
        );
      });
    console.log("maybe?", this.state.transactionGroupData);
  }

  simpleLookupLabel = { "aria-label": "Simple lookup" };

  handleFilterChange = (e) => {
    this.setState({ filterValue: e.value }, () => {
      //console.log("New filter value:", this.state.filterValue);
      //pageoption = this.state.filterValue;
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
          remoteOperations={true}
          //keyExpr={"UNIQUEID"}
        >
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
                <Item dataField="FPTRANSACTIONCODE" />
                <Item dataField="DESCRIPTION" />

                <SimpleItem
                  dataField="TRANSACTIONGROUP"
                  editorType="dxLookup"
                  editorOptions={{
                    dataSource: this.state.transactionGroupData,
                    displayExpr: "TRANSACTIONGROUP",
                    valueexpression: "UNIQUEID",
                  }}
                />

                <Item dataField="REPORTINGROW" />
                <Item dataField="CHANGEINNETWORTHCODE" />
              </Item>

              <Item
                itemType="group"
                caption="Options"
                colCount={2}
                colSpan={2}
                showBorders={true}
              >
                <Item dataField="INTERESTCHARGE" editorType="dxCheckBox" />
                <Item dataField={"INTERESTPAYMENT"} editorType="dxCheckBox" />
                <Item
                  dataField={"DIRECTINTERESTPAYMENT"}
                  //label={{ text: "Direct Interest Payment", location: "left" }}
                />
                <Item
                  dataField={"COMPOUNDINTERESTTYPE"}
                  editorType="dxCheckBox"
                  //label={{ text: "Compound Interest", location: "right" }}
                />
                <Item
                  dataField={"CLIENTTRANSACTION"}
                  editorType="dxCheckBox"
                  //label={{ text: "Client Transaction", location: "right" }}
                />
                <Item
                  dataField={"TRANSFERTRANSACTIONS"}
                  editorType="dxCheckBox"
                  //label={{ text: "Transfer", location: "right" }}
                />
                <Item
                  dataField={"PERSONALINTERESTPAYMENT"}
                  editorType="dxCheckBox"
                  //label={{
                  //  text: "Personal Interest Payment",
                  //  location: "right",
                  //}}
                />

                <Item
                  dataField={"DEDUCTIBLEINTERESTPAYMENT"}
                  editorType="dxCheckBox"
                  //label={{
                  //  text: "Deductible Interest Payment",
                  //  location: "right",
                  //}}
                />

                <Item
                  dataField={"INCLUDEINCOMPOUNDVALUE"}
                  editorType="dxCheckBox"
                  //label={{
                  //  text: "Include in Compound Interest",
                  //  location: "right",
                  //}}
                />

                <Item
                  dataField={"INTERESTALLOCATION"}
                  editorType="dxCheckBox"
                  //label={{ text: "Interest Allocation", location: "right" }}
                />
                <Item
                  dataField={"CARRYINGCHARGEINTERESTPAID"}
                  editorType="dxCheckBox"
                  //label={{
                  //  text: "Carrying Charge Interest Paid",
                  //  location: "right",
                  //}}
                />
                <Item
                  dataField={"CARRYINGCHARGEDEDUCTIBLEPAYMENT"}
                  editorType="dxCheckBox"
                  //label={{
                  //  text: "Carrying Charges Deductible Payment",
                  //  location: "right",
                  //}}
                />

                <Item
                  dataField={"TAXSHELTERPAYMENT"}
                  editorType="dxCheckBox"
                  //label={{ text: "Tax Shelter Payment", location: "right" }}
                />

                <Item
                  dataField={"CARRYINGCHARGEDEDUCTIBLEINTEREST"}
                  editorType="dxCheckBox"
                  //label={{
                  //  text: "Carrying Charge Deductible Payment",
                  //  location: "right",
                  //}}
                />
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
          <Column
            dataField={"TRANSACTIONGROUP"}
            width={190}
            caption={"Transaction Group"}
            hidingPriority={8}
            visible={true}
          />
          <Column
            dataField={"REPORTINGROW  "}
            width={190}
            caption={"Reporting Row"}
            hidingPriority={8}
            visible={true}
          />
          <Column
            dataField={"CHANGEINNETWORTHCODE"}
            caption={"Change in Net Worth Code"}
            hidingPriority={8}
            width={150}
            visible={false}
            //onCellClick={this.handleActionRequiredClick}
          />

          <Column
            dataType="boolean"
            dataField={"INTERESTCHARGE"}
            caption={"Interest Charge"}
            hidingPriority={8}
            visible={true}
          />
          <Column
            dataType="boolean"
            dataField={"INTERESTPAYMENT"}
            caption={"Interest Payment"}
            hidingPriority={8}
            width={150}
            visible={true}
            //onCellClick={this.handleActionRequiredClick}
          />
          <Column
            dataType="boolean"
            dataField={"DIRECTINTERESTPAYMENT"}
            caption={"Direct Interest Payment"}
            hidingPriority={8}
            width={150}
            visible={true}
            //onCellClick={this.handleActionRequiredClick}
          />
          <Column
            dataType="boolean"
            dataField={"COMPOUNDINTERESTTYPE"}
            caption={"Compound Interest Type"}
            hidingPriority={8}
            width={150}
            visible={false}
            //onCellClick={this.handleActionRequiredClick}
          />
          <Column
            dataType="boolean"
            dataField={"CLIENTTRANSACTION"}
            caption={"Compound Interest Rest Type"}
            hidingPriority={8}
            width={150}
            visible={false}
            //onCellClick={this.handleActionRequiredClick}
          />
          <Column
            dataType="boolean"
            dataField={"TRANSFERTRANSACTIONS"}
            caption={"Transfer Transactions"}
            hidingPriority={8}
            width={150}
            visible={false}
            //onCellClick={this.handleActionRequiredClick}
          />
          <Column
            dataType="boolean"
            dataField={"PERSONALINTERESTPAYMENT"}
            caption={"Personal Interest Payment"}
            hidingPriority={8}
            width={150}
            visible={false}
            //onCellClick={this.handleActionRequiredClick}
          />
          <Column
            dataType="boolean"
            dataField={"DEDUCTIBLEINTERESTPAYMENT"}
            caption={"Deductible Interest Payment"}
            hidingPriority={8}
            width={150}
            visible={false}
            //onCellClick={this.handleActionRequiredClick}
          />
          <Column
            dataType="boolean"
            dataField={"INCLUDEINCOMPOUNDVALUE"}
            caption={"Deductible Interest Payment"}
            hidingPriority={8}
            width={150}
            visible={false}
            //onCellClick={this.handleActionRequiredClick}
          />
          <Column
            dataType="boolean"
            dataField={"INTERESTALLOCATION"}
            caption={"Interest Allocation"}
            hidingPriority={8}
            width={150}
            visible={false}
            //onCellClick={this.handleActionRequiredClick}
          />
          <Column
            dataType="boolean"
            dataField={"CARRYINGCHARGEINTERESTPAID"}
            caption={"Carrying Charge Interest Paid"}
            hidingPriority={8}
            width={150}
            visible={false}
            //onCellClick={this.handleActionRequiredClick}
          />
          <Column
            dataType="boolean"
            dataField={"CARRYINGCHARGEDEDUCTIBLEPAYMENT"}
            caption={"Carrying Charge Deductible Payment"}
            hidingPriority={8}
            width={150}
            visible={false}
            //onCellClick={this.handleActionRequiredClick}
          />
          <Column
            dataType="boolean"
            dataField={"TAXSHELTERPAYMENT"}
            caption={"Tax Shelter Payment"}
            hidingPriority={8}
            width={150}
            visible={false}
            //onCellClick={this.handleActionRequiredClick}
          />
          <Column
            dataType="boolean"
            dataField={"CARRYINGCHARGEDEDUCTIBLEINTEREST"}
            caption={"Carrying Charge Deductible Interest"}
            hidingPriority={8}
            width={150}
            visible={false}
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
  handleRowClick = (e) => {
    this.setState({ currentRow: e.row });
    console.log(this.state.currentRow);
    console.log("here");
  };
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

export default function TransactionTypes() {
  const { user } = useAuth();
  //console.log({ user });
  return <TransactionTypesx companyCode={user.companyCode} />;
}
