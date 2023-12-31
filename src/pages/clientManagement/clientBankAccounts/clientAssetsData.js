import CustomStore from "devextreme/data/custom_store";
function isNotEmpty(value) {
  return value !== undefined && value !== null && value !== "";
}

export const getAssetTypes = (myClient) => {
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
  console.log("client sent", myClient);
  const url = `${process.env.REACT_APP_BASE_URL}/getAssetTypes`;
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
      console.log("asset groups", json);
      return {
        data: json.user_response.loginq,
      };
    });
};

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
  console.log("client sent", myClient);
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

export const assetStore = (myClient) =>
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
      const url = `${process.env.REACT_APP_BASE_URL}/getClientAssetHeader`;
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
          //console.log("from client: ", myClient, "assets go bang: ", json);
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
      const url = `${process.env.REACT_APP_BASE_URL}/updateClientAssetHeader`;
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
      const url = `${process.env.REACT_APP_BASE_URL}/updateClientAssetHeader`;
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
      const url = `${process.env.REACT_APP_BASE_URL}/updateClientAssetHeader`;
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
  const url = `${process.env.REACT_APP_BASE_URL}/getAssetDetails`;
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
///////////////////////////////////////////////////////
export const mystore6 = (myClient) =>
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
      const url = `${process.env.REACT_APP_BASE_URL}/getClientAssetHeader`;
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

///////////////////////////////////////////////////////
export const mystore7 = (bankID, rangeValue) =>
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
      //myemployee = "b@b.com";
      //mycompany = 1;
      //myemployee = "b@b.com";
      ////console.log("bank", bankID, "range", rangeValue);
      ////console.log(rangeValue);
      params = params.slice(0, -1);
      var requestoptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json;",
        },
        body: JSON.stringify({
          sentbankid: bankID,
          Parameters: params,
          daterange: rangeValue,
        }),
      };
      const url = `${process.env.REACT_APP_BASE_URL}/returnClientAssetDetails`;
      return new Promise((resolve, reject) => {
        fetch(url, requestoptions)
          .then((response) => {
            if (!response.ok) {
              reject(new Error("System did not respond"));
            }
            return response.json();
          })
          .then((json) => {
            // console.log(
            //   "bank: ",
            //   bankID,
            //   "data",
            //   json.user_response.bankq,
            //   "total count",
            //   json.user_response.totalCount,
            //   "key",
            //   json.user_response.keyname
            // );
            resolve(json.user_response.bankq);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    totalCount: (loadOptions) => {
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
      return new Promise((resolve, reject) => {
        fetchData(bankID, params, rangeValue)
          .then((json) => {
            resolve(json.user_response.totalCount);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    insert: (values) => {
      ////console.log(values, bankID);
      var requestoptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json;",
        },
        body: JSON.stringify({
          ThisFunction: "insert",
          keyvaluepair: values,
          sentbankID: bankID,
        }),
      };
      const url = `${process.env.REACT_APP_BASE_URL}/updateClientAssetDetails`;
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
      ////console.log(key);
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
      const url = `${process.env.REACT_APP_BASE_URL}/updateClientAssetDetails`;
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
      ////console.log(key);
      ////console.log(values);
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
      //console.log("update", requestoptions, "key:", key, "values:", values);
      const url = `${process.env.REACT_APP_BASE_URL}/updateClientAssetDetails`;
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

const fetchData = (bankID, params, rangeValue) => {
  var requestoptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json;",
    },
    body: JSON.stringify({
      sentbankid: bankID,
      Parameters: params,
      daterange: rangeValue,
    }),
  };
  const url = `${process.env.REACT_APP_BASE_URL}/returnbanktransactionsOnly`;

  return fetch(url, requestoptions).then((response) => {
    if (!response.ok) {
      throw new Error("System did not respond");
    }
    return response.json();
  });
};
