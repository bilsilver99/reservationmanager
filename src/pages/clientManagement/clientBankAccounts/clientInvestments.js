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
import { InvestmentStore, mystore8 } from "./clientInvestmentsData";
import ClientAssetDetails from "./clientAssetDetails";
import { Button } from "devextreme-react/button";
//import { mystore2 } from "./clientBanksAccountsData";
//import { myStore3, myStore4, myStore5 } from "./clientBanksAccountsData";
import "whatwg-fetch";
//import ClientBankSegments from "./clientBankSegments";
//import CustomStore from "devextreme/data/custom_store";
//import SelectBox from "devextreme-react/select-box";

const allowedPageSizes = [8, 12, 24];

let pageoption = 90;

class ClientInvestmentsx extends React.Component {
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
      //transactionGroupData: [], // add new state variable
      companyCode: 1,
      showFilterRow: true,
      showHeaderFilter: true,
      currentFilter: this.applyFilterTypes[0].key,
      assetTypes: [],
      ownerData: [],
      bankTypes: [],
      InvestGroup: [],
      myClientcode: this.props.clientCode,
      //bankNameToAuthorize: "", // add new state variable
    };
  }

  componentDidMount() {
    mystore8() // call the function to fetch data
      .then((data) => {
        //console.log("banks", data);
        this.setState({ InvestGroup: data.data }); // store the data in state
        //console.log("bankdata", this.state.bankData);
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the transaction group data:",
          error
        );
      });
  }

  getClientOwners;

  handleSelectionChanged(e) {
    this.setState({ selectedRowKeys: e.selectedRowKeys });
    if (e.selectedRowKeys.length > 0) {
      this.setState({ currentRow: e.selectedRowKeys[0] }); // update the current row
    }
  }

  nameEditorOptions = { disabled: true };

  // handleEditingStart(e) {
  //   const rowToBeEdited = e.data;
  //   if (rowToBeEdited.someField === "someValue") {
  //     e.cancel = true; // Prevents the editing from starting
  //   }
  // }

  handleDetailChange = (newDetailData) => {};

  render() {
    return (
      <div className="content-block2 dx-card ">
        <DataGrid
          dataSource={InvestmentStore(this.props.clientCode)}
          keyExpr="UNIQUEID"
          showBorders={false}
          remoteOperations={false}
          onSelectionChanged={this.handleSelectionChanged.bind(this)} // add this line
          onEditingStart={this.handleEditingStart}
          width={"100%"}
          columnAutoWidth={true}
          height={"auto"}
        >
          <FilterRow
            visible={this.state.showFilterRow}
            applyFilter={this.state.currentFilter}
          />
          <HeaderFilter visible={this.state.showHeaderFilter} />
          <SearchPanel visible={false} width={240} placeholder="Search..." />
          {/* <Paging enabled={true} /> */}
          <Editing
            mode="popup"
            allowUpdating={true}
            allowAdding={true}
            allowDeleting={true}
          >
            <Popup
              title="Bank Info"
              showTitle={true}
              width={900}
              height={500}
            />
            <Form>
              <Item dataField={"INVESTMENTNAME"} />
              <Item dataField={"CURRENCY"} />
              <Item dataField={"DESCRIPTION"} />
              <Item dataField={"INVESTMENTGROUP"} />
              <Item dataField={"INVESTMENTSUBGROUP"} />
              <Item dataField={"TFSA"} editorType="dxCheckBox" />
              <Item dataField={"RRIF"} />
              <Item dataField={"RDSP"} />
              <Item dataField={"LIRA"} />
              <Item dataField={"RESP"} />
              <Item dataField={"GROUPPLAN"} />
              <Item dataField={"CURRENTVALUE"} />
              {/* <Item dataField={"SEQUENCE"} />
              <Item dataField={"LASTPDFDATE"} />
              <Item dataField={"PREVIOUSIMPORTDATE  "} /> */}
            </Form>
          </Editing>
          <Column
            dataField={"INVESTMENTNAME"}
            width={150}
            caption={"Investment"}
            hidingPriority={8}
            visible={true}
          />
          <Column
            dataField={"CURRENCY"}
            width={50}
            caption={"Currency"}
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
            dataField={"INVESTMENTGROUP"}
            width={150}
            caption={"Inv Group"}
            hidingPriority={8}
            visible={true}
          >
            <Lookup
              dataSource={this.state.InvestGroup}
              valueExpr="FPINVESTMENTGROUP"
              displayExpr="DESCRIPTION"
            />
          </Column>
          <Column
            dataField={"INVESTMENTSUBGROUP"}
            width={100}
            caption={"Sub "}
            hidingPriority={8}
            visible={true}
          />
          <Column
            dataType="boolean"
            dataField={"TFSA"}
            width={100}
            caption={"TFSA"}
            hidingPriority={8}
            visible={true}
            editorType="dxCheckBox"
          />
          <Column
            dataType="boolean"
            dataField={"RRIF"}
            width={100}
            caption={"RRIF"}
            hidingPriority={8}
            visible={true}
            editorType="dxCheckBox"
          />
          <Column
            dataType="boolean"
            dataField={"RDSP"}
            width={100}
            caption={"RDSP"}
            hidingPriority={8}
            visible={true}
          />
          <Column
            dataType="boolean"
            dataField={"LIRA"}
            width={100}
            caption={"LIRA"}
            hidingPriority={8}
            visible={true}
          />
          <Column
            dataType="boolean"
            dataField={"RESP"}
            width={100}
            caption={"RESP"}
            hidingPriority={8}
            visible={true}
          />
          <Column
            dataType="boolean"
            dataField={"GROUPPLAN"}
            width={150}
            caption={"Group Plan"}
            hidingPriority={8}
            visible={true}
          />
          <Column
            format={"$###,###,###.00"}
            dataField={"CURRENTVALUE"}
            width={100}
            caption={"Current Value"}
            hidingPriority={8}
            visible={true}
          />
          {/* <Column
            dataField={"SEQUENCE"}
            width={190}
            caption={"Report Sequence"}
            hidingPriority={8}
            visible={true}
          />
          <Column
            dataField={"OWNER"}
            width={190}
            caption={"Owner"}
            hidingPriority={8}
            visible={true}
          />
          <Column
            dataType="date"
            dataField={"LASTPDFDATE"}
            width={190}
            caption={"Last PDF Date"}
            hidingPriority={8}
            visible={true}
          />
          <Column
            dataType="date"
            dataField={"PREVIOUSIMPORTDATE"}
            width={190}
            caption={"Previous Import Date"}
            hidingPriority={8}
            visible={true}
          /> */}
          {/* <Lookup
              dataSource={this.state.assetTypes}
              valueExpr="ASSETTYPE"
              displayExpr="DESCRIPTION"
            /> */}
          {/* <MasterDetail
            enabled={true}
            //render={renderDetail}
            sendor={this.state.filterValue}
            render={(props) => renderDetail(props, this.handleDetailChange)}
          /> */}
          {/* <Paging defaultPageSize={8} />
          <Pager
            showPageSizeSelector={true}
            allowedPageSizes={allowedPageSizes}
          /> */}
        </DataGrid>

        {/* <div className="red-color">
          <p></p>
          &nbsp;&nbsp;
          <Button text="Refresh" onClick={refreshDataGrid} />
          <p></p>
        </div> */}
      </div>
    );
  }
}

export default function ClientInvestments() {
  const { user } = useAuth();
  //console.log("my user stuff", { user });
  return <ClientInvestmentsx clientCode={user.thisClientcode} />;
}

function renderDetail(props) {
  const uniqueid = props.data.UNIQUEID;
  return (
    <ClientAssetDetails
      rowid={uniqueid}
      sendit={pageoption}
      clientCode={props.data.CLIENTCODE}
      assetName={props.data.ASSETNAME}
      currency={props.data.CURRENCY}
      //      bankAccountUniqueID={bankAccountUniqueID}
      //onDetailChange={handleDetailChange}
    />
  );
}
