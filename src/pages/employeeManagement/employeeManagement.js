import React from "react";
import DataGrid, {
  Column,
  Paging,
  Pager,
  Editing,
} from "devextreme-react/data-grid";
import CustomStore from "devextreme/data/custom_store";
import "devextreme/data/data_source";
import "whatwg-fetch";
import { useAuth } from "../../contexts/auth";

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
      const url = `${process.env.REACT_APP_BASE_URL}/GetOperators`;
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
      const url = `${process.env.REACT_APP_BASE_URL}/updateOperators`;
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
      const url = `${process.env.REACT_APP_BASE_URL}/updateOperators`;
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
      //console.log(key);
      //console.log(values);
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
      const url = `${process.env.REACT_APP_BASE_URL}/updateOperators`;
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

const turnoffedit = { disabled: true };

const allowedPageSizes = [8, 12, 20];

class EmployeeManagementx extends React.Component {
  constructor(props) {
    super(props);
    this.state = { sentcompany: this.props.companynumber };
    //mystore.load();
  }

  render() {
    return (
      <>
        <div className="right-side"></div>
        <DataGrid
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
            mode="cell"
            allowUpdating={true}
            allowAdding={true}
            allowDeleting={true}
          />
          <Column
            dataField={"UNIQUEID"}
            width={90}
            hidingPriority={2}
            visible={false}
          />
          <Column
            dataField={"COMPANYNUMBER"}
            width={190}
            caption={"Company Number"}
            hidingPriority={8}
            editorOptions={turnoffedit}
          />
          <Column
            dataField={"USERNAME"}
            caption={"Username"}
            hidingPriority={6}
          />
          <Column
            dataField={"USERPASSWORD"}
            caption={"User Password"}
            hidingPriority={5}
          />

          <Column
            dataType="boolean"
            dataField={"ADMINISTRATOR"}
            caption={"Administrator"}
            hidingPriority={7}
          />
          <Column
            dataField={"OPERATORNAME"}
            caption={"Employee Name"}
            hidingPriority={7}
          />
          <Column
            dataField={"EMAILADDRESS"}
            caption={"Employee Email Address"}
            hidingPriority={7}
          />
          <Paging defaultPageSize={12} />
          <Pager
            showPageSizeSelector={true}
            allowedPageSizes={allowedPageSizes}
          />
        </DataGrid>
      </>
    );
  }
}

export default function EmployeeManagement() {
  const { user } = useAuth();
  return <EmployeeManagementx companynumber={user.companynumber} />;
}
