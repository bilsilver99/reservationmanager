import React, { useState, useEffect } from "react";
//import { Popup, Position, ToolbarItem } from "devextreme-react/popup";
import DataGrid, {
  Column,
  Editing,
  Sorting,
  Lookup,
  MasterDetail,
} from "devextreme-react/data-grid";
import "devextreme-react/text-area";
import "./app.scss";

import "devextreme/data/data_source";

import DataSource from "devextreme/data/data_source";
import { mystore2 } from "./segmentData";
import ClientBankSegmentTransactions from "./clientBankSegmentTransactions";
//import myStore from "./clientSegmentBankData";
let pageoption = 90;

function ClientBankSegment(props) {
  const [dataSourcex, setDataSource] = useState(null);
  // const [thisID,setthisID]= useState(props.uniqueid);
  // const [currentRow, setCurrentRow] = useState(0);
  const [filterValue, setfilervalue] = useState("90");
  // const [selectedRowKeys,setselectedRowkeys] = useState ([]);
  // const [settransactionGroupData]= useState([]); // add new state variable
  // const [companyCode,setcompanyCode] = useState(1);
  // const [showFilterRow,setshowFilterRow] = useState(true);
  // const [showHeaderFilter,setshowHeaderFilter]= useState(true);
  //currentFilter: this.applyFilterTypes[0].key,

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
          Segments
          <div className="custom-container">
            <DataGrid dataSource={dataSourcex} columnAutoWidth={true}>
              <Sorting mode="single" />
              <Column
                dataField={"UNIQUEID"}
                caption={"Unique ID"}
                hidingPriority={7}
                allowEditing={true}
                visible={true}
              />
              <Column
                dataField={"BANKACCOUNTNUMBER"}
                caption={"Bank Account Number"}
                hidingPriority={7}
                allowEditing={false}
                visible={false}
              />
              <Column
                dataField={"SEGMENTNUMBER"}
                caption={"Segment"}
                hidingPriority={7}
                allowEditing={true}
              />

              <Column
                dataField={"DESCRIPTION"}
                caption={"Description"}
                hidingPriority={7}
                allowEditing={true}
              />
              <Column
                dataField={"SEGMENTBALANCE"}
                caption="Balance"
                allowEditing={false}
                format={"$###,###,###.00"}
                alignment="right"
              />

              <Column
                dataField={"INTERESTRATE"}
                caption={"Interest Rate"}
                hidingPriority={7}
                allowEditing={true}
                format={"###,###,###.00"}
                alignment="right"
              />
              <Column
                dataField={"MATURITYDATE"}
                caption={"Maturity Date"}
                hidingPriority={7}
                allowEditing={true}
              />
              <Column
                dataType="boolean"
                dataField={"FIXED"}
                caption={"Fixed Rate"}
                hidingPriority={7}
                allowEditing={true}
              />
              <Column
                dataType="boolean"
                dataField={"VARIABLE"}
                caption={"Variable Rate"}
                hidingPriority={7}
                allowEditing={true}
              />
              <MasterDetail
                enabled={true}
                render={renderDetail}
                sendor={filterValue}
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

export default ClientBankSegment;

async function getTasks(key, masterField) {
  console.log("call to datasource", key, "range is", masterField);

  const store = mystore2(key, masterField);
  const loadResult = await store.load();
  return new DataSource({ store, load: () => loadResult });
}

function renderDetail(props) {
  console.log("unique2", props.data.UNIQUEID, "range: ", pageoption);
  const uniqueid = props.data.UNIQUEID;
  return <ClientBankSegmentTransactions rowid={uniqueid} sendit={pageoption} />;
}
