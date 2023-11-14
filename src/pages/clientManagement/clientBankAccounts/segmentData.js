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
      ////console.log(json);
      return {
        data: json.user_response.loginq,
        totalCount: json.user_response.totalCount,
        key: json.user_response.keyname,
      };
    });
};
export const mystore5 = (bankID, rangeValue) =>
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
