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

      //mycompany = 1;

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
      //lert("in mystore for some reason");
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
          ////console.log(json);
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
          sentclientcode: myClient,
        }),
      };
      const url = `${process.env.REACT_APP_BASE_URL}/updateServices`;
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
          sentclientcode: key,
          ThisFunction: "delete",
        }),
      };
      const url = `${process.env.REACT_APP_BASE_URL}/updateServices`;
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
          sentclientcode: key,
          keyvaluepair: values,
        }),
      };

      const url = `${process.env.REACT_APP_BASE_URL}/updateServices`;
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
export const mystore2 = (bankID, rangeValue) =>
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
      const url = `${process.env.REACT_APP_BASE_URL}/returnbankSegmentsOnly`;
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
      const url = `${process.env.REACT_APP_BASE_URL}/UpdatebankSegmentsOnly`;
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
      const url = `${process.env.REACT_APP_BASE_URL}/UpdatebankSegmentsOnly`;
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
      const url = `${process.env.REACT_APP_BASE_URL}/UpdatebankSegmentsOnly`;
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

export const mystore3 = (bankID, rangeValue) =>
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
      const url = `${process.env.REACT_APP_BASE_URL}/returnSegmentbanktransactionsOnly`;
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
      console.log("values", values, "ID:", bankID);
      const url = `${process.env.REACT_APP_BASE_URL}/UpdatebankSegmentTransactions`;
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
      console.log("Key", key);
      const url = `${process.env.REACT_APP_BASE_URL}/UpdatebankSegmentTransactions`;
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
      const url = `${process.env.REACT_APP_BASE_URL}/UpdatebankSegmentTransactions`;
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

export const mystore4 = (ClientCode, rangeValue) =>
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
          sentclientcode: ClientCode,
          Parameters: params,
        }),
      };
      const url = `${process.env.REACT_APP_BASE_URL}/returnDebtSummary`;
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
            //   "client: ",
            //   ClientCode,
            //   "data",
            //   json.user_response.FPTransq,
            //   "total count",
            //   json.user_response.totalCount,
            //   "key",
            //   json.user_response.keyname
            // );
            resolve(json.user_response.FPTransq);
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
        fetchData(ClientCode, params, rangeValue)
          .then((json) => {
            resolve(json.user_response.totalCount);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  });

export const fetchSegment = (bankID, segment) => {
  var requestoptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json;",
    },
    body: JSON.stringify({
      sentbankid: bankID,
      sentSegment: segment,
    }),
  };
  console("bankID", bankID, "segment", segment);
  const url = `${process.env.REACT_APP_BASE_URL}/fetchThisSegmment`;

  return fetch(url, requestoptions).then((response) => {
    if (!response.ok) {
      throw new Error("System did not respond");
    }
    return response.json();
  });
};

export const getTransactionTypes = (bankID, segment) => {
  var requestoptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json;",
    },
    body: JSON.stringify({
      sentbankid: bankID,
      sentSegment: segment,
    }),
  };
  //console("bankID", bankID, "segment", segment);
  const url = `${process.env.REACT_APP_BASE_URL}/getTransactionTypes`;
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
      console.log(json);
      return {
        data: json.user_response.loginq,
        totalCount: json.user_response.totalCount,
        key: json.user_response.keyname,
      };
    });
};
export const mystore5nope = (bankID, rangeValue, startdate, enddate) =>
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
          startdate: startdate,
          enddate: enddate,
        }),
      };
      console.log("startdate definite", startdate);
      const url = `${process.env.REACT_APP_BASE_URL}/returnClientbanktransactionsOnly`;

      return new Promise((resolve, reject) => {
        fetch(url, requestoptions)
          .then((response) => {
            if (!response.ok) {
              reject(new Error("System did not respond"));
            }
            return response.json();
          })
          .then((json) => {
            console.log(
              "bank: ",
              bankID,
              "data",
              json.user_response.bankq,
              "total count",
              json.user_response.totalCount,
              "key",
              json.user_response.keyname
            );
            //alert("after call");
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
          sentcompany: bankID,
        }),
      };
      //console.log("values", values, "ID:", bankID);
      const url = `${process.env.REACT_APP_BASE_URL}/UpdateClientTransactions`;
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
          return json.user_response.keyvaluepair;
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
          sentcompany: key,
          ThisFunction: "delete",
        }),
      };
      //console.log("Key", key);
      const url = `${process.env.REACT_APP_BASE_URL}/UpdateClientTransactions`;
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

      const url = `${process.env.REACT_APP_BASE_URL}/UpdateClientTransactions`;
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
  //console("bankID", bankID, "segment", segment);
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
      //console.log("bank stuff", json);
      return {
        data: json.user_response.bankq,
        totalCount: json.user_response.totalCount,
        key: json.user_response.keyname,
      };
    });
};
//////////////////
export const mystore6 = (bankID, rangeValue) =>
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
      console.log("inside mystore6 looking for ", bankID, rangeValue);
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
      const url = `${process.env.REACT_APP_BASE_URL}/returnImportBankTransactionsOnly`;
      return new Promise((resolve, reject) => {
        fetch(url, requestoptions)
          .then((response) => {
            if (!response.ok) {
              reject(new Error("System did not respond"));
            }
            return response.json();
          })
          .then((json) => {
            console.log(
              "sentbankid: ",
              bankID,
              "data",
              json.user_response.bankq,
              "total count",
              json.user_response.totalCount,
              "key",
              json.user_response.keyname
            );
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
          sentcompany: bankID,
        }),
      };
      //console.log("values", values, "ID:", bankID);
      const url = `${process.env.REACT_APP_BASE_URL}/UpdateImportClientTransactions`;
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
          return json.user_response.keyvaluepair;
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
          sentcompany: key,
          ThisFunction: "delete",
        }),
      };
      //console.log("Key", key);
      const url = `${process.env.REACT_APP_BASE_URL}/UpdateImportClientTransactions`;
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
          sentcompany: key,
          keyvaluepair: values,
        }),
      };
      console.log("update", requestoptions, "key:", key, "values:", values);
      const url = `${process.env.REACT_APP_BASE_URL}/UpdateImportClientTransactions`;
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
export const validateImports = (bankID) => {
  var requestoptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json;",
    },
    body: JSON.stringify({
      sentbankID: bankID,
    }),
  };
  //console("bankID", bankID, "segment", segment);
  const url = `${process.env.REACT_APP_BASE_URL}/validateImports`;
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
      ////console.log(json);
      return {
        valid: json.user_response.valid,
      };
    });
};

export const processImports = (bankID, startdate, enddate) => {
  var requestoptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json;",
    },
    body: JSON.stringify({
      sentbankID: bankID,
      startdate: startdate,
      enddate: enddate,
    }),
  };
  console.log("customer", bankID, startdate, enddate);
  const url = `${process.env.REACT_APP_BASE_URL}/processImports`;
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
      ////console.log(json);
      return {
        valid: json.user_response.valid,
      };
    });
};

///////////////////////////////
export const deleteImports = (bankID) => {
  var requestoptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json;",
    },
    body: JSON.stringify({
      sentbankID: bankID,
    }),
  };
  console.log("customer", bankID);
  const url = `${process.env.REACT_APP_BASE_URL}/deleteImports`;
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
      ////console.log(json);
      return {
        valid: json.user_response.valid,
      };
    });
};

//////////////////////////////////////////
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
      console.log("data stuff", json);
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
        COPPERID: json.user_response.bankq.COPPERID,
      };
    });
};
export const updateClient = async (requestedclientcode, companyValues) => {
  //console.log("client in:", requestedclientcode, companyValues);
  //companyValues.AddressLineThree = "corner light";
  var requestoptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json;",
    },
    body: JSON.stringify({
      clientcode: requestedclientcode,
      Name: companyValues.Name,
      AddressLineOne: companyValues.AddressLineOne,
      AddressLineTwo: companyValues.AddressLineTwo,
      AddressLineThree: companyValues.AddressLineThree,
      AddressLineFour: companyValues.AddressLineFour,
      Country: companyValues.Country,
      PostalZip: companyValues.PostalZip,
      UniqueID: companyValues.UniqueID,
      startdate: companyValues.StartDate,
      enddate: companyValues.EndDate,
      copperid: companyValues.CopperID,
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
