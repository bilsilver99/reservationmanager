import React, { useState, useEffect, useCallback } from "react";
import "./profile.scss";
import "devextreme-react/text-area";
import Form, { Item, ButtonItem, GroupItem } from "devextreme-react/form";
import { fetchThisClientData } from "../clientManagementData";
//import { useAuth } from "../../contexts/auth";
import notify from "devextreme/ui/notify";
import ClientBankSegment from "./clientBankSegments";
//import SelectBox from "devextreme-react/select-box";
//import ColorBox from "devextreme-react/color-box";

const Interestx = (props) => {
  const [clientCode, setClientCode] = useState(props.sentClientCode);
  const [clientData, setClientData] = useState({});
  const [clientBankAccount, setClientBankAccount] = useState("");
  const [clientBankSegment, setClientBankSegment] = useState("");

  useEffect(() => {
    (async () => {
      const result = await fetchThisClientData(clientCode);
      setClientData({
        clientBankAccount: "",
        clientBankSegment: "",
        ClientCode: result.CLIENTCODE,
        Name: result.NAME,
        AddressLineOne: result.ADDRESSLINEONE,
        AddressLineTwo: result.ADDRESSLINETWO,
        AddressLineThree: result.ADDRESSLINETHREE,
        AddressLineFour: result.ADDRESSLINEFOUR,
        Country: result.COUNTRY,
        PostalZip: result.POSTALZIP,
        UniqueID: result.UNIQUEID,
        StartDate: result.STARTDATE,
        EndDate: result.ENDDATE,
      });
    })();
    //getemployee(service.getEmployee());

    return () => {
      // this now gets called when the component unmounts
    };
  }, [clientCode]);

  // const companyUpdate = (event) => {
  //   updateCompany(props.companynumber, companyValues);
  //   notify(
  //     {
  //       message: "You have submitted the form",
  //       position: {
  //         my: "center top",
  //         at: "center top",
  //       },
  //     },
  //     "success",
  //     3000
  //   );
  //   event.preventDefault();
  // };

  const handleClientBankAccountChange = (e) => {
    clientBankAccount(e.value);
  };
  const handleClientBankAccountSegmentChange = (e) => {
    clientBankSegment(e.value);
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
      <h3 className={"content-block"}>Interest Calculations</h3>

      <div className="content-block dx-card responsive-paddings">
        <form>
          <Form
            onContentReady={validateForm}
            //colCountByScreen={colCountByScreen}
            id="form"
          >
            <Item
              labeltext={"Bank Account Number"}
              dataField="clientBankAccount"
            />
            <Item labeltext={"Segment"} dataField="clientBankSegment" />
          </Form>
        </form>
      </div>
    </React.Fragment>
  );
};

export default function Interest(props) {
  //const { user } = useAuth();
  return <Interestx sentClientCode={props.clientCode} />;
}
