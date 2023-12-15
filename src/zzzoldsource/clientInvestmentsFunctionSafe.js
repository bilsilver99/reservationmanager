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
import { GetStockQuote } from "./stockQuery";
import { Button } from "devextreme-react/button";
import "whatwg-fetch";
import { Col } from "devextreme-react/responsive-box";

//const allowedPageSizes = [8, 12, 24];

//let pageoption = 90;

function ClientInvestments(props) {
  const { user } = useAuth();

  console.log("client passed in", props);
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
  const [transactionGroupData, setTransactionGroupData] = useState([]);
  const [transactionGroupTransactionData, setTransactionGroupTransactionData] =
    useState([]);
  const [TransactionStocks, setTransactionStocks] = useState([]);
  const [rowToBeEdited, setRowToBeEdited] = useState(0);
  const [selectedStockCode, setSelectedStockCode] = useState("Undefined");

  useEffect(() => {
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

  ///////////////////////////////////////////// end of trying here //////////////

  const handleSelectionChanged = (e) => {
    setSelectedRowKeys(e.selectedRowKeys);
    if (e.selectedRowKeys.length > 0) {
      setCurrentRow(e.selectedRowKeys[0]); // update the current row
    }
  };

  const nameEditorOptions = { disabled: true };

  const handleEditingStart = (e) => {
    const idnumber = e.data.UNIQUEID;
    fetchAllInvestmentData(idnumber)
      .then(
        ({
          transactionsData,
          transactionsDetailsData,
          transactionsStocksData,
        }) => {
          setTransactionGroupData(transactionsData);
          setTransactionGroupTransactionData(transactionsDetailsData);
          setTransactionStocks(transactionsStocksData);
        }
      )

      .catch((error) => {
        console.error("There was an error fetching the data:", error);
      });
    //  handleEditingStart = (e) => {
    //    const idnumber = e.data.UNIQUEID; // Assuming the ID is stored in UNIQUEID

    // Promise.all([mystore12(idnumber), mystore13(idnumber), mystore14(idnumber)])
    //   .then(([data12, data13, data14]) => {
    //     useState({
    //       transactionGroupData: data12.data,
    //       transactionGroupTransactionData: data13.data,
    //       TransactionStocks: data14.data,
    //     });
    //   })
    //   .catch((error) => {
    //     console.error("There was an error fetching the data:", error);
    //   });
    //};

    const handleDetailChange = (newDetailData) => {};

    const handleEditingStartStock = (e) => {
      alert("here we go");

      // useState({ selectedStockCode: e.data.STOCKCODE }, () => {
      //   console.log("stock code", state.selectedStockCode);
      // });
    };

    return (
      <div className="content-block2 dx-card ">
        <DataGrid
          id="maindatagrid"
          dataSource={InvestmentStore(myClient)}
          keyExpr="UNIQUEID"
          showBorders={false}
          remoteOperations={false}
          //onSelectionChanged={handleSelectionChanged.bind(this)} // add this line
          //onEditingStart={handleEditingStart}
          width={"100%"}
          columnAutoWidth={true}
          height={"auto"}
        >
          {/* <FilterRow visible={showFilterRow} applyFilter={currentFilter} /> */}
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
            <Form>
              <Item
                itemType="group"
                colCount={4}
                colSpan={1}
                showBorders={true}
              >
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
                <Item dataField={"SEQUENCE"} />
                <Item dataField={"TAG"} />
              </Item>
              <Item
                itemType="group"
                caption="Summary Values By Period"
                colCount={4}
                colSpan={1}
                showBorders={true}
              >
                <DataGrid
                  dataSource={transactionGroupData}
                  keyExpr="UNIQUEID"
                  showBorders={false}
                  remoteOperations={false}
                  //onSelectionChanged={handleSelectionChanged.bind(this)} // add this line
                  //onEditingStart={handleEditingStart}
                  width={"50%"}
                  columnAutoWidth={true}
                  height={300}
                  paging={{ pageSize: 5 }}
                >
                  <Column
                    dataField={"INVESTMENTNAME"}
                    width={100}
                    caption={"Investment"}
                    hidingPriority={8}
                    visible={true}
                  />
                  <Column
                    dataField={"TRANSACTIONDATE"}
                    width={150}
                    caption={"Date"}
                    hidingPriority={8}
                    visible={true}
                  />
                  <Column
                    dataField={"CURRENTVALUE"}
                    width={150}
                    caption={"Value"}
                    hidingPriority={8}
                    visible={true}
                    format={"$###,###,###.00"}
                  />
                </DataGrid>
              </Item>
              <Item
                itemType="group"
                caption="Stock Transactions"
                colCount={4}
                colSpan={1}
                showBorders={true}
              >
                <DataGrid
                  dataSource={transactionGroupTransactionData}
                  //onRowPrepared={onRowPrepared}
                  scrolling={{ mode: "virtual" }} // or 'standard', based on your preference
                  //keyExpr="UNIQUEID"
                  showBorders={true}
                  remoteOperations={false}
                  //onSelectionChanged={handleSelectionChanged.bind(this)} // add this line
                  //onEditingStart={handleEditingStart}
                  //width={thisWidth}
                  rowHeight={"70px"} // Set the row height to 70px
                  columnAutoWidth={true}
                  height={300}
                  paging={{ pageSize: 5 }}
                >
                  {/* <FilterRow
                  visible={showFilterRow}
                  applyFilter={currentFilter}
                /> */}
                  <HeaderFilter visible={showHeaderFilter} />
                  <Paging enabled={false} />
                  <Column
                    dataField={"NONCASHTRANSACTION"}
                    caption="Non Cash"
                    dataType="boolean"
                    visible={true}
                  />
                  <Column
                    dataField={"INVESTMENTNAME"}
                    width={150}
                    caption={"Investment"}
                    hidingPriority={8}
                    visible={false}
                  />
                  <Column
                    dataField={"STOCKCODE"}
                    width={100}
                    caption={"Stock"}
                    hidingPriority={8}
                    visible={true}
                  />
                  <Column
                    dataField={"TRANSACTIONDATE"}
                    width={150}
                    caption={"Date"}
                    hidingPriority={8}
                    visible={true}
                  />
                  <Column
                    dataField={"DESCRIPTION"}
                    width={200}
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
              </Item>
              <Item
                itemType="group"
                caption="Stocks"
                colCount={2}
                colSpan={2}
                showBorders={true}
              >
                <DataGrid
                  dataSource={TransactionStocks}
                  //onRowPrepared={onRowPrepared}
                  scrolling={{ mode: "virtual" }} // or 'standard', based on your preference
                  //keyExpr="UNIQUEID"
                  showBorders={true}
                  remoteOperations={false}
                  //onSelectionChanged={handleSelectionChanged.bind(this)} // add this line
                  onEditingStart={handleEditingStartStock}
                  //width={thisWidth}
                  height={"100%"}
                  rowHeight={"70px"} // Set the row height to 70px
                  //handleEditingStart={handleEditingStartStock}
                >
                  {/* <FilterRow
                  visible={showFilterRow}
                  applyFilter={currentFilter}
                /> */}
                  <HeaderFilter visible={showHeaderFilter} />
                  <Paging enabled={false} />
                  <Editing
                    mode="popup"
                    allowUpdating={true}
                    allowAdding={true}
                    allowDeleting={true}
                  >
                    <Popup
                      title={`Stock Info ${selectedStockCode}`}
                      showTitle={true}
                      width={800}
                      height={600}
                    />
                    <Form colCount={3} colSpan={2}>
                      <Item
                        render={() => (
                          <React.Fragment>
                            <GetStockQuote thiscode={selectedStockCode} />
                          </React.Fragment>
                        )}
                      />
                      <Item dataField={"STOCKCODE"} />
                      <Item dataField={"DESCRIPTION"} />
                      <Item
                        render={() => (
                          <React.Fragment>
                            <p></p>
                          </React.Fragment>
                        )}
                      />
                      <Item dataField={"QUANTITY"} />
                      <Item dataField={"UNITPRICE"} />
                      <Item dataField={"AMOUNT"} />
                    </Form>
                  </Editing>

                  <Column
                    dataField={"INVESTMENTNAME"}
                    width={150}
                    caption={"Investment"}
                    hidingPriority={8}
                    visible={false}
                  />
                  <Column
                    dataField={"STOCKCODE"}
                    width={100}
                    caption={"Stock"}
                    hidingPriority={8}
                    visible={true}
                  />
                  <Column
                    dataField={"TRANSACTIONDATE"}
                    width={150}
                    caption={"Purchase Date "}
                    hidingPriority={8}
                    visible={true}
                  />
                  <Column
                    dataField={"DESCRIPTION"}
                    width={200}
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
              </Item>
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
              dataSource={InvestGroup}
              valueExpr="FPINVESTMENTGROUP"
              displayExpr="DESCRIPTION"
            />
          </Column>
          <Column
            dataField={"INVESTMENTSUBGROUP"}
            width={120}
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
          <Column dataField={"INVESTMENTBANKCODE"} caption="Bank" width={150}>
            <Lookup
              dataSource={BankNames}
              valueExpr="INVESTMENTBANKCODE"
              displayExpr="BANKNAME"
            />
          </Column>
          <Column dataField={"OWNER"} width={150}>
            <Lookup
              dataSource={OwnerNames}
              valueExpr="SEQUENCE"
              displayExpr="NAME"
            />
          </Column>

          <Column dataField={"SEQUENCE"} width={150} />

          <Column
            format={"$###,###,###.00"}
            dataField={"CURRENTVALUE"}
            width={100}
            caption={"Current Value"}
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
  };
}

export default ClientInvestments;

// export default function ClientInvestments() {
//   const { user } = useAuth();
//   //console.log("my user stuff", { user });
//   return <ClientInvestmentsx clientCode={user.thisClientcode} />;
// }

// function renderDetail(props) {
//   const uniqueid = props.data.UNIQUEID;
//   return (
//     <ClientAssetDetails
//       rowid={uniqueid}
//       sendit={pageoption}
//       clientCode={props.data.CLIENTCODE}
//       assetName={props.data.ASSETNAME}
//       currency={props.data.CURRENCY}
//       //      bankAccountUniqueID={bankAccountUniqueID}
//       //onDetailChange={handleDetailChange}
//     />
//   );
// }
