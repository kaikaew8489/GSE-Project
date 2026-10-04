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

// =========================================================
// GSE AUTHENTICATION SERVICE
// Security Phase 1
// =========================================================

const GISTDA_DOMAIN = 'gistda.or.th';

const AUTH_INTENT_KEY = 'gse_auth_intent';
const AUTH_MODE_KEY = 'gse_auth_mode';

const googleProvider = new GoogleAuthProvider();

// ช่วยแนะนำบัญชีองค์กร GISTDA บน Google Sign-In
// หมายเหตุ:
// hd เป็นเพียง UX Hint เท่านั้น
// Security จริงตรวจซ้ำหลัง Authentication สำเร็จ
googleProvider.setCustomParameters({
  hd: GISTDA_DOMAIN,
  prompt: 'select_account',
});

// ---------------------------------------------------------
// Helper: Normalize Intent
// ---------------------------------------------------------
const normalizeIntent = (intent) => {
  return intent === 'reporter'
    ? 'reporter'
    : 'staff';
};

// ---------------------------------------------------------
// ตรวจสอบว่าเป็นอีเมล GISTDA
// ---------------------------------------------------------
export const isGistdaEmail = (email = '') => {
  return String(email)
    .trim()
    .toLowerCase()
    .endsWith(`@${GISTDA_DOMAIN}`);
};

// ---------------------------------------------------------
// Normalize Staff Role
//
// Firestore อาจเก็บ:
// Commander / commander
// Technician / technician
// Admin / admin
//
// ภายใน Auth Service จะใช้ lowercase เป็นมาตรฐาน
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
// อ่านตัวตนจาก Firebase Authentication + staff_roles
//
// ฟังก์ชันนี้ยังไม่ตัดสินว่า User เข้า Staff Portal
// หรือ Reporter Portal
// ---------------------------------------------------------
const resolveGistdaIdentity = async (user) => {
  if (!user) {
    throw new Error('AUTH_USER_NOT_FOUND');
  }

  const email = String(user.email || '')
    .trim()
    .toLowerCase();

  // Firebase/Google ต้องยืนยันอีเมลแล้ว
  // และต้องอยู่ภายใต้ @gistda.or.th เท่านั้น
  if (!user.emailVerified || !isGistdaEmail(email)) {
    await signOut(auth);
    throw new Error('GISTDA_ACCOUNT_REQUIRED');
  }

  // staff_roles ใช้อีเมลเป็น Document ID
  const staffRef = doc(
    db,
    'staff_roles',
    email
  );

  const staffSnap = await getDoc(staffRef);

  if (!staffSnap.exists()) {
    return {
      user,
      email,
      staffProfile: null,
      staffRole: null,
    };
  }

  const staffProfile = staffSnap.data();

  return {
    user,
    email,
    staffProfile,
    staffRole: normalizeStaffRole(
      staffProfile.role
    ),
  };
};

// ---------------------------------------------------------
// Security Policy ตามช่องทางที่ User เลือก
//
// reporter:
// - GISTDA account ทุกคนใช้ได้
// - ถึงแม้อยู่ใน staff_roles ก็เข้าในฐานะ reporter
//
// staff:
// - ต้องมี document ใน staff_roles
// - active ต้องไม่เป็น false
// - role ต้องถูกต้อง
// ---------------------------------------------------------
const applyIntentPolicy = async (
  identity,
  requestedIntent
) => {
  const intent =
    normalizeIntent(requestedIntent);

  // =======================================================
  // REPORTER PORTAL
  // =======================================================
  if (intent === 'reporter') {
    return {
      user: identity.user,
      email: identity.email,

      // Portal นี้ใช้สิทธิ์ Reporter เสมอ
      role: 'reporter',

      // เก็บไว้เพื่อ reference เท่านั้น
      directoryRole: identity.staffRole,
      staffProfile: identity.staffProfile,

      intent: 'reporter',
    };
  }

  // =======================================================
  // STAFF PORTAL
  // =======================================================

  // ไม่อยู่ใน staff_roles
  if (!identity.staffProfile) {
    await signOut(auth);
    throw new Error(
      'STAFF_ACCESS_REQUIRED'
    );
  }

  // ถูกระงับสิทธิ์
  if (
    identity.staffProfile.active === false
  ) {
    await signOut(auth);
    throw new Error(
      'STAFF_DISABLED'
    );
  }

  // มี record แต่ role ไม่ถูกต้อง
  // Fail Closed
  if (!identity.staffRole) {
    await signOut(auth);
    throw new Error(
      'INVALID_STAFF_ROLE'
    );
  }

  // ถ้า field email มีอยู่
  // ต้องตรงกับ Google Account
  if (
    identity.staffProfile.email &&
    String(identity.staffProfile.email)
      .trim()
      .toLowerCase() !== identity.email
  ) {
    await signOut(auth);
    throw new Error(
      'STAFF_EMAIL_MISMATCH'
    );
  }

  return {
    user: identity.user,
    email: identity.email,
    role: identity.staffRole,
    directoryRole: identity.staffRole,
    staffProfile: identity.staffProfile,
    intent: 'staff',
  };
};

// =========================================================
// LEGACY POPUP
//
// เก็บไว้ชั่วคราวช่วง Migration
// แต่ผ่าน Security Policy เดียวกับ Redirect
// =========================================================
export const signInWithGistdaGoogle =
  async () => {
    const result = await signInWithPopup(
      auth,
      googleProvider
    );

    const identity =
      await resolveGistdaIdentity(
        result.user
      );

    const access =
      await applyIntentPolicy(
        identity,
        'staff'
      );

    sessionStorage.setItem(
      AUTH_MODE_KEY,
      'staff'
    );

    return access;
  };

// =========================================================
// NEW AUTH FLOW
// เริ่ม Google Sign-In ด้วย Redirect
//
// staff
//   = ปุ่ม "สำหรับเจ้าหน้าที่ ฝวด."
//
// reporter
//   = ปุ่ม "แจ้งซ่อมระบบ/อุปกรณ์"
// =========================================================
export const startGistdaGoogleRedirect =
  async (intent = 'staff') => {
    const normalizedIntent =
      normalizeIntent(intent);

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
// รับผลหลัง Google Redirect กลับเข้า GSE
// =========================================================
export const completeGistdaGoogleRedirect =
  async () => {
    try {
      const result =
        await getRedirectResult(auth);

      // เปิดเว็บตามปกติ
      // ไม่มี Redirect Result ใหม่
      if (!result) {
        return null;
      }

      const intent =
        sessionStorage.getItem(
          AUTH_INTENT_KEY
        ) || 'staff';

      const identity =
        await resolveGistdaIdentity(
          result.user
        );

      const access =
        await applyIntentPolicy(
          identity,
          intent
        );

      // Redirect สำเร็จแล้ว
      sessionStorage.removeItem(
        AUTH_INTENT_KEY
      );

      // จำเฉพาะ Portal Mode
      // ไม่ใช่ตัวตัดสิน Security
      sessionStorage.setItem(
        AUTH_MODE_KEY,
        access.intent
      );

      return access;
    } catch (error) {
      sessionStorage.removeItem(
        AUTH_INTENT_KEY
      );

      throw error;
    }
  };

// =========================================================
// Restore Firebase Session
//
// ใช้ตอน Refresh Page
//
// Security:
// - ไม่อ่าน role จาก sessionStorage
// - Role จะถูกอ่านใหม่จาก staff_roles ทุกครั้ง
// =========================================================
export const resolveExistingGistdaSession =
  async (user = auth.currentUser) => {
    if (!user) {
      return null;
    }

    const identity =
      await resolveGistdaIdentity(user);

    // Mode ไม่ใช่ Security Boundary
    // หากไม่มีค่า ให้ default เป็น reporter
    // ซึ่งเป็นสิทธิ์ต่ำกว่าและปลอดภัยกว่า
    const savedMode =
      sessionStorage.getItem(
        AUTH_MODE_KEY
      ) || 'reporter';

    return applyIntentPolicy(
      identity,
      savedMode
    );
  };

// =========================================================
// Logout
// =========================================================
export const logoutGse = async () => {
  sessionStorage.removeItem(
    AUTH_INTENT_KEY
  );

  sessionStorage.removeItem(
    AUTH_MODE_KEY
  );

  // ล้างค่า Legacy ที่เคยใช้ควบคุมสิทธิ์
  sessionStorage.removeItem(
    'role'
  );

  sessionStorage.removeItem(
    'hasStarted'
  );

  sessionStorage.removeItem(
    'activeTab'
  );

  await signOut(auth);
};