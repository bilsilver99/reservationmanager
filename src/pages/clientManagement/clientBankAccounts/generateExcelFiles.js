import React, { useEffect } from "react";

import { Chart, Series } from "devextreme-react/chart";
import ExcelJS from "exceljs";

import withReactContent from "sweetalert2-react-content";
import { saveAs } from "file-saver";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Swal from "sweetalert2";

import {
  getexcelProgressdata,
  getexcelDebtdata,
  getexcelNetWorthdata,
} from "./segmentData";

import "devextreme-react/text-area";
import "devextreme/data/data_source";
import "./debtSummaryStyles.scss";
import "./debtsummary.css";

//import { EditBatch } from "./editBatch";

//const allowedPageSizes = [8, 12, 20];

//let pageoption = 90;

export const GenerateExcelFiles = (props) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const MySwal = withReactContent(Swal);
  //const [data, setData] = React.useState([]);
  //alert("GenerateExcel");

  const ProcessComplete = async () => {
    setIsLoading(true);
    await CreateExcel();
    setIsLoading(false);

    props.onMappingUpdated2(true);
  };

  useEffect(() => {
    ProcessComplete();
  }, []);

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
    cell.numFmt = "$#,##0;($#,##0)"; // This is Excel's format for currency
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

  const CreateExcel = async () => {
    const ExcelJS = require("exceljs");
    const { saveAs } = require("file-saver");

    try {
      const workbook = new ExcelJS.Workbook();

      await buildProgressSheet(workbook);
      await CreateExcelProgress(workbook, props.clientCode);
      await CreateExcelNetWorth(workbook, props.clientCode);
      const buf = await workbook.xlsx.writeBuffer();

      saveAs(
        new Blob([buf], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
        `${props.clientCode}Comparison.xlsx`
      );

      // Success message
      MySwal.fire({
        icon: "success",
        title: "Excel File Created",
        text: `The file ${props.clientCode}Comparison.xlsx has been successfully created.`,
        customClass: { container: "high-z-index" },
      });
    } catch (error) {
      console.error(
        "An error occurred during the Excel file creation process:",
        error
      );
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "There was an issue creating the Excel file.",
        customClass: { container: "high-z-index" },
      });
    }
  };

  const buildProgressSheet = async (workbook) => {
    const worksheet = workbook.addWorksheet("Change in Net Worth");

    worksheet.columns = [
      { header: "", key: "UNIQUEID", width: 10 },
      {
        header: `Change in Net Worth for ${props.clientCode}`,
        key: "DESCRIPTION",
        width: 50,
      },
      { header: "", key: "VALUEFIELD", width: 15 },
      // Add more columns as needed
    ];

    // Fetch data
    const dataResponse = await getexcelProgressdata(props.clientCode);
    const data = dataResponse.data; // Assuming the response structure has a data property

    console.log("Data fetched successfully", data);

    let lastRowNumber = null;
    if (Array.isArray(data)) {
      data.forEach((item) => {
        if (item.ROWNUMBER !== lastRowNumber) {
          const row = worksheet.addRow({
            DESCRIPTION: item.DESCRIPTION,
            VALUEFIELD: item.VALUEFIELD,
            LINETYPE: item.LINETYPE,
            ROWNUMBER: item.ROWNUMBER,
          });

          renderExcelValueFieldCell(row.getCell("VALUEFIELD"), item);
          renderExcelDescriptionFieldCell(row.getCell("DESCRIPTION"), item);

          lastRowNumber = item.ROWNUMBER;
        }
      });
    }
  };

  return (
    <>
      {/* <div>
        <Button text="Create Excel" onClick={ProcessComplete} />
      </div> */}
      {isLoading === true && (
        <div className="spinner-container">
          <>
            <p>Building the Excel File List please wait &nbsp;&nbsp;</p>
            <FontAwesomeIcon icon={faSpinner} spin className="large-spinner" />
          </>
        </div>
      )}
    </>
  );
};

///////////////////////////// Progress //////////////////////////////

const xapplyDescriptionCellStyle = (cell, rowData) => {
  //console.log("final line", rowData.FINALLINE);
  let style = {
    font: {},
    fill: { type: "pattern", pattern: "solid", fgColor: {} },
    border: {
      left: { style: "thin", color: { argb: "FF000000" } },
      right: { style: "thin", color: { argb: "FF000000" } },
    },
  };

  if (rowData.TOTAL === 1 && ![99, 98].includes(rowData.GROUPTYPESEQUENCE)) {
    style.font.bold = true;
    style.fill.fgColor.argb = "FFD3D3D3"; // Light grey
    style.border.top = { style: "thin", color: { argb: "FF000000" } };

    if (rowData.FINALLINE === 1) {
      style.border.bottom = { style: "thin", color: { argb: "FF000000" } };
    }
  } else if (rowData.GROUPTYPESEQUENCE === 99) {
    // Default border style is applied
  } else if (rowData.GROUPTYPESEQUENCE === 98) {
    style.font.bold = true;
    style.font.color = { argb: "FFFFFFFF" }; // White font color
    style.fill.fgColor.argb = "FF000000"; // Black background
  } else {
    if (rowData.DESCRIPTION !== "") {
      style.border.top = { style: "thin", color: { argb: "FF000000" } };
    }
  }

  cell.style = style;
  cell.value = rowData.DESCRIPTION || null;
};

const xapplyGroupDescriptionCellStyle = (cell, rowData) => {
  let style = {
    font: {},
    fill: { type: "pattern", pattern: "solid", fgColor: {} },
    border: {
      top: { style: "thin", color: { argb: "FF000000" } },
      right: { style: "thin", color: { argb: "FF000000" } },
      bottom: { style: "thin", color: { argb: "FF000000" } },
      left: { style: "thin", color: { argb: "FF000000" } },
    },
  };

  if (rowData.TOTAL === 1 && ![99, 98].includes(rowData.GROUPTYPESEQUENCE)) {
    style.font.bold = true;
    style.fill.fgColor.argb = "FFD3D3D3"; // Light grey
  } else if (
    rowData.GROUPTYPESEQUENCE === 99 ||
    rowData.GROUPTYPESEQUENCE === 98
  ) {
    style.font.bold = true;
    style.fill.fgColor.argb =
      rowData.GROUPTYPESEQUENCE === 99 ? "FFD3D3D3" : "FF000000"; // Light grey or black
    style.font.color =
      rowData.GROUPTYPESEQUENCE === 98 ? { argb: "FFFFFFFF" } : {}; // White for 98
    style.alignment =
      rowData.GROUPTYPESEQUENCE === 98
        ? {
            vertical: "middle",
            horizontal: "center",
          }
        : {};
  } else {
    style.border.right.style = "thin";
  }

  cell.style = style;
  cell.value = rowData.GROUPCODEDESCRIPTION || null;
};

const xapplyCurrentValueCellStyle = (cell, rowData) => {
  let style = {
    font: {},
    fill: { type: "pattern", pattern: "solid", fgColor: {} },
    border: {
      top: { style: "thin", color: { argb: "FF000000" } },
      right: { style: "thin", color: { argb: "FF000000" } },
      bottom: { style: "thin", color: { argb: "FF000000" } },
      left: { style: "thin", color: { argb: "FF000000" } },
    },
  };
  if (rowData.UNIQUEID !== 0) {
    style.numFmt = '"$"#,##0;"($"#,##0)'; // Currency format, red for negative values
  }

  if (rowData.TOTAL === 1 && ![99, 98].includes(rowData.GROUPTYPESEQUENCE)) {
    style.font.bold = true;
    style.fill.fgColor.argb = "FFD3D3D3"; // Light grey
  } else if (
    rowData.GROUPTYPESEQUENCE === 99 ||
    rowData.GROUPTYPESEQUENCE === 98
  ) {
    style.font.bold = true;
    style.fill.fgColor.argb =
      rowData.GROUPTYPESEQUENCE === 99 ? "FFD3D3D3" : "FFE6D180"; // Light grey or black
    //style.font.color =
    //  rowData.GROUPTYPESEQUENCE === 98 ? { argb: "FFFFFFFF" } : {}; // White for 98
    style.alignment =
      rowData.GROUPTYPESEQUENCE === 98
        ? {
            vertical: "middle",
            horizontal: "center",
          }
        : {};
  }
  cell.style = style;
  if (rowData.UNIQUEID === 0) {
    cell.value = rowData.CURRENTDESCRIPTION;
  } else {
    cell.value = rowData.CURRENTVALUE; // Directly assigning value, formatting is handled by numFmt
  }
};

const xapplyPriorValueCellStyle = (cell, rowData) => {
  let style = {
    font: {},
    fill: { type: "pattern", pattern: "solid", fgColor: {} },
    border: {
      top: { style: "thin", color: { argb: "FF000000" } },
      right: { style: "thin", color: { argb: "FF000000" } },
      bottom: { style: "thin", color: { argb: "FF000000" } },
      left: { style: "thin", color: { argb: "FF000000" } },
    },
  };
  if (rowData.UNIQUEID !== 0) {
    style.numFmt = '"$"#,##0;"($"#,##0)'; // Currency format, red for negative values
  }

  if (rowData.TOTAL === 1 && ![99, 98].includes(rowData.GROUPTYPESEQUENCE)) {
    style.font.bold = true;
    style.fill.fgColor.argb = "FFD3D3D3"; // Light grey
  } else if (
    rowData.GROUPTYPESEQUENCE === 99 ||
    rowData.GROUPTYPESEQUENCE === 98
  ) {
    style.font.bold = true;
    style.fill.fgColor.argb =
      rowData.GROUPTYPESEQUENCE === 99 ? "FFD3D3D3" : "FFE6D180"; // Light grey or black
    //style.font.color =
    //  rowData.GROUPTYPESEQUENCE === 98 ? { argb: "FFFFFFFF" } : {}; // White for 98
    style.alignment =
      rowData.GROUPTYPESEQUENCE === 98
        ? {
            vertical: "middle",
            horizontal: "center",
          }
        : {};
  }
  cell.style = style;
  if (rowData.UNIQUEID === 0) {
    cell.value = rowData.PRIORDESCRIPTION;
  } else {
    cell.value = rowData.PRIORVALUE; // Directly assigning value, formatting is handled by numFmt
  }
};
const xapplyChangeValueCellStyle = (cell, rowData) => {
  let style = {
    font: {},
    fill: { type: "pattern", pattern: "solid", fgColor: {} },
    border: {
      top: { style: "thin", color: { argb: "FF000000" } },
      right: { style: "thin", color: { argb: "FF000000" } },
      bottom: { style: "thin", color: { argb: "FF000000" } },
      left: { style: "thin", color: { argb: "FF000000" } },
    },
  };
  if (rowData.UNIQUEID !== 0) {
    style.numFmt = '"$"#,##0;"($"#,##0)'; // Currency format, red for negative values
  }

  if (rowData.TOTAL === 1 && ![99, 98].includes(rowData.GROUPTYPESEQUENCE)) {
    style.font.bold = true;
    style.fill.fgColor.argb = "FFD3D3D3"; // Light grey
  } else if (
    rowData.GROUPTYPESEQUENCE === 99 ||
    rowData.GROUPTYPESEQUENCE === 98
  ) {
    style.font.bold = true;
    style.fill.fgColor.argb =
      rowData.GROUPTYPESEQUENCE === 99 ? "FFD3D3D3" : "FFE6D180"; // Light grey or black
    //style.font.color =
    //  rowData.GROUPTYPESEQUENCE === 98 ? { argb: "FFFFFFFF" } : {}; // White for 98
    style.alignment =
      rowData.GROUPTYPESEQUENCE === 98
        ? {
            vertical: "middle",
            horizontal: "center",
          }
        : {};
  }
  cell.style = style;
  if (rowData.UNIQUEID === 0) {
    cell.value = rowData.CHANGEDESCRIPTION;
  } else {
    cell.value = rowData.CHANGEVALUE; // Directly assigning value, formatting is handled by numFmt
  }
};

const CreateExcelProgress = async (workbook, clientCode) => {
  const worksheet = workbook.addWorksheet("Debt Summary");

  worksheet.columns = [
    { header: "", width: 10 },
    {
      header: `Debt Summary for ${clientCode}`,
      key: "DESCRIPTION",
      width: 50,
    },
    { header: "", key: "GROUPCODEDESCRIPTION", width: 25 },

    { header: "", key: "CURRENTVALUE", width: 20 },
    { header: "", key: "PRIORVALUE", width: 20 },
    { header: "", key: "CHANGEVALUE", width: 20 },

    // Add more columns as needed
  ];

  // Fetch data
  const dataResponse = await getexcelDebtdata(clientCode);
  const data = dataResponse.data; // Assuming the response structure has a data property

  console.log("Data fetched successfully", data);

  //let lastRowNumber = null;
  if (Array.isArray(data)) {
    data.forEach((item) => {
      const row = worksheet.addRow({
        DESCRIPTION: item.DESCRIPTION,
        GROUPCODEDESCRIPTION: item.GROUPCODEDESCRIPTION,
        CURRENTVALUE: item.CURRENTVALUE,
        PRIORVALUE: item.PRIORVALUE,
        CHANGEVALUE: item.CHANGEVALUE,
        TOTAL: item.TOTAL,
        UNIQUEID: item.UNIQUEID,
        CURRENTDESCRIPTION: item.CURRENTDESCRIPTION,
        FINALLINE: item.FINALLINE,
        //UNIQUEID: item.UNIQUEID,
      });

      xapplyDescriptionCellStyle(row.getCell("DESCRIPTION"), item);
      xapplyGroupDescriptionCellStyle(
        row.getCell("GROUPCODEDESCRIPTION"),
        item
      );
      xapplyCurrentValueCellStyle(row.getCell("CURRENTVALUE"), item);
      xapplyPriorValueCellStyle(row.getCell("PRIORVALUE"), item);
      xapplyChangeValueCellStyle(row.getCell("CHANGEVALUE"), item);
    });
  }
};
///////////////////////////// Net Worth //////////////////////////////

const yapplyDescriptionCellStyle = (cell, rowData) => {
  let fill = { type: "pattern", pattern: "solid", fgColor: {} };
  let fontColor = {}; // Default

  switch (rowData.LINETYPE) {
    case "H":
      fill.fgColor.argb = "FF000000"; // Black background
      fontColor = { argb: "FFFFFFFF" }; // White font color
      break;
    case "X":
      fill.fgColor.argb = "FFD3D3D3"; // Light grey background
      fontColor = { argb: "FF0000FF" }; // Blue font color
      break;
    case "T":
      fill.fgColor.argb = "FFD3D3D3"; // Light grey background
      fontColor = { argb: "FF000000" }; // Black font color
      break;
    default:
      fill.fgColor.argb = "FFFFFFFF"; // No background
      break;
  }

  cell.style = {
    font: { color: fontColor },
    fill: fill,
    border: {
      top: { style: "thin", color: { argb: "FF000000" } },
      bottom: { style: "thin", color: { argb: "FF000000" } },
      left: { style: "thin", color: { argb: "FF000000" } },
      right: { style: "thin", color: { argb: "FF000000" } },
    },
  };

  cell.value = rowData.DESCRIPTION || null;
};

const yapplyValueFieldCellStyle = (cell, rowData, column) => {
  let fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFD9D9D9" },
  }; // Default grey
  let valueField, stringField, printColumn;

  if (column === 1 && rowData.PRINTCOLUMN1 === "N") {
    cell.value = null;
    return;
  } else if (column === 2 && rowData.PRINTCOLUMN2 === "N") {
    cell.value = null;
    return;
  } else if (column === 3 && rowData.PRINTCOLUMN3 === "N") {
    cell.value = null;
    return;
  }

  if (column === 1 && rowData.PRINTCOLUMN1 !== "N") {
    printColumn = rowData.PRINTCOLUMN1;
    valueField = rowData.VALUEFIELD;
    stringField = rowData.FIRSTSTRING;
  } else if (column === 2 && rowData.PRINTCOLUMN2 !== "N") {
    printColumn = rowData.PRINTCOLUMN2;
    valueField = rowData.VALUEFIELD2;
    stringField = rowData.SECONDSTRING;
  } else if (column === 3 && rowData.PRINTCOLUMN3 !== "N") {
    printColumn = rowData.PRINTCOLUMN3;
    valueField = rowData.VALUEFIELD3;
    stringField = rowData.THIRDSTRING;
  }

  if (rowData.LINETYPE === "H") {
    fill.fgColor.argb = "FFE6D180"; // Specific yellow
  } else if (printColumn === "N") {
    fill = {}; // No fill
  }

  // Apply numeric format if needed
  let numFmt = printColumn === "H" ? null : '"$"#,##0;"($"#,##0)';

  if (rowData.LINETYPE === "T") {
    cell.style = {
      font: { bold: true },
      fill: fill,
      border: {
        top: { style: "thin", color: { argb: "FF000000" } },
        bottom: { style: "thin", color: { argb: "FF000000" } },
        right: { style: "thin", color: { argb: "FF000000" } },
      },
      numFmt: numFmt,
    };
  } else {
    cell.style = {
      fill: fill,
      border: {
        top: { style: "thin", color: { argb: "FF000000" } },
        bottom: { style: "thin", color: { argb: "FF000000" } },
        right: { style: "thin", color: { argb: "FF000000" } },
        left: { style: "thin", color: { argb: "FF000000" } },
      },
      numFmt: numFmt,
    };
  }

  // Setting cell value based on conditions
  if (printColumn === "H") {
    cell.value = stringField || null;
    cell.alignment = { horizontal: "center" };
  } else {
    // Assuming valueField is numeric
    cell.value = valueField;
  }
};

// Example usage:
// applyValueFieldCellStyle(worksheet.getCell('A1'), rowData, 1);

const CreateExcelNetWorth = async (workbook, clientCode) => {
  const worksheet = workbook.addWorksheet("Net Assets");

  worksheet.columns = [
    { header: "", width: 10 },
    {
      header: `Net Assets ${clientCode}`,
      key: "DESCRIPTION",
      width: 50,
    },
    { header: "", key: "VALUEFIELD", width: 25 },

    { header: "", key: "VALUEFIELD1", width: 20 },
    { header: "", key: "VALUEFIELD2", width: 20 },

    // Add more columns as needed
  ];

  // Fetch data
  const dataResponse = await getexcelNetWorthdata(clientCode);
  const data = dataResponse.data; // Assuming the response structure has a data property

  console.log("Data fetched successfully", data);

  //let lastRowNumber = null;
  if (Array.isArray(data)) {
    data.forEach((item) => {
      const row = worksheet.addRow({
        ROWNUMBER: item.ROWNUMBER,
        DESCRIPTION: item.DESCRIPTION,
        VALUEFIELD: item.VALUEFIELD,
        VALUEFIELD1: item.VALUEFIELD1,
        VALUEFIELD2: item.VALUEFIELD2,
        FORMULAFIELD: item.FORMULAFIELD,
        PRINTCOLUMN1: item.PRINTCOLUMN1,
        PRINTCOLUMN2: item.PRINTCOLUMN2,
        PRINTCOLUMN3: item.PRINTCOLUMN3,
        UNIQUEID: item.UNIQUEID,
      });

      yapplyDescriptionCellStyle(row.getCell("DESCRIPTION"), item);
      yapplyValueFieldCellStyle(row.getCell("VALUEFIELD"), item, 1);
      yapplyValueFieldCellStyle(row.getCell("VALUEFIELD1"), item, 2);
      yapplyValueFieldCellStyle(row.getCell("VALUEFIELD2"), item, 3);
    });
  }
};
