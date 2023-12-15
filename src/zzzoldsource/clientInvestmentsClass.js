import React from "react";

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
      myClient: this.props.clientCode,
      currentRow: 0,
      filterValue: "90",
      selectedRowKeys: [],
      companyCode: 1,
      showFilterRow: true,
      showHeaderFilter: true,
      currentFilter: this.applyFilterTypes[0].key,
      assetTypes: [],
      ownerData: [],
      bankTypes: [],
      InvestGroup: [],
      InvestSubGroup: [],
      BankNames: [],
      OwnerNames: [],
      tagtypes: ["TFSA", "RRIF", "RDSP", "LIRA", "RESP", "GROUP"],
      currentID: 0,
      transactionGroupData: [],
      transactionGroupTransactionData: [],

      TransactionStocks: [],
      myClientcode: this.props.clientCode,
      rowToBeEdited: 0,
      selectedStockCode: "Undefined",
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
    mystore9() // call the function to fetch data
      .then((data) => {
        //console.log("banks", data);
        this.setState({ InvestSubGroup: data.data }); // store the data in state
        //console.log("bankdata", this.state.bankData);
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
        this.setState({ BankNames: data.data }); // store the data in state
        //console.log("bankdata", this.state.bankData);
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the transaction group data:",
          error
        );
      });

    mystore11(this.state.myClientcode) // call the function to fetch data
      .then((data) => {
        //console.log("banks", data);
        this.setState({ OwnerNames: data.data }); // store the data in state
        //console.log("bankdata", this.state.bankData);
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the transaction group data:",
          error
        );
      });
  }

  ///////////////////////////////////////////// end of trying here //////////////

  handleSelectionChanged = (e) => {
    // this.setState({ selectedRowKeys: e.selectedRowKeys });
    // if (e.selectedRowKeys.length > 0) {
    //   this.setState({ currentRow: e.selectedRowKeys[0] }); // update the current row
    // }
  };

  nameEditorOptions = { disabled: true };

  handleEditingStart = (e) => {
    const idnumber = e.data.UNIQUEID;
    this.setState({ currentID: idnumber }, () => {
      console.log("handle editing start - idnumber", this.state.currentID);
    });
    fetchAllInvestmentData(idnumber)
      .then(
        ({
          transactionsData,
          transactionsDetailsData,
          transactionsStocksData,
        }) => {
          this.setState({
            transactionGroupData: transactionsData,
            transactionGroupTransactionData: transactionsDetailsData,
            TransactionStocks: transactionsStocksData,
          });
        }
      )
      .catch((error) => {
        console.error("There was an error fetching the data:", error);
      });
  };

  //  handleEditingStart = (e) => {
  //    const idnumber = e.data.UNIQUEID; // Assuming the ID is stored in UNIQUEID

  // Promise.all([mystore12(idnumber), mystore13(idnumber), mystore14(idnumber)])
  //   .then(([data12, data13, data14]) => {
  //     this.setState({
  //       transactionGroupData: data12.data,
  //       transactionGroupTransactionData: data13.data,
  //       TransactionStocks: data14.data,
  //     });
  //   })
  //   .catch((error) => {
  //     console.error("There was an error fetching the data:", error);
  //   });
  //};

  //handleDetailChange = (newDetailData) => {};

  handleEditingStartStock = (e) => {
    alert("stock editing start" + e.data.STOCKCODE);
    console.log("e is ", e.data.STOCKCODE);

    this.setState({ selectedStockCode: e.data.STOCKCODE }, () => {
      console.log("stock code", this.state.selectedStockCode);
    });

    const idnumber = e.data.STOCKCODE;

    // this.setState({ selectedStockCode: e.data.STOCKCODE }, () => {
    //   console.log("stock code", this.state.selectedStockCode);
    // });
  };

  render() {
    return (
      <div className="content-block2 dx-card ">
        <DataGrid
          id="`maindatagrid"
          dataSource={InvestmentStore(this.props.clientCode)}
          keyExpr="UNIQUEID"
          showBorders={false}
          remoteOperations={false}
          //onSelectionChanged={this.handleSelectionChanged.bind(this)} // add this line
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
                  dataSource={this.state.transactionGroupData}
                  keyExpr="UNIQUEID"
                  showBorders={false}
                  remoteOperations={false}
                  //onSelectionChanged={this.handleSelectionChanged.bind(this)} // add this line
                  //onEditingStart={this.handleEditingStart}
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
                  dataSource={this.state.transactionGroupTransactionData}
                  //onRowPrepared={this.onRowPrepared}
                  scrolling={{ mode: "virtual" }} // or 'standard', based on your preference
                  //keyExpr="UNIQUEID"
                  showBorders={true}
                  remoteOperations={false}
                  //onSelectionChanged={this.handleSelectionChanged.bind(this)} // add this line
                  //onEditingStart={this.handleEditingStart}
                  width={this.state.thisWidth}
                  rowHeight={"70px"} // Set the row height to 70px
                  columnAutoWidth={true}
                  height={300}
                  paging={{ pageSize: 5 }}
                >
                  <FilterRow
                    visible={this.state.showFilterRow}
                    applyFilter={this.state.currentFilter}
                  />
                  <HeaderFilter visible={this.state.showHeaderFilter} />
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
                  dataSource={this.state.TransactionStocks}
                  //dataSource={mystore14(this.state.currentID)}
                  //onRowPrepared={this.onRowPrepared}
                  scrolling={{ mode: "virtual" }} // or 'standard', based on your preference
                  //keyExpr="UNIQUEID"
                  showBorders={true}
                  remoteOperations={false}
                  //onSelectionChanged={this.handleSelectionChanged.bind(this)} // add this line
                  onEditingStart={this.handleEditingStartStock}
                  width={this.state.thisWidth}
                  height={"100%"}
                  rowHeight={"70px"} // Set the row height to 70px
                  //handleEditingStart={this.handleEditingStartStock}
                  //onRowPrepared={this.handleEditingStartStock}
                >
                  <FilterRow
                    visible={this.state.showFilterRow}
                    applyFilter={this.state.currentFilter}
                  />
                  <HeaderFilter visible={this.state.showHeaderFilter} />
                  <Paging enabled={false} />
                  <Editing
                    mode="popup"
                    allowUpdating={true}
                    allowAdding={true}
                    allowDeleting={true}
                  >
                    <Popup
                      title={`Stock Info ${this.state.selectedStockCode}`}
                      showTitle={true}
                      width={800}
                      height={600}
                    />
                    <Form colCount={3} colSpan={2}>
                      <Item
                        render={() => (
                          <React.Fragment>
                            <GetStockQuote
                              thiscode={this.state.selectedStockCode}
                            />
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
              dataSource={this.state.InvestGroup}
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
              dataSource={this.state.InvestSubGroup}
              valueExpr="FPINVESTMENTSUBGROUP"
              displayExpr="LONGDESCRIPTION"
            />
          </Column>
          <Column dataField={"INVESTMENTBANKCODE"} caption="Bank" width={150}>
            <Lookup
              dataSource={this.state.BankNames}
              valueExpr="INVESTMENTBANKCODE"
              displayExpr="BANKNAME"
            />
          </Column>
          <Column dataField={"OWNER"} width={150}>
            <Lookup
              dataSource={this.state.OwnerNames}
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
              dataSource={this.state.tagtypes}
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
}

export default function ClientInvestments() {
  const { user } = useAuth();
  //console.log("my user stuff", { user });
  return <ClientInvestmentsx clientCode={user.thisClientcode} />;
}

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
