import React from "react";
//import { Popup, Position, ToolbarItem } from "devextreme-react/popup";
import DataGrid, {
  Column,
  Paging,
  Pager,
  Editing,
  Item,
  Popup,
  Form,
  MasterDetail,
} from "devextreme-react/data-grid";
import "devextreme-react/text-area";

import "devextreme/data/data_source";
import { useAuth } from "../../contexts/auth";

import ServiceLevels from "./serviceLevels";
import { mystore } from "./ServiceServices";

const allowedPageSizes = [8, 12, 20];

class Servicesx extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mycompany: this.props.mycompany,
      servicelevel: this.props.sentservicelevelid,
      currentRow: 0,
    };
    //mystore.load();
  }

  render() {
    return (
      <div className="content-block dx-card responsive-paddings">
        <h3>Services</h3>
        <DataGrid
          dataSource={mystore(this.state.mycompany)}
          showBorders={true}
          remoteOperations={true}
          //onRowClick={this.handleRowClick}
          // selectedRowKeys={this.state.selectedItemKeys}
          // onSelectionChanged={this.selectionChanged}
        >
          <Editing
            mode="popup"
            allowUpdating={true}
            allowAdding={true}
            allowDeleting={true}
          >
            <Popup
              //titleRender={renderTitle}
              showTitle={true}
              width={1000}
              height={575}
              showCloseButton={false}
            />
            <Form id="form" colCount={1} labelLocation="left">
              <Item dataField="SERVICECODE" />
              <Item dataField="DESCRIPTION" />
              <Item dataField="ACTIVE" />
            </Form>
          </Editing>

          <Column
            dataField={"SERVICECODE"}
            caption={"Code"}
            hidingPriority={6}
            allowEditing={true}
          />
          <Column
            dataField={"DESCRIPTION"}
            caption={"Description"}
            hidingPriority={5}
            allowEditing={true}
          />

          <Column
            dataField={"ACTIVE"}
            dataType="boolean"
            caption={"Active"}
            hidingPriority={7}
            allowEditing={true}
          />
          <MasterDetail enabled={true} component={ServiceLevels} />
          <Paging defaultPageSize={12} />
          <Pager
            showPageSizeSelector={true}
            allowedPageSizes={allowedPageSizes}
          />
        </DataGrid>
      </div>
    );
  }
  handleRowClick = (e) => {
    this.setState({ currentRow: e.row });
    //console.log(this.state.currentRow);
    console.log("here");
  };
}

export default function Services() {
  const { user } = useAuth();
  //console.log({ user });
  return <Servicesx mycompany={user.companynumber} />;
}

//<MasterDetail enabled={true} component={ServiceLevels} />
