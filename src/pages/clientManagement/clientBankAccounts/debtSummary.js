import React from "react";

import { useAuth } from "../../../contexts/auth";
import DataGrid, {
  Column,
  Paging,
  FilterRow,
  HeaderFilter,
} from "devextreme-react/data-grid";

import { mystore4 } from "./segmentData";
import "devextreme-react/text-area";
import "devextreme/data/data_source";
import "./debtSummaryStyles.scss";
import "./debtsummary.css";

//const allowedPageSizes = [8, 12, 20];

//let pageoption = 90;

let lastBankAccountNumber = "xxxxxx";

const renderBankAccountNumber = (data) => {
  const { data: rowData } = data;

  let style = {};
  let content = "";

  if (rowData.BANKACCOUNTNUMBER !== lastBankAccountNumber) {
    content = <div>{rowData.BANKACCOUNTNUMBER}</div>;
  }

  lastBankAccountNumber = rowData.BANKACCOUNTNUMBER;

  if (rowData.GROUPCODEDESCRIPTION !== "") {
    if (rowData.TOTAL === 1 && rowData.ACTUALSEGMENT !== 99) {
      style = { color: "white" }; // Apply blue color
    } else if (rowData.ACTUALSEGMENT === 99) {
      style = { color: "white" }; // Apply yellow color
    }

    return <div style={style}>{content}</div>;
  }
};
const renderDescriptionCell = (data) => {
  const { data: rowData } = data;

  let style = {};
  if (rowData.TOTAL === 1 && rowData.ACTUALSEGMENT !== 99) {
    style = { color: "blue" }; // Apply blue color
  } else if (rowData.ACTUALSEGMENT === 99) {
    style = { color: "red" }; // Apply yellow color
  }

  return <div style={style}>{rowData.DESCRIPTION}</div>;
};

const renderGroupDescriptionCell = (data) => {
  const { data: rowData } = data;

  let style = {};
  if (rowData.GROUPCODEDESCRIPTION !== "") {
    if (rowData.TOTAL === 1 && rowData.ACTUALSEGMENT !== 99) {
      style = { color: "blue" }; // Apply blue color
    } else if (rowData.ACTUALSEGMENT === 99) {
      style = { color: "red" }; // Apply yellow color
    }

    return <div style={style}>{rowData.GROUPCODEDESCRIPTION}</div>;
  }
};

const renderCurrentValueCell = (data) => {
  const { data: rowData } = data;

  let style = {};
  if (rowData.TOTAL === 1 && rowData.ACTUALSEGMENT !== 99) {
    style = { color: "blue", borderTop: "1px solid black" }; // Apply blue color
  } else if (rowData.ACTUALSEGMENT === 99) {
    style = { color: "red", borderTop: "1px solid black" }; // Apply yellow color
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
  if (rowData.TOTAL === 1 && rowData.ACTUALSEGMENT !== 99) {
    style = { color: "blue", borderTop: "1px solid black" }; // Apply blue color
  } else if (rowData.ACTUALSEGMENT === 99) {
    style = { color: "red", borderTop: "1px solid black" }; // Apply yellow color
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
  if (rowData.TOTAL === 1 && rowData.ACTUALSEGMENT !== 99) {
    style = { color: "blue", borderTop: "1px solid black" }; // Apply blue color
  } else if (rowData.ACTUALSEGMENT === 99) {
    style = { color: "red", borderTop: "1px solid black" }; // Apply yellow color
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
      isLoading: true, // Add a loading state
      thisWidth: this.props.thisWidth,
      showCurrentOnly: this.props.showPrior,
    };
    console.log("what is props in debtsummary :", { props });
  }

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
      <div className="content-block2 dx-card responsive-paddings">
        <div className="custom-container" style={{ height: "800px" }}>
          <p>Debt Summary for {this.props.clientCode}</p>
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
            <FilterRow
              visible={this.state.showFilterRow}
              applyFilter={this.state.currentFilter}
            />
            <HeaderFilter visible={this.state.showHeaderFilter} />

            <Paging enabled={false} />
            <Column dataField="UNIQUEID" caption="Unique ID" visible={false} />
            <Column dataField="CLIENTCODE" caption="Client" visible={false} />
            <Column dataField="TOTALSEQ" caption="Seq" visible={false} />
            <Column dataField="BANKCODE" caption="Bank" visible={false} />
            <Column
              dataField="BANKACCOUNTNUMBER"
              caption="Account"
              style={{ color: "blue" }}
              width={150}
              cellRender={renderBankAccountNumber}
              visible={false}
            />
            <Column
              dataField="DESCRIPTION"
              caption="Description"
              width={350}
              cellRender={renderDescriptionCell}
            />
            <Column
              dataField="SEGMENTNUMBER"
              caption="Segment"
              format={"###"}
              alignment="right"
              width={120}
              visible={false}
            />
            <Column dataField="GROUPCODE" caption="Group" visible={false} />
            <Column
              dataField="GROUPCODEDESCRIPTION"
              cellRender={renderGroupDescriptionCell}
              caption="Description"
              width={200}
            />
            <Column
              dataField="CURRENTVALUE"
              caption="Current"
              format={"$###,###,###"}
              alignment="right"
              cellRender={renderCurrentValueCell}
            />
            <Column
              dataField="PRIORVALUE"
              caption="Prior"
              format={"$###,###,###"}
              alignment="right"
              visible={this.state.showCurrentOnly}
              cellRender={renderPriorValueCell}
            />
            <Column
              dataField="CHANGEVALUE"
              caption="Change"
              format={"$###,###,###"}
              alignment="right"
              visible={this.state.showCurrentOnly}
              cellRender={renderChangeValueCell}
            />
            <Column
              dataField="GROUPSEQUENCE"
              caption="Sequence"
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
            <Column dataField="COMPOUND" caption="Compound" visible={false} />
            <Column dataField="ACTUALSEGMENT" caption="SEQG" visible={false} />
          </DataGrid>
        </div>
      </div>
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
