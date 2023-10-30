import React, { useState, useEffect } from "react";
import "./profile.scss";
import "devextreme-react/text-area";
import Form, { Item, ButtonItem, GroupItem } from "devextreme-react/form";
import { fetchclientdata, updateClient } from "../../api/MyOwnServices";
import { useAuth } from "../../contexts/auth";
import notify from "devextreme/ui/notify";

function Profilex(props) {
  const [companyValues, setCompanyValues] = useState({
    CLIENTCODE: "",
    NAME: "",
    ADDRESSLINEONE: "",
    ADDRESSLINETWO: "",
    ADDRESSLINETHREE: "",
    ADDRESSLINEFOUR: "",
    COUNTRY: "",
    POSTALZIP: "",
    UNIQUEID: "",
  });
  //const [employee, getemployee] = useState();

  //this.employee = service.getEmployee();
  //this.positions = service.getPositions();

  const clientsent = props.clientCode; //CompanyContext; //{companyvalue};

  useEffect(() => {
    (async () => {
      const result = await fetchclientdata(clientsent);
      //console.log(result);
      setCompanyValues({
        ClientCode: result.CLIENTCODE,
        Name: result.NAME,
        AddressLineOne: result.ADDRESSLINEONE,
        AddressLineTwo: result.ADDRESSLINETWO,
        AddressLineThree: result.ADDRESSLINETHREE,
        AddressLineFour: result.ADDRESSLINEFOUR,
        Country: result.COUNTRY,
        PostalZip: result.POSTALZIP,
        UniqueID: result.UNIQUEID,
      });
    })();
    //getemployee(service.getEmployee());

    return () => {
      // this now gets called when the component unmounts
    };
  }, [clientsent]);

  const clientUpdate = (event) => {
    updateClient(props.requestedclientcode, companyValues);
    notify(
      {
        message: "You have updated your information",
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
  const nameEditorOptions = { disabled: true };

  const rules = { X: /[02-9]/ };

  const phonesEditorOptions = {
    mask: "+1 (X00) 000-0000",
    maskRules: rules,
  };

  const buttonOptions = {
    text: "Update",
    type: "success",
    useSubmitBehavior: true,
  };

  return (
    <React.Fragment>
      <div className="content-block dx-card responsive-paddings">
        <h6>Your Account Details</h6>
      </div>
      <div className="content-block dx-card responsive-paddings">
        <form onSubmit={clientUpdate}>
          <Form
            onContentReady={validateForm}
            //colCountByScreen={colCountByScreen}
            id="form"
            formData={companyValues}
          >
            <GroupItem colCount={3}>
              <Item
                labeltext={"Client Code"}
                dataField="ClientCode"
                editorOptions={nameEditorOptions}
              />
              <Item
                dataField="Name"
                //editorType="dxSelectBox"
                //editorOptions={this.positionEditorOptions}
                //validationRules={this.validationRules.position}
              />
              <Item
                dataField="AddressLineOne"
                //editorOptions={nameEditorOptions}
              />
              <Item
                dataField="AddressLineTwo"
                //editorType="dxDateBox"
                //editorOptions={this.hireDateEditorOptions}
                //validationRules={this.validationRules.hireDate}
              />
              <Item
                dataField="AddressLineThree"
                //editorType="dxDateBox"
                //editorOptions={this.birthDateEditorOptions}
              />
              <Item dataField="AddressLineFour" />
              <Item
                dataField="Country"
                //colSpan={2}
                //editorType="dxTextArea"
                //editorOptions={this.notesEditorOptions}
              />
              <Item
                dataField="PostalZip" //editorOptions={this.phonesEditorOptions}
              />
              <Item dataField="UNIQUEID" visible={false} />
            </GroupItem>
            <GroupItem>
              <ButtonItem
                horizontalAlignment="left"
                buttonOptions={buttonOptions}
              />
            </GroupItem>
          </Form>
        </form>
      </div>
    </React.Fragment>
  );
}

const colCountByScreen = {
  xs: 1,
  sm: 2,
  md: 3,
  lg: 4,
};

export default function Profile() {
  const { user } = useAuth();
  return <Profilex clientCode={user.clientCode} />;
}

// {/* <React.Fragment>
// <h2 className={"content-block"}>Company Information</h2>

// <div className={"content-block dx-card responsive-paddings"}>
//   {companyValues.CompanyNumber !== 0 && (
//     <>
//       <Form
//         onContentReady={validateForm}
//         id={"form"}
//         formData={companyValues}
//         labelLocation={"top"}
//         colCountByScreen={colCountByScreen}
//       />
//       <Item
//         dataField="CompanyNumber"
//         editorOptions={CompanyNumberEditorOptions}
//       />
//       <Item dataField={"CompanyName"} />
//       <Button
//         icon="plus"
//         text="Update"
//         onClick={() => {
//           companyUpdate();
//         }}
//       />
//     </>
//   )}
// </div>
// </React.Fragment> */}
