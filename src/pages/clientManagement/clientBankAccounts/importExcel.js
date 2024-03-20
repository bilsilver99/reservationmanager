import React, { useEffect, useState } from "react";
import "./import.scss";
import SelectBox from "devextreme-react/select-box";
import { getBanks, updateExcelTransactions } from "./clientBanksAccountsData";
import "./FileUploader.css"; // Importing the CSS file

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from "react-router-dom";

const ExcelJS = require("exceljs");

const ImportExcel = (props) => {
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
  const [columnMappings, setColumnMappings] = useState({
    date: "",
    description: "",
    debit: "",
    credit: "",
  }); // To store user-specified column mappings

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) {
      // No file was selected
      return;
    }

    const fileExtension = file.name.split(".").pop().toLowerCase();
    if (fileExtension !== "xlsx") {
      MySwal.fire({
        icon: "error",
        title: "Invalid File Format",
        text: "Please select an Excel file with an .xlsx extension.",
      });
      return; // Stop the function if the file is not an Excel file
    }

    setSelectedFile(file);
    readExcelFile(file);
    setShowInfo(true);
  };

  // const handleFileSelect = (event) => {
  //   const file = event.target.files[0];
  //   setSelectedFile(file);
  //   readExcelFile(file);
  //   setShowInfo(true);
  // };

  const readExcelFile = (file) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      const buffer = e.target.result;
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(buffer);

      const worksheet = workbook.getWorksheet(1); // or use workbook.worksheets[0]

      let headersTemp = [];
      let rowsTemp = [];

      worksheet.eachRow({ includeEmpty: true }, function (row, rowNumber) {
        if (rowNumber === 1) {
          // Store header row
          headersTemp = row.values.slice(1); // ExcelJS might include a leading empty cell, so slice it off
          if (!headersTemp.includes("N/A")) {
            headersTemp.push("N/A");
          }
          //console.log("headers temp", headersTemp);
        } else {
          // Store data rows
          const rowData = {};
          row.eachCell({ includeEmpty: true }, function (cell, colNumber) {
            if (headersTemp[colNumber - 1]) {
              rowData[headersTemp[colNumber - 1]] = cell.text;
            }
          });
          rowsTemp.push(rowData);
        }
      });

      setHeaders(headersTemp);
      setRows(rowsTemp);
    };

    reader.onerror = (ex) => {
      console.error(ex);
    };

    reader.readAsArrayBuffer(file);
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

  return (
    <>
      {ShowPage && (
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
            <div className="column-selector">
              <label htmlFor="date-column">Date Column name:</label>
              <select
                id="date-column"
                value={columnMappings.date}
                onChange={(e) =>
                  setColumnMappings({ ...columnMappings, date: e.target.value })
                }
              >
                {headers.map((header, index) => (
                  <option key={index} value={header}>
                    {header}
                  </option>
                ))}
              </select>
            </div>

            <div className="column-selector">
              <label htmlFor="description-column">
                Description Column Name:
              </label>
              <select
                id="description-column"
                value={columnMappings.description}
                onChange={(e) =>
                  setColumnMappings({
                    ...columnMappings,
                    description: e.target.value,
                  })
                }
              >
                {headers.map((header, index) => (
                  <option key={index} value={header}>
                    {header}
                  </option>
                ))}
              </select>
            </div>

            <div className="column-selector">
              <label htmlFor="debit-column">Deposit Column Name:</label>
              <select
                id="debit-column"
                value={columnMappings.debit}
                onChange={(e) =>
                  setColumnMappings({
                    ...columnMappings,
                    debit: e.target.value,
                  })
                }
              >
                {headers.map((header, index) => (
                  <option key={index} value={header}>
                    {header}
                  </option>
                ))}
              </select>
            </div>

            <div className="column-selector">
              <label htmlFor="credit-column">Payment Column Name:</label>
              <select
                id="credit-column"
                value={columnMappings.credit}
                onChange={(e) =>
                  setColumnMappings({
                    ...columnMappings,
                    credit: e.target.value,
                  })
                }
              >
                {headers.map((header, index) => (
                  <option key={index} value={header}>
                    {header}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="content-block2 dx-card">
            <p> </p>
            <p>&nbsp;&nbsp;Bank Transactions Import </p>
            <div style={{ display: "flex", alignItems: "left" }}>
              {showInfo && (
                <>
                  <p
                    style={{
                      marginRight: "10px",
                      marginLeft: "10px",
                      marginTop: "6px",
                    }}
                  >
                    Bank Account:
                  </p>

                  <SelectBox
                    style={{ width: "250px", height: "30px" }}
                    items={bankAccounts}
                    valueExpr="BANKACCOUNTNUMBER"
                    displayExpr={(item) =>
                      item
                        ? `${item.BANKNAME} - ${item.BANKACCOUNTNUMBER} - ${item.ACCOUNTDESCRIPTION}`
                        : ""
                    }
                    value={currentBankAccount}
                    searchEnabled={true}
                    //value={currentEmployeeName}
                    onValueChanged={setAccountData}
                    //onValueChanged={(e) => setCurrentEmployeeName(e.value)}
                  />
                </>
              )}

              {currentBankAccount && (
                <button
                  onClick={createJsonFromSelections}
                  className="pretty-button"
                >
                  Import Transactions
                </button>
              )}
              <p>&nbsp;&nbsp;&nbsp;{currentBankAccountName}</p>
            </div>
          </div>

          {headers.length > 0 && rows.length > 0 && (
            <>
              <table className="table">
                <thead>
                  <tr>
                    {headers.map((header, index) => (
                      <th key={index}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {headers.map((header, cellIndex) => (
                        <td key={cellIndex}>
                          {editMode ? (
                            <input
                              type="text"
                              value={row[header]}
                              onChange={(e) =>
                                handleCellChange(e, rowIndex, header)
                              }
                            />
                          ) : (
                            row[header] || "" // Using || '' to handle undefined values gracefully
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </>
      )}
    </>
  );
};

export default ImportExcel;
