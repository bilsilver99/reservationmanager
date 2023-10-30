import React, { useEffect, useState } from "react";
import { PostInvestmentAccount } from "../../api/MyOwnServices";
import { useAuth } from "../../contexts/auth";
function AuthorizeInvestmentUserx(props) {
  const [completedAuth, setcompletedAuth] = useState(false);
  const [mydata, setmydata] = useState({
    institution: "",
    loginId: "",
    requestId: "",
    url: "",
  });
  const [myclientcode, setclientcode] = useState();
  //const srcname = `${props.FlinksConnectDomainWealth}/?demo=true&redirectUrl=https://flinks.com/contact/thank-you&innerRedirect=true&theme=light&consentEnable=true&customerName=FinTech&backgroundColor=f7f7f7&foregroundColor1=000000&desktopLayout=true&headerEnable=false&institutionFilterEnable=true`;
  const srcname = `${props.FlinksConnectDomainWealth}/?demo=true?institutionsLocation=ca&productType=investment&scheduleRefresh=true`;

  const srcname2 =
    "https://demo.flinks.com/v2/?institutionsLocation=ca&productType=investment";

  useEffect(() => {
    setclientcode(props.clientCode);
    console.log(myclientcode);
    console.log(props.FlinksAPIDomainWealth);
    console.log(srcname);
    console.log(srcname2);
    window.addEventListener("message", onPostMessage);
    return function cleanup() {
      window.removeEventListener("message", onPostMessage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (mydata.requestId !== "") {
      PostInvestmentAccount(
        myclientcode,
        mydata.institution,
        mydata.loginId,
        mydata.requestId,
        mydata.url
      );
    }
  }, [mydata, myclientcode]);

  const closeWin = (e) => {
    setcompletedAuth(true);
    //console.log("clicked now what");
    //ValidateBanks(props.UserCode, props.UserPassword);
  };
  const onPostMessage = (event) => {
    console.log(event.data);

    if (event.data.step === "REDIRECT") {
      setmydata({
        institution: event.data.institution,
        loginId: event.data.loginId,
        requestId: event.data.requestId,
        step: event.data.step,
        url: event.data.url,
      });
    }
  };

  //

  return (
    <>
      {completedAuth !== true && (
        <div className="content-block dx-card responsive-paddings">
          <div>
            <h6>Investment Authorizations</h6>
            <button
              type="submit"
              className="buttonsPage"
              id="logoutbutton"
              onClick={() => {
                closeWin();
              }}
            >
              Authorization Complete
            </button>
          </div>
          <div className="dashed-border">
            <iframe
              title='Authorize"'
              width={766}
              height={500}
              src={srcname}
            ></iframe>
          </div>
        </div>
      )}
    </>
  );
}

export default function AuthorizeInvestmentUser() {
  const { user } = useAuth();
  return (
    <AuthorizeInvestmentUserx
      clientCode={user.clientCode}
      FlinksConnectDomainWealth={user.FlinksConnectDomainWealth}
      UserCode={user.UserCode}
      UserPassword={user.UserPassword}
    />
  );
}
//`${process.env.REACT_APP_BASE_URL}/validateuser
//src="https://toolbox-iframe.private.fin.ag/?demo=true&redirectUrl=https://flinks.com/contact/thank-you&innerRedirect=true&theme=light&consentEnable=true&customerName=FinTech&backgroundColor=f7f7f7&foregroundColor1=000000&desktopLayout=true&headerEnable=false&institutionFilterEnable=true"
