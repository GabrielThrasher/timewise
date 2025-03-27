import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";

export const register = async (
  email: string,
  password: string,
  name: string,
  username: string,
): Promise<User | null> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    await createAccount(name, username);

    return userCredential.user;
  } catch (error: any) {
    return null;
  }
};

export const logIn = async (
  email: string,
  password: string,
): Promise<User | null> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );

    return userCredential.user;
  } catch (error: any) {
    return null;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error: any) {}
};

export const getFirebaseToken = async (): Promise<string | null> => {
  const user = auth.currentUser;
  return user ? await user.getIdToken() : null;
};

const createAccount = async (name: string, username: string) => {
  const token = await getFirebaseToken();

  if (!token) {
    throw new Error("No Firebase token found");
  }

  try {
    const response = await fetch("http://127.0.0.1:8000/api/auth/register", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        username,
      }),
    });

    if (response.status !== 201) {
      throw new Error("account creation failed");
    }
  } catch (error) {
    console.error(error);
    throw new Error("error creating account");
  }
};
