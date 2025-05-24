import { auth } from "@/firebaseConfig";
import { ProfileInfo, UserProfile } from "@/types";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";

interface IUserAuthProviderProps {
  children: React.ReactNode;
}

type AuthContextData = {
  user: User | null;
  login: typeof login;
  logOut: typeof logOut;
  signUp: typeof signUp;
  googleSignup: typeof googleSignup;
  updateProfileInfo: typeof updateProfileInfo
};

const login = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

const signUp = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

const logOut = () => {
  signOut(auth);
};

const googleSignup = () => {
  const googleAuthProvider = new GoogleAuthProvider();
  return signInWithPopup(auth, googleAuthProvider);
};

const updateProfileInfo = (profileInfo: ProfileInfo) => {
          console.log("the profile info is: ", profileInfo);
          return updateProfile(
            profileInfo.user!, {
            displayName: profileInfo.displayName,
            photoURL: profileInfo.photoURL
          })
}


export const userAuthContext = createContext<AuthContextData>({
  user: null,
  login,
  logOut,
  signUp,
  googleSignup,
  updateProfileInfo
});

export const UserAuthProvider: React.FC<IUserAuthProviderProps> = ({children}) => {

    const [user, setuser] = useState<User | null>(null);
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user)=> {
        if(user){
                setuser(user);
                console.log("the loggedIn user state is: ", user)
        } 
      })
    
      return () => {
        unsubscribe();
      }
    })
    

  const value: AuthContextData = {
    user,
    login,
    logOut,
    signUp,
    googleSignup,
    updateProfileInfo
  };

  return (
    <userAuthContext.Provider value={value}>
      {children}
    </userAuthContext.Provider>
  );
};

export const useUserAuth = () =>{
    return useContext(userAuthContext);
}