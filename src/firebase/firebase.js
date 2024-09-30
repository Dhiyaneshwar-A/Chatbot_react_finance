import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCFGImyBg0u-lx0RMqLN-IjkPjqoOJ4mWI",
  authDomain: "legalappa-edb2e.firebaseapp.com",
  projectId: "legalappa-edb2e",
  storageBucket: "legalappa-edb2e.appspot.com",
  messagingSenderId: "262319255784",
  appId: "1:262319255784:web:0fdd2864d98cdcfcf5d95d",
  measurementId: "G-SD9ZCZ0YYC"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);

export {db, storage, auth}