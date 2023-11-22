import React, { useEffect } from "react";
import Scheduler, { View } from "devextreme-react/scheduler";
import Form, { Item, ButtonItem, GroupItem } from "devextreme-react/form";
import SelectBox from "devextreme-react/select-box";
import "./clientManagement.scss";
import { useAuth } from "../../contexts/auth";
import {
  fetchThisClientData,
  getClients,
  updateClient,
} from "./clientManagementData";
import { Button } from "devextreme-react/button";
import ClientBankAccounts from "./clientBankAccounts/clientBankAccounts";
import DebtSummary from "./clientBankAccounts/debtSummary";
import ClientTransactions from "./clientBankAccounts/clientTransactions";
import Interest from "./clientBankAccounts/interest";
//import ClientImports from "./clientBankAccounts/clientExcelImports";
import CustomerProfile from "./clientBankAccounts/customerProfile";

import ImportTransactions from "./clientBankAccounts/importTransactions";
//import TestImport from "./clientBankAccounts/testImport";
import BankCSVImport from "./clientBankAccounts/bankCSVImport";
//import { set } from "react-hook-form";
//import { Height } from "devextreme-react/chart";
//import ClientOwners from "./clientOwners";
//import { isWithinInterval, set } from "date-fns";
import ClientOwners from "./clientOwners";

import notify from "devextreme/ui/notify";
import dxDateBox from "devextreme/ui/date_box";
import { set } from "date-fns";

const clients = ["sam", "lou"];
const ClientManagement = () => {
  const [sharedValue, setSharedValue] = React.useState();

  const { user, updateUser } = useAuth();
  const [currentClientCode, setCurrentClientCode] = React.useState("RATTI");

  // const [allowAdding, setAllowAdding] = React.useState(true);
  // const [allowDeleting, setAllowDeleting] = React.useState(true);
  // const [allowUpdating, setAllowUpdating] = React.useState(false);
  const [thisWidth, setThisWidth] = React.useState("100%");

  const [key, setKey] = React.useState(Math.random());
  const [customerData, setCustomerData] = React.useState(clients); // this is the aray of customers
  const [customerList, setCustomerList] = React.useState([]); // this is the aray of customers
  const [customerName, setCustomerName] = React.useState("");
  const [startdate, setStartDate] = React.useState("");
  const [enddate, setEndDate] = React.useState("");
  const [processDates, setProcessDates] = React.useState("");
  const setClientData = async (e) => {
    //console.log("value of e ", e.value);
    if (e.value === null || e.value === undefined || e.value === "") return;
    setCurrentClientCode(e.value);
  };
  const [showBanks, setShowBanks] = React.useState(false);
  const [showBanksForm, setShowBanksForm] = React.useState(false);
  const [showInfo, setShowInfo] = React.useState(false);

  const [showDashboard, setShowDashboard] = React.useState(false);
  const [showOwners, setShowOwners] = React.useState(false);
  const [showAssets, setShowAssets] = React.useState(false);
  const [showInvestments, setShowInvestments] = React.useState(false);

  const [showTransfers, setFormTransfers] = React.useState(false);
  const [showInterest, setShowInterest] = React.useState(false);

  const [showDebtSummary, setFormDebtSummary] = React.useState(false);
  const [showProgress, setFormProgress] = React.useState(false);
  const [showNetWorth, setFormNetWorth] = React.useState(false);

  const [ShowTransactions, setShowTransactions] = React.useState(false);
  const [ShowImport, setShowImport] = React.useState(false);
  const [ShowProcessImport, setShowProcessImport] = React.useState(false);

  const [showPrior, setPrior] = React.useState(true);

  const ClientUpdate = (e) => {
    console.log("client update", customerData);
    updateClient(currentClientCode, customerData);
    notify(
      {
        message: "You have submitted the form",
        position: {
          my: "center top",
          at: "center top",
        },
      },
      "success",
      3000
    );
    e.preventDefault();
  };

  const buttonOptions = {
    text: "Update",
    type: "success",
    useSubmitBehavior: true,
  };

  useEffect(() => {
    if (
      currentClientCode === null ||
      currentClientCode === undefined ||
      currentClientCode === ""
    )
      return;
    (async () => {
      //console.log("current client code: " & currentClientCode);
      const result = await fetchThisClientData(currentClientCode);
      //console.log("passsed back", result);
      setCustomerData({
        ClientCode: result.CLIENTCODE,
        Name: result.NAME,
        AddressLineOne: result.ADDRESSLINEONE,
        AddressLineTwo: result.ADDRESSLINETWO,
        AddressLineThree: result.ADDRESSLINETHREE,
        AddressLineFour: result.ADDRESSLINEFOUR,
        Country: result.COUNTRY,
        PostalZip: result.POSTALZIP,
        UniqueID: result.UNIQUEID,
        StartDate: result.STARTDATE,
        EndDate: result.ENDDATE,
      });
      updateUser({ thisClientcode: result.CLIENTCODE });
      setCustomerName(result.NAME);
      setStartDate(result.STARTDATE);
      setEndDate(result.ENDDATE);
      //if (startdate !== null && startdate !== undefined && startdate !== "") {
      setProcessDates(
        "Currently Processing from " +
          result.STARTDATE +
          " to " +
          result.ENDDATE
      );
      //}
      //console.log("new client code in user", user.thisClientCode);
    })();
    //getemployee(service.getEmployee());

    return () => {
      // this now gets called when the component unmounts
    };
  }, [currentClientCode]);

  const setallflags = () => {
    setShowInfo(false);
    setShowOwners(false);
    setShowBanks(false);
    setShowAssets(false);
    setShowInvestments(false);
    setShowDashboard(false);
    setFormDebtSummary(false);
    setShowTransactions(false);
    setShowImport(false);
    setShowProcessImport(false);
    setShowBanksForm(false);
    setShowInterest(false);
  };

  const setForm1 = () => {
    setallflags();
    setShowInfo(true);
    setShowOwners(true);
  };
  const setForm2 = () => {
    setallflags();
    setShowBanks(true);
    setShowBanksForm(true);
  };
  // const setForm3 = () => {
  //   setallflags();
  //   setShowOwners(true);
  // };
  const setForm4 = () => {
    setallflags();
    setShowAssets(true);
  };
  const setForm5 = () => {
    setallflags();
    setShowInvestments(true);
  };
  const setForm6 = () => {
    setallflags();
    setShowDashboard(true);
  };

  const setShowProgress = () => {
    setallflags();
    setShowDashboard(true);
  };
  const setShowDebtSummary = () => {
    setallflags();
    setShowDashboard(true);
    setFormDebtSummary(true);
  };
  const setShowNetWorth = () => {
    setallflags();
    setShowDashboard(true);
  };

  const setFormTransactions = () => {
    setallflags();
    setShowBanks(true);
    setShowBanksForm(false);
    setShowTransactions(true);
  };
  const setFormImport = () => {
    setallflags();
    setShowBanks(true);
    setShowBanksForm(false);
    setShowImport(true);
    setShowProcessImport(false);
  };
  const setFormProcessImports = () => {
    setallflags();
    setShowBanks(true);
    setShowBanksForm(false);
    setShowProcessImport(true);
  };
  const setFormInterest = () => {
    setallflags();
    setShowBanks(true);
    setShowBanksForm(false);
    setShowInterest(true);
  };
  // const toggleDebtSummary = () => {
  //   setShowDebtSummary((prevState) => !prevState);
  // };

  useEffect(() => {
    (async () => {
      // Fetching customer data
      const resultCustomerdata = await getClients();
      setCustomerList(resultCustomerdata.data);
      //console.log("Customer", resultCustomerdata.data);
      setKey(resultCustomerdata.data.key);
    })();
    setThisWidth("70%");

    return () => {};
  }, [user]);

  //<div className="content-block2 dx-card responsive-paddings top-section">

  return (
    <>
      <div className="responsive-paddingsx my-top-section">
        <div style={{ display: "flex", alignItems: "left" }}>
          <p style={{ marginRight: "10px" }}>Client:</p>
          <SelectBox
            className="white-text-selectbox"
            style={{ width: "200px", height: "40px", marginTop: "5px" }}
            items={customerList}
            valueExpr="label"
            displayExpr="label"
            value={currentClientCode}
            searchEnabled={true}
            //value={currentEmployeeName}
            onValueChanged={setClientData}
            //onValueChanged={(e) => setCurrentEmployeeName(e.value)}
          />
          <p>
            &nbsp;&nbsp;&nbsp;{customerName}&nbsp;&nbsp;&nbsp;{processDates}
          </p>
        </div>
      </div>

      <div>
        <div className="app2 " style={{ display: "flex", alignItems: "left" }}>
          <div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(6, auto)",
                gap: "10px",
              }}
            >
              <Button text="Info" onClick={setForm1} />
              <Button text="Bank Accounts" onClick={setForm2} />
              <Button text="Assets" onClick={setForm4} />
              <Button text="Investments" onClick={setForm5} />
              <Button text="Dashboard" onClick={setForm6} />
              {showBanks && (
                <>
                  <div></div>
                  <Button text="Import" onClick={setFormImport} />
                  <Button text="Transfers" onClick={setFormTransfers} />
                  <Button text="Interest" onClick={setFormInterest} />
                  <Button text="Transactions" onClick={setFormTransactions} />

                  {/* Empty divs for alignment */}
                  <div></div>
                  <div></div>
                  <div></div>
                </>
              )}
              {showDashboard && (
                <>
                  <div></div>
                  <Button text="Progress" onClick={setShowProgress} />
                  <Button text="Debt Summary" onClick={setShowDebtSummary} />
                  <Button text="Net Worth" onClick={setShowNetWorth} />
                  {/* Empty divs for alignment */}
                  <div></div>
                  <div></div>
                  <div></div>
                </>
              )}
            </div>
          </div>
        </div>

        {showInfo && (
          <>
            <CustomerProfile clientCode={currentClientCode} />
            <ClientOwners clientCode={currentClientCode} />
          </>
        )}
      </div>
      {showBanksForm && (
        <>
          <p></p>
          <ClientBankAccounts clientCode={currentClientCode} />
        </>
      )}
      {showDebtSummary && (
        <>
          <p></p>
          <DebtSummary
            clientCode={currentClientCode}
            thisWidth={thisWidth}
            showPrior={showPrior}
          />
        </>
      )}
      {ShowTransactions && (
        <>
          <p></p>
          <ClientTransactions clientCode={currentClientCode} />
        </>
      )}
      {ShowImport && (
        <>
          <BankCSVImport
            clientCode={currentClientCode}
            sharedValue={sharedValue}
            onValueChange={setSharedValue}
          />
          <ImportTransactions
            clientCode={currentClientCode}
            sharedValue={sharedValue}
          />
        </>
      )}
      {showInterest && <Interest clientCode={currentClientCode} />}
    </>
  );
};
export default ClientManagement;
// )}
// {ShowProcessImport && (
//   <ImportTransactions clientCode={currentClientCode} />
// )}
