import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
} from 'firebase/auth';

import {
  doc,
  getDoc,
} from 'firebase/firestore';

import { auth, db } from './firebaseConfig.jsx';

const GISTDA_DOMAIN = 'gistda.or.th';
const AUTH_INTENT_KEY = 'gse_auth_intent';

const googleProvider = new GoogleAuthProvider();

// ช่วยแนะนำบัญชีองค์กร GISTDA ในหน้า Google Sign-In
// หมายเหตุ: hd เป็นเพียงตัวช่วยด้าน UX ไม่ใช่ Security Boundary
googleProvider.setCustomParameters({
  hd: GISTDA_DOMAIN,
  prompt: 'select_account',
});

// ---------------------------------------------------------
// ตรวจสอบอีเมล GISTDA
// ---------------------------------------------------------
export const isGistdaEmail = (email = '') => {
  return String(email)
    .trim()
    .toLowerCase()
    .endsWith(`@${GISTDA_DOMAIN}`);
};

// ---------------------------------------------------------
// ทำ Role ให้เป็นมาตรฐานตัวพิมพ์เล็ก
// ---------------------------------------------------------
const normalizeStaffRole = (rawRole) => {
  const role = String(rawRole || '')
    .trim()
    .toLowerCase();

  if (role === 'technician') return 'technician';
  if (role === 'commander') return 'commander';
  if (role === 'admin') return 'admin';

  return null;
};

// ---------------------------------------------------------
// ตรวจสอบ User หลัง Google Authentication สำเร็จ
// ---------------------------------------------------------
const resolveAuthenticatedUser = async (user) => {
  if (!user) {
    throw new Error('AUTH_USER_NOT_FOUND');
  }

  const email = String(user.email || '')
    .trim()
    .toLowerCase();

  // ต้องเป็นอีเมล GISTDA และ Google ต้องยืนยันอีเมลแล้ว
  if (!user.emailVerified || !isGistdaEmail(email)) {
    await signOut(auth);
    throw new Error('GISTDA_ACCOUNT_REQUIRED');
  }

  // staff_roles ปัจจุบันใช้อีเมลเป็น Document ID
  const staffRef = doc(db, 'staff_roles', email);
  const staffSnap = await getDoc(staffRef);

  // ไม่อยู่ใน staff_roles
  // = บุคลากร GISTDA ทั่วไป / ผู้แจ้งซ่อม
  if (!staffSnap.exists()) {
    return {
      user,
      email,
      role: 'reporter',
      staffProfile: null,
    };
  }

  const staffProfile = staffSnap.data();

  // Staff ถูกระงับสิทธิ์
  if (staffProfile.active === false) {
    await signOut(auth);
    throw new Error('STAFF_DISABLED');
  }

  const role = normalizeStaffRole(staffProfile.role);

  // มี Staff record แต่ Role ไม่ถูกต้อง
  // ใช้แนวทาง Fail Closed
  if (!role) {
    await signOut(auth);
    throw new Error('INVALID_STAFF_ROLE');
  }

  return {
    user,
    email,
    role,
    staffProfile,
  };
};

// =========================================================
// LEGACY / MIGRATION
// Google Popup เดิม
//
// เก็บไว้ชั่วคราวเพื่อไม่ให้ LandingPage ปัจจุบัน Compile พัง
// หลัง Redirect ทำงานสมบูรณ์แล้วเราจะลบฟังก์ชันนี้
// =========================================================
export const signInWithGistdaGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);

  return resolveAuthenticatedUser(result.user);
};

// =========================================================
// NEW AUTH FLOW
// เริ่ม Google Sign-In แบบ Redirect
//
// intent:
// - staff    = เข้าทาง "สำหรับเจ้าหน้าที่ ฝวด."
// - reporter = เข้าทาง "แจ้งซ่อมระบบ/อุปกรณ์"
// =========================================================
export const startGistdaGoogleRedirect = async (
  intent = 'staff'
) => {
  const normalizedIntent =
    intent === 'reporter'
      ? 'reporter'
      : 'staff';

  sessionStorage.setItem(
    AUTH_INTENT_KEY,
    normalizedIntent
  );

  await signInWithRedirect(
    auth,
    googleProvider
  );
};

// =========================================================
// รับผลหลัง Google Redirect กลับเข้าสู่ GSE App
// =========================================================
export const completeGistdaGoogleRedirect = async () => {
  try {
    const result = await getRedirectResult(auth);

    // ไม่มี Redirect result
    // เช่น การเปิด App ตามปกติ
    if (!result) {
      return null;
    }

    const intent =
      sessionStorage.getItem(AUTH_INTENT_KEY) ||
      'staff';

    const access =
      await resolveAuthenticatedUser(
        result.user
      );

    sessionStorage.removeItem(
      AUTH_INTENT_KEY
    );

    return {
      ...access,
      intent,
    };
  } catch (error) {
    sessionStorage.removeItem(
      AUTH_INTENT_KEY
    );

    throw error;
  }
};

// =========================================================
// Logout
// =========================================================
export const logoutGse = async () => {
  sessionStorage.removeItem(
    AUTH_INTENT_KEY
  );

  await signOut(auth);
};