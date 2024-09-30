import React, { useContext, useState, useEffect } from "react";
import { auth } from "../../firebase/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        setUsername(user.displayName || user.email); // Use displayName or email if no username is available
        setUserLoggedIn(true);
      } else {
        setCurrentUser(null);
        setUsername("");
        setUserLoggedIn(false);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  function logout() {
    return signOut(auth);
  }

  const value = {
    userLoggedIn,
    currentUser,
    username,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
