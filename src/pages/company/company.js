import React, { useState, useEffect, useCallback } from "react";
import "./companyProfile.scss";
import "devextreme-react/text-area";
import Form, { Item, ButtonItem, GroupItem } from "devextreme-react/form";
import { Lookup } from "devextreme-react/lookup";
import {
  fetchcompany,
  updateCompany,
  getStockTypes,
} from "../../api/MyOwnServices";
import { useAuth } from "../../contexts/auth";
import notify from "devextreme/ui/notify";
//import SelectBox from "devextreme-react/select-box";
//import ColorBox from "devextreme-react/color-box";

function Companyx(props) {
  const [companyValues, setCompanyValues] = useState({
    CompanyNumber: 0,
    CompanyName: "",
    AddressLineOne: "",
    AddressLineTwo: "",
    AddressLineThree: "",
    AddressLineFour: "",
    Country: "",
    PostalCode: "",
    FaxNumber: "",
    PhoneNumber: "",
    DataDirectoryLocation: "",
    LastProcessingDate: 0,
    InputSheetName: "",
    CarryingChargesSheetname: "",
    HeaderColourDescription: "",
    HeaderColourDescriptionString: "#f05b41",
    HeaderColourColumns: "",
    FooterColourDescription: "",
    FooterColourColumns: "",
    NetAssetsName: "",
    NetWorthName: "",
    DebtSummaryName: "",
    CarryingChargesName: "",
    CarryingChargesStartDate: 0,
    CarryingChargesEndDate: 0,
    PlaidClientID: "",
    PlaidDevelopmentSecretKey: "",
    PlaidSandboxSecretKey: "",
    developmentURL: "",
    productionURL: "",
    UsingLive: false,
    CashInvestmentStockCode: "",
    PurchaseTransactionType: "",
    SaleTransactionType: "",
    CostTransactionType: "",
    NoncashTransactionType: "",
  });

  const companynumbersent = props.companynumber; //CompanyContext; //{companyvalue};
  const [investmenttypes, setInvestmentTypes] = useState([]);

  useEffect(() => {
    getStockTypes()
      .then((data) => {
        setInvestmentTypes(data.data);
      })
      .catch((error) => {
        console.error("Error fetching investment types:", error);
      });
    (async () => {
      console.log("companynumbersent", companynumbersent);
      const result = await fetchcompany(companynumbersent);
      setCompanyValues({
        CompanyNumber: result.CompanyNumber,
        CompanyName: result.CompanyName,
        AddressLineOne: result.AddressLineOne,
        AddressLineTwo: result.AddressLineTwo,
        AddressLineThree: result.AddressLineThree,
        AddressLineFour: result.AddressLineFour,
        Country: result.Country,
        PostalCode: result.PostalCode,
        FaxNumber: result.FaxNumber,
        PhoneNumber: result.PhoneNumber,
        DataDirectoryLocation: result.DataDirectoryLocation,
        LastProcessingDate: result.LastProcessingDate,
        InputSheetName: result.InputSheetName,
        CarryingChargesSheetname: result.CarryingChargesSheetname,
        HeaderColourDescription: result.HeaderColourDescription,
        HeaderColourDescriptionString: result.HeaderColourDescriptionString,
        HeaderColourColumns: result.HeaderColourColumns,
        FooterColourDescription: result.FooterColourDescription,
        FooterColourColumns: result.FooterColourColumns,
        NetAssetsName: result.NetAssetsName,
        NetWorthName: result.NetWorthName,
        DebtSummaryName: result.DebtSummaryName,
        CarryingChargesName: result.CarryingChargesName,
        CarryingChargesStartDate: result.CarryingChargesStartDate,
        CarryingChargesEndDate: result.CarryingChargesEndDate,
        PlaidClientID: result.PlaidClientID,
        PlaidDevelopmentSecretKey: result.PlaidDevelopmentSecretKey,
        PlaidSandboxSecretKey: result.PlaidSandboxSecretKey,
        developmentURL: result.developmentURL,
        productionURL: result.productionURL,
        sandboxURL: result.sandboxURL,
        UsingLive: result.UsingLive,

        basecurrency: result.basecurrency,
        personalrealestatecode: result.personalrealestatecode,
        startdateforreports: result.startdateforreports,
        enddateforreports: result.enddateforreports,
        primerate: result.primerate,
        lastpdffile: result.lastpdffile,
        CashInvestmentStockCode: result.CashInvestmentStockCode,
        PurchaseTransactionType: result.PurchaseTransactionType,
        SaleTransactionType: result.SaleTransactionType,
        CostTransactionType: result.CostTransactionType,
        NoncashTransactionType: result.NoncashTransactionType,
      });
    })();
    //getemployee(service.getEmployee());

    return () => {
      // this now gets called when the component unmounts
    };
  }, [companynumbersent]);

  const companyUpdate = (event) => {
    updateCompany(props.companynumber, companyValues);
    notify(
      {
        message: "You have submitted the form",
        position: {
          my: "center top",
          at: "center top",
        },
      },
      "success",
      3000
    );
    event.preventDefault();
  };

  const validateForm = (event) => {
    event.component.validate();
  };
  const nameEditorOptions = { disabled: false };

  const rules = { X: /[02-9]/ };

  //const handleColorChange = ({ value }) => ({ color: value });

  const phonesEditorOptions = {
    mask: "(X00) 000-0000",
    maskRules: rules,
  };

  const buttonOptions = {
    text: "Update",
    type: "success",
    useSubmitBehavior: true,
  };

  return (
    <React.Fragment>
      <h2 className={"content-block"}>Company Information</h2>
      <div className="content-block dx-card responsive-paddings">
        <form onSubmit={companyUpdate}>
          <Form
            onContentReady={validateForm}
            //colCountByScreen={colCountByScreen}
            id="form"
            formData={companyValues}
          >
            <Item dataField="CompanyNumber" editorOptions={nameEditorOptions} />
            <GroupItem
              caption="Address Info"
              colCount={3}
              cssClass="group-border"
            >
              <Item dataField="CompanyName" />
              <Item dataField="AddressLineOne" />
              <Item dataField="AddressLineTwo" />
              <Item dataField="AddressLineThree" />
              <Item dataField="AddressLineFour" />
              <Item dataField="Country"></Item>
              <Item dataField="PostalCode" />
              <Item dataField="FaxNumber" editorOptions={phonesEditorOptions} />
              <Item
                dataField="PhoneNumber"
                editorOptions={phonesEditorOptions}
              />
            </GroupItem>
            <GroupItem>
              <GroupItem caption="Colors" colCount={4} cssClass="group-border">
                <Item dataField="HeaderColourDescription" />
                <Item dataField="HeaderColourColumns" />
                <Item dataField="FooterColourDescription" />
                <Item dataField="FooterColourColumns" />
              </GroupItem>
              <GroupItem
                caption="Excel Setup"
                colCount={2}
                cssClass="group-border"
              >
                <Item dataField="DataDirectoryLocation" />
                <Item dataField="LastProcessingDate" editorType="dxDateBox" />
                <Item dataField="InputSheetName" />
                <Item dataField="CarryingChargesSheetname" />
                <Item dataField="NetAssetsName" />
                <Item dataField="NetWorthName" />
                <Item dataField="DebtSummaryName" />
                <Item dataField="CarryingChargesName" />
                <Item
                  dataField="CarryingChargesStartDate"
                  editorType="dxDateBox"
                />
                <Item
                  dataField="CarryingChargesEndDate"
                  editorType="dxDateBox"
                />
              </GroupItem>
              <GroupItem
                caption="Plaid Info"
                colCount={3}
                cssClass="group-border"
              >
                <Item dataField="PlaidClientID" />
                <Item dataField="PlaidDevelopmentSecretKey" />
                <Item dataField="PlaidSandboxSecretKey" />
                <Item dataField="developmentURL" />
                <Item dataField="productionURL" />
                <Item dataField="sandboxURL" />
              </GroupItem>
              <GroupItem
                caption="Data Setup"
                colCount={3}
                cssClass="group-border"
              >
                <Item
                  dataField="basecurrency"
                  label={{ text: "Base Currency" }}
                />
                <Item
                  dataField="personalrealestatecode"
                  label={{ text: "Personal Real Estate Code" }}
                />
                <Item
                  dataField="startdateforreports"
                  editorType="dxDateBox"
                  label={{ text: "Start Date For Reports" }}
                />
                <Item
                  dataField="enddateforreports"
                  editorType="dxDateBox"
                  label={{ text: "End Date For Reports" }}
                />
                <Item dataField="primerate" label={{ text: "Prime Rate" }} />
                <Item
                  dataField="lastpdffile"
                  label={{ text: "Last PDF File" }}
                />
                <Item
                  dataField="CashInvestmentStockCode"
                  label={{ text: "Cash Stock Code" }}
                />
              </GroupItem>

              <GroupItem caption="Investment Setup" colCount={3}>
                <Item
                  dataField="PurchaseTransactionType"
                  label={{ text: "Purchase Transaction Type" }}
                  editorType="dxSelectBox" // if Lookup doesn't work, try using dxSelectBox
                  editorOptions={{
                    dataSource: investmenttypes,
                    valueExpr: "STOCKTRANSACTIONCODE",
                    displayExpr: "STOCKTRANSACTIONCODE",
                    onValueChanged: (e) => {
                      setCompanyValues({
                        ...companyValues,
                        PurchaseTransactionType: e.value,
                      });
                    },
                  }}
                />
                <Item
                  dataField="SaleTransactionType"
                  label={{ text: "Sale Transaction Type" }}
                  editorType="dxSelectBox" // if Lookup doesn't work, try using dxSelectBox
                  editorOptions={{
                    dataSource: investmenttypes,
                    valueExpr: "STOCKTRANSACTIONCODE",
                    displayExpr: "STOCKTRANSACTIONCODE",
                    onValueChanged: (e) => {
                      setCompanyValues({
                        ...companyValues,
                        SaleTransactionType: e.value,
                      });
                    },
                  }}
                />

                <Item
                  dataField="CostTransactionType"
                  label={{ text: "Cost Transaction Type" }}
                  editorType="dxSelectBox" // if Lookup doesn't work, try using dxSelectBox
                  editorOptions={{
                    dataSource: investmenttypes,
                    valueExpr: "STOCKTRANSACTIONCODE",
                    displayExpr: "STOCKTRANSACTIONCODE",
                    onValueChanged: (e) => {
                      setCompanyValues({
                        ...companyValues,
                        CostTransactionType: e.value,
                      });
                    },
                  }}
                />

                <Item
                  dataField="NoncashTransactionType"
                  label={{ text: "Non Cash Transaction Type" }}
                  editorType="dxSelectBox" // if Lookup doesn't work, try using dxSelectBox
                  editorOptions={{
                    dataSource: investmenttypes,
                    valueExpr: "STOCKTRANSACTIONCODE",
                    displayExpr: "STOCKTRANSACTIONCODE",
                    onValueChanged: (e) => {
                      setCompanyValues({
                        ...companyValues,
                        NoncashTransactionType: e.value,
                      });
                    },
                  }}
                />
              </GroupItem>

              <GroupItem>
                <ButtonItem
                  horizontalAlignment="left"
                  buttonOptions={buttonOptions}
                />
              </GroupItem>
            </GroupItem>
          </Form>
        </form>
      </div>
    </React.Fragment>
  );
}

export default function Company() {
  //const { user } = useAuth();
  return <Companyx companynumber={1} />;
}

/////////////////////////////////////////////////////////
//const handleHeaderColorChange = (e) => {

//this.handleColorChange = ({ value }) => this.setState({ color: value });

// const handleHeaderColourDescription = (e) => {
//   setCompanyValues((prevValues) => ({
//     ...prevValues,
//     HeaderColourDescription: e.value,
//   }));
//   //console.log("e.value", e.value);
//   const hex = e.value;
//   //console.log("e.value", e.value, "hex", hex);
//   const const2 = hex.slice(1);
//   setDecimalValue(parseInt(const2, 16).toString());
//   console.log(
//     "const2: ",
//     const2,
//     " hexValue",
//     hex,
//     "decimalValue",
//     decimalValue
//   );
// };

// const handleHeaderColourColumn = (e) => {
//   setCompanyValues((prevValues) => ({
//     ...prevValues,
//     HeaderColourColumns: e.value,
//   }));
//   console.log("e.value", e.value);
// };

// const FooterColourDescription = (e) => {
//   setCompanyValues((prevValues) => ({
//     ...prevValues,
//     FooterColourDescription: e.value,
//   }));
//   console.log("e.value", e.value);
// };
// const FooterColourColumns = (e) => {
//   setCompanyValues((prevValues) => ({
//     ...prevValues,
//     FooterColourColumns: e.value,
//   }));
//   console.log("e.value", e.value);
// };
// //////////////////////////////////////////////////////////////

// const inHeaderColourDescription = decimalToHex(
//   result.HeaderColourDescription
// );
// const inHeaderColourColumns = decimalToHex(result.HeaderColourColumns);
// const inFooterColourDescription = decimalToHex(
//   result.FooterColourDescription
// );
// const inFooterColourColumns = decimalToHex(result.FooterColourColumns);

// const defaultModeLabel = { "aria-label": "Default mode" };
// const alphaChannelLabel = { "aria-label": "With alpha channel editing" };
// const customButtonCaptionsLabel = { "aria-label": "Custom button captions" };
// const readOnlyLabel = { "aria-label": "Read only" };
// const disabledLabel = { "aria-label": "Disabled" };
// const eventHandlingLabel = { "aria-label": "Event Handling" };

// function decimalToHex(d, padding) {
//   var hex = Number(d).toString(16);
//   padding =
//     typeof padding === "undefined" || padding === null
//       ? (padding = 2)
//       : padding;

//   while (hex.length < padding) {
//     hex = "0" + hex;
//   }
//   const string = `#${hex.toString(16).padStart(6, "0")}`;
//   console.log("string", string, "decimal : ", d);
//   return string;
// }

// const [hexValue, setHexValue] = useState("");
// const [decimalValue, setDecimalValue] = useState("");
