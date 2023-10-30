import React from "react";
import ReactDOM from "react-dom";
import DataGrid, {
  Column,
  Paging,
  Pager,
  Sorting,
  Editing,
  FilterRow,
} from "devextreme-react/data-grid";
import { useAuth } from "../../contexts/auth";
import { SelectBox } from "devextreme-react";
import { mystore } from "./bankData";

const transactionTypeOptions = [
  { value: "type1", text: "Type 1" },
  { value: "type2", text: "Type 2" },
  { value: "type3", text: "Type 3" },
  // Add more options as needed
];

class UnallocatedBankTransactionsx extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      myClient: this.props.clientCode,
    };
  }

  render() {
    return (
      <div className="content-block dx-card responsive-paddings">
        <h3>Unallocated Bank Accounts Transactions</h3>
        <DataGrid dataSource={mystore(this.state.myClient)} showBorders={true}>
          <Editing mode="cell" allowUpdating={true} />
          <FilterRow visible={false} />
          <Sorting mode="single" />
          <Column
            dataField="BANKNAME"
            caption="Bank"
            hidingPriority={8}
            width={200}
          />
          <Column
            dataField="DESCRIPTION"
            caption="Transaction Description"
            hidingPriority={8}
            visible={true}
          />
          <Column
            dataField="FPTRANSACTIONCODE"
            caption="Type"
            hidingPriority={8}
            width={200}
            editCellTemplate={(cellElement, cellInfo) => {
              const value = cellInfo.value || "";
              const onValueChanged = (e) => {
                cellInfo.setValue(e.value);
              };
              const defaultStyles = {
                width: "100%",
                boxSizing: "border-box",
              };
              const selectStyles = {
                ...defaultStyles,
                padding: "6px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              };
              ReactDOM.render(
                <SelectBox
                  dataSource={transactionTypeOptions}
                  displayExpr="text"
                  valueExpr="value"
                  value={value}
                  style={selectStyles}
                  onValueChanged={onValueChanged}
                />,
                cellElement
              );
            }}
          />
          <Column
            dataField="UNIQUEID"
            hidingPriority={8}
            dataType="Number"
            visible={false}
          />
          <Column
            dataField="TRANSACTIONDATE"
            caption="Date"
            allowSorting={false}
            width={150}
          />
          <Column
            dataField="TRANSACTIONAMOUNT"
            caption="Amount"
            hidingPriority={8}
            format="$###,###,###.00"
          />
          <Paging defaultPageSize={12} />
          <Pager showPageSizeSelector={true} allowedPageSizes={[8, 12, 20]} />
        </DataGrid>
      </div>
    );
  }
}

export default function UnallocatedBankTransactions() {
  const { user } = useAuth();
  return <UnallocatedBankTransactionsx clientCode={user.clientCode} />;
}
