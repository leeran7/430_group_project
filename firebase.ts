import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  browserSessionPersistence,
} from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore/lite";
import User from "./userType";

const firebaseConfig = {
  apiKey: "AIzaSyDLXkpVoC6kGsJ9w5d-bRVQR9gcHsJwD6g",
  authDomain: "games-r-us-a0241.firebaseapp.com",
  projectId: "games-r-us-a0241",
  storageBucket: "games-r-us-a0241.appspot.com",
  messagingSenderId: "486124633503",
  appId: "1:486124633503:web:e437711a1d04129bb391aa",
};

const app = initializeApp(firebaseConfig);
export const authen = getAuth(app);
const fs = getFirestore(app);

export const useUser = () => useAuthState(authen);

async function getAllDocsFromColl(colName: string) {
  const coll = collection(fs, colName);
  const { docs } = await getDocs(coll);
  return docs.map((doc) => {
    const data = doc.data();
    return { ...data, id: doc.id };
  });
}

async function getAllUsers() {
  return await getAllDocsFromColl("users");
}

export async function getUserById(id: string) {
  const users = await getAllUsers();
  return users.find((user) => user.id === id);
}

export async function addUser(newUser: User) {
  const users = collection(fs, "users");
  const userDoc = doc(users, newUser.uid);
  await setDoc(userDoc, newUser);
}

async function updateDocument(id: string, obj: User, colName: string) {
  const coll = collection(fs, colName);
  const data = doc(coll, id);
  await setDoc(data, obj);
}

export async function updateUser(id: string, user: User) {
  await updateDocument(id, user, "users");
}

async function deleteDocument(id: string, colName: string) {
  const col = collection(fs, colName);
  const document = doc(col, id);
  await deleteDoc(document);
}

export async function deleteUser(id: string) {
  await deleteDocument(id, "users");
}

export async function login(email: string, password: string) {
  return await authen
    .setPersistence(browserSessionPersistence)
    .then(async () => {
      return await signInWithEmailAndPassword(authen, email, password).then(
        (data) => data.user
      );
    });
}

export async function logout() {
  return await signOut(authen);
}

export async function register(email: string, password: string) {
  return await authen
    .setPersistence(browserSessionPersistence)
    .then(async () => {
      return await createUserWithEmailAndPassword(authen, email, password).then(
        (data) => data.user
      );
    });
}
