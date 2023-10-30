import React, { useEffect, useState } from "react";
import { PostAccount, ValidateBanks } from "../../api/MyOwnServices";
import { useAuth } from "../../contexts/auth";
function AuthorizeSpecificBankx(props) {
  console.log("in authorizex", { props });
  const [completedAuth, setcompletedAuth] = useState(false);
  //const [thisbank, setbank] = useState(props.sentBank);
  const [mydata, setmydata] = useState({
    institution: "",
    loginId: "",
    requestId: "",
    url: "",
  });
  const srcname = `${props.FlinksConnectDomainRetail}Credential/${props.sentBank}`;
  //    changesrcname(`${props.FlinksConnectDomainRetail}Credential/${thisbank}`);
  const srcname3 =
    "https://beachstreetwealth-retail-iframe.private.fin.ag/v2/Credential/4";
  console.log("basic", srcname);
  console.log("flat ", srcname3);
  const [myclientcode, setclientcode] = useState(props.clientCode);

  const handleIframeLoad = () => {
    console.log("Iframe loaded");
    // Perform any additional logic here
  };
  const handleIframError = () => {
    console.log("there was an error");
  };

  useEffect(() => {
    window.addEventListener("message", onPostMessage);
    return function cleanup() {
      window.removeEventListener("message", onPostMessage);
    };
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (mydata.requestId !== "") {
      PostAccount(
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
    ValidateBanks(props.UserCode, props.UserPassword);
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
            <h6>Banking Authorizations</h6>
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
              onLoad={handleIframeLoad}
              onError={handleIframError}
              sandbox="allow-same-origin allow-scripts"
            ></iframe>
          </div>
        </div>
      )}
    </>
  );
}

export default function AuthorizeSpecificBank(props) {
  const { user } = useAuth();
  console.log({ props });
  const { bankNamex } = props; //.sentBank === undefined ? 4 : props.sentBank;
  var bankName;
  if (bankNamex === undefined) {
    bankName = 4;
  } else {
    bankName = bankNamex;
  }

  console.log("auth", bankName, "sent:", props.sentBank);
  return (
    <AuthorizeSpecificBankx
      clientCode={user.clientCode}
      FlinksConnectDomainRetail={user.FlinksConnectDomainRetail}
      UserCode={user.UserCode}
      UserPassword={user.UserPassword}
      sentBank={bankName}
    />
  );
}
//`${process.env.REACT_APP_BASE_URL}/validateuser
//src="https://toolbox-iframe.private.fin.ag/?demo=true&redirectUrl=https://flinks.com/contact/thank-you&innerRedirect=true&theme=light&consentEnable=true&customerName=FinTech&backgroundColor=f7f7f7&foregroundColor1=000000&desktopLayout=true&headerEnable=false&institutionFilterEnable=true&enhancedMFA=true&withMFAQuestions"
