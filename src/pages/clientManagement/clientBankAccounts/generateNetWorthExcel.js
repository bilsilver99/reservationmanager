import React, { useEffect } from "react";

import { Chart, Series } from "devextreme-react/chart";
import ExcelJS from "exceljs";

import withReactContent from "sweetalert2-react-content";
import { saveAs } from "file-saver";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Swal from "sweetalert2";

// import { useAuth } from "../../../contexts/auth";
// import DataGrid, {
//   Column,
//   Paging,
//   FilterRow,
//   HeaderFilter,
//   Editing,
// } from "devextreme-react/data-grid";

import { getexcelNetWorthdata } from "./segmentData";

import "devextreme-react/text-area";
import "devextreme/data/data_source";
import "./debtSummaryStyles.scss";
import "./debtsummary.css";
//import { set } from "date-fns";
//import { EditBatch } from "./editBatch";

//const allowedPageSizes = [8, 12, 20];

//let pageoption = 90;

export const GenerateNetWorthExcel = (props) => {
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

  const applyDescriptionCellStyle = (cell, rowData) => {
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

  const applyValueFieldCellStyle = (cell, rowData, column) => {
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
    let numFmt = printColumn === "H" ? null : '"$"#,##0.00;"($"#,##0.00)';

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

  useEffect(() => {
    ProcessComplete();
  }, []);

  const CreateExcel = async () => {
    const ExcelJS = require("exceljs");
    const { saveAs } = require("file-saver");

    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Net Assets");

      worksheet.columns = [
        { header: "", width: 10 },
        {
          header: `Net Assets ${props.clientCode}`,
          key: "DESCRIPTION",
          width: 50,
        },
        { header: "", key: "VALUEFIELD", width: 25 },

        { header: "", key: "VALUEFIELD1", width: 20 },
        { header: "", key: "VALUEFIELD2", width: 20 },

        // Add more columns as needed
      ];

      // Fetch data
      const dataResponse = await getexcelNetWorthdata(props.clientCode);
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

          applyDescriptionCellStyle(row.getCell("DESCRIPTION"), item);
          applyValueFieldCellStyle(row.getCell("VALUEFIELD"), item, 1);
          applyValueFieldCellStyle(row.getCell("VALUEFIELD1"), item, 2);
          applyValueFieldCellStyle(row.getCell("VALUEFIELD2"), item, 3);

          // applyDescriptionCellStyle(row.getCell("DESCRIPTION"), item);
          // applyGroupDescriptionCellStyle(
          //   row.getCell("GROUPCODEDESCRIPTION"),
          //   item
          // );
          // applyCurrentValueCellStyle(row.getCell("CURRENTVALUE"), item);
          // applyPriorValueCellStyle(row.getCell("PRIORVALUE"), item);
          // applyChangeValueCellStyle(row.getCell("CHANGEVALUE"), item);
        });

        const buf = await workbook.xlsx.writeBuffer();

        saveAs(
          new Blob([buf], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          }),
          `${props.clientCode}NetWorth.xlsx`
        );

        // Success message
        MySwal.fire({
          icon: "success",
          title: "Excel File Created",
          text: `Your file ${props.clientCode}NetWorth.xlsx has been successfully created.`,
          customClass: { container: "high-z-index" },
        });
      } else {
        console.error("Expected data to be an array but got:", typeof data);
      }
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

  return (
    <>
      {/* <div>
        <Button text="Create Excel" onClick={ProcessComplete} />
      </div> */}
      {isLoading === true && (
        <div className="spinner-container">
          <>
            <p>Building the Excel File please wait &nbsp;&nbsp;</p>
            <FontAwesomeIcon icon={faSpinner} spin className="large-spinner" />
          </>
        </div>
      )}
    </>
  );
};
