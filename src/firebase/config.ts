import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBfVH8TNheDWBtATgBWW3_YLLegOQXB6V4",
  authDomain: "eco-uom.firebaseapp.com",
  projectId: "eco-uom",
  storageBucket: "eco-uom.firebasestorage.app",
  messagingSenderId: "622721006481",
  appId: "1:622721006481:web:551c1f7221c3458c17f830",
  measurementId: "G-QMM82DNGGG"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
