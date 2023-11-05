import React, { useEffect, useState } from "react";
//import { Popup, Position, ToolbarItem } from "devextreme-react/popup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckSquare, faSquare } from "@fortawesome/free-solid-svg-icons";
import { PostAccount, ValidateBanks } from "../../api/MyOwnServices";
import DataGrid, {
  Column,
  Paging,
  Pager,
  Sorting,
  Editing,
  FilterRow,
  Item,
  Popup,
  Form,
  MasterDetail,
} from "devextreme-react/data-grid";

import cibc from "../../logos/CIBC/cibc.png";
import bmo from "../../logos/BMO/bmo.png";
import Citizens from "../../logos/Citizens/citizens.png";
import Scotiabank from "../../logos/Scotiabank/scotiabank.png";
import Manulife from "../../logos/Manulife/manulife.png";
import TD from "../../logos/TD/TD.png";
import National from "../../logos/National/national.png";
import Tangerine from "../../logos/Tangerine/Tangerine.png";
import Laurentian from "../../logos/Laurentian/Laurentian.png";
import HSBC from "../../logos/HSBC/hsbc.png";
import RBC from "../../logos/RBC/RBC.png";
import Desjardin from "../../logos/Desjardin/Desjardin.png";
import Simplii from "../../logos/Simplii/Simplii.png";
//
//import AuthorizeSpecificBank from "../authorizeUser/authorizeSpecificBank";
import AuthorizeUser from "../authorizeUser/authorizeUser";
import SelectBox from "devextreme-react/select-box";
import "devextreme-react/text-area";
import BankTransactions from "./bankTransactions";
import "devextreme/data/data_source";
import { useAuth } from "../../contexts/auth";
import "./app.scss";
import { mystore } from "./bankData";
import { Button } from "devextreme-react";
//import { SelectBox } from "devextreme-react";
//import { Template } from "devextreme-react/core/template";

const allowedPageSizes = [8, 12, 20];
const imagetoshow = [
  cibc,
  bmo,
  Citizens,
  Scotiabank,
  Manulife,
  TD,
  National,
  Tangerine,
  Laurentian,
  HSBC,
  RBC,
  Desjardin,
  Simplii,
];

let pageoption = 90;

function booleanCellRender(cellData) {
  return (
    <div>
      {cellData.value ? (
        <FontAwesomeIcon
          icon={faCheckSquare}
          style={{ color: "green" }}
          size="xl"
        />
      ) : (
        <></>
      )}
    </div>
  );
}

class BankAccountSummaryx extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      myClient: this.props.clientCode,
      currentRow: 0,
      filterValue: "90",
      selectedRowKeys: [],
      bankNameToAuthorize: "", // add new state variable
    };
  }

  handleFilterChange = (e) => {
    this.setState({ filterValue: e.value }, () => {
      //console.log("New filter value:", this.state.filterValue);
      pageoption = this.state.filterValue;
    });
  };

  handleSelectionChanged(e) {
    this.setState({ selectedRowKeys: e.selectedRowKeys });
  }

  applyFilter = () => {
    //const { filterValue } = this.state;
    // Perform filter action with the selected filter value
    // You can pass the filterValue to your data source or perform any other filtering logic
    //console.log("Filter value:", filterValue);
  };

  emailCellTemplate = (cellElement, cellInfo) => {
    //const BANKCODE = cellInfo.data.BANKCODE;
    const BANKNAME = cellInfo.data.BANKNAME;
    //const ACTIONREQUIRED = cellInfo.data.ACTIONREQUIRED;
    cellElement.textContent = BANKNAME;
    //   if (BANKCODE && ACTIONREQUIRED === 1) {
    //     const link = document.createElement("a");
    //     link.href = "#";
    //     link.textContent = BANKNAME;
    //     link.addEventListener("click", () => {
    //       // Call the AuthorizeUser procedure here
    //       console.log("clicked bank", BANKCODE);
    //       this.setState({ bankNameToAuthorize: BANKCODE }); // set state variable
    //     });
    //     cellElement.appendChild(link);
    //   } else {
    //     cellElement.textContent = BANKNAME;
    //   }
  };

  render() {
    const dateFilterOptions = [
      { value: 30, text: "Last 30 days" },
      { value: 60, text: "Last 60 days" },
      { value: 90, text: "Last 90 days" },
      { value: 0, text: "All Transactions" },
    ];
    //const imagename = "cibc";
    return (
      <div className="content-block dx-card responsive-paddings">
        <div>
          <SelectBox
            dataSource={dateFilterOptions}
            valueExpr="value"
            displayExpr="text"
            placeholder="Select date range"
            value={this.state.filterValue}
            onValueChanged={this.handleFilterChange}
            dropDownOptions={{
              width: 200, // Set the width of the dropdown menu
              height: 200, // Set the height of the dropdown menu
            }}
            width={150} // Set the width of the select box
          />
        </div>
        <h3>
          Bank Accounts &nbsp; &nbsp; &nbsp;{" "}
          {this.state.filterValue > 0
            ? "showing all transactions in the last " +
              this.state.filterValue +
              " days"
            : "All Transactions"}
        </h3>
        <DataGrid dataSource={mystore(this.state.myClient)} showBorders={true}>
          <Editing mode="cell" allowUpdating={true} />
          <FilterRow visible={false} />
          <Sorting mode="single" />
          <Column
            dataType="boolean"
            dataField={"IMPORTMX"}
            caption={"Import Data"}
            hidingPriority={8}
            visible={false}
          />
          <Column
            dataType="boolean"
            dataField={"ACTIONREQUIRED"}
            caption={"Auth Reqd"}
            hidingPriority={8}
            width={150}
            visible={true}
            cellRender={booleanCellRender}
            //onCellClick={this.handleActionRequiredClick}
          />
          <Column
            dataField={"CLIENTCODE"}
            width={190}
            caption={"Client Code"}
            hidingPriority={8}
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
            dataField="BANK"
            width={80}
            allowSorting={false}
            cellRender={cellRender}
          />
          <Column
            dataField={"BANKCODE"}
            caption={""}
            hidingPriority={8}
            visible={false}
          />
          <Column
            dataField={"BANKNAME"}
            caption={""}
            hidingPriority={8}
            cellTemplate={this.emailCellTemplate}
            width={200}
          />
          <Column
            dataField={"BANKACCOUNTNUMBER"}
            caption={"Account Number"}
            hidingPriority={8}
          />
          <Column
            dataField={"ACCOUNTDESCRIPTION"}
            caption={"Account Description"}
            hidingPriority={8}
            //editorOptions={turnoffedit}
          />
          <Column
            dataField={"BANKBALANCEY"}
            caption={"Balance"}
            hidingPriority={8}
            format="$###,###,###.00"
            width={100}
          />
          <Column
            dataField={"UNPOSTED"}
            caption={"Unposted "}
            hidingPriority={8}
            format="$###,###,###.00"
            width={100}
          />
          <Column
            dataField={"AVAILABLEBALANCE"}
            caption={"Available"}
            hidingPriority={8}
            format="$###,###,###.00"
            width={100}
          />
          <Column
            dataField={"ACCOUNTLIMIT"}
            caption={"Account Limit"}
            hidingPriority={8}
            format="$###,###,###.00"
          />
          <MasterDetail
            enabled={true}
            render={renderDetail}
            sendor={this.state.filterValue}
          />
          <Paging defaultPageSize={12} />
          <Pager
            showPageSizeSelector={true}
            allowedPageSizes={allowedPageSizes}
          />
        </DataGrid>
        {this.state.bankNameToAuthorize && (
          <AuthorizeSpecificBank bankName={this.state.bankNameToAuthorize} />
        )}
      </div>
    );
  }
  // handleRowClick = (e) => {
  //   this.setState({ currentRow: e.row });
  //   console.log(this.state.currentRow);
  //   console.log("here");
  // };
}
function cellRender(data) {
  //console.log("wtf", data.row.data.IMAGE);
  if (data.row.data.IMAGE || 0)
    return (
      <img
        src={imagetoshow[data.row.data.IMAGE - 1]}
        alt={data.row.data.BANKNAME}
        height={40}
      />
      // <img src={cibc} alt={`${data.row.data.IMAGE}`} height={40} />
    );
}

// function cellRender(data) {
//   console.log("sent", data);
//   return <img src={`${data}`} alt="BANK" height={40} />;
// }

export default function BankAccountSummary() {
  const { user } = useAuth();
  //console.log({ user });
  return (
    <BankAccountSummaryx
      clientCode={user.clientCode}
      FlinksConnectDomainRetail={user.FlinksConnectDomainRetail}
      UserCode={user.UserCode}
      UserPassword={user.UserPassword}
    />
  );
}

function renderDetail(props) {
  console.log("unique", props.data.UNIQUEID, "range: ", pageoption);
  const uniqueid = props.data.UNIQUEID;
  return <BankTransactions rowid={uniqueid} sendit={pageoption} />;
}
//<MasterDetail enabled={true} component={bankTransactions} />

//  <img
// className="systempic"
// src={cibc}
// alt="Iron Reservations "
// height="200"
// width="200"
// />

// {this.state.bankNameToAuthorize && ( // conditionally render component
//   <AuthorizeSpecificBank bankName={this.state.bankNameToAuthorize} />
// )}

function AuthorizeSpecificBankx(props) {
  console.log("in authorizex", { props });
  const [completedAuth, setcompletedAuth] = useState(false);
  const [mydata, setmydata] = useState({
    institution: "",
    loginId: "",
    requestId: "",
    url: "",
  });
  const srcname = `${props.FlinksConnectDomainRetail}Credential/${props.sentBank}`;
  //    changesrcname(`${props.FlinksConnectDomainRetail}Credential/${thisbank}`);
  const [myclientcode, setclientcode] = useState(props.clientCode);

  const handleIframeLoad = () => {
    console.log("Iframe loaded");
    // Perform any additional logic here
  };
  const handleIframError = () => {
    console.log("there was an error");
  };

  useEffect(() => {
    window.addEventListener("message", onPostMessage);
    return function cleanup() {
      window.removeEventListener("message", onPostMessage);
    };
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (mydata.requestId !== "") {
      PostAccount(
        myclientcode,
        mydata.institution,
        mydata.loginId,
        mydata.requestId,
        mydata.url
      );
    }
  }, [mydata, myclientcode]);

  const closeWin = (e) => {
    setcompletedAuth(true);
    //console.log("clicked now what");
    ValidateBanks(props.UserCode, props.UserPassword);
  };
  const onPostMessage = (event) => {
    console.log(event.data);

    if (event.data.step === "REDIRECT") {
      setmydata({
        institution: event.data.institution,
        loginId: event.data.loginId,
        requestId: event.data.requestId,
        step: event.data.step,
        url: event.data.url,
      });
    }
  };

  //

  return (
    <>
      {completedAuth !== true && (
        <div className="content-block dx-card responsive-paddings">
          <div>
            <h6>Banking Authorizations</h6>
            <button
              type="submit"
              className="buttonsPage"
              id="logoutbutton"
              onClick={() => {
                closeWin();
              }}
            >
              Authorization Complete
            </button>
          </div>
          <div className="dashed-border">
            <iframe
              title='Authorize"'
              width={766}
              height={500}
              src={srcname}
              onLoad={handleIframeLoad}
              onError={handleIframError}
              sandbox="allow-same-origin allow-scripts"
            ></iframe>
          </div>
        </div>
      )}
    </>
  );
}

function AuthorizeSpecificBank(props) {
  const { user } = useAuth();
  console.log({ props });
  const { bankNamex } = props; //.sentBank === undefined ? 4 : props.sentBank;
  var bankName;
  if (bankNamex === undefined) {
    bankName = 4;
  } else {
    bankName = bankNamex;
  }

  console.log("auth", bankName, "sent:", props.sentBank);
  return (
    <AuthorizeSpecificBankx
      clientCode={user.clientCode}
      FlinksConnectDomainRetail={user.FlinksConnectDomainRetail}
      UserCode={user.UserCode}
      UserPassword={user.UserPassword}
      sentBank={bankName}
    />
  );
}
//`${process.env.REACT_APP_BASE_URL}/validateuser
//src="https://toolbox-iframe.private.fin.ag/?demo=true&redirectUrl=https://flinks.com/contact/thank-you&innerRedirect=true&theme=light&consentEnable=true&customerName=FinTech&backgroundColor=f7f7f7&foregroundColor1=000000&desktopLayout=true&headerEnable=false&institutionFilterEnable=true&enhancedMFA=true&withMFAQuestions"
