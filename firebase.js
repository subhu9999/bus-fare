import * as firebase from "firebase";

import "@firebase/firestore";

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  var firebaseConfig = {
    apiKey: "AIzaSyAHioPnVRA7SPAv2b_CuLsMiaXU-YS9E3E",
    authDomain: "busfarecalculator-1b24c.firebaseapp.com",
    projectId: "busfarecalculator-1b24c",
    storageBucket: "busfarecalculator-1b24c.appspot.com",
    messagingSenderId: "232542121441",
    appId: "1:232542121441:web:728c3e2987130968def6a0",
    measurementId: "G-MBVRE4C7C9"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  firebase.firestore();

  export default firebase;