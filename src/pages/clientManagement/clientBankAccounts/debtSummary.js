import React from "react";

import { useAuth } from "../../../contexts/auth";
import DataGrid, {
  Column,
  Paging,
  FilterRow,
  HeaderFilter,
} from "devextreme-react/data-grid";
import { Button } from "devextreme-react/button";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { mystore4 } from "./segmentData";
import "devextreme-react/text-area";
import "devextreme/data/data_source";
import "./debtSummaryStyles.scss";
import "./debtsummary.css";
import { GenerateDebtExcel } from "./generateDebtExcel";

//const allowedPageSizes = [8, 12, 20];

//let pageoption = 90;

const renderDescriptionCell = (data) => {
  const { data: rowData } = data;

  let style = {};
  if (
    rowData.TOTAL === 1 &&
    rowData.GROUPTYPESEQUENCE !== 99 &&
    rowData.GROUPTYPESEQUENCE !== 98
  ) {
    style = {
      fontWeight: "bold",
      backgroundColor: "lightgrey",
      borderTop: "1px solid black",
      borderLeft: "1px solid black",
    };
  } else if (rowData.GROUPTYPESEQUENCE === 99) {
    style = {
      borderRight: "1px solid black",
      borderLeft: "1px solid black",
    };
  } else if (rowData.GROUPTYPESEQUENCE === 98) {
    style = {
      fontWeight: "bold",
      color: "white",
      backgroundColor: "black",
      borderTop: "1px solid black",
      borderBottom: "1px solid black",
      borderLeft: "1px solid black",
    }; //
  } else {
    if (rowData.DESCRIPTION === "") {
      style = {
        borderRight: "1px solid black",
        borderLeft: "1px solid black",
      };
    } else {
      style = {
        borderTop: "1px solid black",
        borderRight: "1px solid black",
        borderLeft: "1px solid black",
      };
    }
  }

  if (rowData.DESCRIPTION === "") {
    return <div style={style}>&nbsp;</div>;
  }

  return <div style={style}>{rowData.DESCRIPTION}</div>;
};

const renderGroupDescriptionCell = (data) => {
  const { data: rowData } = data;

  let style = {};
  if (
    rowData.TOTAL === 1 &&
    rowData.GROUPTYPESEQUENCE !== 99 &&
    rowData.GROUPTYPESEQUENCE !== 98
  ) {
    if (rowData.GROUPCODEDESCRIPTION !== "") {
      style = {
        fontWeight: "bold",
        borderTop: "1px solid black",
        backgroundColor: "lightgrey",
        borderRight: "1px solid black",
      };
    } else {
      style = {
        backgroundColor: "lightgrey",
        borderTop: "1px solid black",
        borderRight: "1px solid black",
      };
      return <div style={style}>&nbsp;</div>;
    }
  } else if (rowData.GROUPTYPESEQUENCE === 99) {
    style = {
      fontWeight: "bold",
      borderTop: "1px solid black",
      backgroundColor: "lightgrey",
      borderRight: "1px solid black",
      borderBottom: "1px solid black",
    };
  } else if (rowData.GROUPTYPESEQUENCE === 98) {
    style = {
      fontWeight: "bold",
      color: "white",
      backgroundColor: "black",
      borderTop: "1px solid black",
      borderBottom: "1px solid black",
      borderLeft: "1px solid black",
    }; //
  } else {
    style = { borderRight: "1px solid black" };
  }

  return <div style={style}>{rowData.GROUPCODEDESCRIPTION}</div>;
};

const renderCurrentValueCell = (data) => {
  const { data: rowData } = data;

  let style = {};
  if (
    rowData.TOTAL === 1 &&
    rowData.GROUPTYPESEQUENCE !== 99 &&
    rowData.GROUPTYPESEQUENCE !== 98
  ) {
    style = {
      fontWeight: "bold",
      borderTop: "1px solid black",
      backgroundColor: "lightgrey",
    };
  } else if (rowData.GROUPTYPESEQUENCE === 99) {
    style = {
      fontWeight: "bold",
      borderTop: "1px solid black",
      backgroundColor: "lightgrey",
      borderRight: "1px solid black",
      borderBottom: "1px solid black",
    };
  } else if (rowData.GROUPTYPESEQUENCE === 98) {
    style = {
      fontWeight: "bold",
      color: "black",
      backgroundColor: "#E6D180",
      borderTop: "1px solid black",
      borderBottom: "1px solid black",
      borderLeft: "1px solid black",
      borderRight: "1px solid black",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    };
    return <div style={style}>Current</div>;
  } else {
    style = { borderRight: "1px solid black" };
  }

  // Check if the value is negative
  const isNegative = rowData.CHANGEVALUE < 0;
  const absoluteValue = Math.abs(rowData.CURRENTVALUE);

  // Format the number
  const formattedValue = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(absoluteValue);

  // If negative, enclose in brackets
  const displayValue = isNegative ? `(${formattedValue})` : formattedValue;

  return <div style={style}>{displayValue}</div>;
};
const renderPriorValueCell = (data) => {
  const { data: rowData } = data;

  let style = {};
  if (
    rowData.TOTAL === 1 &&
    rowData.GROUPTYPESEQUENCE !== 99 &&
    rowData.GROUPTYPESEQUENCE !== 98
  ) {
    style = {
      fontWeight: "bold",
      borderTop: "1px solid black",
      backgroundColor: "lightgrey",
    };
  } else if (rowData.GROUPTYPESEQUENCE === 99) {
    style = {
      fontWeight: "bold",
      borderTop: "1px solid black",
      backgroundColor: "lightgrey",
      borderRight: "1px solid black",
      borderBottom: "1px solid black",
    };
  } else if (rowData.GROUPTYPESEQUENCE === 98) {
    style = {
      fontWeight: "bold",
      color: "black",
      backgroundColor: "#E6D180",
      borderTop: "1px solid black",
      borderBottom: "1px solid black",
      borderLeft: "1px solid black",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    };
    return <div style={style}>Prior</div>;
  } else {
    style = { borderRight: "1px solid black" };
  }

  // Check if the value is negative
  const isNegative = rowData.CHANGEVALUE < 0;
  const absoluteValue = Math.abs(rowData.PRIORVALUE);

  // Format the number
  const formattedValue = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(absoluteValue);

  // If negative, enclose in brackets
  const displayValue = isNegative ? `(${formattedValue})` : formattedValue;

  return <div style={style}>{displayValue}</div>;
};
const renderChangeValueCell = (data) => {
  const { data: rowData } = data;

  let style = {};
  if (
    rowData.TOTAL === 1 &&
    rowData.GROUPTYPESEQUENCE !== 99 &&
    rowData.GROUPTYPESEQUENCE !== 98
  ) {
    style = {
      fontWeight: "bold",
      borderTop: "1px solid black",
      backgroundColor: "lightgrey",
    };
  } else if (rowData.GROUPTYPESEQUENCE === 99) {
    style = {
      fontWeight: "bold",
      borderTop: "1px solid black",
      backgroundColor: "lightgrey",
      borderRight: "1px solid black",
      borderBottom: "1px solid black",
    };
  } else if (rowData.GROUPTYPESEQUENCE === 98) {
    style = {
      fontWeight: "bold",
      color: "black",
      backgroundColor: "#E6D180",
      borderTop: "1px solid black",
      borderBottom: "1px solid black",
      borderLeft: "1px solid black",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    };
    return <div style={style}>+/-</div>;
  } else {
    style = { borderRight: "1px solid black" };
  }

  // Check if the value is negative
  const isNegative = rowData.CHANGEVALUE < 0;
  const absoluteValue = Math.abs(rowData.CHANGEVALUE);

  // Format the number
  const formattedValue = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(absoluteValue);

  // If negative, enclose in brackets
  const displayValue = isNegative ? `(${formattedValue})` : formattedValue;

  return <div style={style}>{displayValue}</div>;
};

class DebtSummaryx extends React.Component {
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
      showFilterRow: true,
      showHeaderFilter: true,
      companyCode: 1,
      assetGroupsCodes: [],
      currentFilter: this.applyFilterTypes[0].key,
      isLoading: false, // Add a loading state
      thisWidth: this.props.thisWidth,
      showCurrentOnly: this.props.showPrior,
    };
    console.log("what is props in debtsummary :", { props });
  }

  handleMappingUpdated2 = (value) => {
    this.setState({ EditExcelOn: false });
  };

  CreateExcel = () => {
    console.log("Edit Batch Clicked");
    this.setState({ EditExcelOn: true });
    //this.setState({ CreateExcelOn: true });
  };

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

  onRowPrepared(e) {
    //if (e.rowIndex % 2 === 0) e.rowElement.style.height = "5px";
    //console.log("row prepared", e);
  }
  //      <div className="custom-container" style={{ height: "400px" }}>

  onCellPrepared = (e) => {
    e.cellElement.style.padding = "0px";
    e.cellElement.style.borderTop = "1px solid purple";
  };

  render() {
    return (
      <>
        {this.state.EditExcelOn !== true && (
          <>
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
            <div className="content-block2 dx-card responsive-paddings">
              <div className="custom-container" style={{ height: "800px" }}>
                {/* <p>Debt Summary for {this.props.clientCode}</p> */}
                <DataGrid
                  dataSource={mystore4(this.props.clientCode)}
                  onRowPrepared={this.onRowPrepared}
                  onCellPrepared={this.onCellPrepared}
                  scrolling={{ mode: "virtual" }} // or 'standard', based on your preference
                  //keyExpr="UNIQUEID"
                  showBorders={true}
                  remoteOperations={false}
                  onSelectionChanged={this.handleSelectionChanged.bind(this)} // add this line
                  onEditingStart={this.handleEditingStart}
                  width={this.state.thisWidth}
                  height={"100%"}
                  rowHeight={"70px"} // Set the row height to 70px
                >
                  <Paging enabled={false} />
                  <Column
                    dataField="UNIQUEID"
                    caption="Unique ID"
                    visible={false}
                  />
                  <Column
                    dataField="CLIENTCODE"
                    caption="Client"
                    visible={false}
                  />
                  <Column dataField="TOTALSEQ" caption="Seq" visible={false} />
                  <Column dataField="BANKCODE" caption="Bank" visible={false} />
                  <Column
                    dataField="BANKACCOUNTNUMBER"
                    caption="Account"
                    visible={false}
                  />
                  <Column
                    dataField="DESCRIPTION"
                    width={350}
                    cellRender={renderDescriptionCell}
                    caption={`Debt Summary for ${this.props.clientCode}`}
                    //headerCellRender={renderTitleHeader}
                  />
                  <Column
                    dataField="SEGMENTNUMBER"
                    caption=""
                    format={"###"}
                    alignment="right"
                    width={120}
                    visible={false}
                  />
                  <Column
                    dataField="GROUPCODE"
                    caption="Group"
                    visible={false}
                  />
                  <Column
                    dataField="GROUPCODEDESCRIPTION"
                    cellRender={renderGroupDescriptionCell}
                    caption=""
                    width={200}
                  />
                  <Column
                    dataField="CURRENTVALUE"
                    caption=""
                    format={"$###,###,###"}
                    alignment="right"
                    cellRender={renderCurrentValueCell}
                  />
                  <Column
                    dataField="PRIORVALUE"
                    caption=""
                    format={"$###,###,###"}
                    alignment="right"
                    visible={this.state.showCurrentOnly}
                    cellRender={renderPriorValueCell}
                  />
                  <Column
                    dataField="CHANGEVALUE"
                    caption=""
                    format={"$###,###,###"}
                    alignment="right"
                    visible={this.state.showCurrentOnly}
                    cellRender={renderChangeValueCell}
                  />
                  <Column
                    dataField="GROUPSEQUENCE"
                    caption=""
                    visible={false}
                  />
                  <Column dataField="TOTAL" caption="Total" visible={false} />
                  <Column
                    dataField="BANKSEQUENCE"
                    caption="Bank Seq"
                    visible={false}
                  />
                  <Column
                    dataField="GROUPTYPESEQUENCE"
                    caption="Group Type Seq"
                    visible={false}
                  />
                  <Column
                    dataField="COMPOUND"
                    caption="Compound"
                    visible={false}
                  />
                </DataGrid>
              </div>
            </div>
          </>
        )}
        {this.state.EditExcelOn === true && (
          <div>
            <GenerateDebtExcel
              clientCode={this.props.clientCode}
              onMappingUpdated2={this.handleMappingUpdated2}
            />
          </div>
        )}
      </>
    );
  }
}

export default function DebtSummary(props) {
  const { user } = useAuth();
  console.log("what is props in debtsummary not x :", { props });
  //console.log("what is user:", { user }, user.thisClientcode);
  return (
    <DebtSummaryx
      clientCode={user.thisClientcode}
      thisWidth={props.thisWidth}
      showPrior={props.showPrior}
    />
  );
}

// export default function DebtSummary() {
//   const { user } = useAuth();
//   //console.log({ user });
//   return <DebtSummaryx companyCode={user.companyCode} />;
// }

// <Popup
// title="Type Info"
// showTitle={true}
// width={900}
// height={800}
// />
// <Form>
// <Item itemType="group" colCount={2} colSpan={2}>
//   <Item dataField="ASSETTYPEGROUP" />
//   <Item dataField="DESCRIPTION" />
//   <Item dataField="REPORTSEQUENCE" />
//   <Item dataField="SHOWASSETGROUPTOTALSINNETASSETSHEET" />
// </Item>
// </Form>
