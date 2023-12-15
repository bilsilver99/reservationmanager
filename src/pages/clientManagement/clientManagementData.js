export const getClients = async () => {
  const companynumber = 1;
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
  const url = `${process.env.REACT_APP_BASE_URL}/getClientData`;
  return fetch(url, requestoptions) // Request fish
    .then((response) => {
      //console.log("company:", companynumber);
      if (!response.ok) {
        return {
          companyname: "System did not respond",
          returnaddress: " ",
        };
      }
      return response.json();
    })
    .then((json) => {
      //console.log("data stuff", json);
      return {
        data: json.user_response.loginq.map((item) => ({
          label: item.CLIENTCODE,
          value: item.UNIQUEID,
        })),
        totalCount: json.user_response.totalCount,
        key: json.user_response.keyname,
        // data: json.user_response.mdata,
        // totalCount: json.user_response.totalCount,
        // key: json.user_response.keyname,
      };
    });
};
export const fetchThisClientData = async (clientCode) => {
  //console.log("client in:", clientCode);
  var requestoptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json;",
    },
    body: JSON.stringify({
      requestedclientcode: clientCode,
    }),
  };
  const url = `${process.env.REACT_APP_BASE_URL}/getClientCode`;
  return fetch(url, requestoptions) // Request fish
    .then((response) => {
      //console.log("company:", companynumber);
      if (!response.ok) {
        return {
          companyname: "System did not respond",
          returnaddress: " ",
        };
      }
      return response.json();
    })
    .then((json) => {
      //console.log("data stuff", json);
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
        STARTDATE: json.user_response.bankq.STARTDATE,
        ENDDATE: json.user_response.bankq.ENDDATE,
        STARTYEARINTEREST: json.user_response.bankq.STARTYEARINTEREST,
        STARTMONTHINTEREST: json.user_response.bankq.STARTMONTHINTEREST,
        ENDYEARINTEREST: json.user_response.bankq.ENDYEARINTEREST,
        ENDMONTHINTEREST: json.user_response.bankq.ENDMONTHINTEREST,
        startinterestperiod: json.user_response.bankq.STARTINTEREST,
        endinterestperiod: json.user_response.bankq.ENDINTEREST,
      };
    });
};
export const updateClient = async (requestedclientcode, companyValues) => {
  console.log("client in:", requestedclientcode);
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
      startdate: companyValues.startdate,
      enddate: companyValues.enddate,
    }),
  };
  const url = `${process.env.REACT_APP_BASE_URL}/updateClientDataAdmin`;
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

///////////////////////////////////////////////////////
///const updateCurrentClient = (clientCode) => {  }
//////////////////////////////////////////////////////
export const updateCurrentUser = async (usercode, clientcode) => {
  //console.log("client in:", requestedclientcode);
  //companyValues.AddressLineThree = "corner light";
  var requestoptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json;",
    },
    body: JSON.stringify({
      usercode: usercode,
      clientcode: clientcode,
    }),
  };
  const url = `${process.env.REACT_APP_BASE_URL}/updateClientDataAdmin`;
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
