import React, { useState, useEffect } from "react";

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
import {
  InvestmentStore,
  mystore8,
  mystore9,
  mystore10,
  mystore11,
  mystore12,
  mystore13,
  mystore14,
  fetchAllInvestmentData,
} from "./clientInvestmentsData";

import ClientInvestmentsTransactions from "./clientInvestmentsTransactions";
import ClientInvestmentsSummary from "./clientInvestmentsSummary";
import ClientInvestmentsStocks from "./clientInvestmentsStocks";
import DebtSummary from "./debtSummary";

import { GetStockQuote } from "./stockQuery";
import { Button } from "devextreme-react/button";
import "whatwg-fetch";
import { Col } from "devextreme-react/responsive-box";
import { set } from "date-fns";

let pageoption = 90;

//const allowedPageSizes = [8, 12, 24];

//let pageoption = 90;

function ClientInvestments(props) {
  const { user } = useAuth();

  //console.log("client passed in", props);
  //const [applyFilterTypes, setFilterTypes] = useState("90");
  //   {
  //     key: "auto",
  //     name: "Immediately",
  //   },
  //   {
  //     key: "onClick",
  //     name: "On Button Click",
  //   },
  // ]);

  //state = {

  const [currentRow, setCurrentRow] = useState(0);
  const [filterValue, setFilterValue] = useState("90");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [myClient, setMyClientcode] = useState(user.thisClientcode);

  //const companyCode,SentCompanyCode]=useState(1)

  const [showFilterRow, setShowFilterRow] = useState(true);
  const [showHeaderFilter, setShowHeaderFilter] = useState(true);
  //const [currentFilter, setCurrentFilter] = useState(applyFilterTypes[0].key);
  const [assetTypes, setAssetTypes] = useState([]);
  const [ownerData, setOwnerData] = useState([]);
  const [bankTypes, setBankTypes] = useState([]);
  const [InvestGroup, setInvestGroup] = useState([]);
  const [InvestSubGroup, setInvestSubGroup] = useState([]);
  const [BankNames, setBankNames] = useState([]);
  const [OwnerNames, setOwnerNames] = useState([]);
  const [tagtypes, setTagtypes] = useState([
    "TFSA",
    "RRIF",
    "RDSP",
    "LIRA",
    "RESP",
    "GROUP",
  ]);
  const [currentID, setCurrentID] = useState(0);
  const [currentStock, setCurrentStock] = useState("");
  const [rowToBeEdited, setRowToBeEdited] = useState(0);
  const [refreshKey, setRefreshKey] = useState(props.sharedValue);

  // const [transactionGroupData, setTransactionGroupData] = useState([]);

  // const [transactionGroupTransactionData, setTransactionGroupTransactionData] =
  //   useState([]);
  // const [TransactionStocks, setTransactionStocks] = useState([]);
  // const [selectedStockCode, setSelectedStockCode] = useState("Undefined");

  // const [thisWidthSent, setwidth] = useState("50%");
  // const [thisWidthOut, setwidthOut] = useState("50%");
  // const [showPrior, setPrior] = useState(false);

  const handleRowUpdating = (e) => {
    const { oldData, newData } = e;
    // Update logic here, e.g., call an API to update the data
    // Refresh the DataGrid's data source if necessary
  };

  useEffect(() => {
    setRefreshKey((prevKey) => prevKey + 1);
    mystore8() // call the function to fetch data
      .then((data) => {
        //console.log("banks", data);
        setInvestGroup(data.data); // store the data in state
        //console.log("bankdata", state.bankData);
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the transaction group data:",
          error
        );
      });
    mystore9() // call the function to fetch data
      .then((data) => {
        //console.log("banks", data);
        setInvestSubGroup(data.data); // store the data in state
        //console.log("bankdata", state.bankData);
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the transaction group data:",
          error
        );
      });
    mystore10() // call the function to fetch data
      .then((data) => {
        //console.log("banks", data);
        setBankNames(data.data); // store the data in state
        //console.log("bankdata", state.bankData);
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the transaction group data:",
          error
        );
      });
    mystore11(myClient) // call the function to fetch data
      .then((data) => {
        //console.log("banks", data);
        setOwnerNames(data.data); // store the data in state
        //console.log("bankdata", state.bankData);
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the transaction group data:",
          error
        );
      });
  }, []);

  const handleEditingStart = (e) => {
    //console.log("editing start", e);
    setRowToBeEdited(e.data.UNIQUEID);
    setCurrentID(e.data.UNIQUEID);
    setCurrentStock(e.data.INVESTMENTNAME);
  };

  const refreshData = () => {
    setRefreshKey((oldKey) => oldKey + 1);
  };

  return (
    <div className="content-block2 dx-card ">
      <DataGrid
        id="maindatagrid"
        dataSource={InvestmentStore(myClient)}
        keyExpr="UNIQUEID"
        key={refreshKey}
        showBorders={false}
        remoteOperations={false}
        width={"100%"}
        columnAutoWidth={true}
        height={"auto"}
        onEditingStart={handleEditingStart}
        onRowUpdating={handleRowUpdating}
      >
        <HeaderFilter visible={showHeaderFilter} />
        <SearchPanel visible={false} width={240} placeholder="Search..." />
        <Paging enabled={true} />

        <Editing
          mode="popup"
          allowUpdating={true}
          allowAdding={true}
          allowDeleting={true}
        >
          <Popup
            title="Investments"
            showTitle={true}
            width={"100%"}
            height={900}
          />
          <Form colCount={4}>
            <Item itemType="group" colCount={4} colSpan={2} showBorders={true}>
              <Item dataField={"INVESTMENTNAME"} />
              <Item dataField={"INVESTMENTBANKCODE"} />
              <Item dataField={"CURRENCY"} />
              <Item dataField={"DESCRIPTION"} />
              <Item dataField={"INVESTMENTGROUP"} />
              <Item dataField={"INVESTMENTSUBGROUP"} />
              <Item dataField={"SEQUENCE"} />
              <Item dataField={"LASTPDFDATE"} />
              <Item dataField={"PREVIOUSIMPORTDATE  "} />
              <Item
                dataField={"CURRENTVALUE"}
                editorType={"dxNumberBox"}
                cssClass="right-aligned-editor"
                editorOptions={{
                  format: {
                    type: "currency",
                    currency: "USD", // Specify the currency code as needed
                  },
                }}
              />
              <Item dataField={"OWNER"} />
              <Item dataField={"TAG"} />
            </Item>
            <Item
              colSpan={2}
              colCount={1}
              render={() => (
                <React.Fragment>
                  <ClientInvestmentsSummary
                    StockID={currentID}
                    StockName={currentStock}
                    ClientCode={myClient}
                    Key={refreshKey}
                    onRefresh={refreshData}
                  />
                </React.Fragment>
              )}
            />
            <Item
              colSpan={4}
              colCount={1}
              render={() => (
                <React.Fragment>
                  <ClientInvestmentsStocks
                    StockID={currentID}
                    StockName={currentStock}
                    ClientCode={myClient}
                    Key={refreshKey}
                    onRefresh={refreshData}
                  />
                </React.Fragment>
              )}
            />

            <Item
              colSpan={4}
              colCount={1}
              render={() => (
                <React.Fragment>
                  <ClientInvestmentsTransactions
                    StockID={currentID}
                    Key={refreshKey}
                    onRefresh={refreshData}
                  />
                </React.Fragment>
              )}
            />
          </Form>
        </Editing>
        <Column dataField={"INVESTMENTBANKCODE"} caption="Bank" width={250}>
          <Lookup
            dataSource={BankNames}
            valueExpr="INVESTMENTBANKCODE"
            displayExpr="BANKNAME"
          />
        </Column>

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
          visible={false}
        />

        <Column
          dataField={"INVESTMENTGROUP"}
          width={150}
          caption={"Inv Group"}
          hidingPriority={8}
          visible={false}
        >
          <Lookup
            dataSource={InvestGroup}
            valueExpr="FPINVESTMENTGROUP"
            displayExpr="DESCRIPTION"
          />
        </Column>
        <Column
          dataField={"INVESTMENTSUBGROUP"}
          width={200}
          caption={"Sub "}
          hidingPriority={8}
          visible={true}
        >
          <Lookup
            dataSource={InvestSubGroup}
            valueExpr="FPINVESTMENTSUBGROUP"
            displayExpr="LONGDESCRIPTION"
          />
        </Column>
        <Column dataField={"OWNER"} width={250}>
          <Lookup
            dataSource={OwnerNames}
            valueExpr="SEQUENCE"
            displayExpr="NAME"
          />
        </Column>
        <Column
          dataField={"DESCRIPTION"}
          width={260}
          caption={"Description"}
          hidingPriority={8}
          visible={true}
        />
        <Column
          format={"$###,###,###.00"}
          dataField={"CURRENTVALUE"}
          width={100}
          caption={"Value"}
          hidingPriority={8}
          visible={true}
        />
        <Column
          dataField={"TAG"}
          width={150}
          caption={"Type"}
          hidingPriority={8}
          visible={true}
        >
          <Lookup
            dataSource={tagtypes}
            valueExpr={"this"} // Use "this" when the data source is an array of primitives
            displayExpr={"this"} // Same here
          />
        </Column>
        <Column
          dataField={"LASTPDFDATE"}
          caption={"Last PDF Date"}
          dataType="date"
          visible={false}
        />

        <Column
          dataField={"PREVIOUSIMPORTDATE  "}
          caption="Previous Import Date"
          dataType="date"
          visible={false}
        />
      </DataGrid>
    </div>
  );
}

export default ClientInvestments;

// {/* <DataGrid
// dataSource={mystore12(currentID)}
// keyExpr="UNIQUEID"
// showBorders={false}
// remoteOperations={false}
// width={"50%"}
// columnAutoWidth={true}
// height={300}
// paging={{ pageSize: 5 }}
// >
// <Column
//   dataField={"INVESTMENTNAME"}
//   width={100}
//   caption={"Investment"}
//   hidingPriority={8}
//   visible={true}
// />
// <Column
//   dataField={"TRANSACTIONDATE"}
//   width={150}
//   caption={"Date"}
//   hidingPriority={8}
//   visible={true}
// />
// <Column
//   dataField={"CURRENTVALUE"}
//   width={150}
//   caption={"Value"}
//   hidingPriority={8}
//   visible={true}
//   format={"$###,###,###.00"}
// />
// </DataGrid> */}
