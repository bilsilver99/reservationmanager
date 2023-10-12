import React, { useState, useEffect, useCallback } from "react";
import "./companyProfile.scss";
import "devextreme-react/text-area";
import Form, { Item, ButtonItem, GroupItem } from "devextreme-react/form";
import { fetchcompany, updateCompany } from "../../api/MyOwnServices";
import { useAuth } from "../../contexts/auth";
import notify from "devextreme/ui/notify";
import SelectBox from "devextreme-react/select-box";
import {
  getTimeZones,
  rawTimeZones,
  timeZonesNames,
  abbreviations,
} from "@vvo/tzdb";

function CompanyProfilex(props) {
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
    EmailAddress: "",
    UserName: "",
    UserPassword: "",
    TimeZoneOffset: 0,
  });

  const timeZonesArray = getTimeZones();
  console.log(timeZonesArray);
  const TimeZone = timeZonesArray.map((item) => item.name);
  const offset = timeZonesArray.map((item) => item.OffsetInMinutes);

  console.log("countries:", TimeZone);
  const onValueChanged = (e) => {
    companyValues.Country = e.value;

    if (companyValues.Country) {
      let timezoneDetails = timeZonesArray.find(
        (tz) => tz.name === companyValues.Country
      );

      if (timezoneDetails) {
        companyValues.TimeZoneOffset =
          timezoneDetails.currentTimeOffsetInMinutes;
        console.log(
          `Timezone for ${companyValues.Country} is ${timezoneDetails.currentTimeOffsetInMinutes}`
        );
        // Execute any other code you need here
      } else {
        console.log(`No timezone found for ${companyValues.Country}`);
      }
    }
    console.log("Offset ", companyValues.TimeZoneOffset);
    console.log(e.previousValue);
    console.log(e.value);
  };

  //  const found = timeZonesArray.find(tz => tz.abbreviation === abbreviation);

  //const [employee, getemployee] = useState();

  //this.employee = service.getEmployee();
  //this.positions = service.getPositions();

  const companynumbersent = props.companynumber; //CompanyContext; //{companyvalue};

  useEffect(() => {
    (async () => {
      const result = await fetchcompany(companynumbersent);
      console.log(result);
      setCompanyValues({
        CompanyNumber: result.Companynumber,
        CompanyName: result.CompanyName,
        AddressLineOne: result.AddressLineOne,
        AddressLineTwo: result.AddressLineTwo,
        AddressLineThree: result.AddressLineThree,
        AddressLineFour: result.AddressLineFour,
        Country: result.Country,
        PostalCode: result.PostalCode,
        FaxNumber: result.FaxNumber,
        PhoneNumber: result.PhoneNumber,
        EmailAddress: result.EmailAddress,
        UserName: result.UserName,
        UserPassword: result.UserPassword,
        TimeZoneOffset: result.TimeZoneOffset,
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
      <h2 className={"content-block"}>Client Information</h2>
      <div className="content-block dx-card responsive-paddings">
        <form onSubmit={companyUpdate}>
          <Form
            onContentReady={validateForm}
            //colCountByScreen={colCountByScreen}
            id="form"
            formData={companyValues}
          >
            <GroupItem colCount={3}>
              <Item
                dataField="CompanyNumber"
                editorOptions={nameEditorOptions}
              />
              <Item
                dataField="CompanyName"
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
              >
                <SelectBox
                  dataSource={TimeZone}
                  validationMessagePosition="left"
                  placeholder={companyValues.Country}
                  onValueChanged={onValueChanged}
                ></SelectBox>
              </Item>
              <Item
                dataField="PostalCode" //editorOptions={this.phonesEditorOptions}
              />
              <Item dataField="FaxNumber" editorOptions={phonesEditorOptions} />
              <Item
                dataField="PhoneNumber"
                editorOptions={phonesEditorOptions}
              />
              <Item
                dataField="EmailAddress" //editorOptions={this.phonesEditorOptions}
              />
              <Item
                dataField="UserName" //editorOptions={this.phonesEditorOptions}
              />
              <Item
                dataField="UserPassword" //editorOptions={this.phonesEditorOptions}
              />
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

export default function CompanyProfile() {
  const { user } = useAuth();
  return <CompanyProfilex companynumber={user.companynumber} />;
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

//className="content-block dx-card responsive-paddings'}>

// const countries = [
//   "Afghanistan",
//   "Albania",
//   "Algeria",
//   "Andorra",
//   "Angola",
//   "Antigua and Barbuda",
//   "Argentina",
//   "Armenia",
//   "Australia",
//   "Austria",
//   "Azerbaijan",
//   "The   Bahamas",
//   "Bahrain",
//   "Bangladesh",
//   "Barbados",
//   "Belarus",
//   "Belgium",
//   "Belize",
//   "Benin",
//   "Bhutan",
//   "Bolivia",
//   "Bosnia and Herzegovina",
//   "Botswana",
//   "Brazil",
//   "Brunei",
//   "Bulgaria",
//   "Burkina Faso",
//   "Burma",
//   "Burundi",
//   "Cambodia",
//   "Cameroon",
//   "Canada",
//   "Cape Verde",
//   "Central African Republic",
//   "Chad",
//   "Chile",
//   "China",
//   "Colombia",
//   "Comoros",
//   "Democratic Republic of the Congo",
//   "Republic of the Congo",
//   "Costa Rica",
//   "Ivory Coast",
//   "Croatia",
//   "Cuba",
//   "Cyprus",
//   "Czech Republic",
//   "Denmark",
//   "Djibouti",
//   "Dominica",
//   "Dominican Republic",
//   "East Timor",
//   "Ecuador",
//   "Egypt",
//   "El Salvador",
//   "Equatorial Guinea",
//   "Eritrea",
//   "Estonia",
//   "Ethiopia",
//   "Fiji",
//   "Finland",
//   "France",
//   "Gabon",
//   "The Gambia",
//   "Georgia",
//   "Germany",
//   "Ghana",
//   "Greece",
//   "Grenada",
//   "Guatemala",
//   "Guinea",
//   "Guinea-Bissau",
//   "Guyana",
//   "Haiti",
//   "Honduras",
//   "Hungary",
//   "Iceland",
//   "India",
//   "Indonesia",
//   "Iran",
//   "Iraq",
//   "Republic of Ireland",
//   "Israel",
//   "Italy",
//   "Jamaica",
//   "Japan",
//   "Jordan",
//   "Kazakhstan",
//   "Kenya",
//   "Kiribati",
//   "North Korea",
//   "South Korea",
//   "Kuwait",
//   "Kyrgyzstan",
//   "Laos",
//   "Latvia",
//   "Lebanon",
//   "Lesotho",
//   "Liberia",
//   "Libya",
//   "Liechtenstein",
//   "Lithuania",
//   "Luxembourg",
//   "Republic of Macedonia",
//   "Madagascar",
//   "Malawi",
//   "Malaysia",
//   "Maldives",
//   "Mali",
//   "Malta",
//   "Marshall Islands",
//   "Mauritania",
//   "Mauritius",
//   "Mexico",
//   "Federated States of Micronesia",
//   "Moldova",
//   "Monaco",
//   "Mongolia",
//   "Montenegro",
//   "Morocco",
//   "Mozambique",
//   "Namibia",
//   "Nauru",
//   "Nepal",
//   "Kingdom of the Netherlands",
//   "New Zealand",
//   "Nicaragua",
//   "Niger",
//   "Nigeria",
//   "Norway",
//   "Oman",
//   "Pakistan",
//   "Palau",
//   "State of Palestine",
//   "Panama",
//   "Papua New Guinea",
//   "Paraguay",
//   "Peru",
//   "Philippines",
//   "Poland",
//   "Portugal",
//   "Qatar",
//   "Romania",
//   "Russia",
//   "Rwanda",
//   "Saint Kitts and Nevis",
//   "Saint Lucia",
//   "Saint Vincent and the Grenadines",
//   "Samoa",
//   "San Marino",
//   "São Tomé and Príncipe",
//   "Saudi Arabia",
//   "Senegal",
//   "Serbia",
//   "Seychelles",
//   "Sierra Leone",
//   "Singapore",
//   "Slovakia",
//   "Slovenia",
//   "Solomon Islands",
//   "Somalia",
//   "South Africa",
//   "South Sudan",
//   "Spain",
//   "Sri Lanka",
//   "Sudan",
//   "Suriname",
//   "Swaziland",
//   "Sweden",
//   "Switzerland",
//   "Syria",
//   "Tajikistan",
//   "Tanzania",
//   "Thailand",
//   "Togo",
//   "Tonga",
//   "Trinidad and Tobago",
//   "Tunisia",
//   "Turkey",
//   "Turkmenistan",
//   "Tuvalu",
//   "Uganda",
//   "Ukraine",
//   "United Arab Emirates",
//   "United Kingdom",
//   "United States",
//   "Uruguay",
//   "Uzbekistan",
//   "Vanuatu",
//   "Vatican City",
//   "Venezuela",
//   "Vietnam",
//   "Yemen",
//   "Zambia",
//   "Zimbabwe",
// ];
