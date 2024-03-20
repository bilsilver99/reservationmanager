import React, { useState, useEffect, useCallback } from "react";
import "./profile.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

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
//import DateBox from "devextreme-react/date-box";
import TextBox from "devextreme-react/text-box";
import { Button } from "devextreme-react/button";
import { fetchThisClientData } from "../clientManagementData";
import { updateInterest, resetInterest } from "./interestData";
import ClientUnpostedInterestTransactions from "./clientUnpostedInterestTransactions";
import ClientPostedInterestTransactions from "./clientPostedInterestTransactions";

import { getBanks } from "./clientBanksAccountsData";
import ClientInterestTransactions from "./clientInterestTransactions";

const Interestx = (props) => {
  //console.log(props);

  const [isLoading, setIsLoading] = useState(false);

  const [myClientCode, setClientCode] = useState(props.sentClientCode);
  const [bankAccountList, setBankAccountList] = useState([]);
  const MySwal = withReactContent(Swal);

  //const { register, handleSubmit, errors } = useForm();

  const [currentBankAccount, setCurrentBankAccount] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const [Segment, setSegment] = useState("");
  const [startYear, setStartdate] = useState("");
  const [endYear, setEnddate] = useState("");
  const [allAccounts, setAllAccounts] = useState(false);
  const [monthYearList, setMonthYearList] = useState([]);
  const [startPeriod, setStartPeriod] = useState("");
  const [endPeriod, setEndPeriod] = useState("");
  const [showInterest, setShowInterest] = useState(false);

  const handleBankAccountChange = (e) => {
    setCurrentBankAccount(e.value);
    setRefreshKey((prevKey) => prevKey + 1);
    console.log("reset the refesh key", refreshKey);
  };

  const ProcessInterest = async (e) => {
    try {
      // Wait for the updateInterest routine to finish
      setIsLoading(true);
      await updateInterest(
        myClientCode,
        currentBankAccount,
        Segment,
        startPeriod,
        endPeriod,
        allAccounts
      );

      // After updateInterest resolves, show the success message
      MySwal.fire({
        icon: "success",
        title: "Interest Processed",
        text: "The Interest has been processed successfully.",
      });
      setRefreshKey((oldKey) => oldKey + 1);
    } catch (error) {
      // Handle any errors that occur during updateInterest
      console.error("Error processing interest:", error);
      // Optionally show an error message to the user
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "There was an issue processing the interest.",
      });
    } finally {
      // Set loading to false regardless of outcome
      setIsLoading(false);
      ShowInterestTransactions();
    }
  };

  const ResetInterest = async (e) => {
    try {
      // Wait for the updateInterest routine to finish
      await resetInterest(
        myClientCode,
        currentBankAccount,
        Segment,
        startPeriod,
        endPeriod,
        allAccounts
      );

      // After updateInterest resolves, show the success message
      MySwal.fire({
        icon: "success",
        title: "Interest Reset",
        text: "The Interest has been Reset successfully.",
      });
      setRefreshKey((oldKey) => oldKey + 1);
    } catch (error) {
      // Handle any errors that occur during updateInterest
      console.error("Error processing interest:", error);
      // Optionally show an error message to the user
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "There was an issue processing the interest.",
      });
    }
  };
  // const handleFieldDataChange = (e) => {
  //   setFormData({ ...formData, [e.dataField]: e.value });
  // }; // Initialize other fields

  useEffect(() => {
    console.log("client code value", myClientCode);
    fetchThisClientData(myClientCode).then((data) => {
      console.log("client data", data);
      //setStartdate(data.STARTDATE);
      //setEnddate(data.ENDDATE);

      setStartPeriod(data.startinterestperiod);
      setEndPeriod(data.endinterestperiod);
    });
    getBanks(myClientCode) // call the function to fetch data
      .then((data) => {
        //console.log("bank accounts ", data.data);
        setBankAccountList(data.data);
        //console.log("bank accounts ", bankAccountList);
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the transaction group data:",
          error
        );
      });
    generateMonthYearList();
    //console.log("month year list outside", monthYearList);
  }, []);

  const generateMonthYearList = () => {
    const monthYears = [];
    for (let year = 2030; year >= 2020; year--) {
      for (let month = 12; month >= 1; month--) {
        monthYears.push(`${year}-${month.toString().padStart(2, "0")}`);
      }
    }
    setMonthYearList(monthYears);
    return monthYears;
  };

  const handleSegmentChange = (e) => {
    setSegment(e.value);
  };

  const ShowInterestTransactions = () => {
    setShowInterest((currentShowInterest) => !currentShowInterest);
  };

  const handleMappingUpdated = () => {
    setShowInterest(false);
    // Do something with the value, like updating the state
  };
  return (
    <>
      {isLoading && (
        <div className="spinner-container">
          {isLoading && (
            <>
              <p>Processing please wait &nbsp;&nbsp;</p>
              <FontAwesomeIcon
                icon={faSpinner}
                spin
                className="large-spinner"
              />
            </>
          )}
        </div>
      )}

      <p>&nbsp;&nbsp;&nbsp;Interest Calculations</p>
      <div className="red-color responsive-paddingsx">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "50%",
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
              showClearButton={true}
              onValueChanged={handleBankAccountChange}
            />
          </label>
          <label>
            Segment:
            <TextBox
              value={Segment}
              onValueChanged={handleSegmentChange}
              className="white-text-selectbox"
              style={{ width: "50px", height: "30px", marginTop: "5px" }}
            />
          </label>
          <label>
            Period:
            <SelectBox
              className="white-text-selectbox"
              style={{ width: "100px", height: "30px", marginTop: "5px" }}
              items={monthYearList}
              value={startPeriod}
              acceptCustomValue={true}
              onValueChanged={(e) => setStartPeriod(e.value)}
            />
          </label>
          <label>
            End Period:
            <SelectBox
              className="white-text-selectbox"
              style={{ width: "100px", height: "30px", marginTop: "5px" }}
              items={monthYearList}
              value={endPeriod}
              acceptCustomValue={true}
              onValueChanged={(e) => setEndPeriod(e.value)}
            />
          </label>

          <label>
            All Accounts:
            <div>
              <input
                style={{
                  width: "50px",
                  height: "20px",
                  marginTop: "5px",
                  marginRight: "5px",
                }}
                type="checkbox"
                value={allAccounts}
                onChange={(e) => setAllAccounts(e.target.checked)}
              />
            </div>
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
      <ClientUnpostedInterestTransactions
        myClient={myClientCode}
        Key={refreshKey}
        bankaccount={currentBankAccount}
      />

      <div>
        {showInterest && (
          <div className="overlay">
            <ClientPostedInterestTransactions
              clientCode={myClientCode}
              onMappingUpdated={handleMappingUpdated}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default function Interest(props) {
  //const { user } = useAuth();
  //console.log("props coming in", props);
  return <Interestx sentClientCode={props.clientCode} />;
}
