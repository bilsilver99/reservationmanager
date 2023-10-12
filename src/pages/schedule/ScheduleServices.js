export const mystore = async (companynumber) => {
  console.log("company in:", companynumber);
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
  const url = `${process.env.REACT_APP_BASE_URL}/GetAllServiceLevels`;
  return fetch(url, requestoptions) // Request fish
    .then((response) => {
      console.log("company:", companynumber);
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
      return {
        data: json.user_response.mdata.map((item) => ({
          label: item.DESCRIPTION,
          value: item.MINUTESREQUIRED,
          key: item.UNIQUEID,
        })),
        totalCount: json.user_response.totalCount,
        key: json.user_response.keyname,
        // data: json.user_response.mdata,
        // totalCount: json.user_response.totalCount,
        // key: json.user_response.keyname,
      };
    });
};

export const myshift = async (companynumber) => {
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
  const url = `${process.env.REACT_APP_BASE_URL}/Getshifts`;
  return fetch(url, requestoptions) // Request fish
    .then((response) => {
      console.log(companynumber);
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
      return {
        startshift: json.user_response.StartShift,
        endshift: json.user_response.EndShift,
      };
    });
};

export const myEmployees = async (companynumber) => {
  console.log("company in:", companynumber);
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
  const url = `${process.env.REACT_APP_BASE_URL}/getEmployees`;
  return fetch(url, requestoptions) // Request fish
    .then((response) => {
      console.log("company:", companynumber);
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
      return {
        data: json.user_response.mdata.map((item) => ({
          label: item.OPERATORNAME,
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

export const myAppointments = async (companynumber, currentEmployeeName) => {
  //const ThisEmployee = 2;
  console.log("company in:", companynumber);
  var requestoptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json;",
    },
    body: JSON.stringify({
      SentCompany: companynumber,
      SentOperatorName: currentEmployeeName,
    }),
  };
  const url = `${process.env.REACT_APP_BASE_URL}/getAppointments`;
  return fetch(url, requestoptions) // Request fish
    .then((response) => {
      console.log("company:", companynumber);
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
      return {
        data: json.user_response.mdata.map((item) => ({
          text: item.DESCRIPTION,
          startDate: item.STARTDATE,
          endDate: item.ENDDATE,
        })),
        totalCount: json.user_response.totalCount,
        key: json.user_response.keyname,
        // data: json.user_response.mdata,
        // totalCount: json.user_response.totalCount,
        // key: json.user_response.keyname,
      };
    });
};

export const addAppointment = async (
  companynumber,
  currentEmployeeName,
  startDate,
  endDate,
  description,
  text,
  //appointmentData,
  currentCellkey
) => {
  //const ThisEmployee = 2;
  console.log("company in:", companynumber);
  console.log("Employee:", currentEmployeeName);
  console.log("Appointment:", text);
  console.log("service:", currentCellkey);

  var requestoptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json;",
    },
    body: JSON.stringify({
      // "SentCompany" : "1",
      // "SentOperatorName:" : "sam",
      // "sentServiceID" : "1",
      // "StartDate" : "datae",
      // "endDate" : "dateb",
      // "Text" : "text"

      SentCompany: companynumber,
      SentOperatorName: currentEmployeeName,
      //sentServiceID: "1",
      StartDate: startDate,
      endDate: endDate,
      Text: text,
      //SentAppointmentData: appointmentData,
      sentServiceID: currentCellkey,
    }),
  };
  const url = `${process.env.REACT_APP_BASE_URL}/AddAppointment`;
  return fetch(url, requestoptions) // Request fish
    .then((response) => {
      console.log("company:", companynumber);
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
      return {
        data: json.user_response.mdata.map((item) => ({
          text: item.DESCRIPTION,
          startDate: item.STARTDATE,
          endDate: item.ENDDATE,
        })),
        totalCount: json.user_response.totalCount,
        key: json.user_response.keyname,
        // data: json.user_response.mdata,
        // totalCount: json.user_response.totalCount,
        // key: json.user_response.keyname,
      };
    });
};

export const deleteAppointment = async (companynumber, currentEmployeeName) => {
  //const ThisEmployee = 2;
  console.log("company in:", companynumber);
  var requestoptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json;",
    },
    body: JSON.stringify({
      SentCompany: companynumber,
      SentOperatorName: currentEmployeeName,
    }),
  };
  const url = `${process.env.REACT_APP_BASE_URL}/getAppointments`;
  return fetch(url, requestoptions) // Request fish
    .then((response) => {
      console.log("company:", companynumber);
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
      return {
        data: json.user_response.mdata.map((item) => ({
          text: item.DESCRIPTION,
          startDate: item.STARTDATE,
          endDate: item.ENDDATE,
        })),
        totalCount: json.user_response.totalCount,
        key: json.user_response.keyname,
        // data: json.user_response.mdata,
        // totalCount: json.user_response.totalCount,
        // key: json.user_response.keyname,
      };
    });
};

export const updateAppointment = async (companynumber, currentEmployeeName) => {
  //const ThisEmployee = 2;
  console.log("company in:", companynumber);
  var requestoptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json;",
    },
    body: JSON.stringify({
      SentCompany: companynumber,
      SentOperatorName: currentEmployeeName,
    }),
  };
  const url = `${process.env.REACT_APP_BASE_URL}/getAppointments`;
  return fetch(url, requestoptions) // Request fish
    .then((response) => {
      console.log("company:", companynumber);
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
      return {
        data: json.user_response.mdata.map((item) => ({
          text: item.DESCRIPTION,
          startDate: item.STARTDATE,
          endDate: item.ENDDATE,
        })),
        totalCount: json.user_response.totalCount,
        key: json.user_response.keyname,
        // data: json.user_response.mdata,
        // totalCount: json.user_response.totalCount,
        // key: json.user_response.keyname,
      };
    });
};
