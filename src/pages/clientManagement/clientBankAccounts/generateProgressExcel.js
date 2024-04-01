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

import {
  //   mystore5,
  //   mystoreGraph,
  //   relatedData,
  //   relatedData2,
  //   relatedData3,
  getexcelProgressdata,
} from "./segmentData";

import { Button } from "devextreme-react/button";

import "devextreme-react/text-area";
import "devextreme/data/data_source";
import "./debtSummaryStyles.scss";
import "./debtsummary.css";
import { set } from "date-fns";
//import { EditBatch } from "./editBatch";

//const allowedPageSizes = [8, 12, 20];

//let pageoption = 90;

export const GenerateProgressExcel = (props) => {
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

  const CreateExcel = async () => {
    const ExcelJS = require("exceljs");
    const { saveAs } = require("file-saver");

    try {
      const workbook = new ExcelJS.Workbook();
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

        const buf = await workbook.xlsx.writeBuffer();

        saveAs(
          new Blob([buf], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          }),
          `${props.clientCode}Progress.xlsx`
        );

        // Success message
        MySwal.fire({
          icon: "success",
          title: "Excel File Created",
          text: `The file ${props.clientCode}Progress.xlsx has been successfully created.`,
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
            <p>Building the Excel File(s) please wait &nbsp;&nbsp;</p>
            <FontAwesomeIcon icon={faSpinner} spin className="large-spinner" />
          </>
        </div>
      )}
    </>
  );
};
