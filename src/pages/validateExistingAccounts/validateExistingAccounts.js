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
import AuthorizeSpecificBank from "../authorizeUser/authorizeSpecificBank";

function isNotEmpty(value) {
  return value !== undefined && value !== null && value !== "";
}

function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

const mystore = (myClient, FlinksConnectDomainRetail, UserCode, UserPassword) =>
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

      params = params.slice(0, -1);

      var requestoptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json;",
        },
        body: JSON.stringify({
          clientname: myClient,
        }),
      };
      const url = `${process.env.REACT_APP_BASE_URL}/GetAuthStatusList`;
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
            data: json.user_response.AuthQ,
            totalCount: json.user_response.totalcount,
            key: json.user_response.keyname,
          };
        });
    },
    update: (key, values) => {
      console.log(key);
      console.log(values);
      const bankid = 4;

      return (
        <AuthorizeSpecificBank
          myClientx={myClient}
          FlinksConnectDomainRetailx={FlinksConnectDomainRetail}
          UserCodex={UserCode}
          UserPasswordx={UserPassword}
          bankidx={bankid}
        />
      );

      // var requestoptions = {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Accept: "application/json;",
      //   },
      //   body: JSON.stringify({
      //     clientname: myClient,
      //   }),
      // };
      // const url = `${process.env.REACT_APP_BASE_URL}/GetAuthStatusList`;
      // console.log(requestoptions);
      // return fetch(url, requestoptions) // Request fish
      //   .then((response) => {
      //     if (!response.ok) {
      //       return {
      //         companyname: "System did not respond",
      //         returnaddress: " ",
      //       };
      //     }
      //     return response.json();
      //   })
      //   .then((json) => {
      //     console.log(json);
      //     return {
      //       data: json.user_response.AuthQ,
      //       totalCount: json.user_response.totalcount,
      //       key: json.user_response.keyname,
      //     };
      //   });
    },
  });

const turnoffedit = { disabled: true };

const allowedPageSizes = [8, 12, 20];

class ValidateExistingAccountsx extends React.Component {
  constructor(props) {
    super(props);
    this.state = { sentClient: this.props.clientCode };
    //mystore.load();
  }

  render() {
    return (
      <>
        <div className="content-block dx-card responsive-paddings">
          <h6>Banking Verifications</h6>
          <DataGrid
            ref={(ref) => {
              this.dataGrid = ref;
            }}
            dataSource={mystore(
              this.props.clientCode,
              this.props.FlinksConnectDomainRetail,
              this.props.UserCode,
              this.props.UserPassword
            )}
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
              dataField={"ACTIONREQUIRED"}
              caption={"Verification required"}
              hidingPriority={8}
            />
            <Column
              dataField={"BANKCODE"}
              caption={"Bank Code"}
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
              dataField={"INSTITUTION"}
              caption={"Bank Name"}
              hidingPriority={8}
              editorOptions={turnoffedit}
            />

            <Column
              dataField={"LASTREFRESH"}
              caption={"Last Refresh Date"}
              hidingPriority={8}
              editorOptions={turnoffedit}
            />
            <Column
              dataField={"STATUSCODE"}
              caption={"Status"}
              hidingPriority={8}
              //editorOptions={turnoffedit}
            />

            <Column
              dataField={"STATUSMESSAGE"}
              caption={"Status Notes"}
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

export default function ValidateExistingAccounts() {
  const { user } = useAuth();
  console.log({ user });
  return (
    <ValidateExistingAccountsx
      clientCode={user.clientCode}
      FlinksConnectDomainRetail={user.FlinksConnectDomainRetail}
      UserCode={user.UserCode}
      UserPassword={user.UserPassword}
    />
  );
}
