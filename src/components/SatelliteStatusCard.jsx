import React from 'react';
import { Globe, Activity, Zap, AlertTriangle, ArrowUpRight, Radio, Home, LogOut } from 'lucide-react';

// 🌟 ฟันธง: รับกุญแจประตู setActiveTab และ onGoHome มาจาก MainApp
export default function SatelliteStatusCard({ setActiveTab, onGoHome }) {
  const mxaSyntaxData = {
    id: 'MXA_N9020A',
    power: '-99.99', 
    frequency: '8.2500', 
    status: 'SEARCHING' 
  };

  const exaSyntaxData = {
    id: 'EXA_N9010A',
    power: '-99.99', 
    frequency: '8.2500', 
    status: 'SEARCHING' 
  };

  // 🌟 ฟันธง: ใช้กุญแจเปิดประตู วาร์ปไปหน้าหลักแบบเนียนๆ ไม่รีโหลดเว็บให้เสียจังหวะ!
  const handleGoHub = () => {
    if (setActiveTab) setActiveTab('hub'); 
  };

  // 🌟 ฟันธง: ใช้ระบบออกจากระบบของ MainApp วาร์ปไปหน้าน้องมาสคอต!
  const handleLogout = () => {
    if (onGoHome) onGoHome(); 
  };

  return (
    <div className="p-4 md:p-8 flex flex-col items-center min-h-[85vh] relative w-full pb-32">
      {/* Background Glow ธีมอวกาศ สีม่วง/ชมพู */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] md:w-[800px] md:h-[600px] bg-fuchsia-600/10 blur-[100px] md:blur-[120px] rounded-full pointer-events-none z-0"></div>

      <div className="w-full max-w-md md:max-w-4xl relative z-10 animate-in fade-in slide-in-from-bottom-5 duration-500 mt-6">
        
        {/* Header Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border-2 border-fuchsia-500/50 rounded-[2rem] p-6 mb-6 shadow-[0_0_30px_rgba(217,70,239,0.2)] text-center relative overflow-hidden">
          <div className="absolute -top-10 -right-10 text-fuchsia-500/10 rotate-12 pointer-events-none"><Globe size={180} /></div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-widest flex items-center justify-center gap-3">
            <Radio className="text-fuchsia-400 animate-pulse" size={32} />
            SATELLITE SIGNAL <span className="text-fuchsia-400">MONITOR</span>
          </h2>
          <p className="text-slate-400 mt-2 font-bold text-sm tracking-widest uppercase">GISTDA Ground Station Command Center</p>
        </div>

        {/* 2 กรอบซ้าย-ขวา */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-8">
          
          {/* Card 1: THEOS-2 (MXA) - Data-1 */}
          <div className="bg-slate-900/80 backdrop-blur-xl border-2 border-cyan-500/30 rounded-[2rem] p-6 relative overflow-hidden hover:border-cyan-400/80 transition-colors shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">THEOS-2 <span className="text-xs bg-cyan-900/60 text-cyan-300 px-2 py-1 rounded-md border border-cyan-500/50">DATA-1</span></h3>
                <p className="text-slate-500 text-xs mt-1">Source: Agilent MXA N9020A</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-black tracking-widest border-2 flex items-center gap-1.5 animate-pulse ${mxaSyntaxData.status === 'LOCKED' ? 'bg-emerald-900/50 text-emerald-400 border-emerald-500' : 'bg-orange-900/50 text-orange-400 border-orange-500'}`}>
                {mxaSyntaxData.status === 'LOCKED' ? <Activity size={14}/> : <AlertTriangle size={14}/>}
                {mxaSyntaxData.status || 'WAITING'}
              </div>
            </div>

            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 flex items-center justify-between mb-4">
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Center Frequency</p>
                <div className="text-3xl font-black text-cyan-400 font-mono tracking-wider">
                  {mxaSyntaxData.frequency || '8.2500'} <span className="text-sm text-cyan-600">GHz</span>
                </div>
              </div>
              <Activity className="text-cyan-500/20" size={48} />
            </div>

            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Signal Power (Marker 1)</p>
                <div className="text-4xl font-black text-white font-mono tracking-wider flex items-end gap-2">
                  {mxaSyntaxData.power || '-99.99'} 
                  <span className="text-base text-slate-500 mb-1">dBm</span>
                </div>
              </div>
              <ArrowUpRight className={mxaSyntaxData.status === 'LOCKED' ? 'text-emerald-500' : 'text-orange-500'} size={32} />
            </div>
          </div>

          {/* Card 2: THEOS-2 (EXA) - Data-2 */}
          <div className="bg-slate-900/80 backdrop-blur-xl border-2 border-indigo-500/30 rounded-[2rem] p-6 relative overflow-hidden hover:border-indigo-400/80 transition-colors shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">THEOS-2 <span className="text-xs bg-indigo-900/60 text-indigo-300 px-2 py-1 rounded-md border border-indigo-500/50">DATA-2</span></h3>
                <p className="text-slate-500 text-xs mt-1">Source: Keysight EXA N9010A</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-black tracking-widest border-2 flex items-center gap-1.5 animate-pulse ${exaSyntaxData.status === 'LOCKED' ? 'bg-emerald-900/50 text-emerald-400 border-emerald-500' : 'bg-orange-900/50 text-orange-400 border-orange-500'}`}>
                {exaSyntaxData.status === 'LOCKED' ? <Activity size={14}/> : <AlertTriangle size={14}/>}
                {exaSyntaxData.status || 'WAITING'}
              </div>
            </div>

            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 flex items-center justify-between mb-4">
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Center Frequency</p>
                <div className="text-3xl font-black text-indigo-400 font-mono tracking-wider">
                  {exaSyntaxData.frequency || '8.2500'} <span className="text-sm text-indigo-600">GHz</span>
                </div>
              </div>
              <Zap className="text-indigo-500/20" size={48} />
            </div>

            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Signal Power (Marker 1)</p>
                <div className="text-4xl font-black text-white font-mono tracking-wider flex items-end gap-2">
                  {exaSyntaxData.power || '-99.99'} 
                  <span className="text-base text-slate-500 mb-1">dBm</span>
                </div>
              </div>
              <ArrowUpRight className={exaSyntaxData.status === 'LOCKED' ? 'text-emerald-500' : 'text-orange-500'} size={32} />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}