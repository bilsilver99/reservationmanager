import React, { useState, useEffect, useRef } from "react";
//import React, { useEffect, useState } from "react";
//import { Popup, Position, ToolbarItem } from "devextreme-react/popup";
//import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//import { faCheckSquare, faSquare } from "@fortawesome/free-solid-svg-icons";
//import { getTransactionGroups } from "../../api/MyOwnServices";
//
import DataGrid, {
  Sorting,
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
import DataSource from "devextreme/data/data_source";
//import ClientAssetDetails from "./clientAssetDetails";
//import { mystore2 } from "./clientBanksAccountsData";
//import { myStore3, myStore4, myStore5 } from "./clientBanksAccountsData";
import "whatwg-fetch";
//import ClientBankSegments from "./clientBankSegments";
//import CustomStore from "devextreme/data/custom_store";
//import SelectBox from "devextreme-react/select-box";
import { mystore7 } from "./clientAssetsData";
//import ClientBankSegmentTransactions from "./clientBankSegmentTransactions";

const allowedPageSizes = [8, 12, 24];

let pageoption = 90;

class ClientAssetsx extends React.Component {
  constructor(props) {
    super(props);
    this.dataGridRef = React.createRef();
    this.refreshMaster = this.refreshMaster.bind(this);
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

  refreshMaster = () => {
    this.dataGridRef.current.instance.refresh(); // Refresh the master grid
  };

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
          ref={this.dataGridRef}
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
            sendor={this.state.filterValue}
            render={this.renderDetail}
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
export default function ClientAssets() {
  const { user } = useAuth();
  //console.log("my user stuff", { user });
  return <ClientAssetsx clientCode={user.thisClientcode} />;
}

function renderDetail(props) {
  const uniqueid = props.data.UNIQUEID;
  const refreshMasterMethod = this.refreshMaster;
  return (
    <ClientAssetDetails
      rowid={uniqueid}
      sendit={pageoption}
      clientCode={props.data.CLIENTCODE}
      assetName={props.data.ASSETNAME}
      currency={props.data.CURRENCY}
      onRefreshMaster={this.refreshMaster} // Pass refreshMaster directly
    />
  );
}

function ClientAssetDetails(props) {
  const [dataSourcex, setDataSource] = useState(null);
  const [filterValue, setfilervalue] = useState("90");

  const [bankID, setBankID] = useState(props.bankAccountNumberID);
  const [bankUniqueid, setBankUniqueid] = useState(props.bankAccountUniqueID);

  const handleUpdate = () => {
    // After update logic
    props.onRefreshMaster(); // Refresh the master grid
  };

  // const validateSegment = async (params) => {
  //   //console.log("params coming in ", params, "bankid: ", bankUniqueid);
  //   return await asyncValidation(params.value, bankUniqueid);
  // };

  const onEditorPreparing = (e) => {
    // Check if the row is not new
    if (e.parentType === "dataRow" && !e.row.isNewRow) {
      // Disable editing for a specific field
      if (e.dataField === "SEGMENTNUMBER") {
        e.editorOptions.disabled = true;
      }
    }
  };

  const onInitNewRow = (e) => {
    console.log("client", props.clientCode, "asset", props.assetName);
    e.data.CLIENTCODE = props.clientCode;
    e.data.ASSETNAME = props.assetName;
    e.data.CURRENCY = props.currency;
  };

  useEffect(() => {
    async function fetchData() {
      const data = await getTasks(props.rowid, props.sendit);
      setDataSource(data);
    }

    fetchData();
  }, [props.rowid, props.sendit]);

  // const refreshMasterGrid = () => {
  //   const masterGrid = masterGridRef.current.instance;
  //   masterGrid.refresh(); // Refresh the master grid
  // };

  // Example detail grid event handler
  // const onDetailRowUpdated = (e) => {
  //   // ... your update logic ...
  //   refreshMasterGrid(); // Refresh the master grid after update
  // };

  return (
    <>
      {dataSourcex ? (
        <div className="red-color">
          Transactions
          <div>
            <DataGrid
              dataSource={dataSourcex}
              columnAutoWidth={true}
              width={"50%"}
              onEditorPreparing={onEditorPreparing}
              onInitNewRow={onInitNewRow}
              onRowUpdated={handleUpdate}
              onRowInserted={handleUpdate}
              //onRowUpdated={onDetailRowUpdated}
            >
              <Sorting mode="single" />

              <Paging enabled={true} />
              <Editing
                mode="popup"
                allowUpdating={true}
                allowAdding={true}
                allowDeleting={true}
              >
                <Popup
                  title="Transaction Info"
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
                    <Item dataField={"CLIENTCODE"} />
                    <Item dataField={"ASSETNAME"} />

                    <Item dataField={"CURRENCY"} />
                    <Item
                      dataField={"AMOUNT"}
                      editorType={"dxNumberBox"}
                      editorOptions={{
                        format: {
                          type: "currency",
                          currency: "USD", // Specify the currency code as needed
                        },
                      }}
                    />
                    <Item dataField={"TRANSACTIONDATE"} />
                  </Item>
                </Form>
              </Editing>

              <Column
                dataField={"UNIQUEID"}
                caption={"Unique ID"}
                hidingPriority={7}
                allowEditing={true}
                visible={false}
              />
              <Column
                dataField={"CLIENTCODE"}
                caption={"Client"}
                hidingPriority={7}
                allowEditing={false}
                visible={false}
              />
              <Column
                dataField={"ASSETNAME"}
                caption={"Asset"}
                hidingPriority={7}
                allowEditing={false}
                visible={false}
              />
              <Column
                dataField={"CURRENCY"}
                caption={"Currency"}
                hidingPriority={7}
                allowEditing={false}
              ></Column>
              <Column
                dataType="date"
                dataField={"TRANSACTIONDATE"}
                caption={"Transaction Date"}
                hidingPriority={7}
                allowEditing={true}
              />
              <Column
                type="number"
                dataField={"AMOUNT"}
                caption="Value"
                allowEditing={true}
                format={"$###,###,###.00"}
                alignment="right"
              />
            </DataGrid>
          </div>
        </div>
      ) : (
        <div>loading data...</div>
      )}
    </>
  );
}

async function asyncValidation(segmentNumber, bankID) {
  //const bankIDsent = this.state.bankAccountNumberID;
  // console.log(
  //   "bankid sent to asyncValidation",
  //   bankID,
  //   "segmentNumber",
  //   segmentNumber
  // );

  var requestoptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json;",
    },
    body: JSON.stringify({
      SentBankID: bankID,
      SentSegment: segmentNumber,
    }),
  };
  //console.log("bankID", bankID, "segment", segmentNumber);
  const url = `${process.env.REACT_APP_BASE_URL}/fetchThisSegment`;

  const response = await fetch(url, requestoptions);
  if (!response.ok) {
    throw new Error("System did not respond");
  }
  const data = await response.json();
  //console.log("data from fetch", data.user_response.response);
  if (data.user_response.response === "OK") {
    return true; // Validation successful
  } else if (data.user_response.response === "ERROR") {
    return false; // Validation failed
  } else {
    throw new Error("Unexpected response");
  }
}

//export default ClientAssetDetails;

async function getTasks(key, masterField) {
  //console.log("call to datasource", key, "range is", masterField);
  return new DataSource(mystore7(key));
  // const store = mystore2(key, masterField);
  // const loadResult = await store.load();
  // return new DataSource({ store, load: () => loadResult });
}
