import React from "react";

import { Chart, Series } from "devextreme-react/chart";
import ExcelJS from "exceljs";

import withReactContent from "sweetalert2-react-content";
import { saveAs } from "file-saver";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Swal from "sweetalert2";

import { useAuth } from "../../../contexts/auth";
import DataGrid, {
  Column,
  Paging,
  FilterRow,
  HeaderFilter,
  Editing,
} from "devextreme-react/data-grid";

import {
  mystore5,
  mystoreGraph,
  relatedData,
  relatedData2,
  relatedData3,
  getexceldata,
} from "./segmentData";
import { Button } from "devextreme-react/button";

import "devextreme-react/text-area";
import "devextreme/data/data_source";
import "./debtSummaryStyles.scss";
import "./debtsummary.css";
import { EditBatch } from "./editBatch";
import { GenerateProgressExcel } from "./generateProgressExcel";
import { GenerateExcelFiles } from "./generateExcelFiles";

//const allowedPageSizes = [8, 12, 20];

//let pageoption = 90;

class ProgressSummaryx extends React.Component {
  constructor(props) {
    super(props);
    this.MySwal = withReactContent(Swal);
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
      showFilterRow: false,
      showHeaderFilter: false,
      companyCode: 1,
      assetGroupsCodes: [],
      currentFilter: this.applyFilterTypes[0].key,
      isLoading: false, // Add a loading state
      thisWidth: 580, //this.props.thisWidth,
      showCurrentOnly: this.props.showPrior,
      selectedRowData: null,
      selectedRowData2: null,
      selectedRowData3: null,
      lastClickedRowId: null,
      selectedRowNumber: null,
      clickCount: 0,
      PieActive: false,
      counterFlash: 0,
      editBatchOn: false,
      EditExcelOn: false,
    };
    //console.log("what is props in debtsummary :", { props });
  }
  CreateExcel = () => {
    console.log("Edit Batch Clicked");
    this.setState({ EditExcelOn: true });
    //this.setState({ CreateExcelOn: true });
  };

  handleMappingUpdated = (value) => {
    this.setState({ editBatchOn: false });
  };

  handleMappingUpdated2 = (value) => {
    this.setState({ EditExcelOn: false });
  };

  EditBatch = () => {
    console.log("Edit Batch Clicked");
    this.setState({ editBatchOn: true });
  };

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
    if (rowToBeEdited.LINETYPE !== "") {
      e.cancel = true; // Prevents the editing from starting
    }
  }

  onCellPrepared = (e) => {
    e.cellElement.style.padding = "0px";
    e.cellElement.style.borderTop = "1px solid purple";
  };

  ClearClick = () => {
    console.log("Clear Clicked");
    this.setState({ selectedRowData: null });
    this.setState({ selectedRowData2: null });
    this.setState({ selectedRowData3: null });
  };

  ClearPieClick = () => {
    //console.log("Clear Clicked");
    this.setState((prevState) => ({
      PieActive: !prevState.PieActive, // Toggle the boolean value
      counterFlash: prevState.counterFlash + 1,
    }));
  };

  onRowPrepared(e) {
    //e.rowElement.style.height = "5px";
    //if (e.rowIndex % 2 === 0) e.rowElement.style.height = "5px";
    //console.log("row prepared", e);
  }
  //      <div className="custom-container" style={{ height: "400px" }}>
  onRowClick = async (e) => {
    console.log("Row clicked", e.data);
    if (e && e.data) {
      try {
        const rowData = e.data;
        this.setState({ selectedRowNumber: rowData.ROWNUMBER });
        this.setState(
          (prevState) => {
            // Determine the new click count, cycling through 1 to 3
            const newClickCount =
              prevState.clickCount >= 3 ? 1 : prevState.clickCount + 1;
            return { clickCount: newClickCount };
          },
          async () => {
            console.log("click count", this.state.clickCount);
            let dataForRelatedGrid;

            // Fetch data based on the click count
            if (this.state.clickCount === 1) {
              dataForRelatedGrid = await relatedData(
                this.props.clientCode,
                rowData.CHANGEINNETWORTHID
              );
              this.setState({ selectedRowData: dataForRelatedGrid });
            } else if (this.state.clickCount === 2) {
              dataForRelatedGrid = await relatedData2(
                this.props.clientCode,
                rowData.CHANGEINNETWORTHID
              );
              this.setState({ selectedRowData2: dataForRelatedGrid });
            } else if (this.state.clickCount === 3) {
              // Assume relatedData3 is similar function for fetching data for the third click
              dataForRelatedGrid = await relatedData3(
                this.props.clientCode,
                rowData.CHANGEINNETWORTHID
              );
              this.setState({ selectedRowData3: dataForRelatedGrid });
            }
          }
        );
      } catch (error) {
        console.error("Error fetching related data", error);
      }
    }
  };

  renderRelatedGrid() {
    const { selectedRowData } = this.state;

    if (!selectedRowData) {
      return null;
    }

    //const thisrow = selectedRowData[0];

    // Assuming `getRelatedData` is a function that returns the related data based on the selected row
    //const relatedData = getRelatedData(selectedRowData);
    //    <div className="custom-container" style={{ height: "850px" }}>

    return (
      <div className="content-block2 dx-card responsive-paddings">
        <Button
          text="Edit Section"
          onClick={this.EditBatch}
          style={{
            width: "200px",
            height: "30px",
            marginTop: "2px",
            marginBottom: "10px",
            marginLeft: "15px",
          }}
        ></Button>

        <div className="custom-container">
          <DataGrid
            dataSource={selectedRowData}
            rowHeight={"10px"} // Set the row height to 70px>
            onCellPrepared={this.onCellPrepared}
          >
            {/* <Editing
              mode="cell"
              allowUpdating={true}
              allowAdding={false}
              allowDeleting={false}
              selectionMode="single"
            ></Editing> */}
            <Column
              dataField="CLIENTCODE"
              caption="Client Code"
              width={200}
              visible={false}
            />
            <Column
              dataField="BANKNAME"
              caption="Bank Name"
              width={200}
              visible={true}
            />
            <Column
              dataField="BANKACCOUNTNUMBER"
              caption="Bank Account"
              width={150}
              visible={true}
            />
            <Column
              dataField="FPTRANSACTIONCODE"
              caption="Code"
              width={150}
              visible={true}
            />
            <Column
              dataField="TRANSACTIONDATE"
              caption="Date"
              width={100}
              visible={true}
            />
            <Column
              dataField="TRANSACTIONAMOUNT"
              caption="Amount"
              format={"$###,###,###"}
              alignment="right"
              width={200}
              visible={true}
            />
            <Column
              dataField="UNIQUEID"
              caption="ID"
              width={200}
              visible={false}
            />
          </DataGrid>
        </div>
      </div>
    );
  }
  //////////////////////////////////////////////////////////////
  renderRelatedGrid2() {
    const { selectedRowData2 } = this.state;

    if (!selectedRowData2) {
      return null;
    }

    return (
      <div className="content-block2 dx-card responsive-paddings">
        <Button
          text="Edit Section"
          onClick={this.EditBatch}
          style={{
            width: "200px",
            height: "30px",
            marginTop: "2px",
            marginBottom: "10px",
            marginLeft: "15px",
          }}
        ></Button>
        <div className="custom-container">
          <DataGrid
            dataSource={selectedRowData2}
            rowHeight={"10px"} // Set the row height to 70px>
            onCellPrepared={this.onCellPrepared}
          >
            <Column
              dataField="CLIENTCODE"
              caption="Client Code"
              width={200}
              visible={false}
            />
            <Column
              dataField="BANKNAME"
              caption="Bank Name"
              width={200}
              visible={true}
            />
            <Column
              dataField="BANKACCOUNTNUMBER"
              caption="Bank Account"
              width={150}
              visible={true}
            />
            <Column
              dataField="FPTRANSACTIONCODE"
              caption="Code"
              width={150}
              visible={true}
            />
            <Column
              dataField="TRANSACTIONDATE"
              caption="Date"
              width={100}
              visible={true}
            />
            <Column
              dataField="TRANSACTIONAMOUNT"
              caption="Amount"
              format={"$###,###,###"}
              alignment="right"
              width={200}
              visible={true}
            />
            <Column
              dataField="UNIQUEID"
              caption="ID"
              width={200}
              visible={false}
            />
          </DataGrid>
        </div>
      </div>
    );
  }

  renderRelatedGrid3() {
    const { selectedRowData3 } = this.state;

    if (!selectedRowData3) {
      return null;
    }

    return (
      <div className="content-block2 dx-card responsive-paddings">
        <Button
          text="Edit Section"
          onClick={this.EditBatch}
          style={{
            width: "200px",
            height: "30px",
            marginTop: "2px",
            marginBottom: "10px",
            marginLeft: "15px",
          }}
        ></Button>
        <div className="custom-container">
          <DataGrid
            dataSource={selectedRowData3}
            rowHeight={"10px"} // Set the row height to 70px>
            onCellPrepared={this.onCellPrepared}
          >
            <Column
              dataField="CLIENTCODE"
              caption="Client Code"
              width={200}
              visible={false}
            />
            <Column
              dataField="BANKNAME"
              caption="Bank Name"
              width={200}
              visible={true}
            />
            <Column
              dataField="BANKACCOUNTNUMBER"
              caption="Bank Account"
              width={150}
              visible={true}
            />
            <Column
              dataField="FPTRANSACTIONCODE"
              caption="Code"
              width={150}
              visible={true}
            />
            <Column
              dataField="TRANSACTIONDATE"
              caption="Date"
              width={100}
              visible={true}
            />
            <Column
              dataField="TRANSACTIONAMOUNT"
              caption="Amount"
              format={"$###,###,###"}
              alignment="right"
              width={200}
              visible={true}
            />
            <Column
              dataField="UNIQUEID"
              caption="ID"
              width={200}
              visible={false}
            />
          </DataGrid>
        </div>
      </div>
    );
  }

  //////////////////////////////////////////////////////////////
  ////////////////////////  this is the main render
  //////////////////////////////////////////////////////////////

  render() {
    return (
      <>
        {this.state.isLoading && (
          <div className="spinner-container">
            {this.state.isLoading && (
              <>
                <p>Building the Excel File please wait &nbsp;&nbsp;</p>
                <FontAwesomeIcon
                  icon={faSpinner}
                  spin
                  className="large-spinner"
                />
              </>
            )}
          </div>
        )}
        {this.state.EditExcelOn !== true && (
          <>
            <Button
              text="Clear Selections"
              onClick={this.ClearClick}
              style={{
                width: "200px",
                height: "30px",
                marginTop: "2px",
                marginBottom: "10px",
                marginLeft: "15px",
              }}
            ></Button>
            <Button
              text="Create Excel"
              onClick={this.CreateExcel}
              style={{
                width: "200px",
                height: "30px",
                marginTop: "2px",
                marginBottom: "10px",
                marginLeft: "15px",
              }}
            ></Button>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div style={{ flex: 0.75 }}>
                <div className="content-block2 dx-card responsive-paddings">
                  <div className="custom-container" style={{ height: "850px" }}>
                    {/* <p>Change in Net Worth (Progress) for {this.props.clientCode}</p> */}
                    <DataGrid
                      dataSource={mystore5(this.props.clientCode)}
                      onRowPrepared={this.onRowPrepared}
                      onCellPrepared={this.onCellPrepared}
                      //scrolling={{ mode: "virtual" }} // or 'virtual', based on your preference
                      //keyExpr="UNIQUEID"
                      showBorders={true}
                      remoteOperations={false}
                      onSelectionChanged={this.handleSelectionChanged.bind(
                        this
                      )} // add this line
                      onEditingStart={this.handleEditingStart}
                      //onEditorPreparing={this.handleEditorPreparing}
                      id="yourGridId"
                      width={this.state.thisWidth}
                      height={"100%"}
                      rowHeight={"10px"} // Set the row height to 70px
                      onRowClick={this.onRowClick}
                    >
                      <FilterRow
                        visible={this.state.showFilterRow}
                        applyFilter={this.state.currentFilter}
                      />
                      <HeaderFilter visible={this.state.showHeaderFilter} />
                      <Paging enabled={false} />
                      <Column
                        dataField="UNIQUEID"
                        caption="Unique ID"
                        visible={false}
                      />
                      <Column
                        dataField="ROWNUMBER"
                        caption="Row"
                        visible={false}
                      />

                      <Column
                        dataField="DESCRIPTION"
                        caption={`Change in Net Worth for ${this.props.clientCode}`}
                        width={350}
                        visible={true}
                        cellRender={renderDescriptionCell}
                      />
                      <Column
                        dataField="VALUEFIELD"
                        caption=""
                        format={"$###,###,###"}
                        alignment="right"
                        cellRender={renderValueFieldCell}
                        width={150}
                      />
                      <Column
                        dataField="FORMULAFIELD"
                        caption="Formula"
                        visible={false}
                      />
                      <Column
                        dataField="LINETYPE"
                        caption="Type"
                        visible={false}
                      />
                      <Column
                        dataField="UNIQUEID"
                        caption="id"
                        visible={false}
                      />
                    </DataGrid>
                  </div>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                {this.renderRelatedGrid()}
                {this.renderRelatedGrid2()}
                {this.renderRelatedGrid3()}
              </div>
            </div>
          </>
        )}

        {this.state.editBatchOn === true && (
          <div>
            <EditBatch
              rownumber={this.state.selectedRowNumber}
              clientCode={this.props.clientCode}
              onMappingUpdated={this.handleMappingUpdated}
            />
          </div>
        )}
        {this.state.EditExcelOn === true && (
          <div>
            <GenerateExcelFiles
              clientCode={this.props.clientCode}
              onMappingUpdated2={this.handleMappingUpdated2}
            />
          </div>
        )}
      </>
    );
  }
}

export default function ProgressSummary(props) {
  const { user } = useAuth();
  //console.log("what is props in progress summary not x :", { props });
  //console.log("what is user:", { user }, user.thisClientcode);
  return (
    <ProgressSummaryx
      clientCode={user.thisClientcode}
      thisWidth={props.thisWidth}
      showPrior={props.showPrior}
    />
  );
}

const renderDescriptionCell = (data) => {
  const { data: rowData } = data;

  let style = {};
  if (rowData.LINETYPE === "H") {
    style = {
      fontWeight: "bold",
      color: "white",
      backgroundColor: "black",
      borderTop: "1px solid black",
      borderBottom: "1px solid black",
      borderLeft: "1px solid black",
    }; //
  } else if (rowData.LINETYPE === "X") {
    style = {
      fontWeight: "bold",
      color: "black",
      backgroundColor: "#D9D9D9",
      borderTop: "1px solid black",
      borderBottom: "1px solid black",
      borderLeft: "1px solid black",
    }; // Apply blue color
  } else if (rowData.LINETYPE === "T") {
    style = {
      fontWeight: "bold",
      color: "black",
      backgroundColor: "#D9D9D9",
      borderTop: "1px solid black",
      borderBottom: "1px solid black",
      borderLeft: "1px solid black",
    };
  } else {
    style = {
      backgroundColor: "",
      borderLeft: "1px solid black",

      // borderTop: "1px solid black",
      // borderBottom: "1px solid black",
    };
  }

  return <div style={style}>{rowData.DESCRIPTION}</div>;
};

const renderValueFieldCell = (data) => {
  const { data: rowData } = data;

  let style = {};
  if (rowData.LINETYPE === "T") {
    style = {
      fontWeight: "bold",
      color: "black",
      backgroundColor: "lightgrey",
      borderTop: "1px solid black",
      borderBottom: "1px solid black",
      borderRight: "1px solid black",
    };
  }
  if (rowData.LINETYPE === "X") {
    style = {
      color: "black",
      backgroundColor: "lightgrey",
      borderTop: "1px solid black",
      borderBottom: "1px solid black",
      borderRight: "1px solid black",
    };
  }
  if (rowData.LINETYPE === "") {
    style = {
      color: "black",
      borderRight: "1px solid black",
      // borderTop: "1px solid black",
      // borderBottom: "1px solid black",
    };
  }

  if (rowData.LINETYPE === "H") {
    style = {
      backgroundColor: "#E6D180",
      borderRight: "1px solid black",
      borderTop: "1px solid black",
      borderBottom: "1px solid black",
      // borderTop: "1px solid black",
      // borderBottom: "1px solid black",
    };
  }

  // Check if the value is negative
  const isNegative = rowData.VALUEFIELD < 0;
  const absoluteValue = Math.abs(rowData.VALUEFIELD);

  // Format the number
  const formattedValue = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(absoluteValue);

  // If negative, enclose in brackets
  if (rowData.LINETYPE === "H" || rowData.LINETYPE === "B") {
    return <div style={style}>&nbsp;</div>;
  } else {
    const displayValue = isNegative ? `(${formattedValue})` : formattedValue;
    return <div style={style}>{displayValue}&nbsp;&nbsp;</div>;
  }
};
