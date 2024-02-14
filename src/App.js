import React from "react";
//import { Router, Route, Switch } from "react-router-dom";
//import { Container } from "reactstrap";

//import Loading from "./components/Loading";
//import NavBar from "./components/NavBar";
// import Footer from "./components/Footer";
// import Home from "./views/Home";
// import Profile from "./views/Profile";
// import ExternalApi from "./views/ExternalApi";
import { useAuth0 } from "@auth0/auth0-react";
//import history from "./utils/history";
import LoadPanel from "devextreme-react/load-panel";
import AppLogged from "./AppLogged";
// styles
import "./App.css";

// fontawesome
import initFontAwesome from "./utils/initFontAwesome";
initFontAwesome();

const App = () => {
  const { isLoading, error } = useAuth0();
  //console.log("App.js: isLoading: ", isLoading);

  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  if (isLoading) {
    return <LoadPanel />;
  }

  return <AppLogged />;
};

export default App;
