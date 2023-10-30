import React from "react";
//import { Popup, Position, ToolbarItem } from "devextreme-react/popup";
import DataGrid, {
  Column,
  Editing,
  Sorting,
  Lookup,
} from "devextreme-react/data-grid";
import "devextreme-react/text-area";
import "./app.scss";

//import { Validator, RequiredRule } from "devextreme-react/validator";

import "devextreme/data/data_source";
//import { useAuth } from "../../contexts/auth";

import DataSource from "devextreme/data/data_source";
import { mystore2 } from "./investmentData";

class InvestmentDetails extends React.Component {
  constructor(props) {
    super(props);
    this.thisID = props.uniqueid; // props.data.data.UNIQUEID;
  }

  handleDataChanged(e) {
    e.component.repaintRows();
  }

  render() {
    const { DESCRIPTION } = ""; //this.props.data.data;
    //const dateoptions = 60;
    //const { rowData, masterField } = this.props;
    //console.log("props ", this.props);
    this.dataSource = getTasks(this.props.rowid, this.props.sendit);

    //const { selectedItem, onItemClicked } = this.props;

    return (
      <>
        <div className="content-block dx-card responsive-paddings red-color">
          {DESCRIPTION} Investment Account Details
          <div className="custom-container">
            <DataGrid dataSource={this.dataSource} columnAutoWidth={true}>
              <Editing
                mode="cell"
                allowUpdating={true}
                //allowAdding={true}
                //allowDeleting={true}
              ></Editing>
              <Sorting mode="single" />
              <Column
                dataField={"NAME"}
                caption={"Account"}
                hidingPriority={7}
              />
              <Column
                dataField={"TYPE"}
                caption={"Account Type"}
                hidingPriority={7}
              />{" "}
              <Column
                dataField={"FPINVESTMENTGROUP"}
                caption={"Investment Group"}
                hidingPriority={7}
              />
              <Column
                dataField={"FPINVESTMENTSUBGROUP"}
                caption={"Investment SubGroup"}
                hidingPriority={7}
              />
              <Column
                dataType="boolean"
                dataField={"REGISTERED"}
                caption="Registered"
              />
              <Column
                dataField={"CURRENCY"}
                caption={"Currency"}
                hidingPriority={7}
                allowEditing={true}
              />
              <Column
                dataField={"CASH"}
                caption={"Cash Value"}
                hidingPriority={7}
                format="$###,###,###.00"
              />
              <Column
                dataField={"ACCOUNTVALUE"}
                caption={"Account Value"}
                hidingPriority={7}
                format="$###,###,###.00"
              />
              <Column
                dataField={"CURRENCYVALUE"}
                caption={"Currency Value"}
                hidingPriority={7}
                format="$###,###,###.00"
              />
            </DataGrid>
          </div>
        </div>
      </>
    );
  }
}

export default InvestmentDetails;

function getTasks(key) {
  //console.log("call to datasource", key, "range is", dateoptions);
  return new DataSource(mystore2(key));
  //new DataSource({ data: tasks });
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
