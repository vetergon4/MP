// AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { checkIfLoggedIn as apiCheckIfLoggedIn, currentUser as apiCurrentUser } from '../services/dataService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if the user is logged in when the component is initially loaded
    const isLoggedIn = apiCheckIfLoggedIn();

    if (isLoggedIn) {
      // Get the current user information from the token
      const currentUser = apiCurrentUser();
   
      setUser(currentUser);
    }
  }, []);


  const isAdmin = () => {
    //use apICurretUser and check id of returned user to see if it is admin
    const currentUser = apiCurrentUser();
    if (currentUser) {
      if (currentUser.id === 1) {
        return true;
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
