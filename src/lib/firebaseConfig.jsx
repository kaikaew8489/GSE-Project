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

// ---------------------------------------------------------
// Firebase Auth Domains
// ---------------------------------------------------------
//
// Production:
//   gse-project-slzm.vercel.app
//
// Preview / security-phase1:
//   gse-project-slzm-git-secur-aa427e-
//   nawattakorn-kaikaews-projects.vercel.app
//
// Development / StackBlitz:
//   gse-project-phase-2.firebaseapp.com
//
// หมายเหตุ:
// - Production และ Preview บน Vercel ใช้ same-origin authDomain
// - /__/auth/* บน Vercel ถูก Proxy ไปยัง Firebase ผ่าน vercel.json
// - แนวทางนี้ใช้เพื่อรองรับ signInWithRedirect()
//   และลดปัญหา browser storage partitioning / missing initial state
// ---------------------------------------------------------

const PRODUCTION_AUTH_DOMAIN =
  'gse-project-slzm.vercel.app';

const SECURITY_PREVIEW_AUTH_DOMAIN =
  'gse-project-slzm-git-secur-aa427e-nawattakorn-kaikaews-projects.vercel.app';

const DEFAULT_FIREBASE_AUTH_DOMAIN =
  'gse-project-phase-2.firebaseapp.com';

// ---------------------------------------------------------
// ตรวจสอบ hostname ที่กำลังใช้งาน
// ---------------------------------------------------------

const currentHostname =
  typeof window !== 'undefined'
    ? window.location.hostname
    : '';

// Production
const isProductionDomain =
  currentHostname ===
  PRODUCTION_AUTH_DOMAIN;

// Preview branch: security-phase1
const isSecurityPreviewDomain =
  currentHostname ===
  SECURITY_PREVIEW_AUTH_DOMAIN;

// เลือก Firebase Auth Domain ให้ตรงกับ Environment
const resolvedAuthDomain =
  isProductionDomain
    ? PRODUCTION_AUTH_DOMAIN
    : isSecurityPreviewDomain
      ? SECURITY_PREVIEW_AUTH_DOMAIN
      : DEFAULT_FIREBASE_AUTH_DOMAIN;

// ---------------------------------------------------------
// Firebase Config
// ---------------------------------------------------------

const firebaseConfig = {
  apiKey:
    'AIzaSyD3440oEO-8MvilWbHd5DUHVnlHSjjH1rk',

  authDomain:
    resolvedAuthDomain,

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

// =========================================================
// Firebase App Initialization
// =========================================================
//
// ป้องกันการ Initialize Firebase ซ้ำ
// ระหว่าง Vite Hot Module Reload
// =========================================================

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