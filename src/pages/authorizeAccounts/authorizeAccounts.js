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

const mystore = (myClient) =>
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

      var administrator = 0;

      params = params.slice(0, -1);

      var requestoptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json;",
        },
        body: JSON.stringify({
          sentadministrator: administrator,
          Parameters: params,
          sentclientcode: myClient,
        }),
      };
      const url = `${process.env.REACT_APP_BASE_URL}/returnbankdata`;
      console.log(requestoptions);
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
            data: json.user_response.bankq,
            totalCount: json.user_response.totalCount,
            key: json.user_response.keyname,
          };
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
      const url = `${process.env.REACT_APP_BASE_URL}/newUpdatebankdata`;
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

class AuthorizeAccountsx extends React.Component {
  constructor(props) {
    super(props);
    this.state = { sentClient: this.props.clientCode };
    //mystore.load();
  }

  render() {
    return (
      <>
        <div className="content-block dx-card responsive-paddings">
          <h6>Banking Authorizations</h6>
          <DataGrid
            ref={(ref) => {
              this.dataGrid = ref;
            }}
            dataSource={mystore(this.props.clientCode)}
            showBorders={true}
            remoteOperations={true}
            columnAutoWidth={true}

            // selectedRowKeys={this.state.selectedItemKeys}
            // onSelectionChanged={this.selectionChanged}
          >
            <Editing
              mode="cell"
              allowUpdating={true}
              //allowAdding={true}
              //allowDeleting={true}
            />
            <Column
              dataType="boolean"
              dataField={"IMPORTMX"}
              caption={"Import Data"}
              hidingPriority={8}
            />
            <Column
              dataField={"CLIENTCODE"}
              width={190}
              caption={"Client Code"}
              hidingPriority={8}
              editorOptions={turnoffedit}
              visible={false}
            />
            <Column
              dataField={"UNIQUEID"}
              width={90}
              hidingPriority={8}
              dataType="Number"
              visible={false}
            />
            <Column
              dataField={"BANKCODE"}
              caption={"Bank Code"}
              hidingPriority={8}
              editorOptions={turnoffedit}
              visible={false}
            />
            <Column
              dataField={"BANKNAME"}
              caption={"Bank Name"}
              hidingPriority={8}
              editorOptions={turnoffedit}
            />

            <Column
              dataField={"BANKACCOUNTNUMBER"}
              caption={"Account Number"}
              hidingPriority={8}
              editorOptions={turnoffedit}
            />
            <Column
              dataField={"ACCOUNTDESCRIPTION"}
              caption={"Account Description"}
              hidingPriority={8}
              //editorOptions={turnoffedit}
            />

            <Column
              dataField={"BANKBALANCE"}
              caption={"Account Balance"}
              hidingPriority={8}
            />
            <Column
              dataField={"AVAILABLEBALANCE"}
              caption={"Available Balance"}
              hidingPriority={8}
            />
            <Column
              dataField={"ACCOUNTLIMIT"}
              caption={"Account Limit"}
              hidingPriority={8}
            />
            <Paging defaultPageSize={12} />
            <Pager
              showPageSizeSelector={true}
              allowedPageSizes={allowedPageSizes}
            />
          </DataGrid>
        </div>
      </>
    );
  }
}

export default function AuthorizeAccounts() {
  const { user } = useAuth();
  console.log({ user });
  return <AuthorizeAccountsx clientCode={user.clientCode} />;
}
