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

//const allowedPageSizes = [8, 12, 20];

//let pageoption = 90;
const renderGroupDescriptionCell = (data) => {
  const { data: rowData } = data;

  let style = {};
  if (rowData.TOTAL === 1 && rowData.ACTUALSEGMENT !== 99) {
    style = { color: "blue" }; // Apply blue color
  } else if (rowData.ACTUALSEGMENT === 99) {
    style = { color: "red" }; // Apply yellow color
  }

  return <div style={style}>{rowData.GROUPCODEDESCRIPTION}</div>;
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

  //   componentDidMount() {
  //     Assetgroups() // call the function to fetch data
  //       .then((data) => {
  //         console.log("group codes returned", data);
  //         this.setState({ assetGroupsCodes: data.data }); // store the data in state
  //       })
  //       .catch((error) => {
  //         console.error(
  //           "There was an error fetching the transaction group data:",
  //           error
  //         );
  //       });
  //   }

  // handleFilterChange = (e) => {
  //   this.setState({ filterValue: e.value }, () => {
  //     //console.log("New filter value:", this.state.filterValue);
  //     pageoption = this.state.filterValue;
  //   });
  // };

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
    if (e.rowIndex % 2 === 0) e.rowElement.style.height = "5px";
    //console.log("row prepared", e);
  }
  //      <div className="custom-container" style={{ height: "400px" }}>

  render() {
    return (
      <div className="content-block2 dx-card responsive-paddings">
        <div className="custom-container" style={{ height: "800px" }}>
          <p>Debt Summary for {this.props.clientCode}</p>
          <DataGrid
            dataSource={mystore4(this.props.clientCode)}
            onRowPrepared={this.onRowPrepared}
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
            />
            <Column
              dataField="DESCRIPTION"
              caption="Description"
              width={150}
              cellRender={renderDescriptionCell}
            />
            <Column
              dataField="SEGMENTNUMBER"
              caption="Segment"
              format={"###"}
              alignment="right"
              width={120}
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
              format={"$###,###,###.00"}
              alignment="right"
            />
            <Column
              dataField="PRIORVALUE"
              caption="Prior"
              format={"$###,###,###.00"}
              alignment="right"
              visible={this.state.showCurrentOnly}
            />
            <Column
              dataField="CHANGEVALUE"
              caption="Change"
              format={"$###,###,###.00"}
              alignment="right"
              visible={this.state.showCurrentOnly}
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
