// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBFaWwYj_e-MthS30Y08ivR214AvGwRhHY",
  authDomain: "tierlist2-cb3df.firebaseapp.com",
  projectId: "tierlist2-cb3df",
  storageBucket: "tierlist2-cb3df.appspot.com",
  messagingSenderId: "1007183833341",
  appId: "1:1007183833341:web:f2968d292ee53f81d53694"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app); 