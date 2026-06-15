import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import LandingPage from './components/LandingPage';
import MainApp from './components/MainApp';

// 1. 🛡️ ระบบกันแอปพัง (ป้องกันจอขาว 1,000,000%)
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-10 bg-slate-950 text-white min-h-screen flex flex-col justify-center items-center font-sans text-center border-t-[10px] border-rose-500">
          <AlertCircle size={80} className="mb-6 animate-pulse text-rose-500" />
          <h2 className="text-2xl font-black uppercase tracking-tighter">ระบบพบข้อผิดพลาดรุนแรง</h2>
          <p className="mt-2 text-slate-400 text-sm max-w-xs">{this.state.error?.message || 'กรุณารีเฟรชหน้าจอใหม่อีกครั้ง'}</p>
          <button onClick={() => window.location.reload()} className="mt-8 px-10 py-4 bg-orange-500 text-white font-black rounded-2xl shadow-xl active:scale-95 transition-all">
            REBOOT SYSTEM
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// 2. 🔤 ฟอนต์ Sarabun
const SarabunFontEmbed = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@200;300;400;500;600;700;800&display=swap');
    body, html, *, h1, h2, h3, p, button, input { font-family: 'Sarabun', sans-serif !important; letter-spacing: 0.02em !important; line-height: 1.5 !important; }
    .font-black { font-weight: 700 !important; } .font-bold { font-weight: 600 !important; } .font-normal { font-weight: 400 !important; }
    .font-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important; letter-spacing: 0.02em !important; font-weight: 600 !important; }
  `}</style>
);

// 3. 🚀 ตัวคุมประตูหลัก (App)
export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hasStarted, setHasStarted] = useState(() => sessionStorage.getItem('hasStarted') === 'true');
  const [role, setRole] = useState(() => sessionStorage.getItem('role') || 'reporter');

  useEffect(() => {
    if (sessionStorage.getItem('hasStarted') === 'true') {
      setShowSplash(false);
    }
  }, []);

  useEffect(() => {
    if (!showSplash || sessionStorage.getItem('hasStarted') === 'true') return;
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) { clearInterval(timer); return 100; }
        const diff = Math.floor(Math.random() * 8) + 4; 
        return Math.min(oldProgress + diff, 100);
      });
    }, 100);
    return () => clearInterval(timer);
  }, [showSplash]);

  useEffect(() => {
    if (progress === 100) {
      const fadeTimer = setTimeout(() => setFadeOut(true), 400);
      const closeTimer = setTimeout(() => setShowSplash(false), 900);
      return () => { clearTimeout(fadeTimer); clearTimeout(closeTimer); };
    }
  }, [progress]);

  const handleStart = (selectedRole) => {
    setRole(selectedRole);
    setHasStarted(true);
    sessionStorage.setItem('role', selectedRole);
    sessionStorage.setItem('hasStarted', 'true');
  };

  const handleGoHome = async () => {
    setHasStarted(false);
    sessionStorage.removeItem('hasStarted');
    sessionStorage.removeItem('activeTab');
    sessionStorage.removeItem('role'); 
  };

  if (showSplash) {
    let barColor = "from-red-600 to-red-400 shadow-[0_0_10px_rgba(239,68,68,0.7)]"; 
    if (progress >= 30 && progress < 50) barColor = "from-orange-600 to-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.7)]"; 
    else if (progress >= 50 && progress < 70) barColor = "from-yellow-500 to-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.7)]"; 
    else if (progress >= 70 && progress < 100) barColor = "from-emerald-500 to-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.7)]"; 
    else if (progress === 100) barColor = "from-green-600 to-green-500 shadow-[0_0_15px_rgba(22,163,74,1)]"; 

    return (
      <div className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center transition-opacity duration-700 ease-in-out ${fadeOut ? 'opacity-0' : 'opacity-100'} overflow-hidden bg-[#0c0a09]`}>
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/40 via-[#0c0a09] to-black z-0"></div>
        <div className="absolute inset-0 z-0 opacity-20 bg-[linear-gradient(rgba(249,115,22,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(249,115,22,0.2)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        <div className="relative z-10 flex flex-col items-center justify-center gap-12 w-full">
          <div className="relative flex flex-col items-center justify-center">
             <div className="absolute w-[250px] h-[250px] md:w-[500px] md:h-[500px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-500/30 via-orange-900/10 to-transparent blur-[80px] z-0 animate-pulse"></div>
             <img src="/GSE-logo.webp" alt="GSE Splash Logo" className="relative z-10 w-56 sm:w-64 md:w-80 h-auto drop-shadow-[0_0_20px_rgba(249,115,22,0.5)]" />
          </div>
          <div className="w-full max-w-[320px] md:max-w-[420px] px-6 flex flex-col items-center gap-4 z-10">
             <span className="text-white font-black tracking-[0.4em] text-[15px] md:text-[18px] uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] animate-pulse">LOADING...</span>
             <div className="w-full h-9 md:h-11 bg-slate-950 rounded-xl md:rounded-[1rem] border-2 border-solid border-cyan-400 p-1 flex gap-1 md:gap-1.5 items-center relative shadow-[0_0_30px_rgba(34,211,238,0.9)]">
               {Array.from({ length: 10 }).map((_, index) => {
                 const blockThreshold = (index + 1) * 10;
                 const isActive = progress >= blockThreshold;
                 return <div key={index} className={`h-full flex-1 rounded-[2px] md:rounded-[4px] transition-all duration-150 bg-gradient-to-b ${isActive ? barColor : "from-slate-900 to-slate-950 opacity-20 border border-slate-800"}`} />
               })}
             </div>
             <span className="text-white font-black text-[26px] md:text-[32px] drop-shadow-[0_2px_6px_rgba(0,0,0,1)] tracking-wide">{progress}%</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <SarabunFontEmbed />
      {hasStarted ? (
        <MainApp onGoHome={handleGoHome} initialRole={role} />
      ) : (
        <LandingPage onStart={handleStart} />
      )}
    </ErrorBoundary>
  );
}