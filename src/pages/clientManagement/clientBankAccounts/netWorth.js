import React from "react";

import { useAuth } from "../../../contexts/auth";
import { Button } from "devextreme-react/button";
import DataGrid, {
  Column,
  Paging,
  FilterRow,
  HeaderFilter,
} from "devextreme-react/data-grid";

import { mystore7 } from "./segmentData";
import "devextreme-react/text-area";
import "devextreme/data/data_source";
import "./debtSummaryStyles.scss";
import "./debtsummary.css";
import { GenerateNetWorthExcel } from "./generateNetWorthExcel";

//const allowedPageSizes = [8, 12, 20];

//let pageoption = 90;

let lastBankAccountNumber = "xxxxxx";

const renderDescriptionCell = (data) => {
  const { data: rowData } = data;

  let style = {};
  if (rowData.LINETYPE === "H") {
    style = {
      color: "white",
      backgroundColor: "black",
      borderTop: "1px solid black",
      borderBottom: "1px solid black",
      borderRight: "1px solid black",
      borderLeft: "1px solid black",
    }; // Apply blue color
  } else if (rowData.LINETYPE === "X") {
    style = {
      color: "blue",
      backgroundColor: "lightgrey",
      borderTop: "1px solid black",
      borderBottom: "1px solid black",
      borderRight: "1px solid black",
      borderLeft: "1px solid black",
    }; // Apply blue color
  } else if (rowData.LINETYPE === "T") {
    style = {
      color: "black",
      backgroundColor: "lightgrey",
      borderTop: "1px solid black",
      borderBottom: "1px solid black",
      borderRight: "1px solid black",
      borderLeft: "1px solid black",
    };
  } else {
    style = {
      backgroundColor: "",
      borderRight: "1px solid black",
      borderLeft: "1px solid black",
      // borderTop: "1px solid black",
      // borderBottom: "1px solid black",
    };
  }

  return <div style={style}>{rowData.DESCRIPTION}</div>;
};
///////////////////////////////////////////////////////

const renderValueFieldCell = (data) => renderValueFieldCellCombined(data, 1);

// Usage example for column 2
const renderValueFieldCell2 = (data) => renderValueFieldCellCombined(data, 2);

// Usage example for column 3
const renderValueFieldCell3 = (data) => renderValueFieldCellCombined(data, 3);

const renderValueFieldCellCombined = (data, column) => {
  const { data: rowData } = data;

  let style = { borderRight: "1px solid black" };
  let formattedValue = "";
  let displayValue = "";
  let printColumn = "";
  let valueField = "";
  let stringField = "";

  // Determine column-specific variables
  switch (column) {
    case 1:
      printColumn = rowData.PRINTCOLUMN1;
      valueField = rowData.VALUEFIELD;
      stringField = rowData.FIRSTSTRING;
      break;
    case 2:
      printColumn = rowData.PRINTCOLUMN2;
      valueField = rowData.VALUEFIELD2;
      stringField = rowData.SECONDSTRING;
      break;
    case 3:
      printColumn = rowData.PRINTCOLUMN3;
      valueField = rowData.VALUEFIELD3;
      stringField = rowData.THIRDSTRING;
      break;
    default:
    // Handle default case or throw an error
  }

  // Set the style based on LINETYPE
  if (rowData.LINETYPE === "T" || rowData.LINETYPE === "X") {
    style = {
      color: "black",
      backgroundColor: "#D9D9D9",
      borderTop: "1px solid black",
      borderBottom: "1px solid black",
      borderRight: "1px solid black",
    };
  } else if (rowData.LINETYPE === "H") {
    style = {
      backgroundColor: "#E6D180",
      borderRight: "1px solid black",
    };
  }

  if (printColumn === "N") {
    style = {};
  }

  // Check if the value is negative
  const isNegative = valueField < 0;
  const absoluteValue = Math.abs(valueField);

  // Format the number
  formattedValue = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(absoluteValue);

  // If negative, enclose in brackets
  displayValue = isNegative ? `(${formattedValue})` : formattedValue;

  // Return based on conditions
  if (
    (rowData.LINETYPE === "H" ||
      rowData.LINETYPE === "X" ||
      rowData.LINETYPE === "B") &&
    printColumn !== "Y" &&
    printColumn !== "H"
  ) {
    return <div style={style}>&nbsp;</div>;
  } else if (printColumn === "H") {
    if (stringField === "") {
      return <div style={style}>&nbsp;</div>;
    } else {
      return <div style={{ ...style, textAlign: "center" }}>{stringField}</div>;
    }
  } else {
    return <div style={style}>{displayValue}&nbsp;&nbsp;</div>;
  }
};
///////////////////////////////////////////////////////

class NetWorthx extends React.Component {
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
      showFilterRow: false,
      showHeaderFilter: false,
      companyCode: 1,
      assetGroupsCodes: [],
      currentFilter: this.applyFilterTypes[0].key,
      isLoading: true, // Add a loading state
      thisWidth: 880, //this.props.thisWidth,
      showCurrentOnly: this.props.showPrior,
      EditExcelOn: false,
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

  onCellPrepared = (e) => {
    e.cellElement.style.padding = "0px";
    //e.cellElement.style.borderTop = "1px solid purple";
  };

  onRowPrepared(e) {
    //e.rowElement.style.height = "5px";
    //e.rowElement.style.borderTop = "1px solid red";
    //if (e.rowIndex % 2 === 0) e.rowElement.style.height = "5px";
    //console.log("row prepared", e);
  }
  //      <div className="custom-container" style={{ height: "400px" }}>

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
              <div className="custom-container" style={{ height: "850px" }}>
                {/* <p>Change in Net Worth (Progress) for {this.props.clientCode}</p> */}
                <DataGrid
                  dataSource={mystore7(this.props.clientCode)}
                  onRowPrepared={this.onRowPrepared}
                  onCellPrepared={this.onCellPrepared}
                  scrolling={{ mode: "virtual" }} // or 'virtual', based on your preference
                  //keyExpr="UNIQUEID"
                  showBorders={true}
                  remoteOperations={false}
                  onSelectionChanged={this.handleSelectionChanged.bind(this)} // add this line
                  onEditingStart={this.handleEditingStart}
                  width={this.state.thisWidth}
                  height={"100%"}
                  //rowHeight={"10px"} // Set the row height to 70px
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
                  <Column dataField="ROWNUMBER" caption="Row" visible={false} />

                  <Column
                    dataField="DESCRIPTION"
                    caption={`Net Worth for ${this.props.clientCode}`}
                    width={350}
                    visible={true}
                    cellRender={renderDescriptionCell}
                  />
                  {/* <Column
              dataField="COLUMNONE"
              caption=""
              width={100}
              //cellRender={ColumnnOneCell}
            /> */}
                  <Column
                    dataField="VALUEFIELD"
                    caption=""
                    format={"$###,###,###"}
                    alignment="right"
                    cellRender={renderValueFieldCell}
                    width={150}
                  />
                  <Column
                    dataField="VALUEFIELD1"
                    caption=""
                    format={"$###,###,###"}
                    alignment="right"
                    cellRender={renderValueFieldCell2}
                    width={150}
                  />
                  <Column
                    dataField="VALUEFIELD2"
                    caption=""
                    format={"$###,###,###"}
                    alignment="right"
                    cellRender={renderValueFieldCell3}
                    width={150}
                  />
                  <Column
                    dataField="FORMULAFIELD"
                    caption="Formula"
                    visible={false}
                  />
                  <Column dataField="LINETYPE" caption="Type" visible={false} />
                </DataGrid>
              </div>
            </div>
          </>
        )}
        {this.state.EditExcelOn === true && (
          <div>
            <GenerateNetWorthExcel
              clientCode={this.props.clientCode}
              onMappingUpdated2={this.handleMappingUpdated2}
            />
          </div>
        )}
      </>
    );
  }
}

export default function NetWorth(props) {
  const { user } = useAuth();
  console.log("what is props in progress summary not x :", { props });
  //console.log("what is user:", { user }, user.thisClientcode);
  return (
    <NetWorthx
      clientCode={user.thisClientcode}
      thisWidth={props.thisWidth}
      showPrior={props.showPrior}
    />
  );
}

// const ColumnnOneCell = (data) => {
//   const { data: rowData } = data;

//   let style = {};
//   if (rowData.LINETYPE === "H") {
//     style = {
//       color: "black",
//       backgroundColor: "lightgrey",
//       borderTop: "1px solid black",
//       borderBottom: "1px solid black",
//     }; // Apply blue color
//   } else if (rowData.LINETYPE === "X") {
//     style = {
//       color: "blue",
//       backgroundColor: "yellow",
//       borderTop: "1px solid black",
//       borderBottom: "1px solid black",
//     }; // Apply blue color
//   } else if (rowData.LINETYPE === "T") {
//     style = {
//       color: "red",
//       backgroundColor: "yellow",
//       borderTop: "1px solid black",
//       borderBottom: "1px solid black",
//     };
//   } else {
//     style = {
//       backgroundColor: "",
//       // borderTop: "1px solid black",
//       // borderBottom: "1px solid black",
//     };
//   }

//   return <div style={style}>{rowData.COLUMNONE}</div>;
// };

// const renderValueFieldCell = (data) => {
//     const { data: rowData } = data;

//     let style = {};
//     if (rowData.LINETYPE === "T") {
//       style = {
//         color: "black",
//         backgroundColor: "lightgrey",
//         borderTop: "1px solid black",
//         borderBottom: "1px solid black",
//       }; // Apply blue color
//     }
//     if (rowData.LINETYPE === "X") {
//       style = {
//         color: "black",
//         backgroundColor: "lightgrey",
//         borderTop: "1px solid black",
//         borderBottom: "1px solid black",
//       };
//     }
//     if (rowData.LINETYPE === "") {
//       style = {
//         color: "black",
//         // borderTop: "1px solid black",
//         // borderBottom: "1px solid black",
//       };
//     }

//     if (rowData.LINETYPE === "H") {
//       style = {
//         backgroundColor: "gold",
//         // borderTop: "1px solid black",
//         // borderBottom: "1px solid black",
//       };
//     }

//     if (rowData.PRINTCOLUMN1 === "N") {
//       style = {};
//     }

//     // Check if the value is negative
//     const isNegative = rowData.VALUEFIELD < 0;
//     const absoluteValue = Math.abs(rowData.VALUEFIELD);

//     // Format the number
//     const formattedValue = new Intl.NumberFormat("en-US", {
//       style: "currency",
//       currency: "USD",
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(absoluteValue);

//     // If negative, enclose in brackets
//     if (
//       (rowData.LINETYPE === "H" || rowData.LINETYPE === "X") &&
//       rowData.PRINTCOLUMN1 !== "Y" &&
//       rowData.PRINTCOLUMN1 !== "H"
//     ) {
//       return <div style={style}>&nbsp;</div>;
//     } else {
//       if (rowData.PRINTCOLUMN1 === "H") {
//         return (
//           <div style={{ ...style, textAlign: "center" }}>
//             {rowData.FIRSTSTRING}
//           </div>
//         );
//       } else {
//         const displayValue = isNegative ? `(${formattedValue})` : formattedValue;
//         return <div style={style}>{displayValue}&nbsp;&nbsp;</div>;
//       }
//     }
//   };
//   /////////////////////////////////////////////////////
//   const renderValueFieldCell2 = (data) => {
//     const { data: rowData } = data;

//     let style = {};
//     if (rowData.LINETYPE === "T") {
//       style = {
//         color: "black",
//         backgroundColor: "lightgrey",
//         borderTop: "1px solid black",
//         borderBottom: "1px solid black",
//       }; // Apply blue color
//     }
//     if (rowData.LINETYPE === "X") {
//       style = {
//         color: "black",
//         backgroundColor: "lightgrey",
//         borderTop: "1px solid black",
//         borderBottom: "1px solid black",
//       };
//     }
//     if (rowData.LINETYPE === "") {
//       style = {
//         color: "black",
//         // borderTop: "1px solid black",
//         // borderBottom: "1px solid black",
//       };
//     }

//     if (rowData.LINETYPE === "H") {
//       style = {
//         backgroundColor: "gold",
//         // borderTop: "1px solid black",
//         // borderBottom: "1px solid black",
//       };
//     }

//     if (rowData.PRINTCOLUMN2 === "N") {
//       style = {};
//     }

//     // Check if the value is negative
//     const isNegative = rowData.VALUEFIELD2 < 0;
//     const absoluteValue = Math.abs(rowData.VALUEFIELD2);

//     // Format the number
//     const formattedValue = new Intl.NumberFormat("en-US", {
//       style: "currency",
//       currency: "USD",
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(absoluteValue);

//     // If negative, enclose in brackets
//     if (
//       (rowData.LINETYPE === "H" || rowData.LINETYPE === "X") &&
//       rowData.PRINTCOLUMN2 !== "Y" &&
//       rowData.PRINTCOLUMN2 !== "H"
//     ) {
//       return <div style={style}>&nbsp;</div>;
//     } else {
//       if (rowData.PRINTCOLUMN2 === "H") {
//         return (
//           <div style={{ ...style, textAlign: "center" }}>
//             {rowData.SECONDSTRING}
//           </div>
//         );
//       } else {
//         const displayValue = isNegative ? `(${formattedValue})` : formattedValue;
//         return <div style={style}>{displayValue}&nbsp;&nbsp;</div>;
//       }
//     }
//   };
//   //////////////////////////////////////////////////////
//   const renderValueFieldCell3 = (data) => {
//     const { data: rowData } = data;

//     let style = {};
//     if (rowData.LINETYPE === "T") {
//       style = {
//         color: "black",
//         backgroundColor: "lightgrey",
//         borderTop: "1px solid black",
//         borderBottom: "1px solid black",
//       }; // Apply blue color
//     }
//     if (rowData.LINETYPE === "X") {
//       style = {
//         color: "black",
//         backgroundColor: "lightgrey",
//         borderTop: "1px solid black",
//         borderBottom: "1px solid black",
//       };
//     }
//     if (rowData.LINETYPE === "") {
//       style = {
//         color: "black",
//         // borderTop: "1px solid black",
//         // borderBottom: "1px solid black",
//       };
//     }

//     if (rowData.LINETYPE === "H") {
//       style = {
//         backgroundColor: "gold",
//         // borderTop: "1px solid black",
//         // borderBottom: "1px solid black",
//       };
//     }

//     if (rowData.PRINTCOLUMN3 === "N") {
//       style = {};
//     }

//     // Check if the value is negative
//     const isNegative = rowData.VALUEFIELD3 < 0;
//     const absoluteValue = Math.abs(rowData.VALUEFIELD3);

//     // Format the number
//     const formattedValue = new Intl.NumberFormat("en-US", {
//       style: "currency",
//       currency: "USD",
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(absoluteValue);

//     // If negative, enclose in brackets
//     if (
//       (rowData.LINETYPE === "H" || rowData.LINETYPE === "X") &&
//       rowData.PRINTCOLUMN3 !== "Y" &&
//       rowData.PRINTCOLUMN3 !== "H"
//     ) {
//       return <div style={style}>&nbsp;</div>;
//     } else {
//       if (rowData.PRINTCOLUMN3 === "H") {
//         return (
//           <div style={{ ...style, textAlign: "center" }}>
//             {rowData.THIRDSTRING}
//           </div>
//         );
//       } else {
//         const displayValue = isNegative ? `(${formattedValue})` : formattedValue;
//         return <div style={style}>{displayValue}&nbsp;&nbsp;</div>;
//       }
//     }
//   };
