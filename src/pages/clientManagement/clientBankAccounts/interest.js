import React, { useState, useEffect, useCallback } from "react";
import "./profile.scss";
import "devextreme-react/text-area";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Form, {
  Item,
  ButtonItem,
  GroupItem,
  Lookup,
  EmptyItem,
} from "devextreme-react/form";
import SelectBox from "devextreme-react/select-box";
import DateBox from "devextreme-react/date-box";
import TextBox from "devextreme-react/text-box";
import { Button } from "devextreme-react/button";
import { fetchThisClientData } from "../clientManagementData";

import { getBanks } from "./clientBanksAccountsData";

const Interestx = (props) => {
  console.log(props);

  const [myClientCode, setClientCode] = useState(props.sentClientCode);
  const [bankAccountList, setBankAccountList] = useState([]);
  const MySwal = withReactContent(Swal);

  //const { register, handleSubmit, errors } = useForm();

  const [currentBankAccount, setCurrentBankAccount] = useState("");
  const [Segment, setSegment] = useState("");
  const [startYear, setStartdate] = useState("");
  const [endYear, setEnddate] = useState("");
  const [allAccounts, setAllAccounts] = useState(false);
  const handleStartDateChange = (e) => {
    setStartdate(e.value);
  };

  const handleEndDateChange = (e) => {
    setEnddate(e.value);
  };

  const handleBankAccountChange = (e) => {
    setCurrentBankAccount(e.value);
  };

  const ProcessInterest = (e) => {
    MySwal.fire({
      icon: "success",
      title: "Interest Processed",
      text: "The Interest has been processed successfully.",
    });
  };
  const ResetInterest = (e) => {
    MySwal.fire({
      icon: "success",
      title: "Interest Processed",
      text: "The Interest has been processed successfully.",
    });
  };
  // const handleFieldDataChange = (e) => {
  //   setFormData({ ...formData, [e.dataField]: e.value });
  // }; // Initialize other fields

  useEffect(() => {
    console.log("client code value", myClientCode);
    fetchThisClientData(myClientCode).then((data) => {
      console.log("client data", data);
      setStartdate(data.STARTDATE);
      setEnddate(data.ENDDATE);
    });
    getBanks(myClientCode) // call the function to fetch data
      .then((data) => {
        console.log("bank accounts ", data);
        setBankAccountList(data.data);
        console.log("bank accounts ", bankAccountList);
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the transaction group data:",
          error
        );
      });
  }, []);

  // const setAccountData = (e) => {
  //   setCurrentBankAccount(e.value);
  // };
  // const setSegmentData = (e) => {
  //   setCurrentSegment(e.value);
  // };

  return (
    <>
      <p>&nbsp;&nbsp;&nbsp;Interest Calculations</p>
      <div className="red-color responsive-paddingsx">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "65%",
          }}
        >
          <label>
            Bank Account:
            <SelectBox
              className="white-text-selectbox"
              style={{ width: "250px", height: "30px", marginTop: "5px" }}
              items={bankAccountList}
              valueExpr="BANKACCOUNTNUMBER"
              displayExpr={(item) =>
                item
                  ? `${item.BANKNAME} - ${item.BANKACCOUNTNUMBER} - ${item.ACCOUNTDESCRIPTION}`
                  : ""
              }
              value={currentBankAccount}
              //searchEnabled={true}
              //value={currentEmployeeName}
              onValueChanged={handleBankAccountChange}
              //onValueChanged={(e) => setCurrentEmployeeName(e.value)}
            />
          </label>
          <label>
            Segment:
            <TextBox
              value={Segment}
              className="white-text-selectbox"
              style={{ width: "50px", height: "30px", marginTop: "5px" }}
            />
          </label>

          <label>
            Start Date:
            <DateBox
              style={{ width: "150px", height: "30px", marginTop: "5px" }}
              type="date"
              value={startYear}
              onValueChanged={handleStartDateChange}
            />
          </label>

          <label>
            End Date:
            <DateBox
              style={{ width: "150px", height: "30px", marginTop: "5px" }}
              type="date"
              value={endYear}
              onValueChanged={handleEndDateChange}
            />
          </label>
          <label style={{ width: "150px", height: "30px", marginTop: "30px" }}>
            All Accounts:
            <input
              type="checkbox"
              value={allAccounts}
              onChange={(e) => setAllAccounts(e.target.checked)}
            />
          </label>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "34%",
          }}
        >
          <Button
            text="Process Interest"
            onClick={ProcessInterest}
            style={{ width: "250px", height: "30px", marginTop: "30px" }}
          ></Button>
          <Button
            text="Reset Interest"
            onClick={ResetInterest}
            style={{ width: "250px", height: "30px", marginTop: "30px" }}
          ></Button>
        </div>
      </div>
    </>
  );
};

export default function Interest(props) {
  //const { user } = useAuth();
  return <Interestx sentClientCode={props.clientCode} />;
}
