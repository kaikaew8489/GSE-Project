import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyD3440oEO-8MvilWbHd5DUHVnlHSjiH1rk",
  authDomain: "gse-project-phase-2.firebaseapp.com",
  projectId: "gse-project-phase-2",
  storageBucket: "gse-project-phase-2.firebasestorage.app",
  messagingSenderId: "729534573275",
  appId: "1:729534573275:web:ff7c87bce93afc9852bafe",
  measurementId: "G-7XWJ5SHYWC"
};

const appInstance = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(appInstance);
export const db = getFirestore(appInstance);
export const storage = getStorage(appInstance);