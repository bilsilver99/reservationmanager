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
          thisClientcode: "",
          authorized: "Y",
          administrator: json.user_response.Returnadministrator,
          clientcompany: json.user_response.Returnedcompanynumber,
          returnOK: json.user_response.returnOK,
          guid: json.user_response.returnguid,
          widget: json.user_response.ReturnWidget,
          UserCode: json.user_response.ReturnUserCode,
          UserPassword: json.user_response.ReturnPassword,

          FlinkCustomerRetail: json.user_response.FlinkCustomerRetail,
          FlinksAPIDomainRetail: json.user_response.FlinksAPIDomainRetail,
          FlinksConnectDomainRetail:
            json.user_response.FlinksConnectDomainRetail,
          FlinksProjectIDRetail: json.user_response.FlinksProjectIDRetail,
          FlinkCustomerWealth: json.user_response.FlinkCustomerWealth,
          FlinksAPIDomainWealth: json.user_response.FlinksAPIDomainWealth,
          FlinksConnectDomainWealth:
            json.user_response.FlinksConnectDomainWealth,
          FlinksProjectIDWealth: json.user_response.FlinksProjectIDWealth,
          lastClientUpdated: json.user_response.LastClientUpdated,
          DateFormat: json.user_response.DateFormat,
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
      requestedcompanynumber: companynumber,
    }),
  };
  const url = `${process.env.REACT_APP_BASE_URL}/fetchcompanydata`;
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
      console.log(json);
      //throw new Error("invalid username/password");
      return {
        CompanyNumber: json.user_response.R_CompanyNumber,
        CompanyName: json.user_response.R_CompanyName,
        AddressLineOne: json.user_response.R_AddressLineOne,
        AddressLineTwo: json.user_response.R_AddressLineTwo,
        AddressLineThree: json.user_response.R_AddressLineThree,
        AddressLineFour: json.user_response.R_AddressLineFour,
        Country: json.user_response.R_Country,
        PostalCode: json.user_response.R_PostalCode,
        FaxNumber: json.user_response.R_FaxNumber,
        PhoneNumber: json.user_response.R_PhoneNumber,
        DataDirectoryLocation: json.user_response.R_DataDirectoryLocation,
        LastProcessingDate: json.user_response.R_LastProcessingDate,
        InputSheetName: json.user_response.R_InputSheetName,
        CarryingChargesSheetname: json.user_response.R_CarryingChargesSheetname,
        HeaderColourDescription: json.user_response.R_HeaderColourDescription,
        HeaderColourDescriptionString:
          json.user_response.R_HeaderColourDescriptionString,
        HeaderColourColumns: json.user_response.R_HeaderColourColumns,
        FooterColourDescription: json.user_response.R_FooterColourDescription,
        FooterColourColumns: json.user_response.R_FooterColourColumns,
        NetAssetsName: json.user_response.R_NetAssetsName,
        NetWorthName: json.user_response.R_NetWorthName,
        DebtSummaryName: json.user_response.R_DebtSummaryName,
        CarryingChargesName: json.user_response.R_CarryingChargesName,
        CarryingChargesStartDate: json.user_response.R_CarryingChargesStartDate,
        CarryingChargesEndDate: json.user_response.R_CarryingChargesEndDate,
        PlaidClientID: json.user_response.R_PlaidClientID,
        PlaidDevelopmentSecretKey:
          json.user_response.R_PlaidDevelopmentSecretKey,
        PlaidSandboxSecretKey: json.user_response.R_PlaidSandboxSecretKey,
        developmentURL: json.user_response.R_developmentURL,
        productionURL: json.user_response.R_ProductionURL,
        sandboxURL: json.user_response.R_sandboxURL,
        UsingLive: json.user_response.R_UsingLive,
        basecurrency: json.user_response.R_BaseCurrency,
        personalrealestatecode: json.user_response.R_PersonalRealEstateCode,
        startdateforreports: json.user_response.R_StartDateForReports,
        enddateforreports: json.user_response.R_EndDateForReports,
        primerate: json.user_response.R_PrimeRate,
        lastpdffile: json.user_response.R_LastPDFFile,
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
      DataDirectoryLocation: companyValues.DataDirectoryLocation,
      LastProcessingDate: companyValues.LastProcessingDate,
      InputSheetName: companyValues.InputSheetName,
      CarryingChargesSheetname: companyValues.CarryingChargesSheetname,
      HeaderColourDescription: companyValues.HeaderColourDescription,
      HeaderColourDescriptionString:
        companyValues.HeaderColourDescriptionString,
      HeaderColourColumns: companyValues.HeaderColourColumns,
      FooterColourDescription: companyValues.FooterColourDescription,
      FooterColourColumns: companyValues.FooterColourColumns,
      NetAssetsName: companyValues.NetAssetsName,
      NetWorthName: companyValues.NetWorthName,
      DebtSummaryName: companyValues.DebtSummaryName,
      CarryingChargesName: companyValues.CarryingChargesName,
      CarryingChargesStartDate: companyValues.CarryingChargesStartDate,
      CarryingChargesEndDate: companyValues.CarryingChargesEndDate,
      PlaidClientID: companyValues.PlaidClientID,
      PlaidDevelopmentSecretKey: companyValues.PlaidDevelopmentSecretKey,
      PlaidSandboxSecretKey: companyValues.PlaidSandboxSecretKey,
      developmentURL: companyValues.developmentURL,
      productionURL: companyValues.productionURL,
      sandboxURL: companyValues.sandboxURL,
      UsingLive: companyValues.UsingLive,

      basecurrency: companyValues.basecurrency,
      personalrealestatecode: companyValues.personalrealestatecode,
      startdateforreports: companyValues.startdateforreports,
      enddateforreports: companyValues.enddateforreports,
      primerate: companyValues.primerate,
      lastpdffile: companyValues.lastpdffile,
    }),
  };
  const url = `${process.env.REACT_APP_BASE_URL}/updateCompanydata`;
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

export const fetchcompanyold = async (companynumber) => {
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
      };
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

export const fetchclientdata = async (clientsent) => {
  var requestoptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json;",
    },
    body: JSON.stringify({
      requestedclientcode: clientsent,
    }),
  };
  const url = `${process.env.REACT_APP_BASE_URL}/fetchClientData`;
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
        CLIENTCODE: json.user_response.bankq.CLIENTCODE,
        NAME: json.user_response.bankq.NAME,
        ADDRESSLINEONE: json.user_response.bankq.ADDRESSLINEONE,
        ADDRESSLINETWO: json.user_response.bankq.ADDRESSLINETWO,
        ADDRESSLINETHREE: json.user_response.bankq.ADDRESSLINETHREE,
        ADDRESSLINEFOUR: json.user_response.bankq.ADDRESSLINEFOUR,
        COUNTRY: json.user_response.bankq.COUNTRY,
        POSTALZIP: json.user_response.bankq.POSTALZIP,
        UNIQUEID: json.user_response.bankq.UNIQUEID,
      };
    });
};

export const updateClient = async (requestedclientcode, companyValues) => {
  //companyValues.AddressLineThree = "corner light";
  var requestoptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json;",
    },
    body: JSON.stringify({
      Name: companyValues.Name,
      AddressLineOne: companyValues.AddressLineOne,
      AddressLineTwo: companyValues.AddressLineTwo,
      AddressLineThree: companyValues.AddressLineThree,
      AddressLineFour: companyValues.AddressLineFour,
      Country: companyValues.Country,
      PostalZip: companyValues.PostalZip,
      UniqueID: companyValues.UniqueID,
    }),
  };
  const url = `${process.env.REACT_APP_BASE_URL}/updateClientData`;
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

export const getBankData = (clientcode, administrator) => {
  // TODO: Need to update this to pull from your own service. URL will look something like
  // const url = `${process.env.REACT_APP_BASE_URL}/returnbankdata`;
  var passedclient = "";
  if (clientcode !== "") {
    passedclient = clientcode;
  } else {
    passedclient = "X";
  }

  var requestoptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json;",
    },
    body: JSON.stringify({
      sentclientcode: passedclient,
      sentadministrator: administrator,
    }),
  };
  const url = `${process.env.REACT_APP_BASE_URL}/returnbankdata`;

  return fetch(url, requestoptions) // Request fish
    .then((bankdata) => {
      if (!bankdata.ok) {
        //console.log(bankdata);
        throw new Error("wtf?");
      }
      return bankdata.json();
    })
    .then((bankrecords) => {
      //bankdata = JSON.parse(chips.responseText.FPClientBankAccount);
      //console.log(bankrecords);
      return bankrecords.user_response.bankq;
    });
};

export const PasswordUpdate = (username, password) => {
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

  const url = `${process.env.REACT_APP_BASE_URL}/changepassword`;

  //console.log(username);

  return fetch(url, requestoptions) // Request fish
    .then((response) => {
      if (!response.ok) {
        //console.log(response);
        throw new Error("wtf?");
      }
      return response.json();
    })
    .then((json) => {
      //console.log(json);
      if (json.user_response.returnguid !== "invalid user") {
        return {
          returnOK: json.user_response.returnOK,
        };
      } else {
        //throw new Error("invalid username/password");
        return { loginmessage: "Invalid username/password" };
      }
    });
};

export const PostAccount = (
  clientcode,
  institution,
  loginid,
  requestid,
  senturl
) => {
  var requestoptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json;",
    },
    body: JSON.stringify({
      sentclientcode: clientcode,
      sentinstitution: institution,
      sentloginid: loginid,
      sentrequestid: requestid,
      senturl: senturl,
    }),
  };

  const url = `${process.env.REACT_APP_BASE_URL}/PostAccount`;

  return fetch(url, requestoptions) // Request fish
    .then((response) => {
      if (!response.ok) {
        //console.log(response);
        throw new Error("wtf?");
      }
      return response.json();
    })
    .then((json) => {
      //console.log(json);
      if (json.user_response.returnguid !== "invalid user") {
        return {
          returnOK: json.user_response.returnOK,
        };
      } else {
        //throw new Error("invalid username/password");
        return { loginmessage: "Invalid username/password" };
      }
    });
};
export const ValidateBanks = async (username, password) => {
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

  const url = `${process.env.REACT_APP_BASE_URL}/ValidateUserCommit`;

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
          authorized: "Y",
        };
      } else {
        //throw new Error("invalid username/password");
        return {
          returnOK: json.user_response.ReturnOK,
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
export const PostInvestmentAccount = (
  clientcode,
  institution,
  loginid,
  requestid,
  senturl
) => {
  var requestoptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json;",
    },
    body: JSON.stringify({
      sentclientcode: clientcode,
      sentinstitution: institution,
      sentloginid: loginid,
      sentrequestid: requestid,
      senturl: senturl,
    }),
  };

  const url = `${process.env.REACT_APP_BASE_URL}/PostInvestmentAccount`;

  return fetch(url, requestoptions) // Request fish
    .then((response) => {
      if (!response.ok) {
        //console.log(response);
        throw new Error("wtf?");
      }
      return response.json();
    })
    .then((json) => {
      //console.log(json);
      if (json.user_response.returnguid !== "invalid user") {
        return {
          returnOK: json.user_response.returnOK,
        };
      } else {
        //throw new Error("invalid username/password");
        return { loginmessage: "Invalid username/password" };
      }
    });
};

export const getBankNames = (clientcode, administrator) => {
  // TODO: Need to update this to pull from your own service. URL will look something like
  // const url = `${process.env.REACT_APP_BASE_URL}/returnbankdata`;
  var passedclient = "";
  if (clientcode !== "") {
    passedclient = clientcode;
  } else {
    passedclient = "X";
  }

  var requestoptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json;",
    },
    body: JSON.stringify({
      sentclientcode: passedclient,
      sentadministrator: administrator,
    }),
  };
  const url = `${process.env.REACT_APP_BASE_URL}/returnbankcodes`;

  return fetch(url, requestoptions) // Request fish
    .then((bankdata) => {
      if (!bankdata.ok) {
        //console.log(bankdata);
        throw new Error("wtf?");
      }
      return bankdata.json();
    })
    .then((bankrecords) => {
      //bankdata = JSON.parse(chips.responseText.FPClientBankAccount);
      //console.log(bankrecords);
      return bankrecords.user_response.bankq;
    });
};

export const getNetAssets = (clientcode) => {
  // TODO: Need to update this to pull from your own service. URL will look something like
  // const url = `${process.env.REACT_APP_BASE_URL}/returnbankdata`;
  var passedclient = "";
  if (clientcode !== "") {
    passedclient = clientcode;
  } else {
  }
  //console.log(passedclient);

  var requestoptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json;",
    },
    body: JSON.stringify({
      sentclientcode: passedclient,
    }),
  };
  const url = `${process.env.REACT_APP_BASE_URL}/returnnetassets`;

  return fetch(url, requestoptions) // Request fish
    .then((bankdata) => {
      if (!bankdata.ok) {
        //console.log(bankdata);
        throw new Error("wtf?");
      }
      return bankdata.json();
    })
    .then((bankrecords) => {
      //bankdata = JSON.parse(chips.responseText.FPClientBankAccount);
      //console.log(bankrecords);
      return bankrecords.user_response.bankq;
    });
};

export const getNetWorth = (clientcode) => {
  // TODO: Need to update this to pull from your own service. URL will look something like
  // const url = `${process.env.REACT_APP_BASE_URL}/returnbankdata`;
  var passedclient = "";
  if (clientcode !== "") {
    passedclient = clientcode;
  } else {
  }
  //console.log(passedclient);

  var requestoptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json;",
    },
    body: JSON.stringify({
      sentclientcode: passedclient,
    }),
  };
  const url = `${process.env.REACT_APP_BASE_URL}/returnnetworth`;

  return fetch(url, requestoptions) // Request fish
    .then((bankdata) => {
      if (!bankdata.ok) {
        //console.log(bankdata);
        throw new Error("wtf?");
      }
      return bankdata.json();
    })
    .then((bankrecords) => {
      //bankdata = JSON.parse(chips.responseText.FPClientBankAccount);
      //console.log(bankrecords);
      return bankrecords.user_response.bankq;
    });
};
