import CustomStore from "devextreme/data/custom_store";
function isNotEmpty(value) {
  return value !== undefined && value !== null && value !== "";
}

export const mystore = (myClient) =>
  new CustomStore({
    key: "UNIQUEID",
    load: (loadOptions) => {
      let params = "?";
      [
        "skip",
        "take",
        "requireTotalCount",
        "requireGroupCount",
        "sort",
        "filter",
        "totalSummary",
        "group",
        "groupSummary",
      ].forEach((i) => {
        if (i in loadOptions && isNotEmpty(loadOptions[i])) {
          params += `${i}=${JSON.stringify(loadOptions[i])}&`;
        }
      });

      params = params.slice(0, -1);
      var requestoptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json;",
        },
        body: JSON.stringify({
          sentCompany: myClient,
          Parameters: params,
        }),
      };
      const url = `${process.env.REACT_APP_BASE_URL}/getCodeMapping`;
      return fetch(url, requestoptions) // Request fish
        .then((response) => {
          //console.log("client " + myClient);
          if (!response.ok) {
            return {
              companyname: "System did not respond",
              returnaddress: " ",
            };
          }
          return response.json();
        })
        .then((json) => {
          console.log("types: ", json);
          return {
            data: json.user_response.loginq,
            totalCount: json.user_response.totalCount,
            key: json.user_response.keyname,
          };
        });
    },
    insert: (values) => {
      var requestoptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json;",
        },
        body: JSON.stringify({
          ThisFunction: "insert",
          keyvaluepair: values,
          sentCompany: myClient,
        }),
      };
      const url = `${process.env.REACT_APP_BASE_URL}/updateCodeMapping`;
      return fetch(url, requestoptions) // Request fish
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
    },
    remove: (key) => {
      //console.log(key);
      //console.log(values);
      var requestoptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json;",
        },
        body: JSON.stringify({
          sentCompany: key,
          ThisFunction: "delete",
        }),
      };
      const url = `${process.env.REACT_APP_BASE_URL}/updateCodeMapping`;
      return fetch(url, requestoptions) // Request fish
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
    },
    update: (key, values) => {
      console.log("key: ", key);
      console.log("values: ", values);
      var requestoptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json;",
        },
        body: JSON.stringify({
          ThisFunction: "change",
          sentCompany: key,
          keyvaluepair: values,
        }),
      };
      const url = `${process.env.REACT_APP_BASE_URL}/updateCodeMapping`;
      return fetch(url, requestoptions) // Request fish
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
    },
  });
//
//////////////////////////////////////////////////////////////////////////////
//
export const bankStore = async () => {
  var myClient = 1;
  var requestoptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json;",
    },
    body: JSON.stringify({
      sentclientcode: myClient,
    }),
  };
  const url = `${process.env.REACT_APP_BASE_URL}/getBanks`;

  try {
    const response = await fetch(url, requestoptions); // Await the fetch request

    if (!response.ok) {
      // If the response is not okay, throw an error or return an alternative result
      return {
        companyname: "System did not respond",
        returnaddress: " ",
      };
    }

    const json = await response.json(); // Await the response to be converted to JSON

    console.log("banks: ", json);

    return {
      data: json.user_response.loginq,
    };
  } catch (error) {
    console.error("Error fetching banks:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

export const customerStore = async () => {
  var myClient = 1;
  var requestoptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json;",
    },
    body: JSON.stringify({
      sentclientcode: myClient,
    }),
  };
  const url = `${process.env.REACT_APP_BASE_URL}/getClients`;

  try {
    const response = await fetch(url, requestoptions); // Await the fetch request

    if (!response.ok) {
      // If the response is not okay, throw an error or return an alternative result
      return {
        companyname: "System did not respond",
        returnaddress: " ",
      };
    }

    const json = await response.json(); // Await the response to be converted to JSON

    console.log("Clients: ", json);

    return {
      data: json.user_response.loginq,
    };
  } catch (error) {
    console.error("Error fetching banks:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

export const transactionTypesStore = async () => {
  var myClient = 1;
  var requestoptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json;",
    },
    body: JSON.stringify({
      sentclientcode: myClient,
    }),
  };
  const url = `${process.env.REACT_APP_BASE_URL}/getTransactionTypes`;

  try {
    const response = await fetch(url, requestoptions); // Await the fetch request

    if (!response.ok) {
      // If the response is not okay, throw an error or return an alternative result
      return {
        companyname: "System did not respond",
        returnaddress: " ",
      };
    }

    const json = await response.json(); // Await the response to be converted to JSON

    console.log("Transactions: ", json);

    return {
      data: json.user_response.loginq,
    };
  } catch (error) {
    console.error("Error fetching banks:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};
export const getBanks = (myClient) => {
  var requestoptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json;",
    },
    body: JSON.stringify({
      sentclientcode: myClient,
    }),
  };
  console.log("client", myClient);
  const url = `${process.env.REACT_APP_BASE_URL}/returnbankdataonly`;
  return fetch(url, requestoptions) // Request fish
    .then((response) => {
      ////console.log("client " + myClient);
      if (!response.ok) {
        return {
          companyname: "System did not respond",
          returnaddress: " ",
        };
      }
      return response.json();
    })
    .then((json) => {
      console.log("bank stuff", json.user_response.bankq);
      return {
        data: json.user_response.bankq,
        totalCount: json.user_response.totalCount,
        key: json.user_response.keyname,
      };
    });
};

// export const customerStore = () => {
//   var myClient = 1;
//   var requestoptions = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Accept: "application/json;",
//     },
//     body: JSON.stringify({
//       sentclientcode: myClient,
//     }),
//   };
//   const url = `${process.env.REACT_APP_BASE_URL}/getClients`;
//   return fetch(url, requestoptions) // Request fish
//     .then((response) => {
//       //console.log("client " + myClient);
//       if (!response.ok) {
//         return {
//           companyname: "System did not respond",
//           returnaddress: " ",
//         };
//       }
//       return response.json();
//     })
//     .then((json) => {
//       console.log("clients: ", json);
//       return {
//         data: json.user_response.loginq,
//       };
//     });
// };
// export const transactionTypesStore = () => {
//   var myClient = 1;
//   var requestoptions = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Accept: "application/json;",
//     },
//     body: JSON.stringify({
//       sentadministrator: myClient,
//     }),
//   };
//   const url = `${process.env.REACT_APP_BASE_URL}/getTransactionTypes`;
//   return fetch(url, requestoptions) // Request fish
//     .then((response) => {
//       if (!response.ok) {
//         return {
//           companyname: "System did not respond",
//           returnaddress: " ",
//         };
//       }
//       return response.json();
//     })
//     .then((json) => {
//       console.log("transaction codes: ", json);
//       return {
//         data: json.user_response.loginq,
//       };
//     });
// };
