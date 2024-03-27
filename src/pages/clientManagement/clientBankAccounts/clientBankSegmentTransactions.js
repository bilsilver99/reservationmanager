import React, { useState, useEffect } from "react";
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

import "devextreme/data/data_source";

import DataSource from "devextreme/data/data_source";
import { mystore3, getTransactionTypes } from "./segmentData";

//let pageoption = 90;

function ClientBankSegmentTransactions(props) {
  const [dataSourcex, setDataSource] = useState(null);
  const [transTypes, setTransTypes] = useState(null);
  //const [filterValue, setfilervalue] = useState("90");

  //const thisID = props.uniqueid;

  useEffect(() => {
    async function fetchData() {
      const data = await getTasks(props.rowid, props.sendit);
      setDataSource(data);
    }

    fetchData();
  }, [props.rowid, props.sendit]);

  // const validateSegment = async (params) => {
  //   //console.log("params coming in ", params, "bankid: ", bankUniqueid);
  //   return await asyncValidation(params.value, bankUniqueid);
  // };

  const onEditorPreparing = (e) => {
    // Check if the row is not new
    if (e.parentType === "dataRow" && !e.row.isNewRow) {
      // Disable editing for a specific field
      if (e.dataField === "SEGMENTNUMBER") {
        e.editorOptions.disabled = true;
      }
      if (e.dataField === "BANKACCOUNTNUMBER") {
        e.editorOptions.disabled = true;
      }
      if (e.dataField === "DESCRIPTION") {
        e.editorOptions.disabled = true;
      }
    }
  };

  const onInitNewRow = (e) => {
    e.data.BANKACCOUNTNUMBER = props.bankAccountNumber;
    e.data.SEGMENTNUMBER = props.segmentNumber;
  };

  useEffect(() => {
    getTransactionTypes() // call the function to fetch data
      .then((data) => {
        console.log("types", data.data);
        setTransTypes(data.data); // store the data in state
        console.log("new types", transTypes);
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the transaction Types data:",
          error
        );
      });
  }, []);

  return (
    <>
      {dataSourcex ? (
        <div className="red-color">
          {/* className="content-block dx-card responsive-paddings red-color">*/}
          Bank Transaction Details for bank account {props.bankAccountNumber}{" "}
          segment {props.segmentNumber}
          <div className="custom-container">
            <DataGrid
              dataSource={dataSourcex}
              columnAutoWidth={true}
              onEditorPreparing={onEditorPreparing}
              onInitNewRow={onInitNewRow}
              width={"100%"}
              style={{ border: "1px solid orange" }}
            >
              <FilterRow visible={true} />
              <Sorting mode="single" />
              <Editing
                mode="cell"
                allowUpdating={true}
                //allowAdding={true}
                allowDeleting={true}
              >
                {/* <Popup
                  title="Transaction Info"
                  showTitle={true}
                  width={600}
                  height={400}
                />
                <Form>
                  <Item itemType="group" colCount={2} colSpan={2}>
                    <Item
                      dataField="BANKACCOUNTNUMBER"
                      editorOptions={{ disabled: true }}
                    />
                    <Item
                      dataField="SEGMENTNUMBER"
                      editorOptions={{ disabled: true }}
                    />
                    <Item dataField="DESCRIPTION" />
                    <Item dataField="SECONDDESCRIPTION" />
                    <Item dataField="FPTRANSACTIONCODE" />
                    <Item dataField="TRANSACTIONDATE" />
                    <Item dataField="TRANSACTIONAMOUNT" />
                  </Item>
                </Form> */}
              </Editing>

              <Column
                dataField={"BANKACCOUNTNUMBER"}
                caption={"Bank Account Number"}
                hidingPriority={7}
                allowEditing={false}
              />
              <Column
                dataField={"SEGMENTNUMBER"}
                caption={"Segment"}
                hidingPriority={7}
                allowEditing={false}
              />
              <Column
                dataField={"DESCRIPTION"}
                caption="DESCRIPTION"
                allowEditing={true}
              />
              <Column
                dataField={"SECONDDESCRIPTION"}
                caption="DESCRIPTION"
                allowEditing={true}
              />

              <Column dataField="FPTRANSACTIONCODE" caption=" Type">
                <Lookup
                  dataSource={transTypes}
                  valueExpr="FPTRANSACTIONCODE"
                  //displayExpr="DESCRIPTION"
                  displayExpr={(item) =>
                    item
                      ? `${item.FPTRANSACTIONCODE} - ${item.TRANSACTIONGROUP} - ${item.DESCRIPTION} `
                      : ""
                  }
                />
              </Column>

              <Column
                dataType="date"
                dataField={"TRANSACTIONDATE"}
                caption="Date (MM/DD/YYYY)"
                hidingPriority={7}
                allowEditing={true}
              />
              <Column
                dataField={"TRANSACTIONAMOUNT"}
                caption={"Amount"}
                hidingPriority={7}
                allowEditing={false}
                format="$###,###,###.00"
              />
              <Column
                dataField={"UNIQUEID"}
                caption={"Amount"}
                hidingPriority={7}
                allowEditing={true}
                visible={false}
              />
            </DataGrid>
          </div>
        </div>
      ) : (
        <div>loading data...</div>
      )}
    </>
  );
}

export default ClientBankSegmentTransactions;

async function getTasks(key, masterField) {
  //console.log("call to datasource2", key, "range is", masterField);
  // const store = mystore3(key, masterField);
  // const loadResult = await store.load();
  return new DataSource(mystore3(key));
}

/////////////////////////////
// async function getTasks(key, masterField) {
//   console.log("call to datasource2", key, "range is", masterField);

//   const store = mystore3(key, masterField);
//   const loadResult = await store.load();
//   return new DataSource({ store, load: () => loadResult });
// }

// <Column
//   dataField={"TOTALSERVICECOST"}
//   caption={"Total Service Cost"}
//   hidingPriority={7}
//   allowEditing={false}
//   format="##.00"
//   calculateCellValue={this.calculateSalary}
// />

//<Item dataField="TOTALSERVICECOST" />
//className="content-block dx-card responsive-paddings">

//const { DESCRIPTION } = this.props.data;
//const dateoptions = 60;
//const { rowData, masterField } = this.props;
//console.log("props ", this.props);
//this.dataSource = getTasks(props.rowid, props.sendit);
//console.log(this.dataSource);

//const { selectedItem, onItemClicked } = this.props;

// handleDataChanged(e) {
//   e.component.repaintRows();
// }

// async componentDidMount() {
//   const dataSource = await getTasks(this.props.rowid, this.props.sendit);
//   this.setState({ dataSource });
// }
