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
  getexcelDebtdata,
} from "./segmentData";

import { Button } from "devextreme-react/button";

import "devextreme-react/text-area";
import "devextreme/data/data_source";
import "./debtSummaryStyles.scss";
import "./debtsummary.css";
//import { set } from "date-fns";
//import { EditBatch } from "./editBatch";

//const allowedPageSizes = [8, 12, 20];

//let pageoption = 90;

export const GenerateDebtExcel = (props) => {
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

  const applyDescriptionCellStyle = (cell, rowData) => {
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

  const applyGroupDescriptionCellStyle = (cell, rowData) => {
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

  const applyCurrentValueCellStyle = (cell, rowData) => {
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
      style.numFmt = '"$"#,##0.00;"($"#,##0.00)'; // Currency format, red for negative values
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
      style.font.color =
        rowData.GROUPTYPESEQUENCE === 98 ? { argb: "FFFFFFFF" } : {}; // White for 98
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

  const applyPriorValueCellStyle = (cell, rowData) => {
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
      style.numFmt = '"$"#,##0.00;"($"#,##0.00)'; // Currency format, red for negative values
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
      style.font.color =
        rowData.GROUPTYPESEQUENCE === 98 ? { argb: "FFFFFFFF" } : {}; // White for 98
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
  const applyChangeValueCellStyle = (cell, rowData) => {
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
      style.numFmt = '"$"#,##0.00;"($"#,##0.00)'; // Currency format, red for negative values
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
      style.font.color =
        rowData.GROUPTYPESEQUENCE === 98 ? { argb: "FFFFFFFF" } : {}; // White for 98
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

  const CreateExcel = async () => {
    const ExcelJS = require("exceljs");
    const { saveAs } = require("file-saver");

    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Debt Summary");

      worksheet.columns = [
        { header: "", width: 10 },
        {
          header: `Debt Summary for ${props.clientCode}`,
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
      const dataResponse = await getexcelDebtdata(props.clientCode);
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

          applyDescriptionCellStyle(row.getCell("DESCRIPTION"), item);
          applyGroupDescriptionCellStyle(
            row.getCell("GROUPCODEDESCRIPTION"),
            item
          );
          applyCurrentValueCellStyle(row.getCell("CURRENTVALUE"), item);
          applyPriorValueCellStyle(row.getCell("PRIORVALUE"), item);
          applyChangeValueCellStyle(row.getCell("CHANGEVALUE"), item);
        });

        const buf = await workbook.xlsx.writeBuffer();

        saveAs(
          new Blob([buf], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          }),
          `${props.clientCode}DebtSummary.xlsx`
        );

        // Success message
        MySwal.fire({
          icon: "success",
          title: "Excel File Created",
          text: `Your file ${props.clientCode}DebtSummary.xlsx has been successfully created.`,
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
