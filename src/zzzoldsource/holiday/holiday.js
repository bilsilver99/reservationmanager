import React from "react";
import DataGrid, {
  Column,
  Paging,
  Pager,
  Editing,
  Form,
  Item,
  Popup,
  Label,
} from "devextreme-react/data-grid";

import "devextreme-react/text-area";
import CustomStore from "devextreme/data/custom_store";
import "devextreme/data/data_source";
import "whatwg-fetch";
import { useAuth } from "../../contexts/auth";
//import TextBox from "devextreme-react/text-box";
//import { ItemDragging } from "devextreme-react/list";
import LabelTemplate from "./LabelTemplate.js";
function isNotEmpty(value) {
  return value !== undefined && value !== null && value !== "";
}

function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

const mystore = (mycompany) =>
  new CustomStore({
    key: "UNIQUEID",
    load: (loadOptions) => {
      let params = "?";
      [
        "skip",
        "take",
        "requireTotalCount",
        "requireGroupCount",
        "sort",
        "filter",
        "totalSummary",
        "group",
        "groupSummary",
      ].forEach((i) => {
        if (i in loadOptions && isNotEmpty(loadOptions[i])) {
          params += `${i}=${JSON.stringify(loadOptions[i])}&`;
        }
      });

      mycompany = 1;

      params = params.slice(0, -1);
      var requestoptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json;",
        },
        body: JSON.stringify({
          SentCompany: mycompany,
          Parameters: params,
        }),
      };
      const url = `${process.env.REACT_APP_BASE_URL}/GetCompayHolidays`;
      return fetch(url, requestoptions) // Request fish
        .then((response) => {
          if (!response.ok) {
            return {
              companyname: "System did not respond",
              returnaddress: " ",
            };
          }
          return response.json();
        })
        .then((json) => {
          console.log(json);
          return {
            data: json.user_response.mdata,
            totalCount: json.user_response.totalCount,
            key: json.user_response.keyname,
          };
        });
    },
    insert: (values) => {
      var requestoptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json;",
        },
        body: JSON.stringify({
          ThisFunction: "insert",
          keyvaluepair: values,
          SentCompany: mycompany,
        }),
      };
      const url = `${process.env.REACT_APP_BASE_URL}/updateCompanyHolidays`;
      return fetch(url, requestoptions) // Request fish
        .then((response) => {
          if (!response.ok) {
            return {
              companyname: "System did not respond",
              returnaddress: " ",
            };
          }
          return response.json();
        })
        .then((json) => {
          return {};
        });
    },
    remove: (key) => {
      //console.log(key);
      //console.log(values);
      var requestoptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json;",
        },
        body: JSON.stringify({
          SentCompany: key,
          ThisFunction: "delete",
        }),
      };
      const url = `${process.env.REACT_APP_BASE_URL}/updateCompanyHolidays`;
      return fetch(url, requestoptions) // Request fish
        .then((response) => {
          if (!response.ok) {
            return {
              companyname: "System did not respond",
              returnaddress: " ",
            };
          }
          return response.json();
        })
        .then((json) => {
          return {};
        });
    },
    update: (key, values) => {
      console.log(key);
      console.log(values);
      var requestoptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json;",
        },
        body: JSON.stringify({
          ThisFunction: "change",
          SentCompany: key,
          keyvaluepair: values,
        }),
      };
      const url = `${process.env.REACT_APP_BASE_URL}/updateCompanyHolidays`;
      return fetch(url, requestoptions) // Request fish
        .then((response) => {
          if (!response.ok) {
            return {
              companyname: "System did not respond",
              returnaddress: " ",
            };
          }
          return response.json();
        })
        .then((json) => {
          return {};
        });
    },
  });

//const turnoffedit = { disabled: true };

const allowedPageSizes = [8, 12, 20];

const holidayDateEditorOptions = { width: "100%", value: null };

class CompanyHolidayx extends React.Component {
  constructor(props) {
    super(props);
    this.state = { sentcompany: this.props.companynumber };
    //mystore.load();
  }

  render() {
    return (
      <div className="content-block dx-card responsive-paddings">
        <h3>Holiday Schedule</h3>
        <DataGrid
          width={800}
          height={525}
          ref={(ref) => {
            this.dataGrid = ref;
          }}
          dataSource={mystore(this.sentcompany)}
          showBorders={true}
          remoteOperations={true}
          // selectedRowKeys={this.state.selectedItemKeys}
          // onSelectionChanged={this.selectionChanged}
        >
          <Editing
            mode="row"
            allowUpdating={true}
            allowAdding={true}
            allowDeleting={true}
          >
            <Popup title="Employee Info" showTitle={true} />
            <Form>
              <Item itemType="group" caption="Company Holiday Schedule">
                <Item
                  dataField="DATEOFVACATION"
                  editorType="dxDateBox"
                  editorOptions={holidayDateEditorOptions}
                >
                  <Label render={LabelTemplate("event")} />
                </Item>

                <Item dataField="FULLDAY" />
                <Item dataField="STARTTIME" />
                <Item dataField="ENDTIME" />
                <Item dataField="NOTES" />
              </Item>
            </Form>
          </Editing>

          <Column
            dataField={"UNIQUEID"}
            width={90}
            hidingPriority={2}
            visible={false}
            allowEditing={false}
          />
          <Column
            dataField={"COMPANYNUMBER"}
            visible={false}
            allowEditing={false}
          />
          <Column
            dataField={"DATEOFVACATION"}
            caption={"Date"}
            hidingPriority={6}
            allowEditing={true}
            editorType="dxDateBox"
          />
          <Column
            dataType="boolean"
            dataField={"FULLDAY"}
            caption={"Full Day"}
            hidingPriority={5}
            allowEditing={true}
          />

          <Column
            //dataType="boolean"
            dataField={"STARTTIME"}
            caption={"Start Time"}
            hidingPriority={7}
            allowEditing={true}
            format="##.00"
          />
          <Column
            dataField={"ENDTIME"}
            caption={"End Time"}
            hidingPriority={7}
            allowEditing={true}
            format="##.00"
          />
          <Column
            dataField={"NOTES"}
            caption={"Notes"}
            hidingPriority={7}
            colSpan={2}
            allowEditing={true}
          />

          <Paging defaultPageSize={12} />
          <Pager
            showPageSizeSelector={true}
            allowedPageSizes={allowedPageSizes}
          />
        </DataGrid>
      </div>
    );
  }
}

export default function Holiday() {
  const { user } = useAuth();
  //console.log({ user });
  return <CompanyHolidayx companynumber={user.companynumber} />;
}
