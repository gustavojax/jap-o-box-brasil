import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCoPztqmG0b7lAIaWRg-iIVvQgsJLkV5_I",
  authDomain: "jap-box-core-prod.firebaseapp.com",
  projectId: "jap-box-core-prod",
  storageBucket: "jap-box-core-prod.appspot.com",
  messagingSenderId: "842214047732",
  appId: "1:842214047732:web:2ab310e943ef47f1c303a1",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
