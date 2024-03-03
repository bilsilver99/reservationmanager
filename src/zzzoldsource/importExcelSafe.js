import React, { useEffect, useState } from "react";
import "./import.scss";
import SelectBox from "devextreme-react/select-box";
import {
  getBanks,
  getBankName,
  updateImportFile,
  updateImportFileV2,
} from "./clientBanksAccountsData";
import "./FileUploader.css"; // Importing the CSS file
import { PropertiesPanel } from "devextreme-react/diagram";
//import { set } from "date-fns";

const ExcelJS = require("exceljs");

const toDataURL = (url) => {
  const promise = new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var reader = new FileReader();
      reader.readAsDataURL(xhr.response);
      reader.onloadend = function () {
        resolve({ base64Url: reader.result });
      };
    };
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.send();
  });

  return promise;
};

const ImportExcel = (props) => {
  const [data, setData] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [currentBankAccountName, setCurrentBankAccountName] = useState("");
  const [currentBankAccount, setCurrentBankAccount] = useState("");
  //const [accountData, setAccountData] = useState("");
  const [ClientCode, setClientCode] = useState(props.clientCode);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  //console.log("in here", ClientCode, props.clientCode);
  // const handleFileSelect = (event) => {
  //   console.log("event", event.target.files[0].name);
  //   setSelectedFile(event.target.files[0].name);
  //   console.log("selected file", selectedFile);
  //   const workbook = new ExcelJS.Workbook();
  //   workbook.xlsx
  //     .readFile(selectedFile)
  //     .then(() => {
  //       const ws = workbook.getWorksheet("Sheet1");
  //       const c1 = ws.getColumn(1);

  //       c1.eachCell((c) => {
  //         console.log("inside 1", c.value);
  //       });

  //       const c2 = ws.getColumn(2);

  //       c2.eachCell((c) => {
  //         console.log("inside 2", c.value);
  //       });
  //     })
  //     .catch((err) => {
  //       console.log(err.message);
  //     });
  //   setShowInfo(true);
  //   // You can now do something with the selected file, like upload it
  // };
  // //console.log("in here");

  // const handleFileSelect = async (event) => {
  //   const file = event.target.files[0];
  //   console.log("event", file.name);
  //   setSelectedFile(file.name); // Schedule the update of the state

  //   const workbook = new ExcelJS.Workbook();
  //   const reader = new FileReader();

  //   reader.onload = async (e) => {
  //     const buffer = e.target.result;
  //     await workbook.xlsx.load(buffer);
  //     // Perform operations with the workbook
  //   };

  //   reader.readAsArrayBuffer(file); // Read the file as array buffer for ExcelJS to process
  // };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    readExcelFile(file);
  };

  const readExcelFile = (file) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      const buffer = e.target.result;
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(buffer);

      // Here you can access workbook and its sheets
      const worksheet = workbook.getWorksheet(1); // or use workbook.worksheets[0]

      // Iterate over all rows that have values in a worksheet
      worksheet.eachRow({ includeEmpty: true }, function (row, rowNumber) {
        console.log("Row " + rowNumber + " = " + JSON.stringify(row.values));
      });

      // Perform further processing
      // ...
    };

    reader.onerror = (ex) => {
      console.error(ex);
    };

    // Read the file as an array buffer for ExcelJS to process
    reader.readAsArrayBuffer(file);
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
        //console.log("bank accounts ", data);
        setBankAccounts(data.data); // Correctly updates state in functional component
        console.log("bank accounts ", data.data);
      })
      .catch((error) => {
        //console.log("error", error);
      });
  }, []); // Include clientCode in dependency array if its changes should re-trigger this effect

  //   useEffect(() => {
  //     fetch("https://dummyjson.com/products")
  //       .then((res) => res.json())
  //       .then(async (data) => {
  //         console.log(data);
  //         setData(data);
  //       })
  //       .then((json) => console.log(json));
  //   }, []);

  const exportExcelFile = () => {
    //     const workbook = new ExcelJS.Workbook();
    //     const sheet = workbook.addWorksheet("My Sheet");
    //     sheet.properties.defaultRowHeight = 80;
    //     sheet.getRow(1).border = {
    //       top: { style: "thick", color: { argb: "FFFF0000" } },
    //       left: { style: "thick", color: { argb: "000000FF" } },
    //       bottom: { style: "thick", color: { argb: "F08080" } },
    //       right: { style: "thick", color: { argb: "FF00FF00" } },
    //     };
    //     sheet.getRow(1).fill = {
    //       type: "pattern",
    //       pattern: "darkVertical",
    //       fgColor: { argb: "FFFF00" },
    //     };
    //     sheet.getRow(1).font = {
    //       name: "Comic Sans MS",
    //       family: 4,
    //       size: 16,
    //       bold: true,
    //     };
    //     sheet.columns = [
    //       {
    //         header: "Id",
    //         key: "id",
    //         width: 10,
    //       },
    //       { header: "Title", key: "title", width: 32 },
    //       {
    //         header: "Brand",
    //         key: "brand",
    //         width: 20,
    //       },
    //       {
    //         header: "Category",
    //         key: "category",
    //         width: 20,
    //       },
    //       {
    //         header: "Price",
    //         key: "price",
    //         width: 15,
    //       },
    //       {
    //         header: "Rating",
    //         key: "rating",
    //         width: 10,
    //       },
    //       {
    //         header: "Photo",
    //         key: "thumbnail",
    //         width: 30,
    //       },
    //     ];
    //     const promise = Promise.all(
    //       data?.products?.map(async (product, index) => {
    //         const rowNumber = index + 1;
    //         sheet.addRow({
    //           id: product?.id,
    //           title: product?.title,
    //           brand: product?.brand,
    //           category: product?.category,
    //           price: product?.price,
    //           rating: product?.rating,
    //         });
    //         console.log(product?.thumbnail);
    //         const result = await toDataURL(product?.thumbnail);
    //         const splitted = product?.thumbnail.split(".");
    //         const extName = splitted[splitted.length - 1];
    //         const imageId2 = workbook.addImage({
    //           base64: result.base64Url,
    //           extension: extName,
    //         });
    //         sheet.addImage(imageId2, {
    //           tl: { col: 6, row: rowNumber },
    //           ext: { width: 100, height: 100 },
    //         });
    //       })
    //     );
    //     promise.then(() => {
    //       const priceCol = sheet.getColumn(5);
    //       // iterate over all current cells in this column
    //       priceCol.eachCell((cell) => {
    //         const cellValue = sheet.getCell(cell?.address).value;
    //         // add a condition to set styling
    //         if (cellValue > 50 && cellValue < 1000) {
    //           sheet.getCell(cell?.address).fill = {
    //             type: "pattern",
    //             pattern: "solid",
    //             fgColor: { argb: "FF0000" },
    //           };
    //         }
    //       });
    //       workbook.xlsx.writeBuffer().then(function (data) {
    //         const blob = new Blob([data], {
    //           type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    //         });
    //         const url = window.URL.createObjectURL(blob);
    //         const anchor = document.createElement("a");
    //         anchor.href = url;
    //         anchor.download = "download.xlsx";
    //         anchor.click();
    //         window.URL.revokeObjectURL(url);
    //       });
    //     });
  };

  return (
    <>
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
            <strong>File name:</strong> {selectedFile}
          </div>
        )}
      </div>
      <div className="content-block2 dx-card">
        <p> </p>
        <p>&nbsp;&nbsp;Bank Transactions Import </p>
        <div style={{ display: "flex", alignItems: "left" }}>
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
            //displayExpr="BANKACCOUNTNUMBER"
            //displayExpr={(item) =>
            //  `${item.BANKACCOUNTNUMBER} - ${item.DESCRIPTION}`
            // }
            value={currentBankAccount}
            searchEnabled={true}
            //value={currentEmployeeName}
            onValueChanged={setAccountData}
            //onValueChanged={(e) => setCurrentEmployeeName(e.value)}
          />
          <p>&nbsp;&nbsp;&nbsp;{currentBankAccountName}</p>
        </div>
      </div>
      {showInfo && (
        <div style={{ padding: "30px" }}>
          <button
            className="btn btn-primary float-end mt-2 mb-2"
            onClick={exportExcelFile}
          >
            Export
          </button>
          <h3>Table Data:</h3>
        </div>
      )}
    </>
  );
};

export default ImportExcel;

// <table className="table table-bordered">
// <thead style={{ background: "yellow" }}>
//   <tr>
//     <th scope="col">Id</th>
//     <th scope="col">Title</th>
//     <th scope="col">Brand</th>
//     <th scope="col">Category</th>
//     <th scope="col">Price</th>
//     <th scope="col">Rating</th>
//     <th scope="col">Photo</th>
//   </tr>
// </thead>
// <tbody>
//   {Array.isArray(data?.products) &&
//     data?.products?.map((row) => (
//       <tr>
//         <td>{row?.id}</td>
//         <td>{row?.title}</td>
//         <td>{row?.brand}</td>
//         <td>{row?.category}</td>
//         <td>${row?.price}</td>
//         <td>{row?.rating}/5</td>
//         {/* <td>
//           <img src={row?.thumbnail} alt="" width="100" />
//         </td> */}
//       </tr>
//     ))}
// </tbody>
// </table>
