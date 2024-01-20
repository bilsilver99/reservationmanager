import React, { useState } from "react";

const GetStockPrice = () => {
  const [stock, setStock] = useState("");
  const [lastClose, setLastClose] = useState(null);

  const fetchLastClosePrice = () => {
    const API_KEY = process.env.REACT_APP_API_KEY; // Replace with your Finnhub API key
    const url = `https://finnhub.io/api/v1/quote?symbol=${stock}&token=${API_KEY}`;
    console.log(url);
    alert(url);

    fetch(url)
      .then((response) => response.json())
      .then((data) => setLastClose(data.c))
      .catch((error) => console.error("Error fetching data: ", error));
  };

  //https://finnhub.io/api/v1/quote?symbol=${IBM}&token=${clrjfrhr01qi77sl7rf0clrjfrhr01qi77sl7rfg}

  return (
    <div>
      <input
        type="text"
        value={stock}
        onChange={(e) => setStock(e.target.value.toUpperCase())}
        placeholder="Enter Stock Symbol (e.g., AAPL)"
      />
      <button onClick={fetchLastClosePrice}>Get Last Close Price</button>
      {lastClose && <p>Last Close Price: {lastClose}</p>}
    </div>
  );
};

export default GetStockPrice;
