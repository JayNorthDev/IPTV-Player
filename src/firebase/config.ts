// @ts-nocheck
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyCJnYTpMTzIWT7N6211GAY3iMj2kMIbu7M",
  authDomain: "studio-3948958602-58726.firebaseapp.com",
  projectId: "studio-3948958602-58726",
  messagingSenderId: "102930259764",
  appId: "1:102930259764:web:2dc2a9a4515a3d44f68f61"
};

function initializeFirebase() {
  if (getApps().length) {
    return getApp();
  }
  return initializeApp(firebaseConfig);
}

export const app = initializeFirebase();
export const db = getFirestore(app);
