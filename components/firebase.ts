import { initializeApp } from "firebase/app";
import { getAuth, signOut, signInWithEmailAndPassword } from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore/lite";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDLXkpVoC6kGsJ9w5d-bRVQR9gcHsJwD6g",
    authDomain: "games-r-us-a0241.firebaseapp.com",
    projectId: "games-r-us-a0241",
    storageBucket: "games-r-us-a0241.appspot.com",
    messagingSenderId: "486124633503",
    appId: "1:486124633503:web:e437711a1d04129bb391aa"
  };

const app = initializeApp(firebaseConfig);
export const authen = getAuth(app);
const fs = getFirestore(app);

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

async function addUser(user: User) {
    const jobs = collection(fs, "users");
    const job = doc(jobs);
    setDoc(job, user);
  }

async function updateDocument(id: string, obj: User, colName: string) {
  const coll = collection(fs, colName);
  const data = doc(coll, id);
  await setDoc(data, obj);
}

async function updateUser(id: string, user: User) {
    await updateDocument(id, user, "users");
}

type User = {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    country: string;
    emailAddress: string;
    zipcode: number;
    cart: string[];
    owned: string[];
    wishlist: string[];
}

async function deleteDocument(id: string, colName: string) {
  const col = collection(fs, colName);
  const document = doc(col, id);
  await deleteDoc(document);
}

async function deleteJob(id: string) {
  await deleteDocument(id, "experience");
}

async function deleteProject(id: string) {
  await deleteDocument(id, "projects");
}

export default fb;
