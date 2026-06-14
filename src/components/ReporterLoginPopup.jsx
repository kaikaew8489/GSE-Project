import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Phone, EyeOff, Eye, X, ShieldCheck } from 'lucide-react';
import { query, collection, where, getDocs, updateDoc, doc, addDoc } from 'firebase/firestore';
import { sendPasswordResetEmail } from 'firebase/auth';
import { db, auth } from '../lib/firebaseConfig';

export default function ReporterLoginPopup({ onClose, onLoginSuccess }) {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isConfirmingPin, setIsConfirmingPin] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  
  const [showPhoneConfirm, setShowPhoneConfirm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [showPin, setShowPin] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);

  useEffect(() => {
    const savedPhone = localStorage.getItem('gse_remembered_phone');
    if (savedPhone) {
      setPhone(savedPhone);
      setStep(2); 
      setIsNewUser(false); 
    }
  }, []);

  const handlePhoneNextClick = async () => {
    setIsLoading(true);
    setLoginError('');
    try {
      const cleanPhone = phone.replace(/-/g, '');
      const q = query(collection(db, 'users'), where('phone', '==', cleanPhone));
      const snap = await getDocs(q);

      if (!snap.empty) {
        const userData = snap.docs[0].data();
        localStorage.setItem('gse_remembered_name', userData.fullName || userData.name || '');
        localStorage.setItem('gse_remembered_phone', cleanPhone);
        setEmail(userData.email || ''); 
        setIsNewUser(false);
        setStep(2);
      } else {
        setIsNewUser(true);
        setShowPhoneConfirm(true);
      }
    } catch (error) {
      setLoginError('เกิดข้อผิดพลาดในการตรวจสอบฐานข้อมูล');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isLoading) return;
    if (step === 1 && phone.length === 10 && !showPhoneConfirm) {
      handlePhoneNextClick();
    }
    else if (step === 2) {
      if (isNewUser && isConfirmingPin && confirmPin.length === 6) {
        if (pin === confirmPin) {
          setStep(3); 
        } else {
          setLoginError('รหัส PIN ไม่ตรงกัน กรุณาตั้งใหม่');
          setPin(''); setConfirmPin(''); setIsConfirmingPin(false);
        }
      } else if (!isNewUser && pin.length === 6) {
        submitLogin(phone, pin);
      }
    }
  }, [phone, pin, confirmPin, step, isLoading, isConfirmingPin, isNewUser, showPhoneConfirm]);

  const submitLogin = async (loginPhone, loginPin) => {
    setIsLoading(true);
    setLoginError('');
    try {
      const cleanPhone = loginPhone.replace(/-/g, '');
      const q = query(collection(db, 'users'), where('phone', '==', cleanPhone));
      const snap = await getDocs(q);

      if (!snap.empty) {
        const userData = snap.docs[0].data();
        const docId = snap.docs[0].id;
        
        if (!userData.pin) {
          await updateDoc(doc(db, 'users', docId), { pin: loginPin }); 
          localStorage.setItem('gse_remembered_phone', cleanPhone);
          localStorage.setItem('gse_remembered_name', userData.fullName || userData.name || '');
          setAttemptCount(0);
          onLoginSuccess('reporter');
        } else if (userData.pin === loginPin) {
          localStorage.setItem('gse_remembered_phone', cleanPhone);
          localStorage.setItem('gse_remembered_name', userData.fullName || userData.name || '');
          setAttemptCount(0);
          onLoginSuccess('reporter');
        } else {
          const newCount = attemptCount + 1;
          setAttemptCount(newCount);
          if (newCount >= 5) {
            setLoginError('❌ บัญชีถูกระงับชั่วคราว 3 นาทีเนื่องจากกรอกรหัสผิดครบ 5 ครั้ง');
            localStorage.setItem('gse_user_lock_until', Date.now() + 3 * 60 * 1000); 
            setPin('');
          } else {
            setLoginError(`รหัส PIN ไม่ถูกต้อง (ครั้งที่ ${newCount}/5)`);
            setPin('');
          }
        }
      } else {
        setLoginError('ไม่พบข้อมูลผู้ใช้งาน');
      }
    } catch (error) {
      setLoginError('ตรวจสอบ PIN ไม่สำเร็จ');
    }
    setIsLoading(false);
  };

  const handleFinalSubmit = async () => {
    if (!name || !email) {
      setLoginError('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }
    setIsLoading(true);
    try {
      const cleanPhone = phone.replace(/-/g, '');
      await addDoc(collection(db, 'users'), {
        phone: cleanPhone,
        email: email,
        fullName: name,
        pin: pin,
        role: 'reporter',
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('gse_remembered_phone', cleanPhone);
      localStorage.setItem('gse_remembered_name', name);
      setAttemptCount(0);
      onLoginSuccess('reporter'); 
    } catch (error) {
      setLoginError('บันทึกข้อมูลไม่สำเร็จ');
    }
    setIsLoading(false);
  };

  const handleNumpad = (num) => {
    const userLock = localStorage.getItem('gse_user_lock_until');
    if (userLock && Date.now() < Number(userLock)) {
      const remainMin = Math.ceil((Number(userLock) - Date.now()) / 1000 / 60);
      setLoginError(`❌ ระบบยังล็อกอยู่ กรุณารออีกประมาณ ${remainMin} นาที หรือกดลืมรหัส PIN`);
      return;
    }

    setLoginError('');
    if (step === 1 && phone.length < 10) setPhone(prev => prev + num);
    else if (step === 2) {
      if (isNewUser) {
         if (!isConfirmingPin && pin.length < 6) {
            const newPin = pin + num;
            setPin(newPin);
            if (newPin.length === 6) setIsConfirmingPin(true); 
         } 
         else if (isConfirmingPin && confirmPin.length < 6) {
            const newConfirm = confirmPin + num;
            setConfirmPin(newConfirm);
         }
      } else {
         if (pin.length < 6) {
            const newPin = pin + num;
            setPin(newPin);
         }
      }
    }
  };

  const handleDelete = () => {
    if (step === 1) setPhone(prev => prev.slice(0, -1));
    else if (step === 2) {
      if (isConfirmingPin) setConfirmPin(prev => prev.slice(0, -1));
      else setPin(prev => prev.slice(0, -1));
    }
  };

  const handleClear = () => {
    if (step === 1) setPhone('');
    else if (step === 2) {
      if (isConfirmingPin) setConfirmPin('');
      else setPin('');
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || isLoading || showPhoneConfirm) return;
      if (/^[0-9]$/.test(e.key)) handleNumpad(e.key);
      else if (e.key === 'Backspace') handleDelete();
      else if (e.key.toLowerCase() === 'c' || e.key === 'Escape') handleClear();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phone, pin, confirmPin, step, isLoading, isConfirmingPin, isNewUser, showPhoneConfirm]);

  const formatPhone = (p) => {
    if (!p) return '___-___-____';
    const str = p.padEnd(10, '_');
    return `${str.slice(0, 3)}-${str.slice(3, 6)}-${str.slice(6)}`;
  };

  const formatPinDisplay = (p) => {
    const padded = p.padEnd(6, '-');
    if (showPin) return padded.split('').join(' ');
    return padded.split('').map(c => c === '-' ? '-' : '•').join(' ');
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[300] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="absolute w-[300px] h-[300px] bg-orange-500/30 rounded-full blur-[100px] animate-pulse pointer-events-none z-0"></div>
      
      <div className="relative z-10 w-full max-w-sm bg-slate-900 border-[3px] border-solid border-cyan-500/50 rounded-[2.5rem] p-6 shadow-[0_0_50px_rgba(249,115,22,0.3)] flex flex-col items-center gap-4 transform transition-all" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-5 right-5 text-slate-400 hover:text-rose-400 transition-colors z-20">
          <X size={28} />
        </button>

        {showPhoneConfirm && (
          <div className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 animate-in zoom-in-95 duration-200 rounded-[2.5rem]">
            <div className="bg-slate-900 border-[2px] border-orange-500 rounded-2xl p-6 shadow-[0_0_30px_rgba(249,115,22,0.5)] text-center w-full">
              <h3 className="text-xl font-black text-white mb-2">ตรวจสอบหมายเลข</h3>
              <p className="text-slate-300 text-sm mb-4">นี่คือหมายเลขโทรศัพท์ของท่านใช่หรือไม่?</p>
              <div className="text-3xl font-black text-orange-400 tracking-widest mb-6 py-3 bg-slate-950 rounded-xl border border-orange-500/30">
                {formatPhone(phone)}
              </div>
              <div className="flex gap-3">
              <button onClick={() => { setShowPhoneConfirm(false); setPhone(prev => prev.slice(0, -1)); }} className="flex-1 py-3 bg-slate-800 text-slate-300 font-bold rounded-xl hover:bg-slate-700 transition-colors">แก้ไขเบอร์</button>
                <button onClick={() => { setShowPhoneConfirm(false); setStep(2); setIsNewUser(true); }} className="flex-1 py-3 bg-orange-600 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(249,115,22,0.5)] hover:bg-orange-500 transition-colors">ยืนยันตามนี้</button>
              </div>
            </div>
          </div>
        )}

        {step < 3 && (
          <>
            <div className="relative mt-2">
              <div className="absolute inset-0 bg-orange-500 blur-[20px] opacity-40 rounded-full"></div>
              <div className="relative w-16 h-16 bg-slate-950 border-[2px] border-orange-400 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.6)]">
                <Phone className="w-8 h-8 text-orange-400 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
              </div>
            </div>
            
            <h2 className="text-xl font-black text-white tracking-wide text-center">
              {step === 1 ? 'เบอร์โทรศัพท์ผู้แจ้ง' : (isNewUser ? (isConfirmingPin ? '✅ ยืนยันรหัส PIN อีกครั้ง' : '✨ ตั้งรหัส PIN 6 หลัก') : '🔒 ใส่รหัส PIN เข้าสู่ระบบ')}
            </h2>

            {loginError && <p className="text-sm font-bold text-center p-2 rounded-lg w-full border animate-in shake bg-rose-500/10 text-rose-400 border-rose-500/30">{loginError}</p>}

            <div className="relative w-full mb-2">
              <div className="w-full bg-slate-950 border-[2px] border-slate-700 rounded-2xl h-16 flex items-center justify-center text-3xl font-black text-white tracking-[0.1em] shadow-inner transition-all">
                {step === 1 ? formatPhone(phone) : formatPinDisplay(isConfirmingPin ? confirmPin : pin)}
              </div>
              {step === 2 && (
                <button type="button" onClick={() => setShowPin(!showPin)} className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-600 hover:text-orange-400 transition-colors drop-shadow-md z-20">
                  {showPin ? <EyeOff size={24} /> : <Eye size={24} />}
                </button>
              )}
            </div>

            {step === 2 && (
              <div className="w-full flex justify-between items-center px-1 -mt-1 mb-1">
                {attemptCount >= 3 && (
                  <button type="button" onClick={async () => {
                    if (!email) {
                      setLoginError('ไม่พบอีเมลในระบบ กรุณาสมัครใหม่ค่ะ');
                      return;
                    }
                    setIsLoading(true);
                    try {
                      await sendPasswordResetEmail(auth, email);
                      setLoginError('ระบบได้ส่งลิงก์รีเซ็ต PIN ไปที่อีเมลของท่านแล้วค่ะ');
                    } catch (err) {
                      setLoginError('ไม่สามารถส่งอีเมลรีเซ็ตได้ กรุณาลองใหม่');
                    } finally {
                      setIsLoading(false);
                    }
                  }} disabled={isLoading} className="text-xs font-bold text-rose-400 hover:text-rose-300 underline transition-colors animate-pulse z-10">
                    ลืมรหัส PIN ใช่หรือไม่?
                  </button>
                )}
                <button type="button" onClick={() => { setStep(1); setPhone(''); setPin(''); setConfirmPin(''); setIsConfirmingPin(false); setLoginError(''); setAttemptCount(0); }} className="text-xs font-bold text-slate-400 hover:text-cyan-400 underline transition-colors ml-auto z-10">
                  ไม่ใช่คุณใช่ไหม?
                </button>
              </div>
            )}
            
            <div className={`grid grid-cols-3 gap-3 w-full px-1 ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button key={num} onClick={() => handleNumpad(num.toString())} className="h-14 md:h-16 flex items-center justify-center bg-slate-900/60 border border-slate-600/50 rounded-2xl text-2xl md:text-3xl font-black text-slate-200 hover:bg-orange-500/20 hover:border-orange-400 transition-all active:scale-95">{num}</button>
              ))}
              <button onClick={handleClear} className="h-14 md:h-16 flex items-center justify-center bg-slate-900/60 border border-slate-600/50 rounded-2xl text-2xl md:text-3xl font-black text-amber-500 hover:bg-amber-500/20 hover:border-amber-400 transition-all active:scale-95">C</button>
              <button onClick={() => handleNumpad('0')} className="h-14 md:h-16 flex items-center justify-center bg-slate-900/60 border border-slate-600/50 rounded-2xl text-2xl md:text-3xl font-black text-slate-200 hover:bg-orange-500/20 hover:border-orange-400 transition-all active:scale-95">0</button>
              <button onClick={handleDelete} className="h-14 md:h-16 flex items-center justify-center bg-slate-900/60 border border-slate-600/50 rounded-2xl text-rose-500 hover:bg-rose-500/20 hover:border-rose-500 transition-all active:scale-95">
                <X size={32} className="drop-shadow-md stroke-[3px]" />
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <div className="w-full flex flex-col items-center animate-in slide-in-from-right duration-300 mt-4">
            <h2 className="text-xl font-black text-white tracking-wide text-center mb-4 flex items-center gap-2">
              📝 ข้อมูลผู้แจ้งซ่อม
            </h2>
            <div className="w-full bg-slate-800/80 border border-amber-500/30 rounded-lg p-3 mb-6 text-center shadow-inner">
              <p className="text-amber-400 font-bold text-sm">ยินดีต้อนรับ! กรุณากรอกชื่อและอีเมลเพื่อลงทะเบียน</p>
            </div>

            <div className="w-full space-y-5">
               <div>
                 <label className="text-slate-300 text-sm font-bold mb-2 block text-left">ชื่อ - นามสกุล</label>
                 <input type="text" value={name} onChange={e=>setName(e.target.value)} className="w-full bg-slate-950 border-[2px] border-slate-700 rounded-lg p-3 text-white font-bold focus:border-orange-500 outline-none transition-colors" placeholder="ระบุชื่อของท่าน..." />
               </div>
               <div>
                 <label className="text-slate-300 text-sm font-bold mb-2 block text-left">อีเมลหน่วยงาน</label>
                 <input type="email" placeholder="username@gistda.or.th" value={email} onChange={e=>setEmail(e.target.value)} className="w-full bg-slate-950 border-[2px] border-slate-700 rounded-lg p-3 text-white font-bold focus:border-orange-500 outline-none transition-colors" />
               </div>
            </div>

            <div className="w-full flex gap-3 mt-8">
              <button onClick={() => { setStep(2); setConfirmPin(''); setIsConfirmingPin(false); }} className="flex-1 bg-slate-800 text-white font-bold py-3 md:py-4 rounded-xl border border-slate-600 hover:bg-slate-700 transition-colors">ย้อนกลับ</button>
               <button onClick={handleFinalSubmit} className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-3 md:py-4 rounded-xl shadow-[0_0_15px_rgba(249,115,22,0.5)] hover:scale-[1.02] transition-transform">เสร็จสิ้นการสมัคร</button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}