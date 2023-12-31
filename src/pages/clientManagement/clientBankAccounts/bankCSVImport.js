import React, { Component } from "react";
import { Importer, ImporterField } from "react-csv-importer";
import "react-csv-importer/dist/index.css";
import "./index.css";
import SelectBox from "devextreme-react/select-box";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

import Swal from "sweetalert2";
import {
  getBanks,
  getBankName,
  updateImportFile,
  updateImportFileV2,
} from "./clientBanksAccountsData";
//import { useAuth } from "../../../contexts/auth";
import PredefinedCSVReader from "./preDefinedCVSReader";
import withReactContent from "sweetalert2-react-content";

//import { on } from "devextreme/events";
//import { json } from "react-router-dom";

class BankCSVImportx extends React.Component {
  constructor(props) {
    super(props);
    this.MySwal = withReactContent(Swal);
    this.onDrop = this.onDrop.bind(this);
  }
  state = {
    currentBankAccount: "",
    currentBankAccountName: "", // this is the name of the bank account
    bankAccountList: [],
    dateRow: 0,
    descriptionRow: 0,
    paymentsRow: 0,
    depositsRow: 0,
    columnsAreDefined: "",
    allvalid: false,
    mydataarray: [],
    importedData: [],
    newValue: 0,
    isLoading: false,
    transactionArray: [
      { date: "", description: "", payments: "", deposits: "" },
    ],
  };

  /////////////////////////////////////////// from the manual mapping
  //////////////// this is working
  ////////////////////////////////////////////

  handleImportedData = (importedData) => {
    this.setState({ isLoading: true });

    const transformedData = importedData.map((item) => [
      item.date,
      item.Description,
      item.Payments,
      item.Deposits,
      item.Total,
    ]);

    updateImportFileV2(
      this.props.clientCode,
      this.state.currentBankAccount,
      transformedData
    )
      .then((response) => {
        this.MySwal.fire({
          icon: "success",
          title: "Import Complete",
          text: `There were ${response.count} records imported and ${response.errorcount} errors in the import. Please review the import file and correct the errors.`,
          customClass: {
            container: "high-z-index",
          },
        });

        if (response.success) {
          // Handle successful response
        } else {
          // Handle other scenarios
        }

        this.setState(
          (prevState) => ({
            sharedValue: prevState.sharedValue + 1,
          }),
          () => {
            this.props.onValueChange(this.state.sharedValue);
          }
        );

        this.props.onValueChange(this.state.newValue);
        this.setState({ isLoading: false }); // Set loading to false after operation is complete
      })
      .catch((error) => {
        console.error("Error:", error);
        this.setState({ isLoading: false }); // Set loading to false also in case of error
      });
  };

  /////////////////////////////////////////////////////////////
  //// this is the auto receive not working on the spinner
  /////////////////////////////////////////////////////////////

  onDataReceived = (data) => {
    //console.log("Received data:", data);
    this.setState({ isLoading: true });

    updateImportFile(this.props.clientCode, this.state.currentBankAccount, data)
      /////////////////////////////////////////////////
      .then((response) => {
        this.MySwal.fire({
          icon: "success",
          title: "Import Complete",
          text: `There were ${response.count} records imported and ${response.errorcount} errors in the import. Please review the import file and correct the errors.`,
          customClass: {
            container: "high-z-index",
          },
        });

        if (response.success) {
          // Handle successful response
        } else {
          // Handle other scenarios
        }

        this.setState(
          (prevState) => ({
            sharedValue: prevState.sharedValue + 1,
          }),
          () => {
            this.props.onValueChange(this.state.sharedValue);
          }
        );

        this.props.onValueChange(this.state.newValue);
        this.setState({ isLoading: false }); // Set loading to false after operation is complete
      })
      .catch((error) => {
        console.error("Error:", error);
        this.setState({ isLoading: false }); // Set loading to false also in case of error
      });
  };

  ///////////////////////////////

  componentDidMount() {
    getBanks(this.props.clientCode) // call the function to fetch data
      .then((data) => {
        //console.log("bank accounts ", data);
        this.setState({ bankAccountList: data.data }, () => {
          //console.log("bank accounts ", this.state.bankAccountList);
        });
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the transaction group data:",
          error
        );
      });
  }

  setAccountData = async (e) => {
    const bankAccountNumber = e.value;
    if (!bankAccountNumber) return;

    //console.log(bankAccountNumber);
    this.setState({ currentBankAccount: bankAccountNumber });

    try {
      const data = await getBankName(this.props.clientCode, bankAccountNumber);
      //console.log("bank accounts name ", data);
      this.setState({
        currentBankAccountName: data.data,
        dateRow: data.daterow,
        descriptionRow: data.descriptionrow,
        paymentsRow: data.paymentsrow,
        depositsRow: data.depositsrow,
        totalRow: data.totalrow,
        hasheaders: data.hasheaders,
      });
    } catch (error) {
      console.error("There was an error fetching the data:", error);
    }
  };

  // Ensure getBankName is correctly defined
  getBankName = async (clientCode, bankAccountNumber) => {
    // Your logic to fetch bank name
    // Should return a promise that resolves to bank name data
  };

  ////
  // this is called after the import file is processed
  ////

  render() {
    return (
      <>
        {this.state.isLoading && (
          <div className="spinner-container">
            {this.state.isLoading && (
              <>
                <p>Processing please wait &nbsp;&nbsp;</p>
                <FontAwesomeIcon
                  icon={faSpinner}
                  spin
                  className="large-spinner"
                />
              </>
            )}
          </div>
        )}
        <div className="content-block2 dx-card">
          <p> </p>
          <p>&nbsp;&nbsp;Bank Transactions Import </p>
          <div style={{ display: "flex", alignItems: "left" }}>
            <p
              style={{
                marginRight: "10px",
                marginLeft: "10px",
                marginTop: "6px",
              }}
            >
              Bank Account:
            </p>
            <SelectBox
              style={{ width: "250px", height: "30px" }}
              items={this.state.bankAccountList}
              valueExpr="BANKACCOUNTNUMBER"
              displayExpr={(item) =>
                item
                  ? `${item.BANKNAME} - ${item.BANKACCOUNTNUMBER} - ${item.ACCOUNTDESCRIPTION}`
                  : ""
              }
              //displayExpr="BANKACCOUNTNUMBER"
              //displayExpr={(item) =>
              //  `${item.BANKACCOUNTNUMBER} - ${item.DESCRIPTION}`
              // }
              value={this.state.currentBankAccount}
              searchEnabled={true}
              //value={currentEmployeeName}
              onValueChanged={this.setAccountData}
              //onValueChanged={(e) => setCurrentEmployeeName(e.value)}
            />
            <p>&nbsp;&nbsp;&nbsp;{this.state.currentBankAccountName}</p>
          </div>

          {this.state.dateRow === 0 ? (
            <DataImporter
              onCompleteImport={this.handleImportedData}
              reset={false}
            />
          ) : (
            <PredefinedCSVReader onDataReceived={this.onDataReceived} />
          )}
        </div>
      </>
    );
  }

  // {this.state.dateRow === 0 &&
  //   this.state.currentBankAccountName !== "" ? (
  //     <DataImporter
  //       onCompleteImport={this.handleImportedData}
  //       reset={false}
  //     />

  //  <DataImporter onCompleteImport={this.handleImportedData} />

  onDrop() {
    // Implementation of onDrop
  }
}

export default BankCSVImportx;

function DataImporter(props) {
  //console.log("DataImporter props", props);
  const [importComplete, setImportComplete] = React.useState(props.reset); // Initialize importComplete as false
  const [importedData, setImportedData] = React.useState([]); // Initialize importedData as an empty array

  const onCompleteImport = ({ data }) => {
    // Handle the imported data here
    //console.log("Imported data in DataImporter:", importedData);
    setImportComplete(true);
    // Call the parent's onCompleteImport function with the imported data
    props.onCompleteImport(importedData);
  };

  return (
    <div>
      {importComplete === false && (
        <Importer
          style={{
            width: "500px", // Adjust width as needed
            height: "300px", // Adjust height as needed
          }}
          dataHandler={async (rows, { startIndex }) => {
            await new Promise((resolve) => setTimeout(resolve, 1000));

            const newData = rows.map((row) => ({
              date: row.date,
              Description: row.Description,
              Payments: row.Payments,
              Deposits: row.Deposits,
              Total: row.Total,
            }));

            // Update the importedData state with the new data
            setImportedData((prevData) => [...prevData, ...newData]);
          }}
          chunkSize={10000}
          defaultNoHeader={true}
          restartable={false}
          onComplete={onCompleteImport}
          onClose={() => {
            //console.log("Importer dismissed");
          }}
        >
          <ImporterField name="date" label="date" />
          <ImporterField name="Description" label="Description" />
          <ImporterField name="Payments" label="Payments" optional />
          <ImporterField name="Deposits" label="Deposits / Combined" />
          <ImporterField name="Total" label="Balance" optional />
        </Importer>
      )}
    </div>
  );
}
////////////////////////////////////////////

// handleImportedData = (importedData) => {
//   this.setState({ isLoading: true });
//   //console.log("Received data in parent component:", importedData);
//   const transformedData = [];
//   importedData.forEach((item) => {
//     const row = [
//       item.date,
//       item.Description,
//       item.Payments,
//       item.Deposits,
//       item.Total,
//     ];
//     transformedData.push(row);
//   });

//   //console.log("transformed before sending to data call", transformedData);

//   updateImportFileV2(
//     this.props.clientCode,
//     this.state.currentBankAccount,
//     transformedData
//   )
//     .then((response) => {
//       // Handle the response here
//       // 'response' is what the promise resolved to
//       this.MySwal.fire({
//         icon: "success",
//         title: "Import Complete",
//         text:
//           "There were " +
//           response.count +
//           " records imported and " +
//           response.errorcount +
//           " errors in the import. Please review the import file and correct the errors.",
//         customClass: {
//           container: "high-z-index",
//         },
//       });

//       //console.log("Response:", response);

//       // Check response or process it as needed
//       if (response.success) {
//         // Handle successful response
//       } else {
//         // Handle other scenarios
//       }
//     })
//     .catch((error) => {
//       // Handle any errors here
//       console.error("Error:", error);
//     });

//   this.setState(
//     (prevState) => ({
//       sharedValue: prevState.sharedValue + 1,
//     }),
//     () => {
//       // After state update, call the parent's callback to update its state as well
//       this.props.onValueChange(this.state.sharedValue);
//     }
//   );

//   //console.log("new value:", this.state.newValue);
//   this.props.onValueChange(this.state.newValue);
//   this.setState({ isLoading: false });
// };

///////////////////////////////////////////////////////////////

// onDataReceived = (data) => {
//   //console.log("Received data:", data);
//   this.setState({ isLoading: true });

//   updateImportFile(this.props.clientCode, this.state.currentBankAccount, data)
//     /////////////////////////////////////////////////
//     .then((response) => {
//       // Handle the response here
//       // 'response' is what the promise resolved to
//       this.MySwal.fire({
//         icon: "success",
//         title: "Import Complete",
//         text:
//           "There were " +
//           response.count +
//           " records imported and " +
//           response.errorcount +
//           " errors in the import. Please review the import file and correct the errors.",
//         customClass: {
//           container: "high-z-index",
//         },
//       });

//       //console.log("Response:", response);

//       // Check response or process it as needed
//       if (response.success) {
//         // Handle successful response
//       } else {
//         // Handle other scenarios
//       }
//     })
//     .catch((error) => {
//       // Handle any errors here
//       console.error("Error:", error);
//     });

//   this.setState(
//     (prevState) => ({
//       sharedValue: prevState.sharedValue + 1,
//     }),
//     () => {
//       // After state update, call the parent's callback to update its state as well
//       this.props.onValueChange(this.state.sharedValue);
//     }
//   );
//   //console.log("new value:", this.state.newValue);
//   this.props.onValueChange(this.state.newValue);
//   this.setState({ isLoading: false }); // Set loading to false after operation is complete
//   // Update the state or perform any other actions as needed
// };
