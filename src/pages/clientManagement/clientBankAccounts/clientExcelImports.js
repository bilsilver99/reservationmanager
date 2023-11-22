import React, { useState, useEffect, useCallback } from "react";
//import { Popup, Position, ToolbarItem } from "devextreme-react/popup";
import DataGrid, {
  Column,
  Editing,
  Sorting,
  Lookup,
  MasterDetail,
  Popup,
  Form,
  HeaderFilter,
  FilterRow,
  SearchPanel,
  Paging,
  Item,
  AsyncRule,
} from "devextreme-react/data-grid";
import "devextreme-react/text-area";
import "./app.scss";
import { useAuth } from "../../../contexts/auth";

import "devextreme/data/data_source";

//import DataSource from "devextreme/data/data_source";
//import { mystore5, getTransactionTypes, getBanks } from "./segmentData";
//import { myStore5 } from "./clientBanksAccountsData";

//let pageoption = 90;

import FileUploader from "devextreme-react/file-uploader";
import * as XLSX from "xlsx";

function ClientImports() {
  const [excelData, setExcelData] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.value[0]; // assuming single file upload
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      // Process workbook and extract the data you need
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      setExcelData(jsonData);
      // You can now use jsonData for displaying or further processing
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="content-block2 dx-card responsive-paddings">
      <h5>Import Client Data</h5>
      <FileUploader
        multiple={false}
        accept="*.xlsx, *.xls"
        uploadMode="useForm"
        onValueChanged={handleFileUpload}
        text="Upload Excel File"
      />
      {/* Optionally render excelData in a table or grid */}
    </div>
  );
}

export default ClientImports;
