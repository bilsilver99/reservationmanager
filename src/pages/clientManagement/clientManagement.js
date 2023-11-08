import React, { useEffect } from "react";
import Scheduler, { View } from "devextreme-react/scheduler";
import Form, { Item, ButtonItem, GroupItem } from "devextreme-react/form";
import SelectBox from "devextreme-react/select-box";
import "./clientManagement.scss";
import { useAuth } from "../../contexts/auth";
import { fetchThisClientData, getClients } from "./clientManagementData";
import { Button } from "devextreme-react/button";
import ClientBankAccounts from "../clientBankAccounts/clientBankAccounts";

const clients = ["sam", "lou"];
const ClientManagement = () => {
  const { user, updateUser } = useAuth();
  const [currentClientCode, setCurrentClientCode] = React.useState("RATTI");

  // const [allowAdding, setAllowAdding] = React.useState(true);
  // const [allowDeleting, setAllowDeleting] = React.useState(true);
  // const [allowUpdating, setAllowUpdating] = React.useState(false);
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
  const [showInfo, setShowInfo] = React.useState(true);
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
  const buttonOptions2 = {
    text: "Bank Accounts",
    type: "success",
    useSubmitBehavior: true,
  };
  const rules = { X: /[02-9]/ };

  const phonesEditorOptions = {
    mask: "(X00) 000-0000",
    maskRules: rules,
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
      console.log("new client code in user", user.thisClientCode);
    })();
    //getemployee(service.getEmployee());

    return () => {
      // this now gets called when the component unmounts
    };
  }, [currentClientCode]);

  const setForm = () => {
    setShowBanks(true);
    setShowInfo(false);
  };
  const setForm2 = () => {
    setShowBanks(false);
    setShowInfo(true);
  };
  useEffect(() => {
    (async () => {
      // Fetching customer data
      const resultCustomerdata = await getClients();
      setCustomerList(resultCustomerdata.data);
      //console.log("Customer", resultCustomerdata.data);
      setKey(resultCustomerdata.data.key);
    })();

    return () => {};
  }, [user]);

  return (
    <>
      <p className={"content-block"}>Client Information</p>
      <div className="content-block dx-card responsive-paddings">
        <div className="app">
          <div style={{ display: "flex", alignItems: "left" }}>
            <p style={{ marginRight: "10px" }}>Client:</p>
            <SelectBox
              style={{ width: "200px" }}
              items={customerList}
              valueExpr="label"
              displayExpr="label"
              value={currentClientCode}
              //value={currentEmployeeName}
              onValueChanged={setClientData}
              //onValueChanged={(e) => setCurrentEmployeeName(e.value)}
            />
            <p>&nbsp;&nbsp;&nbsp;{customerName}&nbsp;&nbsp;&nbsp;</p>
            <Button
              text="Info"
              style={{ marginRight: "10px", marginTop: "10px" }}
              onClick={setForm2}
            />
            <Button
              text="Bank Accounts"
              style={{ marginRight: "10px", marginTop: "10px" }}
              onClick={setForm}
            />
          </div>
        </div>
        <div className="content-block dx-card responsive-paddings">
          {showInfo && (
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
          )}
          {showBanks && <ClientBankAccounts clientCode={currentClientCode} />}
        </div>
      </div>
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
