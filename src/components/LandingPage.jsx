import React, { useState, useEffect } from 'react';

import {
  Wrench,
  ShieldCheck,
  FileText,
  X,
  Maximize2,
  CheckCircle,
} from 'lucide-react';

import {
  startGistdaGoogleRedirect,
  completeGistdaGoogleRedirect,
  logoutGse,
} from '../lib/authService';

import ReporterLoginPopup from './ReporterLoginPopup';

const getStaffAuthErrorMessage = (error) => {
  const message = String(error?.message || '');
  const code = String(error?.code || '');

  if (message === 'GISTDA_ACCOUNT_REQUIRED') {
    return 'กรุณาเข้าสู่ระบบด้วยบัญชี @gistda.or.th เท่านั้น';
  }

  if (
    message === 'STAFF_ACCESS_REQUIRED' ||
    message === 'AUTHORIZED_ACCESS_REQUIRED'
  ) {
    return 'บัญชีนี้ไม่ได้รับสิทธิ์สำหรับเจ้าหน้าที่ ฝวด.';
  }

  if (message === 'STAFF_DISABLED') {
    return 'บัญชีเจ้าหน้าที่นี้ถูกระงับสิทธิ์การใช้งาน';
  }

  if (message === 'INVALID_STAFF_ROLE') {
    return 'ไม่พบสิทธิ์การใช้งานที่ถูกต้อง กรุณาติดต่อผู้ดูแลระบบ';
  }

  if (message === 'STAFF_EMAIL_MISMATCH') {
    return 'ข้อมูลบัญชีและสิทธิ์เจ้าหน้าที่ไม่ตรงกัน กรุณาติดต่อผู้ดูแลระบบ';
  }

  if (
    message === 'AUTH_USER_NOT_FOUND' ||
    message === 'AUTHENTICATED_USER_REQUIRED'
  ) {
    return 'ไม่พบสถานะการเข้าสู่ระบบ กรุณาเข้าสู่ระบบใหม่อีกครั้ง';
  }

  if (code === 'auth/unauthorized-domain') {
    return 'โดเมนนี้ยังไม่ได้รับอนุญาตให้เข้าสู่ระบบ';
  }

  if (code === 'auth/network-request-failed') {
    return 'ไม่สามารถเชื่อมต่อระบบยืนยันตัวตนได้ กรุณาตรวจสอบเครือข่ายแล้วลองใหม่';
  }

  if (
    code === 'auth/operation-not-supported-in-this-environment' ||
    code === 'auth/web-storage-unsupported'
  ) {
    return 'สภาพแวดล้อมนี้ยังไม่รองรับการเข้าสู่ระบบ กรุณาใช้งานผ่านระบบ GSE ที่เผยแพร่แล้ว';
  }

  if (code === 'auth/too-many-requests') {
    return 'มีการร้องขอเข้าสู่ระบบหลายครั้งเกินไป กรุณารอสักครู่แล้วลองใหม่';
  }

  return 'ไม่สามารถเข้าสู่ระบบด้วยบัญชี GISTDA ได้ กรุณาลองใหม่';
};

export default function LandingPage({ onStart }) {
  const [showManual, setShowManual] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showReporterLogin, setShowReporterLogin] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // =========================================================
  // Staff Google Sign-In
  // =========================================================
  const handleGoogleStaffLogin = async () => {
    if (isLoggingIn) return;

    setIsLoggingIn(true);
    setLoginError('');

    try {
      await startGistdaGoogleRedirect('staff');
    } catch (error) {
      console.error('Google Redirect Start Error:', error);
      setLoginError(getStaffAuthErrorMessage(error));
      setIsLoggingIn(false);
    }
  };

  // =========================================================
  // Complete Google Redirect
  //
  // Security:
  // - ไม่เชื่อ Role จาก UI / localStorage / sessionStorage
  // - authService ตรวจ Google identity + @gistda.or.th
  // - authService ตรวจ staff_roles
  // - App.tsx ตรวจ Firebase session + staff_roles ซ้ำก่อนเข้า MainApp
  // =========================================================
  useEffect(() => {
    let isMounted = true;

    const handleGoogleRedirectResult = async () => {
      try {
        const result = await completeGistdaGoogleRedirect();

        // เปิด App ตามปกติ ไม่ได้กลับจาก Google Redirect
        if (!result || !isMounted) {
          return;
        }

        // -----------------------------------------------------
        // Staff entrance
        // -----------------------------------------------------
        if (result.intent === 'staff') {
          // บุคลากร GISTDA ที่ไม่มี Staff Role จะถูก authService
          // จัดเป็น reporter ซึ่งห้ามเข้าประตูเจ้าหน้าที่
          if (result.role === 'reporter') {
            await logoutGse();

            if (isMounted) {
              setShowLogin(true);
              setLoginError('บัญชีนี้ไม่ได้รับสิทธิ์สำหรับเจ้าหน้าที่ ฝวด.');
              setIsLoggingIn(false);
            }

            return;
          }

          // App.tsx จะ verify Firebase session + staff_roles ซ้ำ
          const started = await onStart();

          if (!started) {
            await logoutGse();

            if (isMounted) {
              setShowLogin(true);
              setLoginError('ไม่สามารถยืนยันสิทธิ์การใช้งานได้ กรุณาเข้าสู่ระบบใหม่');
              setIsLoggingIn(false);
            }

            return;
          }

          return;
        }

        // -----------------------------------------------------
        // Reporter Google entrance
        // เตรียมรองรับ Flow นี้โดยไม่เปิดสิทธิ์ Staff
        // -----------------------------------------------------
        if (result.intent === 'reporter') {
          const started = await onStart();

          if (!started) {
            await logoutGse();

            if (isMounted) {
              setLoginError('ไม่สามารถยืนยันตัวตนผู้แจ้งซ่อมได้ กรุณาเข้าสู่ระบบใหม่');
              setIsLoggingIn(false);
            }
          }

          return;
        }

        // Unknown intent = Fail Closed
        await logoutGse();

        if (isMounted) {
          setShowLogin(true);
          setLoginError('ไม่สามารถระบุประเภทการเข้าสู่ระบบได้ กรุณาเข้าสู่ระบบใหม่');
          setIsLoggingIn(false);
        }
      } catch (error) {
        console.error('Google Redirect Complete Error:', error);

        try {
          await logoutGse();
        } catch (logoutError) {
          console.error('Google Redirect Cleanup Error:', logoutError);
        }

        if (!isMounted) {
          return;
        }

        setShowLogin(true);
        setIsLoggingIn(false);
        setLoginError(getStaffAuthErrorMessage(error));
      }
    };

    handleGoogleRedirectResult();

    return () => {
      isMounted = false;
    };
  }, [onStart]);

  const closeStaffLogin = () => {
    if (isLoggingIn) return;

    setShowLogin(false);
    setLoginError('');
  };

  return (

    <div className="relative h-[100dvh] md:min-h-screen w-full flex flex-col items-center justify-center md:justify-start p-4 sm:p-6 md:p-12 overflow-hidden md:overflow-x-hidden md:overflow-y-auto bg-[#020617] font-sans">

      <div className="absolute inset-0 z-0">

        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/10 blur-[100px] rounded-full animate-pulse pointer-events-none"></div>

        <div

          className="absolute inset-0 bg-cover bg-top bg-no-repeat opacity-80 mix-blend-screen pointer-events-none"

          style={{ backgroundImage: "url('/bg-earth-new.webp')" }}

        ></div>

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020617]/50 to-[#020617] pointer-events-none"></div>

      </div>



      <style>{`

        @keyframes scan {

          0% { transform: translateY(-100%); opacity: 0; }

          10% { opacity: 1; }

          90% { opacity: 1; }

          100% { transform: translateY(100vh); opacity: 0; }

        }

        .animate-scan::before {

          content: '';

          position: absolute;

          width: 100%;

          height: 8px;

          background: linear-gradient(to bottom, transparent, rgba(34,211,238,0.8), rgba(255,255,255,0.9));

          box-shadow: 0 0 20px rgba(34,211,238,0.8);

          animation: scan 3.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;

        }

        .bg-cyber-grid {

          background-image: 

            linear-gradient(rgba(34, 211, 238, 0.05) 1px, transparent 1px),

            linear-gradient(90deg, rgba(34, 211, 238, 0.05) 1px, transparent 1px);

          background-size: 30px 30px;

        }

        .gse-hidden-scrollbar {

          scrollbar-width: none;

          -ms-overflow-style: none;

        }

        .gse-hidden-scrollbar::-webkit-scrollbar {

          display: none;

          width: 0;

          height: 0;

        }

      `}</style>



      <div className="absolute inset-0 z-0 bg-cyber-grid pointer-events-none fixed"></div>

      <div className="animate-scan absolute inset-0 z-0 pointer-events-none overflow-hidden fixed"></div>



      <div className="relative z-10 w-full h-full md:h-auto max-w-md md:max-w-xl lg:max-w-2xl flex flex-col items-center justify-center animate-in slide-in-from-bottom-8 fade-in duration-1000 my-auto md:my-0 md:mt-8 md:pb-12">

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-orange-500/20 blur-[120px] rounded-full pointer-events-none z-0 animate-pulse"></div>

        <div className="pt-4 pb-4 px-4 md:pt-14 md:pb-6 md:px-10 rounded-[1.5rem] md:rounded-[3rem] flex flex-col items-center justify-between text-center w-full h-full md:h-auto relative backdrop-blur-xl transition-all duration-500 z-10 overflow-hidden"

          style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', border: '3px solid #FF4500', boxShadow: '0 0 50px rgba(255, 69, 0, 0.8), inset 0 0 30px rgba(255, 69, 0, 0.5)' }}>



          <div className="w-full relative flex items-start justify-center mb-2 md:mb-6 min-h-[80px]">

            <div className="relative z-20 bg-slate-900/90 backdrop-blur-md rounded-2xl md:rounded-[2rem] p-3 md:p-6 shadow-[0_10px_30px_rgba(34,211,238,0.6)] text-center border-[2px] border-solid border-cyan-500 animate-bounce mx-auto max-w-[95%] sm:max-w-[80%] mt-4 md:mt-2">

              <div className="absolute left-1/2 -translate-x-1/2 -bottom-[11px] w-5 h-5 bg-slate-900 border-b-[2px] border-r-[2px] border-solid border-cyan-500 transform rotate-45 rounded-sm"></div>

              <p className="text-[17px] sm:text-[20px] md:text-[24px] font-bold text-slate-100 leading-tight md:leading-relaxed relative z-20 shadow-none">

                ระบบ/อุปกรณ์มีปัญหาใช่มั้ยคะ?

                <br className="hidden md:block"/>

                <span className="text-orange-400 font-black text-[17px] md:text-[24px] mt-0.5 md:mt-1 inline-flex items-center justify-center gap-1.5 drop-shadow-[0_0_12px_rgba(249,115,22,1)] whitespace-nowrap">

                  กดแจ้งซ่อมได้เลยค่ะ! <span className="text-[20px] md:text-[45px] leading-[0] transform translate-y-1">👇</span>

                </span>

              </p>

            </div>

          </div>



        <div className="flex-1 min-h-0 flex items-end justify-center w-full relative z-30 pointer-events-none drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)] mt-4 -mb-2 md:mt-2 md:-mb-5">

            <img src="/mascot.webp" alt="Mascot" className="h-full max-h-[320px] sm:max-h-[350px] md:max-h-[380px] w-auto object-contain object-bottom hover:scale-105 transition-transform duration-500" />

          </div>

          <div className="w-full flex flex-col gap-3 md:gap-5 relative z-10 mt-3 md:mt-6">

            <button onClick={() => setShowReporterLogin(true)} className="group relative w-full bg-gradient-to-r from-orange-900 to-orange-600 text-slate-100 font-black text-[17px] sm:text-[19px] md:text-[26px] py-3.5 md:py-5 rounded-2xl md:rounded-[1rem] border-[2px] border-solid border-orange-500/50 shadow-[0_0_25px_rgba(249,115,22,0.6)] md:shadow-[0_0_35px_rgba(249,115,22,0.6)] hover:from-orange-800 hover:to-orange-500 hover:border-orange-400 hover:shadow-[0_0_50px_rgba(249,115,22,0.9),inset_0_0_20px_rgba(249,115,22,0.6)] hover:scale-[1.03] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 md:gap-4 overflow-hidden">

              <div className="absolute inset-0 bg-gradient-to-t from-orange-500/0 via-orange-500/30 to-orange-500/0 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300"></div>

              <div className="bg-orange-900/70 p-1.5 md:p-3 rounded-xl md:rounded-2xl border border-orange-500/50 shadow-[inset_0_0_15px_rgba(249,115,22,0.4)] group-hover:bg-orange-800 group-hover:border-orange-400 group-hover:shadow-[0_0_20px_rgba(249,115,22,0.9)] transition-all z-10">

                <Wrench className="w-5 h-5 md:w-8 md:h-8 text-orange-200 group-hover:text-white drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]"/>

              </div>

              <span className="tracking-widest drop-shadow-[0_2px_5px_rgba(0,0,0,0.9)] z-10 group-hover:text-white group-hover:drop-shadow-[0_0_15px_rgba(249,115,22,1)]">แจ้งซ่อมระบบ/อุปกรณ์</span>

            </button>



            <button onClick={() => { setLoginError(''); setShowLogin(true); }} className="group relative w-full bg-gradient-to-r from-emerald-900 to-teal-600 text-slate-100 font-black text-[17px] sm:text-[19px] md:text-[26px] py-3.5 md:py-5 rounded-2xl md:rounded-[1rem] border-[2px] border-solid border-cyan-500/50 shadow-[0_0_25px_rgba(6,182,212,0.6)] md:shadow-[0_0_35px_rgba(6,182,212,0.6)] hover:from-emerald-800 hover:to-cyan-500 hover:border-cyan-400 hover:shadow-[0_0_50px_rgba(34,211,238,0.9),inset_0_0_20px_rgba(34,211,238,0.6)] hover:scale-[1.03] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 md:gap-4 overflow-hidden">

              <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/0 via-cyan-400/30 to-cyan-500/0 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300"></div>

              <div className="bg-cyan-900/70 p-1.5 md:p-3 rounded-xl md:rounded-2xl border border-cyan-500/50 shadow-[inset_0_0_15px_rgba(6,182,212,0.4)] group-hover:bg-cyan-900 group-hover:border-cyan-400 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.9)] transition-all z-10">

                <ShieldCheck className="w-5 h-5 md:w-8 md:h-8 text-cyan-200 group-hover:text-white drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"/>

              </div>

              <span className="tracking-widest drop-shadow-[0_2px_5px_rgba(0,0,0,0.9)] z-10 group-hover:text-white group-hover:drop-shadow-[0_0_15px_rgba(34,211,238,1)]">สำหรับเจ้าหน้าที่ ฝวด.</span>

            </button>



            <button onClick={() => setShowManual(true)} className="group relative w-full bg-gradient-to-r from-indigo-900 to-purple-600 text-slate-100 font-black text-[17px] sm:text-[19px] md:text-[26px] py-3.5 md:py-5 rounded-2xl md:rounded-[1rem] border-[2px] border-solid border-purple-500/50 shadow-[0_0_25px_rgba(168,85,247,0.6)] md:shadow-[0_0_35px_rgba(168,85,247,0.6)] hover:from-indigo-800 hover:to-purple-500 hover:border-fuchsia-400 hover:shadow-[0_0_50px_rgba(192,38,211,0.9),inset_0_0_20px_rgba(192,38,211,0.6)] hover:scale-[1.03] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 md:gap-4 overflow-hidden">

              <div className="absolute inset-0 bg-gradient-to-t from-fuchsia-500/0 via-fuchsia-500/30 to-fuchsia-500/0 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300"></div>

              <div className="bg-purple-900/70 p-1.5 md:p-3 rounded-xl md:rounded-2xl border border-purple-500/50 shadow-[inset_0_0_15px_rgba(168,85,247,0.4)] group-hover:bg-purple-900 group-hover:border-fuchsia-400 group-hover:shadow-[0_0_20px_rgba(192,38,211,0.9)] transition-all z-10">

                <FileText className="w-5 h-5 md:w-8 md:h-8 text-purple-200 group-hover:text-white drop-shadow-[0_0_8px_rgba(192,38,211,0.8)]"/>

              </div>

              <span className="tracking-widest drop-shadow-[0_2px_5px_rgba(0,0,0,0.9)] z-10 group-hover:text-white group-hover:drop-shadow-[0_0_15px_rgba(192,38,211,1)]">คู่มือการใช้งาน</span>

            </button>

          </div>



          <div className="mt-4 md:mt-6">

            <h2 className="text-[16px] sm:text-[20px] md:text-[24px] font-black text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.9)] uppercase mb-0.5 md:mb-1 transition-all duration-500 tracking-wide">ฝ่ายวิศวกรรมระบบปฏิบัติการดาวเทียม</h2>

            <h3 className="text-[14px] sm:text-[16px] md:text-[20px] font-bold text-slate-300 tracking-[0.2em] transition-all duration-500">สำนักปฏิบัติการดาวเทียม</h3>

            <h3 className="font-mono text-slate-400 tracking-widest font-bold mt-2 md:mt-4 opacity-95 flex items-baseline justify-center flex-wrap gap-x-1.5 gap-y-1">

              <span className="text-[13px] md:text-[14px]">©2026</span>

              <span><span className="text-[15px] md:text-[22px] text-orange-500 font-black drop-shadow-[0_0_10px_rgba(249,115,22,0.8)]">G</span><span className="text-[10px] md:text-[13px]">round</span></span>

              <span><span className="text-[15px] md:text-[22px] text-orange-500 font-black drop-shadow-[0_0_10px_rgba(249,115,22,0.8)]">S</span><span className="text-[10px] md:text-[13px]">ystem</span></span>

              <span><span className="text-[15px] md:text-[22px] text-orange-500 font-black drop-shadow-[0_0_10px_rgba(249,115,22,0.8)]">E</span><span className="text-[10px] md:text-[13px]">ngineering:</span></span>

              <span className="text-[15px] md:text-[22px] text-orange-400 font-black drop-shadow-[0_0_15px_rgba(249,115,22,1)] ml-1">GSE</span>

            </h3>

          </div>

        </div>

      </div>



      {showManual && (

        <div className="fixed inset-0 z-[200] bg-slate-950/90 flex flex-col items-center justify-center p-2 md:p-4 backdrop-blur-md animate-in fade-in" onClick={() => setShowManual(false)}> 

          <div className="absolute w-[300px] h-[300px] bg-orange-500/40 rounded-full blur-[100px] animate-pulse pointer-events-none z-0"></div>

          <div className="w-full max-w-lg md:max-w-4xl bg-slate-900 border-[3px] md:border-[4px] border-solid border-orange-500 rounded-2xl md:rounded-[2rem] overflow-hidden shadow-[0_0_50px_rgba(249,115,22,0.6)] flex flex-col max-h-[96vh] md:max-h-[90vh] relative z-10 transition-all" onClick={(e) => e.stopPropagation()}>

            <div className="relative py-4 px-4 md:px-8 bg-slate-950 flex items-center justify-between border-b-4 border-orange-500 shrink-0 min-h-[70px] md:min-h-[90px]">

              <div className="absolute inset-0 bg-orange-500/20 blur-[40px] pointer-events-none animate-pulse z-0"></div>

              <div className="relative z-10 p-2 md:p-3 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl md:rounded-2xl shadow-[0_0_20px_rgba(249,115,22,0.6)] animate-pulse shrink-0">

                <FileText size={24} className="md:w-8 md:h-8 text-white drop-shadow-md" />

              </div>

              <div className="absolute left-1/2 -translate-x-1/2 z-10 flex justify-center items-center pointer-events-none w-full px-16 md:px-0">

                <div className="relative pointer-events-auto">

                  <div className="absolute -inset-1 bg-orange-500/30 blur-[10px] rounded-full animate-pulse z-0"></div>

                  <div className="relative z-10 bg-slate-800 border-[2px] md:border-[3px] border-solid border-orange-400 rounded-lg md:rounded-xl px-3 md:px-8 py-2 md:py-2.5 shadow-[0_0_10px_rgba(249,115,22,0.8)]">

                    <h3 className="text-white font-black tracking-widest text-[16px] sm:text-[18px] md:text-2xl drop-shadow-[0_0_5px_rgba(255,255,255,0.8)] whitespace-nowrap">คู่มือการใช้งานโปรแกรม</h3>

                  </div>

                </div>

              </div>

              <button onClick={() => setShowManual(false)} className="relative z-20 bg-slate-900 border-2 border-solid border-orange-400 p-2 md:p-3 rounded-full transition-all shadow-[0_0_15px_rgba(249,115,22,0.6)] hover:shadow-[0_0_25px_rgba(225,29,72,1)] hover:-translate-y-1 active:scale-95 animate-pulse hover:bg-rose-600 hover:border-rose-400 group shrink-0">

                <X size={20} className="md:w-6 md:h-6 text-rose-500 group-hover:text-white drop-shadow-[0_0_8px_rgba(225,29,72,0.8)] stroke-[3px] transition-colors" />

              </button>

            </div>

            <div className="p-4 md:p-8 overflow-y-auto space-y-6 md:space-y-10 bg-slate-800 flex-1">

           {[

                { src: '/manual-1-1.png', alt: 'คู่มือเข้าโปรแกรมหน้าแรก' },

                { src: '/manual-2-1.png', alt: 'คู่มือผู้แจ้งซ่อม-1' },

                { src: '/manual-2-2.png', alt: 'คู่มือผู้แจ้งซ่อม-2' },

                    { src: '/manual-iPhone.png', alt: 'คู่มือตั้งค่าโทรศัพท์-iOS' },

                { src: '/manual-Android.png', alt: 'คู่มือการตั้งค่าโทรศัพท์-Android' },

                { src: '/manual-PC.png', alt: 'คู่มือตั้งค่าการแสดงผลบน-PC' }

              ].map((manual, index) => (

                <div key={index} className="flex flex-col items-center gap-3 md:gap-4">

                  <img src={manual.src} alt={manual.alt} className="w-full rounded-xl md:rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.6)] border-[2px] border-solid border-slate-600 transition-opacity" />

                  <a href={manual.src} target="_blank" rel="noopener noreferrer" 

                     className="w-[85%] sm:w-[60%] md:w-[40%] bg-slate-900 border-[2px] border-solid border-orange-500/80 text-orange-400 p-3 md:p-4 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.4)] backdrop-blur-sm transition-all active:scale-95 flex items-center justify-center gap-2 z-20 hover:bg-orange-500 hover:text-white hover:border-white hover:scale-105 group">

                    <Maximize2 size={18} className="md:w-6 md:h-6 drop-shadow-md group-hover:scale-125 transition-transform" strokeWidth={2.5}/>

                    <span className="text-[13px] md:text-[16px] font-black tracking-widest uppercase drop-shadow-md">แตะเพื่อขยายซูมเต็มจอ</span>

                  </a>

                </div>

              ))}

              <div className="text-center pt-6 pb-4 mt-8 border-t-2 border-dashed border-orange-500/30">

                <p className="text-slate-200 font-black text-[12px] md:text-[24px] tracking-widest flex items-center justify-center gap-2 md:gap-3 drop-shadow-[0_0_10px_rgba(249,115,22,1)]">

                  <CheckCircle className="w-6 h-7 md:w-7 md:h-7 text-emerald-600 drop-shadow-[0_0_8px_rgba(16,185,129,1)]" /> 

                  สิ้นสุดคู่มือการใช้งาน

                </p>

              </div>

            </div>

          </div>

        </div>

      )}




      {showReporterLogin && (

        <ReporterLoginPopup onClose={() => setShowReporterLogin(false)} onLoginSuccess={onStart} />

      )}



      {showLogin && (
        <div
          className="fixed inset-0 z-[300] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-300"
          onClick={closeStaffLogin}
        >
          <div className="absolute w-[300px] h-[300px] bg-cyan-500/30 rounded-full blur-[100px] animate-pulse pointer-events-none z-0"></div>

          <div
            className="gse-hidden-scrollbar relative z-10 w-full max-w-sm max-h-[94dvh] overflow-y-auto overscroll-contain bg-slate-900 border-[3px] border-solid border-cyan-500 rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-6 shadow-[0_0_50px_rgba(34,211,238,0.5)] flex flex-col items-center gap-4 transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeStaffLogin}
              disabled={isLoggingIn}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 text-slate-400 hover:text-rose-400 transition-colors z-20 disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="ปิดหน้าต่างเข้าสู่ระบบเจ้าหน้าที่"
            >
              <X size={28} />
            </button>

            <div className="flex flex-col items-center text-center pt-3 sm:pt-2 px-8">
              <div className="relative w-14 h-14 mb-3">
                <div className="absolute inset-0 bg-cyan-500/30 blur-[18px] rounded-full"></div>
                <div className="relative w-14 h-14 bg-slate-950 border-[2px] border-cyan-400 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.5)]">
                  <ShieldCheck className="w-7 h-7 text-cyan-300" />
                </div>
              </div>

              <h2 className="text-[19px] sm:text-xl font-black text-white tracking-wide">
                สำหรับเจ้าหน้าที่ ฝวด.
              </h2>

              <p className="mt-1 text-[11px] sm:text-xs font-bold text-slate-400 leading-relaxed">
                ใช้บัญชีองค์กรเพื่อยืนยันตัวตนและตรวจสอบสิทธิ์โดยอัตโนมัติ
              </p>
            </div>

            <button
              type="button"
              onClick={handleGoogleStaffLogin}
              disabled={isLoggingIn}
              className="w-full min-h-[60px] bg-white text-slate-900 rounded-2xl border-[2px] border-slate-200 shadow-[0_0_18px_rgba(255,255,255,0.16)] hover:border-cyan-300 hover:shadow-[0_0_24px_rgba(34,211,238,0.35)] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 px-4 py-3"
            >
              <span className="w-9 h-9 shrink-0 rounded-full border border-slate-300 bg-white flex items-center justify-center font-black text-[20px] leading-none text-blue-600 shadow-sm">
                G
              </span>

              <span className="flex flex-col items-start text-left leading-tight min-w-0">
                <span className="font-black text-[14px] sm:text-[15px] text-slate-900">
                  {isLoggingIn ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบด้วยบัญชี GISTDA'}
                </span>

                <span className="text-[11px] sm:text-xs font-bold text-slate-500">
                  ใช้บัญชี Google @gistda.or.th
                </span>
              </span>
            </button>

            {loginError && (
              <p
                className="text-sm font-bold text-center p-2.5 rounded-xl w-full border animate-in shake bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.2)]"
                role="alert"
                aria-live="polite"
              >
                {loginError}
              </p>
            )}

            <div className="w-full rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-3.5 flex gap-3 items-start">
              <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />

              <div className="text-left">
                <p className="text-[11px] sm:text-xs font-black text-cyan-300">
                  Security Phase 1
                </p>

                <p className="mt-1 text-[10px] sm:text-[11px] leading-relaxed font-bold text-slate-400">
                  ระบบ PIN เดิมถูกยกเลิกจากการเข้าสู่ระบบเจ้าหน้าที่แล้ว
                  สิทธิ์จะอ้างอิงจากบัญชี GISTDA ที่ยืนยันโดย Google และข้อมูล
                  staff_roles เท่านั้น
                </p>
              </div>
            </div>

            <p className="text-[10px] sm:text-[11px] text-slate-500 font-bold text-center leading-relaxed px-2">
              หากเป็นบุคลากร GISTDA แต่ไม่ได้รับสิทธิ์เจ้าหน้าที่ ฝวด.
              ให้ใช้เมนู “แจ้งซ่อมระบบ/อุปกรณ์” สำหรับการแจ้งปัญหา
            </p>

            {isLoggingIn && (
              <div className="w-full min-h-[110px] flex flex-col items-center justify-center animate-in zoom-in duration-300">
                <div className="relative w-14 h-14 mb-4">
                  <div className="absolute inset-0 border-[4px] border-cyan-500/20 rounded-full"></div>
                  <div className="absolute inset-0 border-[4px] border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                  <ShieldCheck className="absolute inset-0 m-auto text-cyan-400 animate-pulse w-6 h-6" />
                </div>

                <span className="text-cyan-400 font-black tracking-widest text-[14px] sm:text-[15px] drop-shadow-[0_0_10px_rgba(34,211,238,0.8)] animate-pulse">
                  ตรวจสอบสิทธิ์...
                </span>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
