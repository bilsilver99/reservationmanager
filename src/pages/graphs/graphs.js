import React from "react";
import SelectBox from "devextreme-react/select-box";
import {
  Chart,
  Series,
  ArgumentAxis,
  CommonSeriesSettings,
  Export,
  Legend,
  Margin,
  Title,
  Subtitle,
  Tooltip,
  Grid,
} from "devextreme-react/chart";
import service from "./data.js";
import "./styles.css";
const YearsInfo = service.getYearsInfo();
const BankSources = service.getBankAccountsInfo();
const types = ["line", "stackedline", "fullstackedline"];

class BankGraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: "line",
    };
    this.handleChange = this.handleChange.bind(this);
  }

  render() {
    return (
      <React.Fragment>
        <Chart palette="Violet" dataSource={YearsInfo}>
          <CommonSeriesSettings
            argumentField="country"
            type={this.state.type}
          />
          {BankSources.map((item) => (
            <Series key={item.value} valueField={item.value} name={item.name} />
          ))}
          <Margin bottom={20} />
          <ArgumentAxis
            valueMarginsEnabled={false}
            discreteAxisDivisionMode="crossLabels"
          >
            <Grid visible={true} />
          </ArgumentAxis>
          <Legend
            verticalAlignment="bottom"
            horizontalAlignment="center"
            itemTextPosition="bottom"
          />
          <Export enabled={true} />
          <Title text="Bank Account Analysis">
            <Subtitle text="()" />
          </Title>
          <Tooltip enabled={true} />
        </Chart>
        <div className="options">
          <div className="caption">Options</div>
          <div className="option">
            <span>Series Type </span>
            <SelectBox
              dataSource={types}
              value={this.state.type}
              onValueChanged={this.handleChange}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }

  handleChange(e) {
    this.setState({ type: e.value });
  }
}

export default BankGraph;
