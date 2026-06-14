import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Wrench, ShieldCheck, FileText, Phone, EyeOff, Eye, X, Maximize2, CheckCircle } from 'lucide-react';
import { query, collection, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { sendPasswordResetEmail } from 'firebase/auth';
import { db, auth } from '../lib/firebaseConfig';
import ReporterLoginPopup from './ReporterLoginPopup'; // 🌟 ดึง Popup ฝั่งผู้แจ้งซ่อมมาใช้ที่นี่

export default function LandingPage({ onStart }) {
  const [showManual, setShowManual] = useState(false); 
  const [showLogin, setShowLogin] = useState(false);
  const [showReporterLogin, setShowReporterLogin] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // 🌟 ตัวแปรสำหรับระบบ PIN ของเจ้าหน้าที่ ฝวด.
  const [staffPhone, setStaffPhone] = useState('');
  const [staffPin, setStaffPin] = useState('');
  const [staffStep, setStaffStep] = useState(1);
  const [staffEmail, setStaffEmail] = useState('');
  const [staffRole, setStaffRole] = useState('');
  const [showStaffPin, setShowStaffPin] = useState(false)
  const [attemptCount, setAttemptCount] = useState(0);
  const [confirmStaffPin, setConfirmStaffPin] = useState(''); 
  const [isConfirmingStaffPin, setIsConfirmingStaffPin] = useState(false);
  const [isNewStaff, setIsNewStaff] = useState(false);

  useEffect(() => {
    const initStaffLogin = async () => {
      if (showLogin) {
        const savedPhone = localStorage.getItem('gse_staff_phone');
        if (savedPhone) {
          setStaffPhone(savedPhone);
          try {
            const cleanPhone = savedPhone.replace(/-/g, '');
            const qRole = query(collection(db, 'staff_roles'), where('phone', '==', cleanPhone));
            const snapRole = await getDocs(qRole);
            if (!snapRole.empty) {
              setStaffEmail(snapRole.docs[0].data().email);
              setStaffRole(snapRole.docs[0].data().role);
            }
          } catch (e) {}
          setStaffStep(2); 
        } else {
          setStaffStep(1); 
          setStaffPhone('');
        }
        setStaffPin('');
        setLoginError('');
      }
    };
    initStaffLogin();
  }, [showLogin]);

  const closeStaffLogin = () => {
    setShowLogin(false);
    setStaffPhone('');
    setStaffPin('');
    setStaffStep(1);
    setStaffEmail('');
    setStaffRole('');
    setLoginError('');
    setAttemptCount(0);
  };

  const handleStaffPhoneNext = async () => {
    const cleanPhone = staffPhone.replace(/-/g, '');
    if (cleanPhone.length !== 10) {
      setLoginError('กรุณากรอกเบอร์โทรศัพท์ให้ครบ 10 หลักค่ะ');
      setStaffPhone('');
      return;
    }
    
    setIsLoggingIn(true);
    setLoginError('');
    try {
      const qRole = query(collection(db, 'staff_roles'), where('phone', '==', cleanPhone));
      const snapRole = await getDocs(qRole);
      
      if (!snapRole.empty) {
        const data = snapRole.docs[0].data();
        setStaffEmail(data.email);
        setStaffRole(data.role); 
        
        const SkinnerPin = data.pin !== undefined && data.pin !== null && String(data.pin).trim() !== '';
        setIsNewStaff(!SkinnerPin);
        setStaffStep(2);
      } else {
        setLoginError('เฉพาะเจ้าหน้าที่ ฝวด. เท่านั้น'); 
        setStaffPhone('');
      }
    } catch (err) {
      setLoginError('เกิดข้อผิดพลาดในการตรวจสอบข้อมูล');
      setStaffPhone('');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleStaffPinSubmit = async () => {
    const cleanPhone = staffPhone.replace(/-/g, '');

    if (isNewStaff) {
      if (!isConfirmingStaffPin) {
        if (staffPin.length !== 6) { setLoginError('กรุณาตั้งรหัส PIN ให้ครบ 6 หลักค่ะ'); return; }
        setIsConfirmingStaffPin(true);
        setLoginError('');
      } else {
        if (confirmStaffPin.length !== 6) { setLoginError('กรุณายืนยันรหัส PIN ให้ครบ 6 หลักค่ะ'); return; }
        if (staffPin !== confirmStaffPin) { 
          setLoginError('รหัส PIN ไม่ตรงกัน กรุณาลองใหม่อีกครั้งค่ะ'); 
          setConfirmStaffPin(''); 
          return; 
        }
        setIsLoggingIn(true); setLoginError('');
        try {
          const qRole = query(collection(db, 'staff_roles'), where('phone', '==', cleanPhone));
          const snapRole = await getDocs(qRole);
          
          if (!snapRole.empty) {
            const docData = snapRole.docs[0].data();
            const docId = snapRole.docs[0].id;
            
            await updateDoc(doc(db, 'staff_roles', docId), {
              pin: staffPin,
              updatedAt: new Date().toISOString()
            });

            localStorage.setItem('gse_staff_phone', cleanPhone);
            setAttemptCount(0);
            closeStaffLogin();
            onStart(docData.role || 'Commander'); 
          }
        } catch (err) {
          setLoginError('เกิดข้อผิดพลาดในการลงทะเบียน');
          setStaffPin(''); setConfirmStaffPin(''); setIsConfirmingStaffPin(false);
        } finally { setIsLoggingIn(false); }
      }
      return;
    }

    if (staffPin.length !== 6) { setLoginError('กรุณากรอกรหัส PIN ให้ครบ 6 หลักค่ะ'); return; }
    setIsLoggingIn(true); setLoginError('');
    try {
      const q = query(collection(db, 'staff_roles'), where('phone', '==', cleanPhone), where('pin', '==', staffPin));
      const snap = await getDocs(q);

      if (!snap.empty) {
        localStorage.setItem('gse_staff_phone', cleanPhone);
        setAttemptCount(0);
        closeStaffLogin();
        onStart(staffRole || 'Commander'); 
      } else {
        const newCount = attemptCount + 1;
        setAttemptCount(newCount);
        
        if (newCount >= 5) {
          setLoginError('❌ ระบบล็อกการทำงานชั่วคราว 3 นาทีเนื่องจากกรอกรหัสผิดครบ 5 ครั้ง');
          localStorage.setItem('gse_staff_lock_until', Date.now() + 3 * 60 * 1000);
          setStaffPin('');
        } else {
          setLoginError(`รหัส PIN ไม่ถูกต้อง (ครั้งที่ ${newCount}/5)`);
          setStaffPin('');
        }
      }
    } catch (err) {
      setLoginError('เกิดข้อผิดพลาดในการตรวจสอบรหัส');
    } finally { setIsLoggingIn(false); }
  };

  useEffect(() => {
    if (showLogin && staffStep === 2 && !isLoggingIn) {
      if (isNewStaff && isConfirmingStaffPin && confirmStaffPin.length === 6) {
        handleStaffPinSubmit();
      } else if (!isNewStaff && staffPin.length === 6) {
        handleStaffPinSubmit();
      }
    }
  }, [staffPin, confirmStaffPin, staffStep, isLoggingIn, isConfirmingStaffPin, isNewStaff, showLogin]);

  const handleStaffNumpad = (num) => {
    const staffLock = localStorage.getItem('gse_staff_lock_until');
    if (staffLock && Date.now() < Number(staffLock)) {
      const remainMin = Math.ceil((Number(staffLock) - Date.now()) / 1000 / 60);
      setLoginError(`❌ ระบบยังล็อกอยู่ กรุณารออีกประมาณ ${remainMin} นาที`);
      return;
    }
    
    setLoginError('');
    if (staffStep === 1 && staffPhone.length < 10) setStaffPhone(prev => prev + num);
    else if (staffStep === 2) {
      if (isConfirmingStaffPin && confirmStaffPin.length < 6) setConfirmStaffPin(prev => prev + num);
      else if (!isConfirmingStaffPin && staffPin.length < 6) setStaffPin(prev => prev + num);
    }
  };

  useEffect(() => {
    if (!showLogin || isLoggingIn) return;
    if (staffStep === 1 && staffPhone.length === 10) {
      handleStaffPhoneNext();
    }
    else if (staffStep === 2) {
      if (isNewStaff) {
         if (!isConfirmingStaffPin && staffPin.length === 6) {
            setIsConfirmingStaffPin(true);
         } else if (isConfirmingStaffPin && confirmStaffPin.length === 6) {
            handleStaffPinSubmit();
         }
      } else {
         if (staffPin.length === 6) {
            handleStaffPinSubmit();
         }
      }
    }
  }, [staffPhone, staffPin, confirmStaffPin, staffStep, isLoggingIn, isConfirmingStaffPin, isNewStaff, showLogin]);

  const handleStaffDelete = () => {
    if (staffStep === 1) setStaffPhone(prev => prev.slice(0, -1));
    if (staffStep === 2) {
      if (isConfirmingStaffPin) setConfirmStaffPin(prev => prev.slice(0, -1));
      else setStaffPin(prev => prev.slice(0, -1));
    }
  };

  const handleStaffClear = () => {
    if (staffStep === 1) setStaffPhone('');
    if (staffStep === 2) {
      if (isConfirmingStaffPin) setConfirmStaffPin('');
      else setStaffPin('');
    }
  };

  useEffect(() => {
    const handleStaffKeyDown = (e) => {
      if (!showLogin) return;
      if (/^[0-9]$/.test(e.key)) handleStaffNumpad(e.key);
      else if (e.key === 'Backspace') handleStaffDelete();
      else if (e.key.toLowerCase() === 'c' || e.key === 'Escape') handleStaffClear();
      else if (e.key === 'Enter') {
        e.preventDefault();
        if (staffStep === 1) handleStaffPhoneNext();
        else if (staffStep === 2) handleStaffPinSubmit();
      }
    };
    window.addEventListener('keydown', handleStaffKeyDown);
    return () => window.removeEventListener('keydown', handleStaffKeyDown);
  }, [showLogin, staffStep, staffPhone, staffPin, staffEmail, staffRole, isConfirmingStaffPin, confirmStaffPin]);

  const formatPhone = (p) => {
    if (!p) return '___-___-____';
    const str = p.padEnd(10, '_');
    return `${str.slice(0, 3)}-${str.slice(3, 6)}-${str.slice(6)}`;
  };

  const formatPinDisplay = (p) => {
    const padded = p.padEnd(6, '-');
    if (showStaffPin) return padded.split('').join(' ');
    return padded.split('').map(c => c === '-' ? '-' : '•').join(' ');
  };

  return (
    <div className="relative h-[100dvh] md:min-h-screen w-full flex flex-col items-center justify-center md:justify-start p-4 sm:p-6 md:p-12 overflow-hidden md:overflow-x-hidden md:overflow-y-auto bg-[#020617] font-sans">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('[https://www.transparenttextures.com/patterns/carbon-fibre.png](https://www.transparenttextures.com/patterns/carbon-fibre.png)')] opacity-20 pointer-events-none"></div>
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

            <button onClick={() => setShowLogin(true)} className="group relative w-full bg-gradient-to-r from-emerald-900 to-teal-600 text-slate-100 font-black text-[17px] sm:text-[19px] md:text-[26px] py-3.5 md:py-5 rounded-2xl md:rounded-[1rem] border-[2px] border-solid border-cyan-500/50 shadow-[0_0_25px_rgba(6,182,212,0.6)] md:shadow-[0_0_35px_rgba(6,182,212,0.6)] hover:from-emerald-800 hover:to-cyan-500 hover:border-cyan-400 hover:shadow-[0_0_50px_rgba(34,211,238,0.9),inset_0_0_20px_rgba(34,211,238,0.6)] hover:scale-[1.03] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 md:gap-4 overflow-hidden">
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
                { src: '/manual-3-1.png', alt: 'คู่มือเจ้าหน้าที่ ฝวด.-1' },
                { src: '/manual-3-2.png', alt: 'คู่มือเจ้าหน้าที่ ฝวด.-2' },
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
        <div className="fixed inset-0 z-[300] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="absolute w-[300px] h-[300px] bg-cyan-500/30 rounded-full blur-[100px] animate-pulse pointer-events-none z-0"></div>
          
          <div className="relative z-10 w-full max-w-sm bg-slate-900 border-[3px] border-solid border-cyan-500 rounded-[2.5rem] p-6 shadow-[0_0_50px_rgba(34,211,238,0.5)] flex flex-col items-center gap-4 transform transition-all" onClick={e => e.stopPropagation()}>
            <button onClick={closeStaffLogin} className="absolute top-5 right-5 text-slate-400 hover:text-rose-400 transition-colors z-20">
              <X size={28} />
            </button>
            <div className="relative mt-2">
              <div className="absolute inset-0 bg-cyan-500 blur-[20px] opacity-40 rounded-full"></div>
              <div className="relative w-16 h-16 bg-slate-950 border-[2px] border-cyan-400 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.6)]">
                <Phone className="w-8 h-8 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
              </div>
            </div>
            
            <h2 className="text-xl font-black text-white tracking-wide text-center">
              {staffStep === 1 ? 'เบอร์โทรศัพท์เจ้าหน้าที่' : (isNewStaff ? (isConfirmingStaffPin ? '✅ ยืนยันรหัส PIN อีกครั้ง' : '✨ ตั้งรหัส PIN 6 หลัก') : '🔒 ใส่รหัส PIN เข้าสู่ระบบ')}
            </h2>

            {loginError && <p className="text-sm font-bold text-center p-2 rounded-lg w-full border animate-in shake bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.2)]">{loginError}</p>}

            <div className="relative w-full mb-2">
              <div className="w-full bg-slate-950 border-[2px] border-cyan-400 rounded-2xl h-16 flex items-center justify-center text-3xl font-black text-cyan-300 tracking-[0.1em] shadow-[0_0_15px_rgba(34,211,238,0.4),inset_0_0_10px_rgba(34,211,238,0.2)] transition-all">
              {staffStep === 1 ? formatPhone(staffPhone) : formatPinDisplay(isConfirmingStaffPin ? confirmStaffPin : staffPin)}
              </div>
              {staffStep === 2 && (
                <button type="button" onClick={() => setShowStaffPin(!showStaffPin)} className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-600 hover:text-cyan-300 transition-colors drop-shadow-md z-20">
                  {showStaffPin ? <EyeOff size={24} /> : <Eye size={24} />}
                </button>
              )}
            </div>

            {staffStep === 2 && (
              <div className="w-full flex justify-between items-center px-1 -mt-1 mb-1">
                {attemptCount >= 3 && (
                  <button type="button" onClick={async () => {
                    if (!staffEmail) return;
                    setIsLoggingIn(true);
                    try {
                      await sendPasswordResetEmail(auth, staffEmail);
                      setLoginError('ระบบได้ส่งลิงก์รีเซ็ต PIN ไปที่อีเมลหน่วยงานของท่านแล้วค่ะ');
                    } catch (err) {
                      setLoginError('ไม่สามารถส่งอีเมลรีเซ็ตได้ กรุณาลองใหม่');
                    } finally {
                      setIsLoggingIn(false);
                    }
                  }} disabled={isLoggingIn} className="text-xs font-bold text-rose-400 hover:text-rose-300 underline transition-colors animate-pulse z-10">
                    ลืมรหัส PIN ใช่หรือไม่?
                  </button>
                )}
                <button type="button" onClick={() => { setStaffStep(1); setStaffPhone(''); setStaffPin(''); setLoginError(''); setAttemptCount(0); setIsNewStaff(false); }} className="text-xs font-bold text-slate-400 hover:text-cyan-400 underline transition-colors ml-auto z-10">
                  ไม่ใช่คุณใช่ไหม?
                </button>
              </div>
            )}

            <div className={`grid grid-cols-3 gap-3 w-full px-1 transition-all duration-500 ${isLoggingIn ? 'opacity-0 scale-90 pointer-events-none absolute' : 'opacity-100 scale-100 relative'}`}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button key={num} type="button" onClick={() => handleStaffNumpad(num.toString())} className="h-16 flex items-center justify-center bg-slate-900/60 backdrop-blur-md border border-slate-600/50 rounded-2xl text-3xl font-black text-slate-200 transition-all duration-300 hover:bg-cyan-500/10 hover:border-cyan-400 hover:text-cyan-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.6),inset_0_0_10px_rgba(34,211,238,0.2)] active:scale-90 active:bg-cyan-500 active:text-white">
                  {num}
                </button>
              ))}
              <button type="button" onClick={handleStaffClear} className="h-16 flex items-center justify-center bg-slate-900/60 backdrop-blur-md border border-slate-600/50 rounded-2xl text-3xl font-black text-amber-500 transition-all duration-300 hover:bg-amber-500/10 hover:border-amber-400 hover:text-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.6),inset_0_0_10px_rgba(245,158,11,0.2)] active:scale-90 active:bg-amber-500 active:text-white">
                C
              </button>
              <button type="button" onClick={() => handleStaffNumpad('0')} className="h-16 flex items-center justify-center bg-slate-900/60 backdrop-blur-md border border-slate-600/50 rounded-2xl text-3xl font-black text-slate-200 transition-all duration-300 hover:bg-cyan-500/10 hover:border-cyan-400 hover:text-cyan-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.6),inset_0_0_10px_rgba(34,211,238,0.2)] active:scale-90 active:bg-cyan-500 active:text-white">
                0
              </button>
              <button type="button" onClick={handleStaffDelete} className="h-16 flex items-center justify-center bg-slate-900/60 backdrop-blur-md border border-slate-600/50 rounded-2xl transition-all duration-300 hover:bg-rose-500/10 hover:border-rose-500 hover:text-rose-400 hover:shadow-[0_0_20px_rgba(225,29,72,0.6),inset_0_0_10px_rgba(225,29,72,0.2)] active:scale-90 active:bg-rose-600 active:text-white text-rose-500">
                <X size={32} className="drop-shadow-md stroke-[3px]" />
              </button>
            </div>

            {isLoggingIn && (
              <div className="w-full h-[256px] flex flex-col items-center justify-center animate-in zoom-in duration-300">
                <div className="relative w-20 h-20 mb-5">
                  <div className="absolute inset-0 border-[4px] border-cyan-500/20 rounded-full"></div>
                  <div className="absolute inset-0 border-[4px] border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                  <ShieldCheck className="absolute inset-0 m-auto text-cyan-400 animate-pulse w-8 h-8" />
                </div>
                <span className="text-cyan-400 font-black tracking-widest text-[18px] drop-shadow-[0_0_10px_rgba(34,211,238,0.8)] animate-pulse">
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