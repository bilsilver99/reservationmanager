import React from "react";
import "./home.css";
import beach from "./beach.png";
import scheduling from "../images/scheduling.jpg";
//import beach2 from "../images/beach2.jpg";
import globe from "../images/globe.png";
//import logo from "../images/iron.webp";

import { useAuth } from "../../contexts/auth";

function Card() {
  const { user } = useAuth();
  return (
    <div className="card">
      <div className="card-top">
        <h2>Wealth Management</h2>
      </div>
      <img
        className="systempic"
        src={beach}
        alt="Beach Street Wealth "
        height="200"
        width="250"
      />
      {user.administrator === "X" && (
        <>
          <h5>
            Please Contact Beach Street Wealth Management to complete your
            registration process. When the registration process is complete, you
            can return to this page.
          </h5>
          <h5> Thank You - The Beachstreet Wealth Support Group</h5>
        </>
      )}
    </div>
  );
}
function Card2() {
  return (
    <div className="card">
      <div className="card-top">
        <h2>Interactive Account Management</h2>
      </div>
      <p className="ParagraphSpace">
        Real Time Investment/Bank Account Information
      </p>
      <img
        className="systempic"
        src={scheduling}
        alt="Iron Reservations "
        height="200"
        width="200"
      />
    </div>
  );
}
function Card3() {
  return (
    <div className="card">
      <div className="card-top">
        <h2>Global Account Access</h2>
      </div>
      <p className="ParagraphSpace">
        World-wide access to your account information
      </p>
      <img
        className="globepic"
        src={globe}
        alt="Iron Reservations "
        height="200"
        width="200"
      />
    </div>
  );
}
const home = () => {
  return (
    <div className="App">
      <div className="right-container">
        <Card />
      </div>
    </div>
  );
};

export default home;
//<Card2 />
//<Card3 />
