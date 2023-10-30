export const login = (username, password) => {
  var loginreturned = "";
  var tempauthorized = "";
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

  return fetch(url, requestoptions)
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
          authorized: "Y",
          administrator: json.user_response.Returnadministrator,
          returnOK: json.user_response.returnOK,
          widget: json.user_response.ReturnWidget,
        };
      } else {
        returnOK: json.user_response.ReturnOK;
      }
    });
};
