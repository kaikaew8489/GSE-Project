import {
  initializeApp,
  getApps,
  getApp,
} from 'firebase/app';

import {
  getAuth,
} from 'firebase/auth';

import {
  getFirestore,
} from 'firebase/firestore';

import {
  getStorage,
} from 'firebase/storage';

// =========================================================
// Firebase Configuration
// GSE Operations Hub
// Project: GSE-Project-Phase-2
// =========================================================

// Firebase Auth helper domain สำหรับ Production บน Vercel
//
// หมายเหตุ:
// - StackBlitz ใช้สำหรับพัฒนา UI/Code
// - Google Redirect จะทดสอบจริงผ่าน Production domain
// - /__/auth/* บน Vercel จะถูก Proxy ไปยัง Firebase
const PRODUCTION_AUTH_DOMAIN =
  'gse-project-slzm.vercel.app';

const DEFAULT_FIREBASE_AUTH_DOMAIN =
  'gse-project-phase-2.firebaseapp.com';

// ตรวจว่า App กำลังรันจาก Production domain หรือไม่
const isProductionDomain =
  typeof window !== 'undefined' &&
  window.location.hostname ===
    PRODUCTION_AUTH_DOMAIN;

const firebaseConfig = {
  apiKey:
    'AIzaSyD3440oEO-8MvilWbHd5DUHVn1HSjjHl1rk',

  authDomain: isProductionDomain
    ? PRODUCTION_AUTH_DOMAIN
    : DEFAULT_FIREBASE_AUTH_DOMAIN,

  projectId:
    'gse-project-phase-2',

  storageBucket:
    'gse-project-phase-2.firebasestorage.app',

  messagingSenderId:
    '729534573275',

  appId:
    '1:729534573275:web:ff7c87bce93afc9852bafe',

  measurementId:
    'G-7XWJ5SHYWC',
};

// ป้องกันการ Initialize Firebase ซ้ำ
// ระหว่าง Vite Hot Module Reload
const appInstance =
  getApps().length === 0
    ? initializeApp(firebaseConfig)
    : getApp();

// =========================================================
// Firebase Services
// =========================================================

export const auth =
  getAuth(appInstance);

export const db =
  getFirestore(appInstance);

export const storage =
  getStorage(appInstance);