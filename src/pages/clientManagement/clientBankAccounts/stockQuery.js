import React, { useContext, useEffect, useState } from "react";

//import ThemeContext from "../context/ThemeContext";
//import Overview from "./Overview";
//import Details from "./Details";
//import Chart from "./Chart";
//import Header from "./Header";
//import StockContext from "../context/StockContext";
//import { fetchStockDetails, fetchQuote } from "../utils/api/stock-api";

export const GetStockQuote = (props) => {
  console.log("props: ", props.thiscode);
  //const { darkMode } = useContext(ThemeContext);

  //const { stockSymbol } = useContext(StockContext);

  const [stockDetails, setStockDetails] = useState({});

  const [quote, setQuote] = useState({});

  return (
    <p>
      this is the initial format of the stock query page&nbsp;&nbsp;
      {props.thiscode}
    </p>
  );
};

// import React from "react";
// import "./index.css";
// //import './App.css';
// //import StockItem from "./StockItem"

// function StockItem(props) {
//   return (
//     <div className="stockItem">
//       <h2>
//         Stock Symbol: {props.symbol} Stock Name: {props.name}
//       </h2>
//       <h3>Stock Price: {props.price}</h3>
//     </div>
//   );
// }

// export class GetStockQuote extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       symbol: "",
//       stockPrice: 0,
//       value: "",
//       stockName: "",
//     };
//     this.handleChange = this.handleChange.bind(this);
//     this.handleSubmit = this.handleSubmit.bind(this);
//   }

//   handleChange(event) {
//     const value = `${event.target.value}`.toUpperCase();
//     this.setState({ value });
//     console.log(value);
//   }

//   handleSubmit(event) {
//     const symbol = this.state.value; // Use this as your symbol
//     this.setState({ symbol });
//     console.log(symbol);
//     const finnhub = require("finnhub");
//     const api_key =
//       finnhub.ApiClient.instance.authentications[
//         `clrjfrhr01qi77sl7rf0clrjfrhr01qi77sl7rfg`
//       ];
//     /////clrjfrhr01qi77sl7rgg
//     api_key.apiKey = "<API Key>";
//     const finnhubClient = new finnhub.DefaultApi();

//     finnhubClient.quote(symbol, (error, data, response) => {
//       console.log(data);
//       this.setState({ stockPrice: data.c });
//     });
//     finnhubClient.companyProfile2(
//       { symbol: symbol },
//       (error, data, response) => {
//         this.setState({ stockName: data.name });
//         console.log(data.name);
//       }
//     );
//     console.log("update was called");
//     console.log(this.state.stockPrice);
//     event.preventDefault();
//   }
//   render() {
//     return (
//       <div>
//         <form onSubmit={this.handleSubmit}>
//           <label>
//             Stock Symbol:
//             <input
//               type="text"
//               value={this.state.value}
//               onChange={this.handleChange}
//             />
//           </label>
//           <input type="submit" value="Submit" />
//         </form>
//         <div>
//           <StockItem
//             symbol={this.state.symbol}
//             price={this.state.stockPrice}
//             name={this.state.stockName}
//           />
//         </div>
//       </div>
//     );
//   }
// }
