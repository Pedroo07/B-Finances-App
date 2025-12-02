import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDu_MJeDE9MajCCqXvfXrNUiyIPgytEj9o",
  authDomain: "b-finances-2952b.firebaseapp.com",
  projectId: "b-finances-2952b",
  storageBucket: "b-finances-2952b.appspot.com",
  messagingSenderId: "135357395664",
  appId: "1:135357395664:web:4f50b195dbc7393f61a4d5",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export default app