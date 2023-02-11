// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCyeQsZpiagKw1o_HdxCrPnXT8DRcmkkLs",
  authDomain: "mod-s-talk.firebaseapp.com",
  projectId: "mod-s-talk",
  storageBucket: "mod-s-talk.appspot.com",
  messagingSenderId: "440956359999",
  appId: "1:440956359999:web:a3a055a4d314eb7769af8a",
  measurementId: "G-PQ6D06WY1G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);