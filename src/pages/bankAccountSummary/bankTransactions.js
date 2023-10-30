import React, { useState, useEffect } from "react";
//import { Popup, Position, ToolbarItem } from "devextreme-react/popup";
import DataGrid, {
  Column,
  Editing,
  Sorting,
  Lookup,
} from "devextreme-react/data-grid";
import "devextreme-react/text-area";
import "./app.scss";

import "devextreme/data/data_source";

import DataSource from "devextreme/data/data_source";
import { mystore2 } from "./bankData";

function BankTransactions(props) {
  const [dataSourcex, setDataSource] = useState(null);
  const thisID = props.uniqueid;

  useEffect(() => {
    async function fetchData() {
      const data = await getTasks(props.rowid, props.sendit);
      setDataSource(data);
    }

    fetchData();
  }, [props.rowid, props.sendit]);

  return (
    <>
      {dataSourcex ? (
        <div className="content-block dx-card responsive-paddings red-color">
          Bank Transaction Details
          <div className="custom-container">
            <DataGrid dataSource={dataSourcex} columnAutoWidth={true}>
              <Sorting mode="single" />
              <Column
                dataField={"BANKACCOUNTNUMBER"}
                caption={"Bank Account Number"}
                hidingPriority={7}
                allowEditing={true}
              />
              <Column
                dataField={"SEGMENTDESCRIPTION"}
                caption={"Segment"}
                hidingPriority={7}
                allowEditing={true}
              />
              <Column
                dataField={"DESCRIPTION"}
                caption="DESCRIPTION"
                allowEditing={false}
              />
              <Column
                dataField={"TRANSACTIONTYPEDESCRIPTION"}
                caption={"Type"}
                hidingPriority={7}
                allowEditing={true}
              />
              <Column
                dataField={"TRANSACTIONDATE"}
                caption={"Date"}
                hidingPriority={7}
                allowEditing={true}
              />
              <Column
                dataField={"TRANSACTIONAMOUNT"}
                caption={"Amount"}
                hidingPriority={7}
                allowEditing={true}
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

export default BankTransactions;

async function getTasks(key, masterField) {
  console.log("call to datasource", key, "range is", masterField);

  const store = mystore2(key, masterField);
  const loadResult = await store.load();
  return new DataSource({ store, load: () => loadResult });
}
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
