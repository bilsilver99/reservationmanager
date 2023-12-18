import React from "react";

//import React, { useEffect, useState } from "react";
//import { Popup, Position, ToolbarItem } from "devextreme-react/popup";
//import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//import { faCheckSquare, faSquare } from "@fortawesome/free-solid-svg-icons";
//import { getTransactionGroups } from "../../api/MyOwnServices";
//

//import { confirm } from "devextreme/ui/dialog";

import Modal from "react-modal";

import DataGrid, {
  Column,
  Editing,
  Popup,
  Paging,
  Lookup,
  Form,
  Pager,
  FilterRow,
  HeaderFilter,
  Search,
  SearchPanel,
  MasterDetail,
  Button,
} from "devextreme-react/data-grid";
import { Item } from "devextreme-react/form";
import "devextreme-react/text-area";
import "devextreme/data/data_source";
import { useAuth } from "../../../contexts/auth";
import "./app.scss";
import { mystore } from "./clientBanksAccountsData";
//import { mystore2 } from "./clientBanksAccountsData";
import { myStore3, myStore4, myStore5 } from "./clientBanksAccountsData";
import "whatwg-fetch";
import ClientBankSegments from "./clientBankSegments";
//import { isCancelable } from "react-query/types/core/retryer";
//import CustomStore from "devextreme/data/custom_store";
//import SelectBox from "devextreme-react/select-box";

Modal.setAppElement("#root"); // Replace '#root' with your app element ID

const allowedPageSizes = [8, 12, 24];

let pageoption = 90;

function formatCurrency(number, locale = "en-US", currency = "USD") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(number);
}

const ConfirmationModal = ({ isOpen, onRequestClose, onConfirm, balance }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="react-modal"
      // other props
    >
      <div className="react-modal-header">Confirm Deletion</div>
      <div className="react-modal-content">
        <p>
          Are you sure you want to delete this record? The balance
          is&nbsp;&nbsp;
          {formatCurrency(balance)}.
        </p>
      </div>
      <button
        className="react-modal-button react-modal-button-confirm"
        onClick={onConfirm}
      >
        Yes, Delete
      </button>
      <button
        className="react-modal-button react-modal-button-cancel"
        onClick={onRequestClose}
      >
        Cancel
      </button>
      <span className="close-button" onClick={onRequestClose}>
        X
      </span>
    </Modal>
  );
};

class ClientBankAccountsx extends React.Component {
  constructor(props) {
    super(props);
    this.applyFilterTypes = [
      {
        key: "auto",
        name: "Immediately",
      },
      {
        key: "onClick",
        name: "On Button Click",
      },
    ];
    this.state = {
      //myClient: this.props.clientCode,
      currentRow: 0,
      filterValue: "90",
      selectedRowKeys: [],
      //transactionGroupData: [], // add new state variable
      companyCode: 1,
      showFilterRow: true,
      showHeaderFilter: true,
      currentFilter: this.applyFilterTypes[0].key,
      bankData: [],
      ownerData: [],
      bankTypes: [],

      isModalOpen: false,
      currentBalance: 0,
      activeOnly: true,
      resetKey: 0,

      //bankNameToAuthorize: "", // add new state variable
    };
  }

  componentDidMount() {
    myStore3() // call the function to fetch data
      .then((data) => {
        //console.log("banks", data);
        this.setState({ bankData: data.data }); // store the data in state
        //console.log("bankdata", this.state.bankData);
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the transaction group data:",
          error
        );
      });

    myStore4(this.props.clientCode) // call the function to fetch data
      .then((data) => {
        //console.log("owners in", data);

        this.setState({ ownerData: data.data }, () => {
          //console.log("owners assigned", this.state.ownerData);
        });
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the transaction group data:",
          error
        );
      });

    myStore5(this.props.clientCode) // call the function to fetch data
      .then((data) => {
        //console.log("bank types", data);
        this.setState({ bankTypes: data.data }, () => {
          //console.log("bank types", this.state.bankTypes);
        }); // store the data in state
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the transaction group data:",
          error
        );
      });
  }

  getClientOwners;

  // componentDidMount() {
  //   const store = mystore3(this.props.clientCode);

  //   store
  //     .load()
  //     .then((data) => {
  //       console.log("Data returned from mystore3:", data);
  //       this.setState({ bankData: data }, () => {
  //         console.log("bankData:", this.state.bankData);
  //       });
  //     })
  //     .catch((error) => {
  //       console.error("There was an error:", error);
  //     });
  // }

  handleSelectionChanged(e) {
    this.setState({ selectedRowKeys: e.selectedRowKeys });
    if (e.selectedRowKeys.length > 0) {
      this.setState({ currentRow: e.selectedRowKeys[0] }); // update the current row
    }
  }

  nameEditorOptions = { disabled: true };

  handleEditingStart(e) {
    //console.log("Editing is starting for row", e.data);

    // You can access the data of the row that is being edited
    const rowToBeEdited = e.data;

    // Perform any checks or logic you want here.
    // For example, you might want to prevent editing if a certain condition is met:
    if (rowToBeEdited.someField === "someValue") {
      e.cancel = true; // Prevents the editing from starting
    }
  }

  handleDetailChange = (newDetailData) => {
    // Perform necessary state updates or calculations here
    // For example, recalculate the total sum of details and update state
  };

  deleteClick = (e) => {
    if (e.data.BANKBALANCE !== 0) {
      this.setState({ isModalOpen: true, currentBalance: e.data.BANKBALANCE });
      e.cancel = true; // Prevent immediate deletion
    } else {
      // Delete the row directly
      e.cancel = false;
    }
  };

  handleModalConfirm = () => {
    this.setState({ isModalOpen: false });
    // Add your deletion logic here
  };

  handleModalClose = () => {
    this.setState({ isModalOpen: false });
  };

  toggleActiveOnly = () => {
    this.setState(
      (prevState) => ({
        activeOnly: !prevState.activeOnly,
      }),
      () => {
        this.incrementResetKey();
      }
    );
  };

  incrementResetKey = () => {
    this.setState((prevState) => ({
      resetKey: prevState.resetKey + 1,
    }));
  };

  // refreshData = () => {
  //   // Fetch data based on the new 'activeOnly' state
  //   // For example:
  //   mystore(this.props.clientCode, this.state.activeOnly)
  //     .then((data) => {
  //       // Update the state with the new data
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data:", error);
  //     });
  // };

  render() {
    return (
      <>
        <ConfirmationModal
          isOpen={this.state.isModalOpen}
          onRequestClose={this.handleModalClose}
          onConfirm={this.handleModalConfirm}
          balance={this.state.currentBalance}
        />
        <div className="checkbox-container">
          <p></p>
          <input
            className="checkbox-marginx"
            type="checkbox"
            checked={this.state.activeOnly}
            onChange={this.toggleActiveOnly}
            style={{ marginLeft: "50px" }}
          />
          <label>Show Active Only</label>
          <p></p>
        </div>
        <div className="content-block2 dx-card ">
          <DataGrid
            dataSource={mystore(this.props.clientCode, this.state.activeOnly)}
            keyExpr="UNIQUEID"
            showBorders={false}
            remoteOperations={false}
            onSelectionChanged={this.handleSelectionChanged.bind(this)} // add this line
            onEditingStart={this.handleEditingStart}
            width={"100%"}
            columnAutoWidth={true}
            onRowRemoving={this.deleteClick.bind(this)}
            key={this.state.resetkey}
          >
            <FilterRow
              visible={this.state.showFilterRow}
              applyFilter={this.state.currentFilter}
            />
            <HeaderFilter visible={this.state.showHeaderFilter} />
            <SearchPanel visible={false} width={240} placeholder="Search..." />
            <Paging enabled={true} />
            <Editing
              mode="row"
              allowUpdating={true}
              allowAdding={true}
              allowDeleting={true}
              confirmDelete={false}
            />

            <Editing
              mode="popup"
              allowUpdating={true}
              allowAdding={true}
              allowDeleting={true}
            >
              <Popup
                title="Bank Info"
                showTitle={true}
                width={900}
                height={500}
              />
              <Form>
                <Item dataField={"BANKCODE"} />
                <Item dataField={"BANKACCOUNTNUMBER"} />
                <Item dataField={"ACCOUNTDESCRIPTION"} />
                <Item
                  dataField={"BANKBALANCE"}
                  editorOptions={this.nameEditorOptions}
                />
                <Item
                  dataField={"AVAILABLEBALANCE"}
                  editorOptions={this.nameEditorOptions}
                />
                <Item dataField={"ACCOUNTLIMIT"} />
                <Item dataField={"REPORTINGSEQUENCE"} />
                <Item dataField={"BANKACCOUNTTYPE"} />
                <Item dataField={"ACCOUNTOWNER"} />
                <Item
                  dataField={"LASTTRANSACTIONDATE"}
                  editorOptions={this.nameEditorOptions}
                />
              </Form>
            </Editing>
            <Column
              dataField={"UNIQUEID"}
              width={190}
              caption={"ID"}
              hidingPriority={8}
              visible={false}
            />
            <Column
              dataField={"CLIENTCODE"}
              width={190}
              caption={"Client"}
              hidingPriority={8}
              visible={false}
            />

            <Column
              dataField="BANKCODE"
              caption="Bank"
              width={125}
              dataType="number"
            >
              <Lookup
                dataSource={this.state.bankData}
                valueExpr="BANKCODES"
                displayExpr="BANKNAME"
              />
            </Column>

            <Column
              dataField={"BANKACCOUNTNUMBER"}
              width={200}
              caption={"Account"}
              hidingPriority={8}
              visible={true}
            />
            <Column
              dataField={"ACCOUNTDESCRIPTION"}
              width={200}
              caption={"Description"}
              hidingPriority={8}
              visible={true}
            />
            <Column
              dataField={"BANKBALANCE"}
              width={190}
              caption={"Balance"}
              hidingPriority={8}
              visible={true}
              format={"$###,###,###.00"}
              alignment="right"
              edit={false}
            />
            <Column
              dataField={"AVAILABLEBALANCE"}
              width={190}
              caption={"Available Balance"}
              hidingPriority={8}
              visible={true}
              format={"$###,###,###.00"}
              alignment="right"
              edit={false}
            />
            <Column
              dataField={"ACCOUNTLIMIT"}
              width={190}
              caption={"Account Limit"}
              hidingPriority={8}
              visible={true}
              format={"$###,###,###.00"}
              alignment="right"
            />
            <Column
              dataType="boolean"
              dataField={"IMPORTMX"}
              width={200}
              caption={"Active"}
              hidingPriority={8}
              visible={true}
            />
            <Column
              dataField={"BLANK"}
              width={200}
              caption={""}
              hidingPriority={8}
              visible={true}
            />
            <Column
              dataField={"REPORTINGSEQUENCE"}
              width={190}
              caption={"Reporting Sequence"}
              hidingPriority={8}
              visible={false}
              format={"####"}
              alignment="right"
            />
            <Column
              dataField={"BANKACCOUNTTYPE"}
              width={190}
              caption={"Account Type"}
              hidingPriority={8}
              visible={false}
            >
              <Lookup
                dataSource={this.state.bankTypes}
                valueExpr="BANKACCOUNTTYPES"
                displayExpr="DESCRIPTION"
              />
            </Column>
            <Column
              dataField={"ACCOUNTOWNER"}
              width={190}
              caption={"Owner"}
              hidingPriority={8}
              visible={false}
            >
              <Lookup
                dataSource={this.state.ownerData}
                valueExpr="SEQUENCE"
                displayExpr="NAME"
              />
            </Column>

            <Column
              dataField={"LASTTRANSACTIONDATE"}
              width={190}
              caption={"Last Transaction Date"}
              hidingPriority={8}
              visible={false}
            />

            <MasterDetail
              enabled={true}
              //render={renderDetail}
              sendor={this.state.filterValue}
              render={(props) => renderDetail(props, this.handleDetailChange)}
            />
            <Paging defaultPageSize={8} />
            <Pager
              showPageSizeSelector={true}
              allowedPageSizes={allowedPageSizes}
            />
          </DataGrid>
        </div>
      </>
    );
  }
}
export default function ClientBankAccounts() {
  const { user } = useAuth();
  //console.log("my user stuff", { user });
  return <ClientBankAccountsx clientCode={user.thisClientcode} />;
}

function renderDetail(props) {
  const uniqueid = props.data.UNIQUEID;
  const bankAccountNumberid = props.data.BANKACCOUNTNUMBER;
  const bankAccountUniqueID = props.data.UNIQUEID;
  return (
    <ClientBankSegments
      rowid={uniqueid}
      sendit={pageoption}
      bankAccountNumberID={bankAccountNumberid}
      bankAccountUniqueID={bankAccountUniqueID}
      //onDetailChange={handleDetailChange}
    />
  );
}
