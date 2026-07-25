import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "clean-glyph-h6pck",
  appId: "1:124316820349:web:afa9f6c6d09ded9f6da214",
  apiKey: "AIzaSyCnB8CWQyzLdfe_6EULs-5sDZihHy4jVxo",
  authDomain: "clean-glyph-h6pck.firebaseapp.com",
  storageBucket: "clean-glyph-h6pck.firebasestorage.app",
  messagingSenderId: "124316820349",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, 'ai-studio-15e222c0-7ae5-4be9-81aa-d00c54ac9920');
