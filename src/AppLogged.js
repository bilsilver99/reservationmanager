import React, { useState, useEffect } from "react";
import "devextreme/dist/css/dx.common.css";
import "./themes/generated/theme.base.css";
import "./themes/generated/theme.additional.css";
import { HashRouter as Router } from "react-router-dom";
import "./dx-styles.scss";
import LoadPanel from "devextreme-react/load-panel";
import { NavigationProvider } from "./contexts/navigation";
import { AuthProvider } from "./contexts/auth";
import { useAuth0 } from "@auth0/auth0-react";
import { useAuth } from "./contexts/auth";
import { useScreenSizeClass } from "./utils/media-query";
import Content from "./Content";
import notify from "devextreme/ui/notify";

function AppLogged() {
  const { isAuthenticated, loginWithRedirect, isLoading, user } = useAuth0();
  const { signIn2 } = useAuth(); // Assuming this is a context providing signIn2 method
  const [isUserValidated, setIsUserValidated] = useState(false);

  useEffect(() => {
    if (isLoading) return; // Prevent function from running if auth is loading

    if (!isAuthenticated) {
      loginWithRedirect(); // Automatically redirect if not authenticated
      return;
    }

    async function validateUser() {
      if (!user) {
        //console.log("User data is not available.");
        return;
      }

      // console.log(
      //   "AppLogged: isAuthenticated: ",
      //   isAuthenticated,
      //   "user: ",
      //   user
      // );

      // Assuming signIn2 accepts user object and returns a result with an isOk property
      const result = await signIn2(user, "yourPasswordPlaceholder");
      if (result && result.isOk) {
        setIsUserValidated(true);
      } else {
        notify(
          "Authentication failed: " +
            (result ? result.message : "Unknown error"),
          "error",
          2000
        );
        console.error("User validation failed");
        // Consider logging out the user or taking other appropriate actions
      }
    }

    if (isAuthenticated) {
      validateUser();
    }
  }, [isAuthenticated, isLoading, user, signIn2, loginWithRedirect]);

  if (isLoading || !isUserValidated) {
    return <LoadPanel visible={true} />;
  }

  return <Content />;
}

export default function Root() {
  const screenSizeClass = useScreenSizeClass();

  return (
    <Router>
      <AuthProvider>
        <NavigationProvider>
          <div className={`app ${screenSizeClass}`}>
            <AppLogged />
          </div>
        </NavigationProvider>
      </AuthProvider>
    </Router>
  );
}

// import React, { useState, useEffect } from "react";
// import "devextreme/dist/css/dx.common.css";
// import "./themes/generated/theme.base.css";
// import "./themes/generated/theme.additional.css";
// import { HashRouter as Router } from "react-router-dom";
// import "./dx-styles.scss";
// import LoadPanel from "devextreme-react/load-panel";
// import { NavigationProvider } from "./contexts/navigation";
// import { AuthProvider } from "./contexts/auth"; // Ensure AuthProvider is correctly implemented
// import { useAuth0 } from "@auth0/auth0-react";
// import { useAuth } from "./contexts/auth";
// import { useScreenSizeClass } from "./utils/media-query";
// import Content from "./Content";
// import notify from "devextreme/ui/notify";
// //import { login2 } from "./services/loginService";
// //import UnauthenticatedContent from "./UnauthenticatedContent";

// // Example validateUser function (define it appropriately in your app)

// function AppLogged() {
//   const { isAuthenticated, loginWithRedirect, isLoading, user } = useAuth0();
//   const { signIn2 } = useAuth(); // Assuming this is a context providing signIn2 method
//   const [isUserValidated, setIsUserValidated] = useState(false);

//   useEffect(() => {
//     async function validateUser() {
//       if (!isAuthenticated || !user) {
//         console.log("User is not authenticated or user data is not available.");
//         return;
//       }

//       console.log(
//         "AppLogged: isAuthenticated: ",
//         isAuthenticated,
//         "user: ",
//         user
//       );

//       // Assuming signIn2 accepts user object and returns a result with an isOk property
//       // Here you'd replace "password" with the actual password, if available, or adjust your logic accordingly
//       const result = await signIn2(user, "yourPasswordPlaceholder");
//       if (result && result.isOk) {
//         setIsUserValidated(true);
//       } else {
//         notify(
//           "Authentication failed: " +
//             (result ? result.message : "Unknown error"),
//           "error",
//           2000
//         );
//         console.error("User validation failed");
//         // Consider logging out the user or taking other appropriate actions
//       }
//     }

//     validateUser();
//   }, [isAuthenticated, user, signIn2]);

//   if (isLoading) {
//     return <LoadPanel visible={true} />;
//   }

//   if (!isAuthenticated || !isUserValidated) {
//     return (
//       <div>
//         <button
//           id="qsLoginBtn"
//           color="primary"
//           className="btn-margin"
//           onClick={() => loginWithRedirect()}
//         >
//           Log in
//         </button>
//       </div>
//     );
//   }

//   return <Content />;
// }
// export default function Root() {
//   const screenSizeClass = useScreenSizeClass();

//   return (
//     <Router>
//       <AuthProvider>
//         <NavigationProvider>
//           <div className={`app ${screenSizeClass}`}>
//             <AppLogged />
//           </div>
//         </NavigationProvider>
//       </AuthProvider>
//     </Router>
//   );
// }
