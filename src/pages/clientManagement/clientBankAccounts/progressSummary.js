import React from "react";

/////////////////////////////////////////

import { Chart, Series } from "devextreme-react/chart";
//import { areas } from "./progressGraphData.js";
import ExcelJS from "exceljs";

import withReactContent from "sweetalert2-react-content";
import { saveAs } from "file-saver";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Swal from "sweetalert2";

/////////////////////////////

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
} from "./segmentData";
import { Button } from "devextreme-react/button";

import "devextreme-react/text-area";
import "devextreme/data/data_source";
import "./debtSummaryStyles.scss";
import "./debtsummary.css";
import { EditBatch } from "./editBatch";

//const allowedPageSizes = [8, 12, 20];

//let pageoption = 90;

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

const renderExcelValueFieldCell = (cell, item) => {
  // Set font color for all cases
  cell.font = { color: { argb: "FF000000" } }; // Black color

  // Define common border style for simplicity
  const commonBorderStyle = { style: "thin", color: { argb: "FF000000" } }; // Black

  // Apply background color and borders based on LINETYPE
  if (["T", "X"].includes(item.LINETYPE)) {
    cell.font = { bold: true };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD3D3D3" }, // Light grey background
    };
    cell.border = {
      top: commonBorderStyle,
      bottom: commonBorderStyle,
      right: commonBorderStyle,
    };
  } else if (item.LINETYPE === "") {
    // No specific background color, but black font color is already set
    cell.border = {
      right: commonBorderStyle,
    };
  } else if (item.LINETYPE === "H") {
    cell.border = {
      right: commonBorderStyle,
      top: commonBorderStyle,
      bottom: commonBorderStyle,
    };
    cell.font = { bold: true };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE6D180" }, // Custom yellow background
    };
    cell.value = ""; // This ensures the cell displays no content, including zero
    return;
    // Borders are commented out in your example, so not adding them
  } else if (item.LINETYPE === "B") {
    cell.value = ""; // This ensures the cell displays no content, including zero
    return;
  }

  //const valueCell = rowData.VALUEFIELD;
  cell.numFmt = "$#,##0.00;($#,##0.00)"; // This is Excel's format for currency
};

const renderExcelDescriptionFieldCell = (cell, item) => {
  // Define common border style
  const commonBorderStyle = { style: "thin", color: { argb: "FF000000" } }; // Black

  // Apply styles based on LINETYPE
  if (item.LINETYPE === "H") {
    cell.font = { color: { argb: "FFFFFFFF" } }; // White color
    cell.fill = {
      bold: true,
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF000000" }, // Black background
    };
    cell.border = {
      top: commonBorderStyle,
      bottom: commonBorderStyle,
      right: commonBorderStyle,
      left: commonBorderStyle,
    };
  } else if (item.LINETYPE === "X" || item.LINETYPE === "T") {
    cell.font = {
      bold: true,
      color: { argb: item.LINETYPE === "X" ? "FF000000" : "FF000000" },
    }; // Blue for "X", Black for "T"
    cell.fill = {
      bold: true,
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD9D9D9" }, // Grey background
    };
    cell.border = {
      top: commonBorderStyle,
      bottom: commonBorderStyle,
      right: commonBorderStyle,
      left: commonBorderStyle,
    };
  } else if (item.LINETYPE === "") {
    cell.border = {
      left: commonBorderStyle,
    };
  } else {
    // For other LINETYPE, no specific style applied here
    // Assuming default or custom logic might be added
  }

  // Set the value of the cell to DESCRIPTION
  cell.value = item.DESCRIPTION;
};

///////////////////////////////////

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
      isLoading: true, // Add a loading state
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
      isLoading: false,
    };
    //console.log("what is props in debtsummary :", { props });
  }

  handleMappingUpdated = (value) => {
    this.setState({ editBatchOn: false });
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

  CreateExcel = async () => {
    this.setState({ isLoading: true });
    const ExcelJS = require("exceljs");
    const { saveAs } = require("file-saver");

    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Change in Net Worth");

      // Define columns in the worksheet
      worksheet.columns = [
        { header: "", key: "UNIQUEID", width: 10 },
        {
          header: `Change in Net Worth for ${this.props.clientCode}`,
          key: "DESCRIPTION",
          width: 50,
        },
        { header: "", key: "VALUEFIELD", width: 15 },
        // Add more columns as needed
      ];

      // Instantiate your CustomStore
      console.log("inside 1");
      const store = mystore5(this.props.clientCode);

      // Fetch data using the load method of the store
      //console.log("inside 2");
      const data = await store.load({});
      //console.log("inside 3", data);

      if (Array.isArray(data)) {
        //let previousValue = 0;
        console.log(data.length);
        for (let i = 0; i < data.length; i++) {
          const item = data[i];
          //console.log(`Adding row for item at index ${i}`, item);
          const row = worksheet.addRow({
            DESCRIPTION: item.DESCRIPTION,
            VALUEFIELD: item.VALUEFIELD,
            LINETYPE: item.LINETYPE,
            ROWNUMBER: item.ROWNUMBER,
          });

          // Apply styles to the cells
          renderExcelValueFieldCell(row.getCell("VALUEFIELD"), item);
          renderExcelDescriptionFieldCell(row.getCell("DESCRIPTION"), item);
        }
        //console.log("row", worksheet.getRow(1).values);
        //console.log("row", worksheet.getRow(4).values);

        // Write to a buffer
        const buf = await workbook.xlsx.writeBuffer();
        //console.log("buf", buf);

        // Use FileSaver to save the file
        saveAs(
          new Blob([buf], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          }),
          `${this.props.clientCode}.xlsx`
        );

        // Display success message here
        this.MySwal.fire({
          icon: "success",
          title: "Excel File Created",
          text: `Your file ${this.props.clientCode}.xlsx has been successfully created.`,
          customClass: {
            container: "high-z-index",
          },
        });
      } else {
        console.error("Expected data to be an array but got:", typeof data);
      }
    } catch (error) {
      console.error(
        "An error occurred during the Excel file creation process:",
        error
      );
      // You can also show an error message to the user here using MySwal
      this.MySwal.fire({
        icon: "error",
        title: "Error",
        text: "There was an issue creating the Excel file.",
        customClass: {
          container: "high-z-index",
        },
      });
    }
    this.setState({ isLoading: false });
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
        {this.state.editBatchOn !== true && (
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
            {!this.state.PieActive ? (
              <div style={{ display: "flex", flexDirection: "row" }}>
                <div style={{ flex: 0.75 }}>
                  <div className="content-block2 dx-card responsive-paddings">
                    <div
                      className="custom-container"
                      style={{ height: "850px" }}
                    >
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
            ) : (
              <Chart
                id="chart"
                dataSource={mystoreGraph(this.props.clientCode)}
              >
                <Series
                  valueField="DESCRIPTION"
                  argumentField="VALUEFIELD"
                  name="Analysis"
                  type="bar"
                  color="#ffaa66"
                />
              </Chart>

              // <Chart
              //   key={this.state.counterFlash}
              //   id="pie"
              //   //dataSource={this.state.areas}
              //   dataSource={mystoreGraph(this.props.clientCode)}
              //   palette="Bright"
              //   title="Account Type Analysis"
              //   onPointClick={pointClickHandler}
              //   onLegendClick={legendClickHandler}
              // >
              //   <Series argumentField="DESCRIPTION" valueField="VALUEFIELD">
              //     type="bar"
              //     <Label visible={true}>
              //       <Connector visible={true} width={1} />
              //     </Label>
              //   </Series>

              //   <Size width={800} />
              //   <Export enabled={true} />
              // </Chart>
            )}
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

//  <div>
// {this.clickCount === 1 && (
//   <EditBatch
//     rownumber={this.state.selectedRowNumber}
//     clientCode={this.props.clientCode}
//     onMappingUpdated={this.handleMappingUpdated}
//   />
// )}
// {this.clickCount === 2 && (
//   <EditBatch
//     rownumber={this.state.selectedRowNumber2}
//     clientCode={this.props.clientCode}
//     onMappingUpdated={this.handleMappingUpdated}
//   />
// )}
// </div>
