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
import { assetStore, getAssetTypes } from "./clientAssetsData";
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

class ClientAssetsx extends React.Component {
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
      myClientcode: this.props.clientCode,
      //bankNameToAuthorize: "", // add new state variable
    };
  }

  componentDidMount() {
    getAssetTypes() // call the function to fetch data
      .then((data) => {
        //console.log("banks", data);
        this.setState({ assetTypes: data.data }); // store the data in state
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

  handleEditingStart(e) {
    const rowToBeEdited = e.data;
    if (rowToBeEdited.someField === "someValue") {
      e.cancel = true; // Prevents the editing from starting
    }
  }

  handleDetailChange = (newDetailData) => {};

  render() {
    return (
      <div className="content-block2 dx-card ">
        <DataGrid
          dataSource={assetStore(this.props.clientCode)}
          keyExpr="UNIQUEID"
          showBorders={false}
          remoteOperations={false}
          onSelectionChanged={this.handleSelectionChanged.bind(this)} // add this line
          onEditingStart={this.handleEditingStart}
          width={"100%"}
          columnAutoWidth={true}
        >
          <FilterRow
            visible={this.state.showFilterRow}
            applyFilter={this.state.currentFilter}
          />
          <HeaderFilter visible={this.state.showHeaderFilter} />
          <SearchPanel visible={false} width={240} placeholder="Search..." />
          <Paging enabled={true} />
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
              <Item dataField={"ASSETNAME"} />
              <Item dataField={"CURRENCY"} />
              <Item dataField={"ASSETTYPE"} />
              <Item dataField={"LASTPOSTEDDATE"} />
              <Item
                cssClass="right-aligned-editor"
                dataField={"CURRENTVALUE"}
                editorType={"dxNumberBox"}
                editorOptions={{
                  format: {
                    type: "currency",
                    currency: "USD", // Specify the currency code as needed
                  },
                }}
              />
            </Form>
          </Editing>
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
            dataField="ASSETNAME"
            caption="Asset name"
            width={500}
          ></Column>

          <Column
            dataField={"CURRENCY"}
            width={200}
            caption={"Currency"}
            hidingPriority={8}
            visible={true}
          />
          <Column
            dataField={"ASSETTYPE"}
            width={190}
            caption={"Asset Type"}
            hidingPriority={8}
            visible={true}
          >
            <Lookup
              dataSource={this.state.assetTypes}
              valueExpr="ASSETTYPE"
              displayExpr="DESCRIPTION"
            />
          </Column>
          <Column
            dataType="date"
            dataField={"LASTPOSTEDDATE"}
            caption={"Last posted Date"}
            hidingPriority={7}
            allowEditing={false}
          ></Column>
          <Column
            dataField={"CURRENTVALUE"}
            width={190}
            caption={"Current Value"}
            hidingPriority={8}
            visible={true}
            format={"$###,###,###.00"}
            alignment="right"
            allowEditing={false}
          />
          <MasterDetail
            enabled={true}
            //render={renderDetail}
            sendor={this.state.filterValue}
            render={(props) => renderDetail(props, this.handleDetailChange)}
          />
          <Paging defaultPageSize={8} />
          <Pager
            showPageSizeSelector={true}
            allowedPageSizes={allowedPageSizes}
          />
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

export default function ClientAssets() {
  const { user } = useAuth();
  //console.log("my user stuff", { user });
  return <ClientAssetsx clientCode={user.thisClientcode} />;
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
