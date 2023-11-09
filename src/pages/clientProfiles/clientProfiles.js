import React from "react";
import DataGrid, {
  Column,
  Editing,
  Popup,
  Paging,
  Lookup,
  Form,
  Pager,
  FilterRow,
  HeaderFilter,
  Search,
  SearchPanel,
} from "devextreme-react/data-grid";
import { EmptyItem, Item, GroupItem } from "devextreme-react/form";
import "devextreme-react/text-area";
import "devextreme/data/data_source";
import { useAuth } from "../../contexts/auth";
import "./app.scss";

//import "devextreme/dist/css/dx.light.css";

import { mystore } from "./clientprofilesData";
//import { mystore2 } from "./transactionGroupData";
import "whatwg-fetch";
import SelectBox from "devextreme-react/select-box";

const allowedPageSizes = [8, 12, 24];

//let pageoption = 90;

class ClientProfilesx extends React.Component {
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
      transactionGroupData: [], // add new state variable
      companyCode: 1,
      showFilterRow: true,
      showHeaderFilter: true,
      currentFilter: this.applyFilterTypes[0].key,
      //bankNameToAuthorize: "", // add new state variable
    };
  }

  // componentDidMount() {
  //   mystore2() // call the function to fetch data
  //     .then((data) => {
  //       //console.log("data", data);
  //       this.setState({ transactionGroupData: data.data }); // store the data in state
  //     })
  //     .catch((error) => {
  //       console.error(
  //         "There was an error fetching the transaction group data:",
  //         error
  //       );
  //     });
  // }

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
  //  <div className="content-block-font dx-card responsive-paddings">

  render() {
    return (
      <div className="content-block dx-card responsive-paddings">
        <DataGrid
          dataSource={mystore(this.props.companyCode)}
          keyExpr="UNIQUEID"
          showBorders={true}
          remoteOperations={false}
          onSelectionChanged={this.handleSelectionChanged.bind(this)} // add this line
          onEditingStart={this.handleEditingStart}
          id="form"
          editing={{
            mode: "row", // or 'batch' or 'cell', depending on what you use
            allowAdding: false, // Disable adding new rows
            allowUpdating: false, // Disable updating rows
            allowDeleting: false, // Disable deleting rows
          }}
        >
          <FilterRow
            visible={this.state.showFilterRow}
            applyFilter={this.state.currentFilter}
          />
          <HeaderFilter visible={this.state.showHeaderFilter} />
          <SearchPanel visible={true} width={240} placeholder="Search..." />
          <Paging enabled={true} />
          <Column
            dataField={"CLIENTCODE"}
            caption={"Client Code"}
            hidingPriority={8}
            visible={true}
          />
          <Column
            dataField={"NAME"}
            caption={"Name"}
            hidingPriority={8}
            visible={true}
          />
          <Column
            dataField={"ADDRESSLINEONE"}
            caption={"Address"}
            hidingPriority={8}
            visible={true}
          />
          <Column
            dataField={"ADDRESSLINETWO"}
            caption={"Address Two"}
            hidingPriority={8}
            visible={true}
          />
          <Column
            dataField={"ADDRESSLINETHREE"}
            caption={"Address Three"}
            hidingPriority={8}
            visible={true}
          />
          <Column
            dataField={"ADDRESSLINEFOUR"}
            caption={"Address Four"}
            hidingPriority={8}
            visible={true}
          />
          <Column
            dataField={"COUNTRY"}
            caption={"Country"}
            hidingPriority={8}
            visible={true}
          />
          <Column
            dataField={"POSTALZIP"}
            caption={"Postal/Zip"}
            hidingPriority={8}
            visible={true}
          />
          <Column
            dataField={"ASSIGNEDTO"}
            caption={"Assigned To"}
            hidingPriority={8}
            visible={true}
          />

          <Column
            dataType="boolean"
            dataField={"INACTIVE"}
            caption={"Inactive"}
            hidingPriority={8}
            visible={true}
            editorType="dxCheckBox"
          />
          <Column
            dataField={"UNIQUEID"}
            width={90}
            hidingPriority={8}
            dataType="Number"
            visible={false}
            allowEditing={false}
          />
          <Paging defaultPageSize={8} />
          <Pager
            showPageSizeSelector={true}
            allowedPageSizes={allowedPageSizes}
          />
        </DataGrid>
      </div>
    );
  }
}

export default function ClientProfiles() {
  const { user } = useAuth();
  //console.log({ user });
  return <ClientProfilesx companyCode={user.companyCode} />;
}

// {/* <Editing
// mode="popup"
// allowUpdating={true}
// allowAdding={true}
// allowDeleting={true}
// >
// <Popup
//   title="Client Information"
//   showTitle={true}
//   width={"80%"}
//   height={800}
// />
// <Form colCount={2}>
//   <Item itemType="group" colCount={8} colSpan={8} caption="Main">
//     <Item dataField="CLIENTCODE" colSpan={2} />
//     <Item dataField="NAME" colSpan={6} />
//   </Item>
//   <Item itemType="group" colCount={8} colSpan={8} caption="Main">
//     <Item dataField="ADDRESSLINEONE" />
//     <Item dataField="ADDRESSLINETWO" />
//     <Item dataField="ADDRESSLINETHREE" />
//     <Item dataField="ADDRESSLINEFOUR" />
//     <Item dataField="COUNTRY" />
//     <Item dataField="POSTALZIP" />
//     <Item dataField="ASSIGNEDTO" />
//     <Item dataField="INACTIVE" />
//   </Item>
// </Form>
// </Editing> */}
