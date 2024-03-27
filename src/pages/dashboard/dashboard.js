import React, { useState } from "react";
import "./dashboard.scss";
import DebtSummary from "../clientManagement/clientBankAccounts/debtSummary";
//import logo from "../images/iron.webp";
import { useAuth } from "../../contexts/auth";
import { PropertiesPanel } from "devextreme-react/diagram";
import DateBox from "devextreme-react/date-box";

function Card() {
  return (
    <div className="card highlight-box">
      <div className="card-top">
        <h4>Progress </h4>
      </div>
    </div>
  );
}
function Card2({ thisUser, thisWidthOut, showPrior }) {
  //console.log("thisUser", { thisUser }, "thisWidthOut", thisWidthOut);
  return (
    <div>
      <h4>Debt Summary </h4>
      <DebtSummary
        clientCode={thisUser}
        thisWidth={thisWidthOut}
        showPrior={showPrior}
      />
    </div>
  );
}

//        <DebtSummary clientCode={thisUser} />

function Card3() {
  return (
    <div className="card highlight-box">
      <div className="card-top">
        <h5>Net Worth </h5>
      </div>
    </div>
  );
}
const Dashboard = () => {
  //const [thisUser, setThisUser] = React.useState(null); // <-- initialize state with `null` instead of `[]` or `{}

  const { user } = useAuth();
  //setThisUser("RANJAN A&T");
  const [thisWidthSent, setwidth] = useState("50%");
  const [userSent, setUser] = useState(user.thisClientcode);
  const [showPrior, setPrior] = useState(false);
  console.log("userSent", userSent, "thisWidthSent", thisWidthSent);
  const [startdate, setStartdate] = useState(null);
  const [enddate, setEnddate] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0); // for dates to refresh grid when date changed
  const handleStartDateChange = (e) => {
    setStartdate(e.value);
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const handleEndDateChange = (e) => {
    setEnddate(e.value);
    setRefreshKey((prevKey) => prevKey + 1);
  };
  return (
    <>
      <div className="App">
        <div className="right-container ">
          <Card />
        </div>
        <div className="right-container">
          <Card2
            thisUser={userSent}
            thisWidthOut={thisWidthSent}
            showPrior={showPrior}
          />
        </div>
        <div className="right-container">
          <Card3 />
        </div>
      </div>
      <div>
        <label>
          Start Date (MM/DD/YYYY):
          <DateBox
            type="date"
            value={startdate}
            onValueChanged={handleStartDateChange}
          />
        </label>
      </div>
      <div>
        <label>
          End Date (MM/DD/YYYY):
          <DateBox
            type="date"
            value={enddate}
            onValueChanged={handleEndDateChange}
          />
        </label>
      </div>
    </>
  );
};

export default Dashboard;
//<Card2 />
//<Card3 />
