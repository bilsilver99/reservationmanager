import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback,
} from "react";
import {
  getUser,
  signIn as sendSignInRequest,
  signIn2 as sendSignInRequest2,
} from "../api/auth";

function AuthProvider(props) {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  const updateUser = useCallback((updates) => {
    setUser((currentUser) => ({ ...currentUser, ...updates }));
  }, []);

  useEffect(() => {
    (async function () {
      const result = await getUser();
      if (result.isOk) {
        setUser(result.data);
      }
      setLoading(false);
    })();
  }, []);

  const signIn = useCallback(async (email, password) => {
    const result = await sendSignInRequest(email, password);
    if (result.isOk) {
      setUser(result.data);
      //console.log("inside auth user values ", user.data);
    }

    return result;
  }, []);

  const signIn2 = useCallback(async (email, password) => {
    const result = await sendSignInRequest2(email, password);
    if (result.isOk) {
      setUser(result.data);
      //console.log("inside auth user values ", result.data);
    }

    return result;
  }, []);

  const signOut = useCallback(() => {
    setUser(undefined);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signIn2,
        signOut,
        loading,
        updateUser,
      }}
      {...props}
    />
  );
}

const AuthContext = createContext({ loading: false });
const useAuth = () => useContext(AuthContext);
const UseAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth, UseAuth };
