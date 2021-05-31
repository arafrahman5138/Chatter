import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyAUCcWNhI2w8JqoxpVwnli0-f9RicXWG-Y",
  authDomain: "message-chat-16641.firebaseapp.com",
  projectId: "message-chat-16641",
  storageBucket: "message-chat-16641.appspot.com",
  messagingSenderId: "817189450579",
  appId: "1:817189450579:web:4fdde5e33e0eab4f71a7a6"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
export default db;
