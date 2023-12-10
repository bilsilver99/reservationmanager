export const updateInterest = async (
  requestedclientcode,
  bankaccount,
  segment,
  startdate,
  enddate,
  allAccounts
) => {
  console.log(
    "client in:",
    requestedclientcode,
    "account",
    bankaccount,
    "start",
    startdate,
    "end",
    enddate,
    "all",
    allAccounts
  );
  //companyValues.AddressLineThree = "corner light";
  var requestoptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json;",
    },
    body: JSON.stringify({
      requestedclientcode: requestedclientcode,
      bankaccount: bankaccount,
      segment: segment,
      startdate: startdate,
      enddate: enddate,
      allaccounts: allAccounts,
    }),
  };
  const url = `${process.env.REACT_APP_BASE_URL}/updateClientInterest`;
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
///////////////
export const resetInterest = async (
  requestedclientcode,
  bankaccount,
  segment,
  startdate,
  enddate,
  allAccounts
) => {
  console.log(
    "client in:",
    requestedclientcode,
    "account",
    bankaccount,
    "start",
    startdate,
    "end",
    enddate,
    "all",
    allAccounts
  );
  //companyValues.AddressLineThree = "corner light";
  var requestoptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json;",
    },
    body: JSON.stringify({
      requestedclientcode: requestedclientcode,
      bankaccount: bankaccount,
      segment: segment,
      startdate: startdate,
      enddate: enddate,
      allaccounts: allAccounts,
    }),
  };
  const url = `${process.env.REACT_APP_BASE_URL}/resetClientInterest`;
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
