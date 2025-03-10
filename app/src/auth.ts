import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

export const register = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    console.log("User signed up:", userCredential.user);
  } catch (error: any) {
    console.error("Error signing up:", error.message);
  }
};

export const logIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    console.log("User signed in:", userCredential.user);
  } catch (error: any) {
    console.error("Error signing in:", error.message);
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
    console.log("User signed out");
  } catch (error: any) {
    console.error("Error signing out:", error.message);
  }
};
