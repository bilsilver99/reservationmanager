import React from "react";
//import { Popup, Position, ToolbarItem } from "devextreme-react/popup";
//import moment from "moment";
import DataGrid, {
  Column,
  //  Paging,
  //  Pager,
  //  Sorting,
  //  Editing,
  //  FilterRow,
  // Item,
  // Popup,
  // Form,
  MasterDetail,
} from "devextreme-react/data-grid";
import {
  Chart,
  CommonSeriesSettings,
  Series,
  ArgumentAxis,
  ValueAxis,
  Legend,
  SeriesTemplate,
  Tooltip,
} from "devextreme-react/chart";
import { groupBy } from "lodash";

import "devextreme-react/text-area";
import "devextreme/data/data_source";
import { useAuth } from "../../contexts/auth";
import "./app.scss";
import { mystore } from "./investmentData";
import { mystore3 } from "./investmentData";
//import { mystore4 } from "./investmentData";

import InvestmentDetails from "./investmentDetails";

//simport SelectBox from "devextreme-react/select-box";
// import {
//   Chart,
//   Series,
//   ArgumentAxis,
//   CommonSeriesSettings,
//   Export,
//   Legend,
//   Margin,
//   Title,
//   Subtitle,
//   Tooltip,
//   Grid,
// } from "devextreme-react/chart";
//import service from "./data.js";
import "./styles.css";
//const YearsInfo = service.getYearsInfo();
// const BankSources = [
//   { value: "INVESTMENTNAME1", name: "27475085 - Margin-CAD" },
//   { value: "INVESTMENTNAME2", name: "27475085 - Margin-USD" },
//   { value: "INVESTMENTNAME3", name: "52083479 - TFSA-USD" },
//   { value: "INVESTMENTNAME4", name: "520834791 - TFSA-USD" },
// ];
//const types = ["line", "stackedline", "fullstackedline"];

class InvestmentSummaryx extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      myClient: this.props.clientCode,
      currentRow: 0,
      filterValue: "30",
      selectedRowKeys: [],
      showDataGrid: true,
      showDataGrid2: true,
      showGraph: true,
      grid1height: "320px",
      grid2height: "400px",
      type: "line",
      BankSources: [],
      array1: [],
      array2: [],
      mergedArray: [],
      loading: true,
      error: null,
      data: [],
    };
    //this.handleChange = this.handleChange.bind(this);
  }

  async componentDidMount() {
    try {
      const banksourcesIN = await this.mystore5(this.state.myClient);
      const bankdatain = await this.mystore4(this.state.myClient);
      //console.log("banksourcesIN.data2", banksourcesIN.data2);
      this.setState(
        { array1: banksourcesIN.data2, array2: bankdatain.data3 },
        () => {
          //console.log("arrays updated");
          this.loadData();
          //console.log(this.state.data);
          this.setState({ BankSources: banksourcesIN.data2, loading: false });
        }
      );
    } catch (error) {
      console.log("error");
      this.setState({ error: error.message, loading: false });
    }
  }

  loadData() {
    const { array1, array2 } = this.state;

    const data = [];

    // Group array2 by INVESTMENTNAME1
    const groupedData = groupBy(array2, "INVESTMENTNAME1");

    // Loop over array1 to create chart data
    array1.forEach((item) => {
      const seriesData = [];

      // Get the data for this investment name
      const investmentData = groupedData[item.NAME];

      // Check if investmentData is defined before looping over it
      if (investmentData) {
        investmentData.forEach((investmentItem) => {
          // Add a data point to the series data, using the parsed date
          seriesData.push({
            CONVERTEDDATE: investmentItem.CONVERTEDDATE, // Convert Moment.js date to JavaScript date
            VALUE1: investmentItem.VALUE1,
          });
        });
      }

      // Add the series data to the chart data
      data.push({
        name: item.NAME,
        data: seriesData,
      });
    });

    this.setState({ data });
  }
  mystore5 = (bankID) => {
    //console.log("in mystore5", bankID);
    var requestoptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json;",
      },
      body: JSON.stringify({
        sentbankid: bankID,
      }),
    };
    const url = `${process.env.REACT_APP_BASE_URL}/returninvestmentnames`;

    return fetch(url, requestoptions) // Request fish
      .then((response) => {
        if (!response.ok) {
          console.log("no Response");
          throw new Error("wtf?");
        }
        return response.json();
      })
      .then((json) => {
        //bankdata = JSON.parse(chips.responseText.FPClientBankAccount);
        //console.log(json, bankID);
        return { data2: json.user_response.bankq };
      });
  };

  mystore4 = (bankID) => {
    //console.log("in mystore5", bankID);
    var requestoptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json;",
      },
      body: JSON.stringify({
        sentbankid: bankID,
      }),
    };
    const url = `${process.env.REACT_APP_BASE_URL}/returninvestmentHistoryDetails`;

    return fetch(url, requestoptions) // Request fish
      .then((response) => {
        if (!response.ok) {
          console.log("no Response");
          throw new Error("wtf?");
        }
        return response.json();
      })
      .then((json) => {
        //bankdata = JSON.parse(chips.responseText.FPClientBankAccount);
        //console.log(json, bankID);
        return { data3: json.user_response.bankq };
      });
  };

  toggleGraphVisibility = () => {
    this.setState({
      showGraph: !this.state.showGraph,
    });
  };
  toggleDataGridVisibility = () => {
    this.setState({
      showDataGrid: !this.state.showDataGrid,
      grid1height: "320px",
    });
  };
  toggleDataGridVisibility2 = () => {
    this.setState({
      showDataGrid2: !this.state.showDataGrid2,
    });

    if (this.state.showDataGrid2 === false) {
      this.setState({
        grid1height: "320px",
      });
    } else {
      this.setState({
        grid1height: "500px",
      });
    }
  };
  render() {
    const { array1, array2, loading, error } = this.state;
    const datax = this.state.data;

    if (this.state.showGraph && array2.length > 0) {
      //console.log("adata2 ", array2); // This will log to the console if isLoggedIn is true
      console.log("array2", array2); // This will log to the console if isLoggedIn is true

      // return (
      //   <div>
      //     <h1>Welcome, User!</h1>
      //     <p>You are logged in.</p>
      //   </div>
      //);
    }

    if (loading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>Error: {error}</div>;
    }
    return (
      <>
        <div className="content-block dx-card responsive-paddings">
          <button onClick={this.toggleGraphVisibility} className="buttonclass">
            Show/Hide Graph
          </button>
          {this.state.showGraph && datax.length > 0 && loading === false && (
            <Chart
              dataSource={array2} //{datax}
              title="Investment Profile"
              key={JSON.stringify(array2)}
              //key={JSON.stringify(datax)}
            >
              <CommonSeriesSettings
                //argumentField="INVESTMENTNAME1"
                argumentField="CONVERTEDDATE"
                valueField="VALUE1"
                type="spline"
                dataType="string"
              />
              <SeriesTemplate nameField="INVESTMENTNAME1" />
              <ArgumentAxis type="string" />
              <ValueAxis />
              <Tooltip
                enabled={true}
                shared={true}
                customizeTooltip={customizeTooltip}
              />

              <Legend verticalAlignment="top" horizontalAlignment="center" />
            </Chart>
          )}
        </div>

        <div className="content-block dx-card responsive-paddings">
          <p>Investment Accounts</p>
          <button
            onClick={this.toggleDataGridVisibility}
            className="buttonclass"
          >
            Show/Hide Investments
          </button>
          {this.state.showDataGrid ? (
            <DataGrid
              dataSource={mystore(this.state.myClient)}
              showBorders={false}
              height={this.state.grid1height}
            >
              <Column
                dataField={"INSTITUTIONNAME"}
                caption={"Investment Company"}
                hidingPriority={7}
                allowEditing={true}
              />
              <Column
                dataField={"VALUE"}
                caption={"Total Value"}
                hidingPriority={7}
                allowEditing={true}
                format="$###,###,###.00"
              />
              <Column
                dataField={"CASH"}
                caption={"Cash Value"}
                hidingPriority={7}
                allowEditing={true}
                format="$###,###,###.00"
              />
              <Column
                dataField={"LASTREFRESHDATESTRING"}
                caption={"Last Update"}
                hidingPriority={7}
                allowEditing={true}
              />
              <Column
                dataType="boolean"
                dataField={"ACTIONREQUIRED"}
                caption={"Authorization Required"}
                hidingPriority={7}
                allowEditing={true}
              />
              <MasterDetail
                enabled={true}
                render={renderDetail}
                sendor={this.state.filterValue}
              />
            </DataGrid>
          ) : null}
        </div>

        <div className="content-block dx-card responsive-paddings">
          <p>Securities</p>

          <button
            onClick={this.toggleDataGridVisibility2}
            className="buttonclass"
          >
            Show/Hide Securities
          </button>
          {this.state.showDataGrid2 ? (
            <DataGrid
              dataSource={mystore3(this.state.myClient)}
              showBorders={false}
              height={this.state.grid2height}
            >
              <Column
                dataField={"NAME"}
                caption={"Investment "}
                hidingPriority={7}
                allowEditing={true}
              />
              <Column
                dataField={"SYMBOL"}
                caption={"Symbol"}
                hidingPriority={7}
                allowEditing={true}
              />
              <Column
                dataField={"TYPE"}
                caption={"Type"}
                hidingPriority={7}
                allowEditing={true}
              />
              <Column
                dataField={"PRICE"}
                caption={"Price"}
                hidingPriority={7}
                allowEditing={true}
                format="$###,###,###.00"
              />
              <Column
                dataField={"DATESTRING"}
                caption={"Date"}
                hidingPriority={7}
                allowEditing={true}
              />
              <Column
                dataField={"CURRENCY"}
                caption={"Currency"}
                hidingPriority={7}
                allowEditing={true}
              />
            </DataGrid>
          ) : null}
        </div>
      </>
    );
  }
}

function customizeTooltip(pointInfo) {
  return {
    html: `<div><div class="tooltip-header">${pointInfo.argumentText}</div><div class="tooltip-body"><div class="series-name"><span class='top-series-name'>${pointInfo.points[0].seriesName}</span>: </div><div class="value-text"><span class='top-series-value'>${pointInfo.points[0].valueText}</span></div><div class="series-name"><span class='bottom-series-name'></span> </div><div class="value-text"><span class='bottom-series-value'></span></div></div></div>`,
  };
}

export default function InvestmentSummary() {
  const { user } = useAuth();
  //console.log({ user });
  return (
    <InvestmentSummaryx
      clientCode={user.clientCode}
      FlinksConnectDomainRetail={user.FlinksConnectDomainRetail}
      UserCode={user.UserCode}
      UserPassword={user.UserPassword}
    />
  );
}

function renderDetail(props) {
  //console.log("unique", props.data.UNIQUEID);
  const uniqueid = props.data.UNIQUEID;
  return <InvestmentDetails rowid={uniqueid} />;
}
