import CustomStore from "devextreme/data/custom_store";
function isNotEmpty(value) {
  return value !== undefined && value !== null && value !== "";
}

export const getBanks = (myClient) => {
  //var myClient = 1;
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
  const url = `${process.env.REACT_APP_BASE_URL}/getClientbankAccounts`;
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
      //console.log("asset groups", json);
      return {
        data: json.user_response.bankq,
      };
    });
};

export const getBankName = (myClient, MybankAccount) => {
  //var myClient = 1;
  var requestoptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json;",
    },
    body: JSON.stringify({
      sentclientcode: myClient,
      sentBankAccount: MybankAccount,
    }),
  };

  console.log("client sent", myClient, "bank account sent", MybankAccount);

  const url = `${process.env.REACT_APP_BASE_URL}/getClientbankAccountName`;
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
      console.log(
        "client sent",
        myClient,
        "bank account",
        MybankAccount,
        "bank name ",
        json
      );
      return {
        data: json.user_response.returnedName,
        daterow: json.user_response.daterow,
        descriptionrow: json.user_response.descriptionrow,
        paymentsrow: json.user_response.paymentsrow,
        depositsrow: json.user_response.depositsrow,
      };
    });
};

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
          sentclientcode: myClient,
          Parameters: params,
        }),
      };
      const url = `${process.env.REACT_APP_BASE_URL}/getClientbankAccounts`;
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
          //console.log("from client: ", myClient, "types: ", json);
          return {
            data: json.user_response.bankq,
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
          SentCompany: myClient,
        }),
      };
      const url = `${process.env.REACT_APP_BASE_URL}/updateClientbankAccounts`;
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
      ////console.log(values);
      var requestoptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json;",
        },
        body: JSON.stringify({
          SentCompany: key,
          ThisFunction: "delete",
        }),
      };
      const url = `${process.env.REACT_APP_BASE_URL}/updateClientbankAccounts`;
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
      //console.log("key: ", key);
      //console.log("values: ", values);
      var requestoptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json;",
        },
        body: JSON.stringify({
          ThisFunction: "change",
          SentCompany: key,
          keyvaluepair: values,
        }),
      };
      //console.log("key: ', key", "values", values);
      const url = `${process.env.REACT_APP_BASE_URL}/updateClientbankAccounts`;
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

export const mystore2 = (myClient) => {};

export const myStore3 = () => {
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
      //console.log("banks list", json);
      return {
        data: json.user_response.loginq,
      };
    });
};

export const myStore4 = (myClient) => {
  //var myClient = 1;
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
  const url = `${process.env.REACT_APP_BASE_URL}/getClientOwners`;
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
      //console.log("banks list", json);
      return {
        data: json.user_response.bankq,
      };
    });
};

export const myStore5 = (myClient) => {
  //var myClient = 1;
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
  const url = `${process.env.REACT_APP_BASE_URL}/getBankAccountTypes`;
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
      //console.log("banks list", json);
      return {
        data: json.user_response.loginq,
      };
    });
};

export const updateImportFile = (clientcode, bankaccount, dataArray) => {
  console.log("array from web page", dataArray.data);
  //var myClient = 1;
  const sentArray = dataArray.data.map(
    ([date, description, payments, deposits, total]) => ({
      DATEFIELD: date,
      DESCRIPTIONFIELD: description,
      PAYMENTSFIELD: payments,
      DEPOSITSFIELD: deposits,
      TOTALFIELD: total,
    })
  );

  // Create the final object
  const dataToSend = {
    sentArray: sentArray,
  };
  var requestoptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json;",
    },
    body: JSON.stringify({
      sentclientcode: clientcode,
      sentBankAccount: bankaccount,
      sentArray: sentArray,
    }),
  };
  console.log(
    "client sent",
    clientcode,
    "bank account sent",
    bankaccount,
    "data sent",
    dataToSend
  );
  const url = `${process.env.REACT_APP_BASE_URL}/SendImportFileData`;
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
      //console.log("banks list", json);
      return {
        data: json.user_response.loginq,
      };
    });
};
/////////////////////////////////
export const updateImportFileV2 = (clientcode, bankaccount, dataArray) => {
  console.log(
    "clientcode",
    clientcode,
    "banksaccount",
    bankaccount,
    "array from web page",
    dataArray
  );
  //var myClient = 1;
  const sentArray = dataArray.map(
    ([date, description, payments, deposits, total]) => ({
      DATEFIELD: date,
      DESCRIPTIONFIELD: description,
      PAYMENTSFIELD: payments,
      DEPOSITSFIELD: deposits,
      TOTALFIELD: total,
    })
  );

  // Create the final object
  const dataToSend = {
    sentArray: sentArray,
  };
  var requestoptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json;",
    },
    body: JSON.stringify({
      sentclientcode: clientcode,
      sentBankAccount: bankaccount,
      sentArray: sentArray,
    }),
  };
  console.log(
    "client sent",
    clientcode,
    "bank account sent",
    bankaccount,
    "data sent",
    dataToSend
  );
  const url = `${process.env.REACT_APP_BASE_URL}/SendImportFileData`;
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
      //console.log("banks list", json);
      return {
        data: json.user_response.loginq,
      };
    });
};
