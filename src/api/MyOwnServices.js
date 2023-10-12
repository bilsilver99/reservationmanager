import React from "react";
import { useAuth } from "../contexts/auth";

export const login = async (username, password) => {
  var requestoptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json;",
    },
    body: JSON.stringify({
      clientname: username,
      clientpassword: password,
    }),
  };

  const url = `${process.env.REACT_APP_BASE_URL}/validateuser`;

  return await fetch(url, requestoptions)
    .then((response) => {
      if (!response.ok) {
        return {
          clientname: "System did not respond",
          clientcode: "",
          authorized: "N",
          administrator: "",
        };
      }
      return response.json();
    })
    .then((json) => {
      //console.log(json);
      if (json.user_response.returnOK !== false) {
        return {
          clientname: json.user_response.ReturnClientName,
          clientcode: json.user_response.ReturnClientCode,
          authorized: "Y",
          administrator: json.user_response.Returnadministrator,
          clientcompany: json.user_response.Returnedcompanynumber,
          returnOK: json.user_response.returnOK,
        };
      } else {
        //throw new Error("invalid username/password");
        return {
          returnOK: json.user_response.ReturnOK,
          clientname: "",
          error: "Invalid username/password",
          loginmessage: " ",
          clientcode: "",
          authorized: "N",
          administrator: "",
          unavailable: "N",
        };
      }
    })
    .catch((err) => {
      //console.log(err.message);
      return {
        clientname: "",
        error: "System Not Available",
        loginmessage: " ",
        clientcode: "",
        authorized: "N",
        administrator: "",
        unavailable: "Y",
      };
    });
};

export const fetchcompany = async (companynumber) => {
  var requestoptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json;",
    },
    body: JSON.stringify({
      SentCompany: companynumber,
    }),
  };
  const url = `${process.env.REACT_APP_BASE_URL}/GetParameters`;
  return await fetch(url, requestoptions) // Request fish
    .then((response) => {
      if (!response.ok) {
        return {
          companyname: "System did not respond",
          returnaddress: " ",
        };
      }
      return response.json();
    })
    .then((json) => {
      //console.log(json);
      //throw new Error("invalid username/password");
      return {
        Companynumber: json.user_response.Returnedcompanynumber,
        CompanyName: json.user_response.ReturnCompanyName,
        AddressLineOne: json.user_response.ReturnAddressLineOne,
        AddressLineTwo: json.user_response.ReturnAddressLineTwo,
        AddressLineThree: json.user_response.ReturnAddressLineThree,
        AddressLineFour: json.user_response.ReturnAddressLineFour,
        Country: json.user_response.ReturnCountry,
        PostalCode: json.user_response.ReturnPostalCode,
        FaxNumber: json.user_response.ReturnFaxNumber,
        PhoneNumber: json.user_response.ReturnPhoneNumber,
        EmailAddress: json.user_response.ReturnEmailAddress,
        UserName: json.user_response.ReturnUserName,
        UserPassword: json.user_response.ReturnUserPassword,
        TimeZoneOffset: json.user_response.ReturnTimeZoneOffset,
      };
    });
};
export const updateCompany = async (companynumber, companyValues) => {
  //companyValues.AddressLineThree = "corner light";
  var requestoptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json;",
    },
    body: JSON.stringify({
      //Returnedcompanynumber: companynumber,
      CompanyNumber: companyValues.CompanyNumber,
      CompanyName: companyValues.CompanyName,
      AddressLineOne: companyValues.AddressLineOne,
      AddressLineTwo: companyValues.AddressLineTwo,
      AddressLineThree: companyValues.AddressLineThree,
      AddressLineFour: companyValues.AddressLineFour,
      Country: companyValues.Country,
      PostalCode: companyValues.PostalCode,
      FaxNumber: companyValues.FaxNumber,
      PhoneNumber: companyValues.PhoneNumber,
      EmailAddress: companyValues.EmailAddress,
      UserName: companyValues.UserName,
      UserPassword: companyValues.UserPassword,
      TimeZoneOffset: companyValues.TimeZoneOffset,
    }),
  };
  const url = `${process.env.REACT_APP_BASE_URL}/updateCompany`;
  return await fetch(url, requestoptions) // Request fish
    .then((response) => {
      if (!response.ok) {
        return {
          companyname: "System did not respond",
          returnaddress: " ",
        };
      }
      return response.json();
    })
    .then((json) => {
      return {};
    });
};

export default function Pullstore() {
  const { user } = useAuth();
  return <pullstore companynumber={user.companynumber} />;
}
export const pullstore = async (params) => {
  var requestoptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json;",
    },
    body: JSON.stringify({
      SentCompany: this.companynumber,
      Parameters: params,
    }),
  };
  const url = `${process.env.REACT_APP_BASE_URL}/updateCompany`;
  return await fetch(url, requestoptions) // Request fish
    .then((response) => {
      if (!response.ok) {
        return {
          companyname: "System did not respond",
          returnaddress: " ",
        };
      }
      return response.json();
    })
    .then((json) => {
      return {
        data: json.user_response.mdata,
        totalCount: json.user_response.totalCount,
        key: json.user_response.keyname,
      };
    });
};
