import React from "react";
import "./home.css";
import beach from "./beach.png";
import scheduling from "../images/scheduling.jpg";
//import beach2 from "../images/beach2.jpg";
import globe from "../images/globe.png";
//import logo from "../images/iron.webp";

function Card() {
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
