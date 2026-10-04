import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

import {
  startGistdaGoogleRedirect,
} from '../lib/authService.js';


// =========================================================
// Reporter Authentication Error Message
// =========================================================

const getReporterAuthErrorMessage = (error) => {
  const code = String(
    error?.code ||
    error?.message ||
    ''
  ).toLowerCase();

  if (
    code.includes('auth/unauthorized-domain')
  ) {
    return 'โดเมนนี้ยังไม่ได้รับอนุญาตสำหรับการเข้าสู่ระบบ กรุณาติดต่อผู้ดูแลระบบ';
  }

  if (
    code.includes('auth/operation-not-allowed')
  ) {
    return 'ระบบ Google Sign-In ยังไม่ได้เปิดใช้งาน กรุณาติดต่อผู้ดูแลระบบ';
  }

  if (
    code.includes('auth/network-request-failed')
  ) {
    return 'ไม่สามารถเชื่อมต่อระบบยืนยันตัวตนได้ กรุณาตรวจสอบอินเทอร์เน็ตแล้วลองใหม่';
  }

  if (
    code.includes('auth/too-many-requests')
  ) {
    return 'มีการร้องขอเข้าสู่ระบบหลายครั้งเกินไป กรุณารอสักครู่แล้วลองใหม่';
  }

  return 'ไม่สามารถเริ่มการเข้าสู่ระบบได้ กรุณาลองใหม่อีกครั้ง';
};


// =========================================================
// Reporter Login Popup
//
// Security Phase 1:
//
// - ยกเลิก Phone + PIN Authentication
// - ยกเลิก PIN ใน Firestore
// - ยกเลิก localStorage เป็นหลักฐานตัวตน
// - ใช้ Firebase Google Authentication
// - จำกัดบัญชี @gistda.or.th ผ่าน authService
// - ใช้ intent = reporter
//
// LandingPage จะเป็นผู้รับ Redirect Result
// และ App.tsx จะ Verify Firebase Session อีกครั้ง
// =========================================================

export default function ReporterLoginPopup({
  onClose,
}) {
  const [
    isLoggingIn,
    setIsLoggingIn,
  ] = useState(false);

  const [
    loginError,
    setLoginError,
  ] = useState('');


  // =======================================================
  // Google Reporter Login
  // =======================================================

  const handleGoogleReporterLogin =
    async () => {

      if (isLoggingIn) {
        return;
      }

      setIsLoggingIn(true);
      setLoginError('');

      try {

        await startGistdaGoogleRedirect(
          'reporter'
        );

      } catch (error) {

        console.error(
          'Reporter Google Redirect Start Error:',
          error
        );

        setLoginError(
          getReporterAuthErrorMessage(
            error
          )
        );

        setIsLoggingIn(false);
      }
    };


  // =======================================================
  // SSR Safety
  // =======================================================

  if (
    typeof document === 'undefined'
  ) {
    return null;
  }


  // =======================================================
  // UI
  // =======================================================

  return createPortal(

    <div
      className="fixed inset-0 z-[300] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300"
      onClick={() => {
        if (!isLoggingIn) {
          onClose?.();
        }
      }}
    >

      {/* Background Glow */}
      <div className="absolute w-[320px] h-[320px] bg-orange-500/30 rounded-full blur-[110px] animate-pulse pointer-events-none z-0" />


      {/* Main Card */}
      <div
        className="relative z-10 w-full max-w-sm bg-slate-900 border-[3px] border-solid border-cyan-500/50 rounded-[2.5rem] p-7 shadow-[0_0_50px_rgba(249,115,22,0.30)] flex flex-col items-center"
        onClick={(event) =>
          event.stopPropagation()
        }
      >

        {/* Close */}
        <button
          type="button"
          disabled={isLoggingIn}
          onClick={() =>
            onClose?.()
          }
          className="absolute top-5 right-5 text-slate-400 hover:text-rose-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors z-20"
          aria-label="ปิด"
        >
          <X size={28} />
        </button>


        {/* Security Icon */}
        <div className="relative mt-2">

          <div className="absolute inset-0 bg-cyan-500 blur-[22px] opacity-40 rounded-full" />

          <div className="relative w-16 h-16 bg-slate-950 border-[2px] border-cyan-400 rounded-full flex items-center justify-center shadow-[0_0_22px_rgba(34,211,238,0.55)]">

            <ShieldCheck
              size={32}
              className="text-cyan-400"
            />

          </div>

        </div>


        {/* Title */}
        <h2 className="mt-5 text-xl font-black text-white tracking-wide text-center">

          แจ้งซ่อมระบบ/อุปกรณ์

        </h2>


        <p className="mt-2 text-sm text-slate-400 text-center leading-relaxed">

          กรุณายืนยันตัวตนด้วยบัญชีองค์กร GISTDA
          ก่อนเข้าใช้งานระบบแจ้งซ่อม

        </p>


        {/* Security Description */}
        <div className="mt-6 w-full rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4">

          <div className="flex items-start gap-3">

            <ShieldCheck
              size={20}
              className="text-cyan-400 shrink-0 mt-0.5"
            />

            <div>

              <p className="text-sm font-bold text-cyan-300">
                GISTDA Secure Authentication
              </p>

              <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                ระบบจะใช้บัญชี Google
                @gistda.or.th
                เพื่อยืนยันตัวตนผู้แจ้งซ่อม
                โดยไม่ใช้รหัส PIN เดิม
              </p>

            </div>

          </div>

        </div>


        {/* Error */}
        {loginError && (

          <div className="mt-4 w-full rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 flex items-start gap-2">

            <AlertCircle
              size={18}
              className="text-rose-400 shrink-0 mt-0.5"
            />

            <p className="text-sm font-bold text-rose-400 leading-relaxed">
              {loginError}
            </p>

          </div>

        )}


        {/* Google Login Button */}
        <button
          type="button"
          disabled={isLoggingIn}
          onClick={
            handleGoogleReporterLogin
          }
          className="mt-6 w-full min-h-[76px] rounded-2xl bg-white text-slate-900 border border-slate-200 shadow-[0_8px_25px_rgba(0,0,0,0.30)] flex items-center justify-center gap-4 px-4 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all"
        >

          <div className="w-11 h-11 shrink-0 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm">

            <span className="text-[#4285F4] text-2xl font-black">
              G
            </span>

          </div>


          <div className="text-left">

            <div className="font-black text-[16px] sm:text-[17px] leading-tight">

              {isLoggingIn
                ? 'กำลังเข้าสู่ระบบ...'
                : 'เข้าสู่ระบบด้วยบัญชี GISTDA'}

            </div>

            <div className="mt-1 text-xs sm:text-sm text-slate-500 font-bold">

              ใช้บัญชี Google @gistda.or.th

            </div>

          </div>

        </button>


        {/* Migration Note */}
        <div className="mt-5 w-full border-t border-slate-700/60 pt-4">

          <p className="text-[11px] sm:text-xs text-slate-500 text-center leading-relaxed">

            ระบบเบอร์โทรศัพท์และ PIN เดิม
            ถูกยกเลิกจากการยืนยันตัวตน
            เพื่อเพิ่มความปลอดภัยของระบบ GSE

          </p>

        </div>

      </div>

    </div>,

    document.body
  );
}