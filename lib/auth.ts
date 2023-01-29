import {
  GoogleAuthProvider,
  signInWithPopup,
  UserCredential,
  signOut,
} from "firebase/auth";
import router from "next/router";
import { auth } from "../firebase/client";

export const login = (): Promise<UserCredential> => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

export const logout = (): Promise<void> => {
  router.replace("/index");
  return signOut(auth);
};
