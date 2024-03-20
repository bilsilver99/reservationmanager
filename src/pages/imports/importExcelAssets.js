import React, { useEffect, useState } from "react";
import "./import.scss";
//import SelectBox from "devextreme-react/select-box";
import {
  getBanks,
  updateExcelTransactions,
  createAssetsandInvestments,
} from "./clientBanksAccountsData";
import "./FileUploader.css"; // Importing the CSS file

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from "react-router-dom";
import { set } from "date-fns";
import { Button } from "devextreme-react/button";
//import { CheckBox } from "devextreme-react/check-box";

const ExcelJS = require("exceljs");

const ImportExcelAssets = (props) => {
  const [bankAccounts, setBankAccounts] = useState([]);
  const [currentBankAccountName, setCurrentBankAccountName] = useState("");
  const [currentBankAccount, setCurrentBankAccount] = useState("");
  //const [accountData, setAccountData] = useState("");
  const [ClientCode, setClientCode] = useState(props.clientCode);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [headers, setHeaders] = useState([]); // State for storing headers
  const [rows, setRows] = useState([]); // State for storing row data
  const MySwal = withReactContent(Swal);
  const [excelData, setExcelData] = useState([]); // To store Excel rows
  const [editMode, setEditMode] = useState(false); // To toggle edit mode
  const navigate = useNavigate(); // Inside your component
  const [ShowPage, setShowPage] = useState(true); // To toggle edit mode

  const [assets, setAssets] = useState([]);
  const [investments, setInvestments] = useState([]);

  const [assetHeaders, setAssetHeaders] = useState([]);
  const [investmentHeaders, setInvestmentHeaderes] = useState([]);

  const [thisClientCode, setThisClientCode] = useState(""); // To store the client code

  const [headerDates, setHeaderDates] = useState([]); // To store the header dates

  const [importInvestments, setImportInvestments] = useState(true); // To store the header dates
  const [importAssets, setImportAssets] = useState(true); // To store the header dates

  const checkedLabel = { "aria-label": "Checked" };

  // const [columnMappings, setColumnMappings] = useState({
  //   date: "",
  //   description: "",
  //   debit: "",
  //   credit: "",
  // }); // To store user-specified column mappings

  const handleFileSelect = (event) => {
    const file = event.target.files[0];

    setSelectedFile(file);
    readExcelFile(file);
    setShowInfo(true);
  };
  //const readExcelFile = (file) => {

  const readExcelFile = async (file) => {
    //const file = event.target.files[0];
    const workbook = new ExcelJS.Workbook();
    const arrayBuffer = await file.arrayBuffer();
    await workbook.xlsx.load(arrayBuffer);
    const worksheet = workbook.worksheets[0];

    const parsedAssets = [];
    const parsedInvestments = [];
    const parsedAssetHeaders = [];
    const parsedInvestmentHeaders = [];
    let readingAssets = false;
    let readingInvestments = false;
    let headerDaters = [];

    worksheet.eachRow((row, rowNumber) => {
      const rowValues = row.values;

      if (rowValues[1] === "Client ID") {
        headerDaters = rowValues.slice(10).map((dateValue) => {
          // Convert each dateValue to string if it's a Date object, otherwise leave as is
          return dateValue instanceof Date
            ? formatDateToString(dateValue)
            : dateValue;
        });
        //headerDaters = rowValues.slice(10);
        setThisClientCode(rowValues[2]);

        return; // Skip the header row
      }

      if (rowValues[1] === "Investments") {
        readingAssets = false;
        readingInvestments = true;
        //const additionalValues = rowValues.slice(11);
        parsedInvestmentHeaders.push({
          instititution: rowValues[2],
          account: rowValues[3],
          type: rowValues[4],
          description: rowValues[5],
          owner: rowValues[6],
          investGroup: rowValues[7],
          subGroup: rowValues[8],
          sequence: rowValues[9],
          currency: rowValues[10],
          additionalValues: headerDaters,
        });
        return; // Skip the rest of the callback
      }

      if (rowValues[1] === "Assets") {
        readingAssets = true;
        readingInvestments = false;
        //const additionalValues = rowValues.slice(10);

        parsedAssetHeaders.push({
          assetName: rowValues[2],
          assetType: rowValues[3],
          owner: rowValues[6],
          sequence: rowValues[9],
          currency: rowValues[10],
          additionalValues: headerDaters,
        });

        return; // Skip the rest of the callback
      }

      if (readingAssets && rowNumber > 1) {
        // Ensuring we're not on the header row
        // Parse assets
        if (rowValues[2] !== undefined) {
          const sequenceCell = row.getCell(9); // ExcelJS uses 1-based indexing for cells

          let sequenceValue = sequenceCell.value;
          // If the cell contains a formula, ExcelJS might give you an object with `formula` and `result`.
          if (
            sequenceValue &&
            typeof sequenceValue === "object" &&
            sequenceValue.result !== undefined
          ) {
            sequenceValue = sequenceValue.result;
          }

          console.log("rowValues", rowValues[2]);
          const additionalValues = rowValues.slice(11);
          parsedAssets.push({
            assetName: rowValues[2],
            assetType: rowValues[3],
            owner: rowValues[6],
            sequence: sequenceValue,
            currency: rowValues[10],
            additionalValues,
          });
        }
      }

      if (readingInvestments && rowNumber > 1) {
        if (rowValues[2] !== undefined) {
          const sequenceCell = row.getCell(9); // ExcelJS uses 1-based indexing for cells

          let sequenceValue = sequenceCell.value;
          // If the cell contains a formula, ExcelJS might give you an object with `formula` and `result`.
          if (
            sequenceValue &&
            typeof sequenceValue === "object" &&
            sequenceValue.result !== undefined
          ) {
            sequenceValue = sequenceValue.result;
          }
          const additionalValues = rowValues.slice(11);
          parsedInvestments.push({
            institution: rowValues[2],
            account: rowValues[3],
            type: rowValues[4],
            description: rowValues[5],
            owner: rowValues[6],
            investGroup: rowValues[7],
            subGroup: rowValues[8],
            sequence: sequenceValue,
            currency: rowValues[10],
            additionalValues,
          });
        }
      }
    });

    // Update the state once after processing all rows
    setAssets(parsedAssets);
    setInvestments(parsedInvestments);
    setAssetHeaders(parsedAssetHeaders);
    setInvestmentHeaderes(parsedInvestmentHeaders);
    setHeaderDates(headerDaters);
    console.log("Assets:", parsedAssets);
    console.log("Investments:", parsedInvestments);
    console.log("Asset Headers:", parsedAssetHeaders);
  };
  const handleNavigation = () => {
    navigate("/clientManagement");
  };
  const setAccountData = (e) => {
    setCurrentBankAccount(e.value);
  };
  const clearBankAccount = (e) => {
    setCurrentBankAccount("");
  };

  useEffect(() => {
    console.log("these are the headers", investmentHeaders);
  }, [investmentHeaders]);

  useEffect(() => {
    getBanks(ClientCode) // Directly use clientCode without 'this'
      .then((data) => {
        setBankAccounts(data.data); // Correctly updates state in functional component
      })
      .catch((error) => {});
  }, []);

  const handleCellChange = (e, rowIndex, cellIndex) => {
    const updatedRows = [...excelData.rows];
    updatedRows[rowIndex][Object.keys(updatedRows[rowIndex])[cellIndex]] =
      e.target.value;
    setExcelData({ ...excelData, rows: updatedRows });
  };

  function formatDateToString(date) {
    if (!(date instanceof Date)) return date; // If not a Date, return as is
    let dd = String(date.getDate()).padStart(2, "0");
    let mm = String(date.getMonth() + 1).padStart(2, "0"); //January is 0!
    let yyyy = date.getFullYear();
    console.log("date: ", date, "dd: ", dd, "mm: ", mm, "yyyy: ", yyyy);
    return mm + "/" + dd + "/" + yyyy; // Returns date in MM/DD/YYYY format
  }

  const createJsonFromSelections = () => {
    console.log(rows);
    updateExcelTransactions(ClientCode, currentBankAccount, rows);
    MySwal.fire({
      icon: "success",
      title: "Import Complete",
      text: `Data has been imported successfully - please use the Import button to process the new records.`,
    }).then(() => {
      handleNavigation();
      setShowPage(false);
    });

    //console.log("json loaded", jsonTable); // Or set this to state if you want to render it or do further processing
  };
  const handleFileImport = () => {
    createAssetsandInvestments(
      thisClientCode,
      assets,
      investments,
      headerDates,
      importInvestments,
      importAssets
    );
    MySwal.fire({
      icon: "success",
      title: "Import Assets and Investments",
      text: `Data has been imported successfully `,
    }).then(() => {
      handleNavigation();
      setShowPage(false);
    });
    //console.log("json loaded", jsonTable); // Or set this to state if you want to render it or do further processing
  };

  function handleimportInvestmentsChange(e) {
    setImportInvestments(e.value);
  }
  function handleimportAssetsChange(e) {
    setImportAssets(e.value);
  }
  return (
    <>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          justifyContent: "left",
          alignItems: "center",
        }}
      >
        <div className="file-uploader-container">
          <label htmlFor="file-upload" className="file-input-label">
            Choose a file for import
            <input
              id="file-upload"
              type="file"
              className="file-input"
              onChange={handleFileSelect}
            />
          </label>
          {selectedFile && (
            <div className="file-info">
              <strong>File name:</strong> {selectedFile.name}
            </div>
          )}
        </div>

        {/* <div className="content-block2 dx-card">  */}
        <div>
          <p> </p>
          <h3>
            &nbsp;&nbsp;Assets and Investments Transactions Import&nbsp;&nbsp;{" "}
          </h3>
          <p> </p>
        </div>
      </div>
      {selectedFile && (
        <>
          <Button
            text="Import Assets and Investments"
            onClick={handleFileImport}
          />
        </>
      )}
      <p></p>
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <p></p>
        <label style={{ display: "flex", alignItems: "center" }}>
          Import Investments:
          <input
            style={{
              width: "20px", // Adjusted for standard checkbox size
              height: "20px",
              marginLeft: "5px", // Changed to marginLeft for spacing after label
            }}
            type="checkbox"
            checked={importInvestments} // Use checked for checkboxes instead of value
            onChange={(e) => handleimportInvestmentsChange(e.target.checked)}
          />
        </label>

        <label style={{ display: "flex", alignItems: "center" }}>
          Import Assets:
          <input
            style={{
              width: "20px", // Adjusted for standard checkbox size
              height: "20px",
              marginLeft: "5px", // Changed to marginLeft for spacing after label
            }}
            type="checkbox"
            checked={importAssets} // Use checked for checkboxes instead of value
            onChange={(e) => handleimportAssetsChange(e.target.checked)}
          />
        </label>
      </div>

      <div>
        <p> </p>
        <h3>
          &nbsp;&nbsp;Client Codes: &nbsp;&nbsp;{thisClientCode}&nbsp;&nbsp;
        </h3>
        <p> </p>
      </div>

      <div>
        <div>
          <h3 style={{ color: "#2a9d8f", marginBottom: "0.5rem" }}>
            &nbsp;&nbsp;Assets
          </h3>

          <div
            style={{
              margin: "1rem",
              padding: "1rem",
              border: "1px solid #e9c46a",
              borderRadius: "8px",
              overflowX: "auto",
            }}
          >
            {assets.length > 0 ? (
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  tableLayout: "fixed",
                }}
              >
                <colgroup>
                  <col style={{ width: "15%" }} />
                  <col style={{ width: "10%" }} />
                  <col style={{ width: "15%" }} />
                  {/* You may need to dynamically adjust or add <col> elements based on additionalValues */}
                </colgroup>
                <thead>
                  {assetHeaders.length > 0 &&
                    assetHeaders.map((header, headerIndex) => (
                      <tr key={headerIndex}>
                        <th style={{ textAlign: "left", padding: "8px" }}>
                          {header.assetName}
                        </th>
                        <th style={{ textAlign: "left", padding: "8px" }}>
                          {header.assetType}
                        </th>
                        <th style={{ textAlign: "left", padding: "8px" }}>
                          {header.owner}
                        </th>
                        {/* Dynamically render additional values if they exist */}
                        {header.additionalValues &&
                          header.additionalValues.map((value, valueIndex) => (
                            <th
                              key={valueIndex}
                              style={{ textAlign: "left", padding: "8px" }}
                            >
                              {value}
                            </th>
                          ))}
                      </tr>
                    ))}
                </thead>
                <tbody>
                  {assets.map((asset, index) => (
                    <tr key={index}>
                      <td style={{ textAlign: "left", padding: "8px" }}>
                        {asset.assetName}
                      </td>
                      <td style={{ textAlign: "left", padding: "8px" }}>
                        {asset.assetType}
                      </td>
                      <td style={{ textAlign: "left", padding: "8px" }}>
                        {asset.owner}
                      </td>
                      {/* Dynamically create cells for additionalValues */}
                      {asset.additionalValues.map((value, valueIndex) => (
                        <td
                          key={valueIndex}
                          style={{ textAlign: "left", padding: "8px" }}
                        >
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                          }).format(value)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No assets to display.</p>
            )}
          </div>

          <h3 style={{ color: "#2a9d8f", marginBottom: "0.5rem" }}>
            &nbsp;&nbsp;Investments
          </h3>
          <div
            style={{
              margin: "1rem",
              padding: "1rem",
              border: "1px solid #264653",
              borderRadius: "8px",
              overflowX: "auto",
            }}
          >
            {investments.length > 0 ? (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  {investmentHeaders.length > 0 &&
                    investmentHeaders.map((header, headerIndex) => (
                      <tr key={headerIndex}>
                        <th style={{ textAlign: "left", padding: "8px" }}>
                          {header.instititution}
                        </th>
                        <th style={{ textAlign: "left", padding: "8px" }}>
                          {header.account}
                        </th>
                        <th style={{ textAlign: "left", padding: "8px" }}>
                          {header.type}
                        </th>
                        <th style={{ textAlign: "left", padding: "8px" }}>
                          {header.description}
                        </th>
                        <th style={{ textAlign: "left", padding: "8px" }}>
                          {header.owner}
                        </th>
                        <th style={{ textAlign: "left", padding: "8px" }}>
                          {header.investGroup}
                        </th>
                        <th style={{ textAlign: "left", padding: "8px" }}>
                          {header.subGroup}
                        </th>
                        <th style={{ textAlign: "left", padding: "8px" }}>
                          {header.sequence}
                        </th>
                        <th style={{ textAlign: "left", padding: "8px" }}>
                          {header.currency}
                        </th>

                        {/* Dynamically render additional values if they exist */}
                        {header.additionalValues &&
                          header.additionalValues.map((value, valueIndex) => (
                            <th
                              key={valueIndex}
                              style={{ textAlign: "left", padding: "8px" }}
                            >
                              {value}
                            </th>
                          ))}
                      </tr>
                    ))}
                </thead>
                <tbody>
                  {investments.map((investments, index) => (
                    <tr key={index}>
                      <td style={{ textAlign: "left", padding: "8px" }}>
                        {investments.institution}
                      </td>
                      <td style={{ textAlign: "left", padding: "8px" }}>
                        {investments.account}
                      </td>
                      <td style={{ textAlign: "left", padding: "8px" }}>
                        {investments.type}
                      </td>
                      <td style={{ textAlign: "left", padding: "8px" }}>
                        {investments.description}
                      </td>
                      <td style={{ textAlign: "left", padding: "8px" }}>
                        {investments.owner}
                      </td>
                      <td style={{ textAlign: "left", padding: "8px" }}>
                        {investments.investGroup}
                      </td>
                      <td style={{ textAlign: "left", padding: "8px" }}>
                        {investments.subGroup}
                      </td>
                      <td style={{ textAlign: "left", padding: "8px" }}>
                        {investments.sequence}
                      </td>
                      <td style={{ textAlign: "left", padding: "8px" }}>
                        {investments.currency}
                      </td>

                      {/* Dynamically create cells for additionalValues */}
                      {investments.additionalValues.map((value, valueIndex) => (
                        <td
                          key={valueIndex}
                          style={{ textAlign: "left", padding: "8px" }}
                        >
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                          }).format(value)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No investments to display.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ImportExcelAssets;

// console.log("Column Mappings:", columnMappings);
// rows.forEach((row, index) => {
//   console.log(`Row ${index}:`, row);
//   console.log("Mapped Date:", row[columnMappings.date]);
//   console.log("Mapped Description:", row[columnMappings.description]);
//   console.log("Mapped Credit:", row[columnMappings.credit]);
//   console.log("Mapped Debit:", row[columnMappings.debit]);
// });

//console.log("rows in json", rows);
// const jsonTable = rows.map((row) => {
//   const jsonObject = {
//     DATEFIELD: row[columnMappings.date],
//     DESCRIPTIONFIELD: row[columnMappings.description],
//     PAYMENTSFIELD: row[columnMappings.credit],
//     DEPOSITSFIELD: row[columnMappings.debit],
//   };
//   //console.log("object", jsonObject);
//   return jsonObject;
// });

// const toDataURL = (url) => {
//   const promise = new Promise((resolve, reject) => {
//     var xhr = new XMLHttpRequest();
//     xhr.onload = function () {
//       var reader = new FileReader();
//       reader.readAsDataURL(xhr.response);
//       reader.onloadend = function () {
//         resolve({ base64Url: reader.result });
//       };
//     };
//     xhr.open("GET", url);
//     xhr.responseType = "blob";
//     xhr.send();
//   });

//   return promise;
// };

// const readExcelFile = (file) => {
//   console.log("Reading file a:", file);
//   const reader = new FileReader();

//   reader.onload = async (e) => {
//     console.log("event :", e);
//     const buffer = e.target.result;
//     const workbook = new ExcelJS.Workbook();
//     await workbook.xlsx.load(buffer);
//     const assets = [];
//     const investments = [];

//     const worksheet = workbook.getWorksheet(1); // or use workbook.worksheets[0]

//     let headers = {};
//     let headerRowNumber;

//     worksheet.eachRow({ includeEmpty: true }, function (row, rowNumber) {
//       // Assuming the header row is distinct and the row just before data starts
//       if (row.values.includes("Asset")) {
//         headerRowNumber = rowNumber;
//         row.eachCell((cell, colNumber) => {
//           headers[colNumber] = cell.value;
//         });
//       } else if (headerRowNumber && rowNumber > headerRowNumber) {
//         let rowData = {};
//         row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
//           rowData[headers[colNumber]] = cell.value;
//         });
//         if (rowData["Asset Name"]) {
//           assets.push(rowData);
//         } else if (rowData["Institution"]) {
//           investments.push(rowData);
//         }
//       }
//     });

//     console.log("Assets:", assets);
//     console.log("Investments:", investments);
//   };
//   reader.onerror = (ex) => {
//     console.error(ex);
//   };

//   reader.readAsArrayBuffer(file);
// };
