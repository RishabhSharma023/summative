import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDt-iAN_gHEgH17verMycVmf-xwdmI3HoU",
  authDomain: "ics4u-babbf.firebaseapp.com",
  projectId: "ics4u-babbf",
  storageBucket: "ics4u-babbf.firebasestorage.app",
  messagingSenderId: "696286501737",
  appId: "1:696286501737:web:dfcd9d7f242c54aa8ffbf8"
};


const config = initializeApp(firebaseConfig)
const auth = getAuth(config);
const firestore = getFirestore(config);

export { auth, firestore }