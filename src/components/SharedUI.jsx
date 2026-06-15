import React, { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, Clock, AlertCircle, ChevronDown, Search, CheckCircle2, XCircle } from 'lucide-react';

// ==========================================
// 1. ฟอร์แมตวันที่ภาษาไทย
// ==========================================
export const ThaiDateFormatter = (date) => {
  const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  const d = new Date(date);
  const dayOfWeek = d.getDay();
  const dayColors = {
    0: 'text-rose-500', 1: 'text-yellow-500', 2: 'text-pink-500',
    3: 'text-emerald-500', 4: 'text-orange-500', 5: 'text-sky-500', 6: 'text-purple-500'
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 md:gap-6 text-[14px] sm:text-[16px] md:text-[20px] font-sans py-1 px-2">
      <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
        <Calendar className={`w-4 h-4 md:w-5 md:h-5 ${dayColors[dayOfWeek]}`} />
        <span className={`font-black tracking-widest ${dayColors[dayOfWeek]}`}>
          {d.getDate()} {months[d.getMonth()]} {d.getFullYear() + 543}
        </span>
      </div>
      <div className="hidden sm:block w-[2px] h-5 md:h-6 bg-slate-500/50 rounded-full shrink-0"></div>
      <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
        <Clock className="w-4 h-4 md:w-5 md:h-5 text-orange-500 animate-pulse" />
        <span className="font-mono font-black text-orange-500 tracking-wider">
          {d.toLocaleTimeString('th-TH', { hour12: false })} น.
        </span>
      </div>
    </div>
  );
};

// ==========================================
// 2. ระบบกันแอปพัง (Error Boundary)
// ==========================================
export class ErrorBoundary extends React.Component {
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
        <div className="p-10 bg-white text-emerald-700 min-h-screen flex flex-col justify-center items-center font-sans text-center border-t-[10px] border-rose-500 shadow-inner">
          <AlertCircle size={80} className="mb-6 animate-pulse text-rose-500" />
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">ระบบพบข้อผิดพลาด</h2>
          <p className="mt-2 text-slate-400 text-sm max-w-xs">{this.state.error?.message || 'กรุณารีเฟรชเพื่อลองใหม่อีกครั้ง'}</p>
          <button onClick={() => window.location.reload()} className="mt-8 px-10 py-4 bg-orange-500 text-white font-black rounded-2xl shadow-xl active:scale-95 transition-all">
            REBOOT SYSTEM
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ==========================================
// 3. Dropdown พื้นฐาน
// ==========================================
export function SearchableDropdown({ options, value, onChange, placeholder, label, error, id }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) setIsOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    return options.filter((opt) => String(opt).toLowerCase().includes(searchTerm.toLowerCase()));
  }, [options, searchTerm]);

  return (
    <div className="space-y-1.5 md:space-y-2 relative text-left" id={id} ref={containerRef}>
      <label className="text-[12px] md:text-[18px] font-bold text-slate-200 tracking-wide flex items-center gap-1.5 md:gap-2 ml-1">{label}</label>
      <div
        className={`w-full bg-white border-2 border-solid ${error ? 'border-rose-500 ring-1 ring-rose-500/50' : 'border-orange-500 hover:border-orange-600 focus-within:border-orange-600 focus-within:ring-2 focus-within:ring-orange-500/30'} rounded-2xl px-5 py-4 md:py-5 flex items-center justify-between cursor-pointer shadow-sm transition-all`}
        onClick={() => { setIsOpen(!isOpen); setSearchTerm(''); }}
      >
        <div className="flex-1 min-w-0">
          {isOpen ? (
            <input autoFocus className="w-full bg-transparent outline-none text-sm md:text-[16px] font-bold text-slate-800" placeholder="พิมพ์ค้นหา..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onClick={(e) => e.stopPropagation()} />
          ) : (
            <span className={`text-sm md:text-[16px] font-bold truncate ${value ? 'text-slate-800' : 'text-slate-400'}`}>{value || placeholder}</span>
          )}
        </div>
        <ChevronDown size={18} className={`text-slate-400 md:w-6 md:h-6 transition-transform ${isOpen ? 'rotate-180 text-orange-500' : ''}`} />
      </div>
      {isOpen && (
        <div className="absolute z-[100] top-[100%] left-0 w-full bg-white border border-2 border-orange-400/70 mt-2 rounded-2xl md:rounded-[1.5rem] shadow-2xl max-h-60 md:max-h-80 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt, i) => (
              <div key={i} className="px-5 py-3.5 md:py-4 hover:bg-orange-50 hover:text-orange-600 text-sm md:text-[16px] font-bold text-slate-700 cursor-pointer border-b border-slate-50 last:border-0 transition-colors" onClick={() => { onChange(opt); setIsOpen(false); }}>{opt}</div>
            ))
          ) : ( <div className="px-5 py-4 md:py-6 text-xs md:text-[14px] text-slate-400 font-bold italic text-center uppercase tracking-widest">ไม่พบข้อมูล</div> )}
        </div>
      )}
      {error && <div className="text-rose-500 text-[11px] md:text-[13px] font-bold mt-1.5 md:mt-2 ml-1 animate-in fade-in">⚠️ {error}</div>}
    </div>
  );
}

// ==========================================
// 4. Dropdown ไซไฟเรืองแสง (Sci-Fi Modal)
// ==========================================
export function SciFiSelectModal({ id, label, icon, value, options, onChange, error, placeholder, themeColor = 'orange' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const theme = {
    emerald: { text: 'text-emerald-400', border: 'border-emerald-500', glow: 'shadow-[0_0_40px_rgba(16,185,129,0.5)]', flare: 'bg-emerald-500/20', btnBg: 'bg-emerald-900/40', outBorder: 'border-emerald-500/60', outHover: 'hover:border-emerald-400', outGlow: 'shadow-[0_0_15px_rgba(16,185,129,0.3),inset_0_0_10px_rgba(16,185,129,0.1)]', outHoverGlow: 'hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]' },
    amber: { text: 'text-amber-400', border: 'border-amber-500', glow: 'shadow-[0_0_40px_rgba(245,158,11,0.5)]', flare: 'bg-amber-500/20', btnBg: 'bg-amber-900/40', outBorder: 'border-amber-500/60', outHover: 'hover:border-amber-400', outGlow: 'shadow-[0_0_15px_rgba(245,158,11,0.3),inset_0_0_10px_rgba(245,158,11,0.1)]', outHoverGlow: 'hover:shadow-[0_0_25px_rgba(245,158,11,0.5)]' },
    cyan: { text: 'text-cyan-400', border: 'border-cyan-500', glow: 'shadow-[0_0_40px_rgba(6,182,212,0.5)]', flare: 'bg-cyan-500/20', btnBg: 'bg-cyan-900/40', outBorder: 'border-cyan-500/60', outHover: 'hover:border-cyan-400', outGlow: 'shadow-[0_0_15px_rgba(6,182,212,0.3),inset_0_0_10px_rgba(6,182,212,0.1)]', outHoverGlow: 'hover:shadow-[0_0_25px_rgba(6,182,212,0.5)]' },
    orange: { text: 'text-orange-400', border: 'border-orange-500', glow: 'shadow-[0_0_40px_rgba(249,115,22,0.5)]', flare: 'bg-orange-500/20', btnBg: 'bg-orange-900/40', outBorder: 'border-orange-500/60', outHover: 'hover:border-orange-400', outGlow: 'shadow-[0_0_15px_rgba(249,115,22,0.3),inset_0_0_10px_rgba(249,115,22,0.1)]', outHoverGlow: 'hover:shadow-[0_0_25px_rgba(249,115,22,0.5)]' },
  }[themeColor];

  const filteredOptions = options.filter(opt => String(opt).toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-1.5 md:space-y-2 relative text-left" id={id}>
      <label className="text-[14px] md:text-[18px] font-black tracking-wide ml-1 flex items-center gap-1.5 md:gap-2 text-slate-200">{label}</label>
      <div onClick={() => { setIsOpen(true); setSearchTerm(''); }} className={`w-full bg-slate-900 rounded-2xl border-[2px] ${error ? 'border-rose-500 ring-1 ring-rose-500/50 shadow-none' : `${theme.outBorder} ${theme.outHover} ${theme.outGlow} ${theme.outHoverGlow}`} px-5 py-4 md:py-5 flex items-center justify-between cursor-pointer transition-all duration-300`}>
        <div className="flex items-center gap-3">
          {icon} <span className={`text-[15px] md:text-[18px] font-bold truncate ${value ? 'text-slate-100' : 'text-slate-500'}`}>{value || placeholder}</span>
        </div>
        <ChevronDown size={18} className={`md:w-6 md:h-6 ${theme.text} animate-pulse`} />
      </div>
      {error && <div className="text-rose-500 text-[11px] md:text-[13px] font-bold mt-1.5 md:mt-2 ml-1 animate-in fade-in">⚠️ {error}</div>}
      
      {isOpen && typeof document !== 'undefined' ? createPortal(
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200" onClick={() => setIsOpen(false)}>
          <div className={`relative m-auto bg-slate-900 border-[3px] border-solid rounded-[2rem] w-[95%] sm:w-[85%] md:w-full max-w-sm md:max-w-md h-auto max-h-[75vh] md:max-h-[70vh] p-5 md:p-6 flex flex-col ${theme.border} ${theme.glow} shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]`} onClick={(e) => e.stopPropagation()}>
            <div className={`absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 ${theme.flare} blur-[40px] pointer-events-none rounded-full`}></div>
            <div className="flex justify-between items-center mb-4 md:mb-5 pb-3 md:pb-4 shrink-0 border-b border-slate-700/60 relative z-10">
              <h3 className={`text-[18px] md:text-[22px] font-black flex items-center gap-2 ${theme.text} drop-shadow-md`}>{icon} <span className="mt-0.5">{placeholder}</span></h3>
              <button onClick={() => setIsOpen(false)} className="text-rose-500 hover:text-white animate-pulse bg-slate-950 hover:bg-rose-600 p-1.5 md:p-2 rounded-full transition-all duration-300 border-[2px] border-rose-500 shadow-[0_0_20px_rgba(225,29,72,0.8)] cursor-pointer"><XCircle className="w-6 h-6 md:w-7 md:h-7 stroke-[3px]" /></button>
            </div>
            <div className="mb-4 relative shrink-0 z-10">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 md:w-6 md:h-6" />
              <input type="text" placeholder="พิมพ์ค้นหา..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-slate-950 border-[2px] border-slate-700 rounded-xl py-3 md:py-4 pl-10 pr-4 text-white outline-none focus:border-slate-500 transition-colors font-bold text-[15px] md:text-[18px]" />
            </div>
            <div className="overflow-y-auto pr-2 space-y-2.5 md:space-y-3 pb-2 flex-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pt-1 relative z-10">
              {filteredOptions.length > 0 ? filteredOptions.map((opt, idx) => {
                const isSelected = value === opt;
                return (
                  <button key={idx} onClick={() => { onChange(opt); setIsOpen(false); }} className={`w-full text-left px-4 py-4 md:py-5 rounded-xl font-black border-[2px] transition-all duration-300 flex justify-between items-center active:scale-95 ${isSelected ? `${theme.btnBg} ${theme.text} ${theme.border} shadow-[0_0_20px_rgba(0,0,0,0.5),inset_0_0_15px_rgba(255,255,255,0.05)]` : `bg-slate-900/80 text-slate-300 border-slate-700/60 shadow-[0_0_10px_rgba(0,0,0,0.2)] hover:${theme.border} hover:${theme.text} hover:shadow-[0_0_15px_rgba(0,0,0,0.4)]`}`}>
                    <span className="text-[15px] md:text-[18px]">{opt}</span>
                    {isSelected && <CheckCircle2 className={`w-6 h-6 md:w-7 md:h-7 ${theme.text} drop-shadow-md`} />}
                  </button>
                );
              }) : ( <div className="text-center py-6 text-slate-500 font-bold text-[15px] md:text-[18px]">ไม่พบข้อมูล</div> )}
            </div>
          </div>
        </div>,
        document.body
      ) : null}
    </div>
  );
}

// ==========================================
// 5. ฝังฟอนต์ Sarabun สวยๆ
// ==========================================
export const SarabunFontEmbed = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@200;300;400;500;600;700;800&display=swap');
    body, html, *, h1, h2, h3, p, button, input { font-family: 'Sarabun', sans-serif !important; letter-spacing: 0.02em !important; line-height: 1.5 !important; }
    .font-black { font-weight: 700 !important; } .font-bold { font-weight: 600 !important; } .font-normal { font-weight: 400 !important; }
    .font-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important; letter-spacing: 0.02em !important; font-weight: 600 !important; }
  `}</style>
);