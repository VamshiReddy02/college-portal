
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDWxrDdmOi3Ylt99Xd2oKrV2pBY9YX-Cn8",
  authDomain: "college-51a4c.firebaseapp.com",
  projectId: "college-51a4c",
  storageBucket: "college-51a4c.appspot.com",
  messagingSenderId: "892642468208",
  appId: "1:892642468208:web:f9b780fdd2988c0967efb5"
};
  

export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);