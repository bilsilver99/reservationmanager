import React, { useEffect, useState } from "react";
import "./netWorth.css";
import { getNetWorth } from "../../api/MyOwnServices";
import system from "./system.jpg";
import { useAuth } from "../../contexts/auth";

function Card() {
  return (
    <div className="card">
      <div className="card-top">
        <h2>Our System</h2>
      </div>
      <p className="ParagraphSpace">
        Our reservation system is designed to supply easy-to-manage low cost
        subscription and booking management for your business. Whether you run a
        barbershop, a hair salon or a dentist office, we have a solution to fit
        your needs.
      </p>
      <img
        className="systempic"
        src={system}
        alt="Iron Reservations "
        height="200"
        width="200"
      />
    </div>
  );
}

function NetWorthx(props) {
  const [grid, setGridValues] = useState([]);
  //const clientsent = clientCode;
  //const [clientsent, setclient] = useState("PETRUNGARO");
  // grid: [
  //   [
  //     { value: "1", width: 50 },
  //     { value: "h", width: 100 },
  //     { value: "NET WORTH", width: 150 },
  //     { value: " 7-JUN-22", width: 75 },
  //   ],
  //   [{ value: 2 }, { value: 4 }],
  // ],

  const clientsent = props.clientCode;

  useEffect(() => {
    (async () => {
      const result = await getNetWorth(clientsent);
      console.log(result);
      setGridValues(result);
    })();
    //getemployee(service.getEmployee());

    return () => {
      // this now gets called when the component unmounts
    };
  }, [clientsent]);

  const HeaderRow = (props) => {
    return (
      <>
        <div id="wrapper">
          <div id="parent">
            <div className="header1">{props.data.DESCRIPTIONONE}</div>
            <div className="header2">{props.data.DESCRIPTIONTWO}</div>
            <div className="header2">{props.data.DESCRIPTIONTHREE}</div>
            <div className="header2">{props.data.DESCRIPTIONFOUR}</div>
          </div>
        </div>
      </>
    );
  };
  const HeaderValueRow = (props) => {
    return (
      <>
        <div id="wrapper">
          <div id="parent">
            <div className="header1">{props.data.DESCRIPTIONONE}</div>
            <div className="total">{NumberFormat(props.data.VALUEONE)}</div>
            <div className="total">{NumberFormat(props.data.VALUETWO)}</div>
            <div className="total">{NumberFormat(props.data.VALUETHREE)}</div>
          </div>
        </div>
      </>
    );
  };
  const BlankRow = (props) => {
    return (
      <>
        <div id="wrapper">
          <div id="parent">
            <div className="blank">{props.data.DESCRIPTIONONE}</div>
            <div className="blank">{props.data.DESCRIPTIONTWO}</div>
            <div className="blank">{props.data.DESCRIPTIONTHREE}</div>
            <div className="blank">{props.data.DESCRIPTIONFOUR}</div>
          </div>
        </div>
      </>
    );
  };

  const DetailRow = (props) => {
    return (
      <>
        <div id="wrapper">
          <div id="parent">
            <div className="detailh">{props.data.DESCRIPTIONONE}</div>
            <div className="detail1">{NumberFormat(props.data.VALUEONE)}</div>
            <div className="detail1">{NumberFormat(props.data.VALUETWO)}</div>
            <div className="detail1">{NumberFormat(props.data.VALUETHREE)}</div>
          </div>
        </div>
      </>
    );
  };
  const TotalRow = (props) => {
    return (
      <>
        <div id="wrapper">
          <div id="parent">
            <div className="totalh">{props.data.DESCRIPTIONONE}</div>
            <div className="total">{NumberFormat(props.data.VALUEONE)}</div>
            <div className="total">{NumberFormat(props.data.VALUETWO)}</div>
            <div className="total">{NumberFormat(props.data.VALUETHREE)}</div>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      {grid.map((data) => {
        switch (data.ROWTYPE) {
          case "h":
            return <HeaderRow key={data.ROWNUMBER} data={data} />;
          case "h2":
            return <HeaderValueRow key={data.ROWNUMBER} data={data} />;
          case "d":
            return <DetailRow key={data.ROWNUMBER} data={data} />;
          case "b":
            return <BlankRow key={data.ROWNUMBER} data={data} />;
          case "t":
            return <TotalRow key={data.ROWNUMBER} data={data} />;
          default:
            return <></>;
        }
      })}
    </>
  );
  //return <pre>{JSON.stringify(grid, null, 2)}</pre>;
}

export default function NetWorth() {
  const { user } = useAuth();

  return <NetWorthx clientCode={user.clientCode} />;
}

function NumberFormat(props) {
  const number = props;
  //console.log(props);

  // Create a new NumberFormat object and format the number
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    currencySign: "accounting",
  });
  const formattedNumber = formatter.format(number);

  return formattedNumber;
  //   <div>
  //     <p>The number is: {formattedNumber}</p>
  //   </div>
  // );
}

//   [{ value: 1 }, { value: 3 }],
//   [{ value: 2 }, { value: 4 }],

// [{value: "1"},
// {value:  "h"},
// {value: "NET WORTH"},
// {value " 7-JUN-22"}],
//
// {
//   ROWNUMBER: "3",
//   ROWTYPE: "h",
//   DESCRIPTIONONE: "Assets",
//   DESCRIPTIONTWO: "97455.00",
//   DESCRIPTIONTHREE: "",
//   DESCRIPTIONFOUR: ".00",
//   VALUEONE: "0.00",
//   VALUETWO: "2.00",
//   VALUETHREE: "0.00",
//   UNIQUEID: "0",
// },

// {/* <ReactDataSheet
// data={grid}
// valueRenderer={(cell) => cell.value}
// onCellsChanged={(changes) => {
//   const grid = this.state.grid.map((row) => [...row]);
//   changes.forEach(({ cell, row, col, value }) => {
//     grid[row][col] = { ...grid[row][col], value };
//   });
//   this.setState({ grid });
// }}
// /> */}
