import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
  } from 'firebase/auth';
  
  import {
    doc,
    getDoc,
  } from 'firebase/firestore';
  
  import { auth, db } from './firebaseConfig.jsx';
  
  const GISTDA_DOMAIN = 'gistda.or.th';
  
  const googleProvider = new GoogleAuthProvider();
  
  // ช่วยให้หน้าต่าง Google แนะนำบัญชีองค์กร GISTDA
  // แต่ยังไม่ถือเป็น Security Boundary
  googleProvider.setCustomParameters({
    hd: GISTDA_DOMAIN,
    prompt: 'select_account',
  });
  
  export const isGistdaEmail = (email = '') => {
    return String(email)
      .trim()
      .toLowerCase()
      .endsWith(`@${GISTDA_DOMAIN}`);
  };
  
  const normalizeStaffRole = (rawRole) => {
    const role = String(rawRole || '').trim().toLowerCase();
  
    if (role === 'technician') return 'technician';
    if (role === 'commander') return 'commander';
    if (role === 'admin') return 'admin';
  
    return null;
  };
  
  export const signInWithGistdaGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
  
    const email = String(user.email || '')
      .trim()
      .toLowerCase();
  
    // อนุญาตเฉพาะบัญชี GISTDA ที่ Google ยืนยันแล้ว
    if (!user.emailVerified || !isGistdaEmail(email)) {
      await signOut(auth);
      throw new Error('GISTDA_ACCOUNT_REQUIRED');
    }
  
    // staff_roles ใช้อีเมลเป็น Document ID ตามฐานข้อมูลปัจจุบัน
    const staffRef = doc(db, 'staff_roles', email);
    const staffSnap = await getDoc(staffRef);
  
    // ไม่มีใน staff_roles = บุคลากร GISTDA ทั่วไป / ผู้แจ้งซ่อม
    if (!staffSnap.exists()) {
      return {
        user,
        role: 'reporter',
        staffProfile: null,
      };
    }
  
    const staffProfile = staffSnap.data();
  
    // รองรับการระงับสิทธิ์ Staff โดยไม่ลบประวัติ
    if (staffProfile.active === false) {
      await signOut(auth);
      throw new Error('STAFF_DISABLED');
    }
  
    const role = normalizeStaffRole(staffProfile.role);
  
    // มี Staff record แต่ Role ผิด/ไม่รู้จัก ให้ Fail Closed
    if (!role) {
      await signOut(auth);
      throw new Error('INVALID_STAFF_ROLE');
    }
  
    return {
      user,
      role,
      staffProfile,
    };
  };
  
  export const logoutGse = async () => {
    await signOut(auth);
  };