import React, { useEffect } from "react";
import Scheduler, { View } from "devextreme-react/scheduler";
import Form, { Item, ButtonItem, GroupItem } from "devextreme-react/form";
import SelectBox from "devextreme-react/select-box";
import "./clientManagement.scss";
import { useAuth } from "../../contexts/auth";
import { fetchThisClientData, getClients } from "./clientManagementData";
import { Button } from "devextreme-react/button";
import ClientBankAccounts from "./clientBankAccounts/clientBankAccounts";
import DebtSummary from "./clientBankAccounts/debtSummary";
import ClientTransactions from "./clientBankAccounts/clientTransactions";
import ClientImports from "./clientBankAccounts/clientImports";
//import { set } from "react-hook-form";
//import { Height } from "devextreme-react/chart";
//import ClientOwners from "./clientOwners";
import { set } from "date-fns";

const clients = ["sam", "lou"];
const ClientManagement = () => {
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
  const [showInterest, setFormInterest] = React.useState(false);

  const [showDebtSummary, setFormDebtSummary] = React.useState(false);
  const [showProgress, setFormProgress] = React.useState(false);
  const [showNetWorth, setFormNetWorth] = React.useState(false);

  const [ShowTransactions, setShowTransactions] = React.useState(false);
  const [ShowImport, setShowImport] = React.useState(false);

  const [showPrior, setPrior] = React.useState(true);

  const ClientUpdate = (event) => {
    // updateCompany(props.companynumber, companyValues);
    // notify(
    //   {
    //     message: "You have submitted the form",
    //     position: {
    //       my: "center top",
    //       at: "center top",
    //     },
    //   },
    //   "success",
    //   3000
    // );
    event.preventDefault();
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
      });
      updateUser({ thisClientcode: result.CLIENTCODE });
      setCustomerName(result.NAME);
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

  return (
    <>
      <p> </p>
      <div className="content-block2 dx-card responsive-paddings">
        <div className="app">
          <div style={{ display: "flex", alignItems: "left" }}>
            <p style={{ marginRight: "10px" }}>Client:</p>
            <SelectBox
              style={{ width: "200px", height: "40px" }}
              items={customerList}
              valueExpr="label"
              displayExpr="label"
              value={currentClientCode}
              searchEnabled={true}
              //value={currentEmployeeName}
              onValueChanged={setClientData}
              //onValueChanged={(e) => setCurrentEmployeeName(e.value)}
            />
            <p>&nbsp;&nbsp;&nbsp;{customerName}&nbsp;&nbsp;&nbsp;</p>
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
                )}{" "}
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
        </div>
        {showInfo && (
          <>
            <p></p>
            <div style={{ display: "flex", alignItems: "top" }}>
              <div style={{ flexGrow: 1, marginRight: "10px" }}>
                <div className="content-block2 dx-card responsive-paddings">
                  <Form id="form" formData={customerData}>
                    <GroupItem colCount={3}>
                      <Item labeltext={"Client Code"} dataField="ClientCode" />
                      <Item
                        dataField="Name"
                        //editorType="dxSelectBox"
                        //editorOptions={this.positionEditorOptions}
                        //validationRules={this.validationRules.position}
                      />
                      <Item
                        dataField="AddressLineOne"
                        //editorOptions={nameEditorOptions}
                      />
                      <Item
                        dataField="AddressLineTwo"
                        //editorType="dxDateBox"
                        //editorOptions={this.hireDateEditorOptions}
                        //validationRules={this.validationRules.hireDate}
                      />
                      <Item
                        dataField="AddressLineThree"
                        //editorType="dxDateBox"
                        //editorOptions={this.birthDateEditorOptions}
                      />
                      <Item dataField="AddressLineFour" />
                      <Item
                        dataField="Country"
                        //colSpan={2}
                        //editorType="dxTextArea"
                        //editorOptions={this.notesEditorOptions}
                      />
                      <Item
                        dataField="PostalZip" //editorOptions={this.phonesEditorOptions}
                      />
                      <Item dataField="UNIQUEID" visible={false} />
                    </GroupItem>
                    <GroupItem>
                      <ButtonItem
                        horizontalAlignment="left"
                        buttonOptions={buttonOptions}
                      />
                    </GroupItem>
                  </Form>
                </div>
              </div>
            </div>
          </>
        )}
        {showBanksForm && (
          <>
            <p></p>
            <ClientBankAccounts clientCode={currentClientCode} />
          </>
        )}
      </div>
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
          <ClientImports clientCode={currentClientCode} />
        </>
      )}
    </>
  );
};
export default ClientManagement;

// const setCurrentValues = async (e) => {
//   if (!e || !e.value) return;
//   console.log("value sent in", e.value);
//   const getmyvalues = await getCurrentOption(e.value);
//   //setCurrentTaskName(getmyvalues.label);
//   setCurrentCellDuration(getmyvalues.duration);
//   setActivityKey(getmyvalues.keyvalue);
//   // Use the values directly
//   console.log(
//     "duration xx ",
//     getmyvalues.duration,
//     "activity key xx",
//     getmyvalues.keyvalue,
//     //"Label xx:",
//     //getmyvalues.label,
//     "actual: ",
//     currentCellDuration
//     //"Name: ",
//     //currentTaskName
//   );
//   setShowScheduler(true); // Show the scheduler when a service is selected
// };

// const setEmployeeName = async (e) => {
//   setCurrentEmployeeName(e.value);
//   console.log("employee name", e.value, "label", e.label);
//   setShowScheduler2(true); // Show the scheduler when a service is selected
// };

//////////////////////////////////////////////////////////
// const handleAppointmentAdded = async (e) => {
//   try {
//     const response = await addAppointment(
//       user.companynumber,
//       currentEmployeeName,
//       e.appointmentData.startDate,
//       e.appointmentData.endDate,
//       e.appointmentData.description,
//       e.appointmentData.text,
//       activitykey
//       //currentCellkey
//     );
//     // handle success (maybe refresh appointments or show a success message)
//   } catch (error) {
//     console.error("Error adding appointment:", error);
//     // handle error (maybe show an error message to the user)
//   }
// };

// const handleAppointmentDeleted = async (e) => {
//   try {
//     // e.appointmentData contains the data of the deleted appointment
//     //const response = await deleteAppointment(e.appointmentData);
//     //console.log("appointment Deleted", e.appointmentData);
//     // handle success
//   } catch (error) {
//     //console.error("Error deleting appointment:", error);
//     // handle error
//   }
// };

// const handleAppointmentUpdated = async (e) => {
//   try {
//     // e.newData contains the updated data
//     // e.oldData contains the data before the update
//     //const response = await updateAppointment(e.newData);
//     //console.log("appointment Updated", e.appointmentData);
//     // handle success
//   } catch (error) {
//     //console.error("Error updating appointment:", error);
//     // handle error
//   }
// };

//////////////////////////////////////////////////////////
//   onContentReady={validateForm}
//   //colCountByScreen={colCountByScreen}
//   id="form"
//   formData={companyValues}
// ></form>
// const [username, setUsername] = React.useState("");
// const [isUserEntered, setIsUserEntered] = React.useState(false); // New state to check if user has been entered
// // ... [your existing useState declarations]

// const handleUserConfirm = () => {
//   if (username) {
//     setIsUserEntered(true); // User has been entered, show the rest of the components
//   }
// };

//DebtSummary clientCode={currentClientCode} />}

// <div>
// {/* First row of buttons */}
// <div style={{ display: "flex", marginBottom: "10px" }}>
//   {" "}
//   {/* Add margin-bottom for spacing between rows */}
//   <Button
//     text="Info"
//     style={{ marginRight: "10px" }}
//     onClick={setForm1}
//   />
//   <Button
//     text="Bank Accounts"
//     style={{ marginRight: "10px" }}
//     onClick={setForm2}
//   />
//   <Button
//     text="Owners"
//     style={{ marginRight: "10px" }}
//     onClick={setForm3}
//   />
//   <Button
//     text="Assets"
//     style={{ marginRight: "10px" }}
//     onClick={setForm4}
//   />
//   <Button
//     text="Investments"
//     style={{ marginRight: "10px" }}
//     onClick={setForm5}
//   />
//   <Button
//     text="Debt Summary"
//     style={{ marginRight: "10px" }}
//     onClick={setForm6}
//   />
// </div>

// {/* Second row of buttons */}
// <div style={{ display: "flex" }}>
//   {showBanks && (
//     <>
//       <Button
//         text="Import"
//         style={{ marginRight: "10px" }}
//         onClick={setFormImport}
//       />

//       <Button
//         text="Transfers"
//         style={{ marginRight: "10px" }}
//         onClick={setFormTransfers}
//       />
//       <Button
//         text="Interest"
//         style={{ marginRight: "10px" }}
//         onClick={setFormInterest}
//       />
//     </>
//   )}
// </div>

//"content-block2 dx-card responsive-paddings">
