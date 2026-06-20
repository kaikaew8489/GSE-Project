import React, { useState, useEffect } from 'react';
import { Activity, BatteryCharging, Zap, ArrowUpRight, Home, LogOut, Server } from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebaseConfig';

export default function UPSStatusCard({ setActiveTab, onGoHome }) {
  const handleGoHub = () => { if (setActiveTab) setActiveTab('hub'); };
  const handleLogout = () => { if (onGoHome) onGoHome(); };
  
  const defaultData = {
    batteryCapacity: 0, runtimeRemaining: 0, upsLoad: 0, batteryTemp: 0, upsStatus: 2, lastUpdated: "",
    upsMode: "รอการเชื่อมต่อ...", systemMode: "-",
    outVolL1L2: 0, outVolL2L3: 0, outVolL3L1: 0,
    outCurL1: 0, outCurL2: 0, outCurL3: 0,
    outFreq: 0,
    totalPowerKW: 0, totalPowerKVA: 0,
    outPowerL1_KW: 0, outPowerL1_KVA: 0,
    outPowerL2_KW: 0, outPowerL2_KVA: 0,
    outPowerL3_KW: 0, outPowerL3_KVA: 0
  };

  const [upsData1, setUpsData1] = useState(defaultData);
  const [upsData2, setUpsData2] = useState(defaultData);

  useEffect(() => {
    const unsub1 = onSnapshot(doc(db, "ups_monitoring", "station_1"), (docSnap) => {
      if (docSnap.exists()) setUpsData1(prev => ({ ...prev, ...docSnap.data() }));
    });
    const unsub2 = onSnapshot(doc(db, "ups_monitoring", "station_2"), (docSnap) => {
      if (docSnap.exists()) setUpsData2(prev => ({ ...prev, ...docSnap.data() }));
    });
    
    return () => { unsub1(); unsub2(); };
  }, []);

  const formatThaiDate = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    const days = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
    const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    return `วัน${days[d.getDay()]}ที่ ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear() + 543}`;
  };

  const getDayColorClass = (dateString) => {
    if (!dateString) return 'text-cyan-100';
    const day = new Date(dateString).getDay();
    const colors = ['text-red-500', 'text-yellow-400', 'text-pink-400', 'text-green-500', 'text-orange-500', 'text-sky-400', 'text-purple-400'];
    return colors[day];
  };

  return (
    // 🌟 ฟันธง: บีบกล่องเนื้อหาตรงกลางให้เล็กลงนิดนึงด้วย w-[96%] md:w-[94%] mx-auto เพื่อให้มีเลเยอร์ลึกกว่าปุ่มล่าง
    <div className="w-[96%] md:w-[94%] max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 pb-32 mt-4 relative z-10">
      
      {/* 🚀 ==================== เครื่องที่ 1 (Galaxy VS 120kW) ==================== 🚀 */}
      <div className="w-full bg-slate-950/60 backdrop-blur-2xl border-[3px] border-solid border-cyan-400/80 rounded-[1rem] p-4 md:p-6 shadow-[0_0_70px_rgba(6,182,212,0.25)] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] md:w-[750px] md:h-[750px] bg-cyan-500/20 blur-[0px] rounded-[1.5rem] pointer-events-none z-0"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 pb-5 border-b border-cyan-500/30 gap-4 relative z-20">
          <div className="flex items-center justify-between w-full md:w-auto gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-900 border-[2px] border-cyan-500 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.4)]">
                <Activity size={24} className="text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-black text-white tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">Galaxy VS 120kW</h3>
                <p className="text-cyan-400 text-[11px] font-bold tracking-widest mt-0.5">UPS UNIT 1 (STATION_1)</p>
              </div>
            </div>
            <div className="flex md:hidden items-center gap-1.5 bg-emerald-500/15 px-2 py-1 rounded-lg border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div><span className="text-emerald-400 text-[9px] font-bold tracking-widest uppercase">Active</span>
            </div>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            <div className="hidden md:flex items-center gap-2 bg-emerald-500/15 px-3 py-1 rounded-lg border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
               <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div><span className="text-emerald-400 text-xs font-bold tracking-widest uppercase">System Active</span>
            </div>
            <div className="flex items-baseline gap-2 md:gap-3 bg-slate-900/60 px-4 py-2 rounded-xl border border-slate-700 shadow-[inset_0_0_10px_rgba(255,255,255,0.03)] w-full md:w-auto justify-center">
              <span className={`text-xs md:text-sm font-bold drop-shadow-lg ${getDayColorClass(upsData1.lastUpdated)}`}>{formatThaiDate(upsData1.lastUpdated)}</span>
              <span className="text-lg md:text-2xl font-black font-mono text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] tracking-wider">{upsData1.lastUpdated ? new Date(upsData1.lastUpdated).toLocaleTimeString('th-TH') : '--:--:--'} น.</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-20">
          <div className="space-y-6">
            <div className="bg-slate-900/80 border-[2px] border-yellow-500/60 rounded-2xl p-5 shadow-[0_0_20px_rgba(234,179,8,0.25),inset_0_0_10px_rgba(234,179,8,0.1)] relative overflow-hidden group hover:border-yellow-400 transition-all cursor-pointer">
              <h4 className="text-yellow-400 font-bold mb-4 border-b border-yellow-500/30 pb-2 text-sm md:text-base flex items-center gap-3"><Zap size={18} className="text-yellow-400" /> <span>Output voltage</span></h4>
              <div className="space-y-1 font-mono text-base md:text-xl">
                <div className="flex justify-between"><span className="text-slate-400">L1-2 :</span> <span className="text-white font-bold">{upsData1.outVolL1L2} V</span></div>
                <div className="flex justify-between"><span className="text-slate-400">L2-3 :</span> <span className="text-white font-bold">{upsData1.outVolL2L3} V</span></div>
                <div className="flex justify-between"><span className="text-slate-400">L3-1 :</span> <span className="text-white font-bold">{upsData1.outVolL3L1} V</span></div>
              </div>
            </div>
            <div className="bg-slate-900/80 border-[2px] border-orange-500/60 rounded-2xl p-5 shadow-[0_0_20px_rgba(249,115,22,0.25),inset_0_0_10px_rgba(249,115,22,0.1)] relative overflow-hidden group hover:border-orange-400 transition-all cursor-pointer">
              <h4 className="text-orange-400 font-bold mb-4 border-b border-orange-500/30 pb-2 text-sm md:text-base flex items-center gap-3"><Activity size={18} className="text-orange-400" /> <span>Output current</span></h4>
              <div className="space-y-1 font-mono text-base md:text-xl">
                <div className="flex justify-between items-center gap-4"><span className="text-slate-400">L1 :</span> <span className="text-white font-bold flex items-center gap-2">{upsData1.outCurL1} A <div className={`w-2 h-4 ${upsData1.outCurL1 > 0 ? 'bg-orange-500' : 'bg-slate-700'}`}></div></span></div>
                <div className="flex justify-between items-center gap-4"><span className="text-slate-400">L2 :</span> <span className="text-white font-bold flex items-center gap-2">{upsData1.outCurL2} A <div className={`w-2 h-4 ${upsData1.outCurL2 > 0 ? 'bg-orange-500' : 'bg-slate-700'}`}></div></span></div>
                <div className="flex justify-between items-center gap-4"><span className="text-slate-400">L3 :</span> <span className="text-white font-bold flex items-center gap-2">{upsData1.outCurL3} A <div className={`w-2 h-4 ${upsData1.outCurL3 > 0 ? 'bg-orange-500' : 'bg-slate-700'}`}></div></span></div>
              </div>
            </div>
            <div className="bg-slate-900/80 border-[2px] border-rose-500/60 rounded-2xl p-4 shadow-[0_0_20px_rgba(225,29,72,0.25)] text-center flex flex-col justify-center hover:border-rose-400 transition-all">
              <h4 className="text-rose-400 font-bold mb-1 text-xs">Output frequency</h4>
              <span className="text-white font-mono text-3xl font-black tracking-widest">{upsData1.outFreq} <span className="text-sm text-rose-500">Hz</span></span>
            </div>
          </div>

          <div className="space-y-6 flex flex-col justify-between">
            <div className="bg-slate-900/80 border-[2px] border-emerald-500/60 rounded-2xl p-5 shadow-[0_0_20px_rgba(16,185,129,0.25),inset_0_0_10px_rgba(16,185,129,0.1)] flex flex-col items-center justify-center min-h-[180px] relative overflow-hidden group hover:border-emerald-400 transition-all cursor-pointer">
              <h4 className="text-emerald-400 font-bold mb-5 w-full text-center text-sm md:text-base border-b border-emerald-500/30 pb-2 flex items-center justify-center gap-3"><BatteryCharging size={18} className="text-emerald-400" /> <span>Battery Status</span></h4>
              <div className="flex items-center justify-center gap-5 w-full">
                <div className="text-right">
                  <span className="block text-white font-mono text-xl md:text-2xl font-bold">{Math.floor(upsData1.runtimeRemaining / 60)} Hr</span>
                  <span className="block text-white font-mono text-xl md:text-2xl font-bold">{upsData1.runtimeRemaining % 60} Mn</span>
                </div>
                <div className="relative w-16 h-10 border-2 border-emerald-500 rounded-sm p-0.5 flex items-center bg-slate-950">
                  <div className="absolute -right-[6px] top-2 w-1 h-4 bg-emerald-500 rounded-r-sm"></div>
                  <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${upsData1.batteryCapacity}%` }}></div>
                </div>
                <span className="text-emerald-400 font-mono text-2xl md:text-3xl font-black">{upsData1.batteryCapacity}%</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-slate-900/80 border-[2px] border-emerald-500/40 rounded-xl p-3 text-center">
                <h4 className="text-emerald-400 font-bold text-sm mb-2">UPS mode</h4>
                <div className="bg-emerald-500/20 border border-emerald-500/50 w-full py-2 rounded-lg text-emerald-400 font-black text-xs md:text-sm">{upsData1.upsMode}</div>
              </div>
              <div className="bg-slate-900/80 border-[2px] border-emerald-500/40 rounded-xl p-3 text-center">
                <h4 className="text-emerald-400 font-bold text-sm mb-2">System mode</h4>
                <div className="bg-emerald-500/20 border border-emerald-500/50 w-full py-2 rounded-lg text-emerald-400 font-black text-xs md:text-sm">{upsData1.systemMode}</div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-900/90 border-[2px] border-cyan-500/60 rounded-2xl p-5 shadow-[0_0_20px_rgba(34,211,238,0.25)] min-h-[150px] flex flex-col hover:border-cyan-400 transition-all cursor-pointer">
              <h4 className="text-cyan-400 font-bold mb-3 border-b border-cyan-500/30 pb-2 text-sm md:text-base flex items-center gap-3"><ArrowUpRight size={18} className="text-cyan-400" /> <span className="tracking-widest">TOTAL OUTPUT</span></h4>
              <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                <div className="flex items-center gap-4 bg-slate-950/70 px-5 py-2.5 rounded-lg border border-cyan-500/30 w-full justify-center">
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Load</span>
                  <span className="text-cyan-400 font-mono text-2xl font-black">{upsData1.upsLoad}%</span>
                </div>
                <div className="text-white font-mono text-2xl md:text-3xl font-black tracking-widest">{upsData1.totalPowerKW} kW <span className="text-cyan-500/60 mx-1.5 font-light">|</span> {upsData1.totalPowerKVA} kVA</div>
              </div>
            </div>
            <div className="bg-slate-900/80 border-[2px] border-blue-500/60 rounded-2xl p-5 shadow-[0_0_20px_rgba(59,130,246,0.25)] relative hover:border-blue-400 transition-all cursor-pointer">
              <h4 className="text-blue-400 font-bold mb-4 border-b border-blue-500/30 pb-2 text-sm md:text-base flex items-center gap-3"><Zap size={18} className="text-blue-400" /> <span>Phase power</span></h4>
              <div className="space-y-4 font-mono text-base md:text-lg mt-4">
                <div className="flex justify-between items-center"><span className="text-slate-400 font-bold">PHASE L1</span> <div className="text-right text-white font-bold"><p>{upsData1.outPowerL1_KW} kW</p><p className="text-blue-300/70 text-sm font-light">{upsData1.outPowerL1_KVA} kVA</p></div></div>
                <div className="flex justify-between items-center"><span className="text-slate-400 font-bold">PHASE L2</span> <div className="text-right text-white font-bold"><p>{upsData1.outPowerL2_KW} kW</p><p className="text-blue-300/70 text-sm font-light">{upsData1.outPowerL2_KVA} kVA</p></div></div>
                <div className="flex justify-between items-center"><span className="text-slate-400 font-bold">PHASE L3</span> <div className="text-right text-white font-bold"><p>{upsData1.outPowerL3_KW} kW</p><p className="text-blue-300/70 text-sm font-light">{upsData1.outPowerL3_KVA} kVA</p></div></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🚀 ==================== เครื่องที่ 2 (Galaxy VL 250kW - IP: 172.27.196.8) ==================== 🚀 */}
      <div className="w-full bg-slate-950/60 backdrop-blur-2xl border-[3px] border-solid border-orange-400/80 rounded-[1rem] p-4 md:p-6 shadow-[0_0_70px_rgba(249,115,22,0.25)] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] md:w-[750px] md:h-[750px] bg-orange-500/20 blur-[0px] rounded-[1.5rem] pointer-events-none z-0"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 pb-5 border-b border-orange-500/30 gap-4 relative z-20">
          <div className="flex items-center justify-between w-full md:w-auto gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-900 border-[2px] border-orange-500 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.4)]">
                <Server size={24} className="text-orange-300 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)] animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-black text-white tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">Galaxy VL 250kW</h3>
                <p className="text-orange-400 text-[11px] font-bold tracking-widest mt-0.5">UPS UNIT 2 (IP: 172.27.196.8)</p>
              </div>
            </div>
            <div className="flex md:hidden items-center gap-1.5 bg-emerald-500/15 px-2 py-1 rounded-lg border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div><span className="text-emerald-400 text-[9px] font-bold tracking-widest uppercase">Active</span>
            </div>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            <div className="hidden md:flex items-center gap-2 bg-emerald-500/15 px-3 py-1 rounded-lg border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
               <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div><span className="text-emerald-400 text-xs font-bold tracking-widest uppercase">System Active</span>
            </div>
            <div className="flex items-baseline gap-2 md:gap-3 bg-slate-900/60 px-4 py-2 rounded-xl border border-slate-700 shadow-[inset_0_0_10px_rgba(255,255,255,0.03)] w-full md:w-auto justify-center">
              <span className={`text-xs md:text-sm font-bold drop-shadow-lg ${getDayColorClass(upsData2.lastUpdated)}`}>{formatThaiDate(upsData2.lastUpdated)}</span>
              <span className="text-lg md:text-2xl font-black font-mono text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] tracking-wider">{upsData2.lastUpdated ? new Date(upsData2.lastUpdated).toLocaleTimeString('th-TH') : '--:--:--'} น.</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-20">
          <div className="space-y-6">
            <div className="bg-slate-900/80 border-[2px] border-yellow-500/60 rounded-2xl p-5 shadow-[0_0_20px_rgba(234,179,8,0.25),inset_0_0_10px_rgba(234,179,8,0.1)] relative overflow-hidden group hover:border-yellow-400 transition-all cursor-pointer">
              <h4 className="text-yellow-400 font-bold mb-4 border-b border-yellow-500/30 pb-2 text-sm md:text-base flex items-center gap-3"><Zap size={18} className="text-yellow-400" /> <span>Output voltage</span></h4>
              <div className="space-y-1 font-mono text-base md:text-xl">
                <div className="flex justify-between"><span className="text-slate-400">L1-2 :</span> <span className="text-white font-bold">{upsData2.outVolL1L2} V</span></div>
                <div className="flex justify-between"><span className="text-slate-400">L2-3 :</span> <span className="text-white font-bold">{upsData2.outVolL2L3} V</span></div>
                <div className="flex justify-between"><span className="text-slate-400">L3-1 :</span> <span className="text-white font-bold">{upsData2.outVolL3L1} V</span></div>
              </div>
            </div>
            <div className="bg-slate-900/80 border-[2px] border-orange-500/60 rounded-2xl p-5 shadow-[0_0_20px_rgba(249,115,22,0.25),inset_0_0_10px_rgba(249,115,22,0.1)] relative overflow-hidden group hover:border-orange-400 transition-all cursor-pointer">
              <h4 className="text-orange-400 font-bold mb-4 border-b border-orange-500/30 pb-2 text-sm md:text-base flex items-center gap-3"><Activity size={18} className="text-orange-400" /> <span>Output current</span></h4>
              <div className="space-y-1 font-mono text-base md:text-xl">
                <div className="flex justify-between items-center gap-4"><span className="text-slate-400">L1 :</span> <span className="text-white font-bold flex items-center gap-2">{upsData2.outCurL1} A <div className={`w-2 h-4 ${upsData2.outCurL1 > 0 ? 'bg-orange-500' : 'bg-slate-700'}`}></div></span></div>
                <div className="flex justify-between items-center gap-4"><span className="text-slate-400">L2 :</span> <span className="text-white font-bold flex items-center gap-2">{upsData2.outCurL2} A <div className={`w-2 h-4 ${upsData2.outCurL2 > 0 ? 'bg-orange-500' : 'bg-slate-700'}`}></div></span></div>
                <div className="flex justify-between items-center gap-4"><span className="text-slate-400">L3 :</span> <span className="text-white font-bold flex items-center gap-2">{upsData2.outCurL3} A <div className={`w-2 h-4 ${upsData2.outCurL3 > 0 ? 'bg-orange-500' : 'bg-slate-700'}`}></div></span></div>
              </div>
            </div>
            <div className="bg-slate-900/80 border-[2px] border-rose-500/60 rounded-2xl p-4 shadow-[0_0_20px_rgba(225,29,72,0.25)] text-center flex flex-col justify-center hover:border-rose-400 transition-all">
              <h4 className="text-rose-400 font-bold mb-1 text-xs">Output frequency</h4>
              <span className="text-white font-mono text-3xl font-black tracking-widest">{upsData2.outFreq} <span className="text-sm text-rose-500">Hz</span></span>
            </div>
          </div>

          <div className="space-y-6 flex flex-col justify-between">
            <div className="bg-slate-900/80 border-[2px] border-emerald-500/60 rounded-2xl p-5 shadow-[0_0_20px_rgba(16,185,129,0.25),inset_0_0_10px_rgba(16,185,129,0.1)] flex flex-col items-center justify-center min-h-[180px] relative overflow-hidden group hover:border-emerald-400 transition-all cursor-pointer">
              <h4 className="text-emerald-400 font-bold mb-5 w-full text-center text-sm md:text-base border-b border-emerald-500/30 pb-2 flex items-center justify-center gap-3"><BatteryCharging size={18} className="text-emerald-400" /> <span>Battery Status</span></h4>
              <div className="flex items-center justify-center gap-5 w-full">
                <div className="text-right">
                  <span className="block text-white font-mono text-xl md:text-2xl font-bold">{Math.floor(upsData2.runtimeRemaining / 60)} Hr</span>
                  <span className="block text-white font-mono text-xl md:text-2xl font-bold">{upsData2.runtimeRemaining % 60} Mn</span>
                </div>
                <div className="relative w-16 h-10 border-2 border-emerald-500 rounded-sm p-0.5 flex items-center bg-slate-950">
                  <div className="absolute -right-[6px] top-2 w-1 h-4 bg-emerald-500 rounded-r-sm"></div>
                  <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${upsData2.batteryCapacity}%` }}></div>
                </div>
                <span className="text-emerald-400 font-mono text-2xl md:text-3xl font-black">{upsData2.batteryCapacity}%</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-slate-900/80 border-[2px] border-emerald-500/40 rounded-xl p-3 text-center">
                <h4 className="text-emerald-400 font-bold text-sm mb-2">UPS mode</h4>
                <div className="bg-emerald-500/20 border border-emerald-500/50 w-full py-2 rounded-lg text-emerald-400 font-black text-xs md:text-sm">{upsData2.upsMode}</div>
              </div>
              <div className="bg-slate-900/80 border-[2px] border-emerald-500/40 rounded-xl p-3 text-center">
                <h4 className="text-emerald-400 font-bold text-sm mb-2">System mode</h4>
                <div className="bg-emerald-500/20 border border-emerald-500/50 w-full py-2 rounded-lg text-emerald-400 font-black text-xs md:text-sm">{upsData2.systemMode}</div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-900/90 border-[2px] border-cyan-500/60 rounded-2xl p-5 shadow-[0_0_20px_rgba(34,211,238,0.25)] min-h-[150px] flex flex-col hover:border-cyan-400 transition-all cursor-pointer">
              <h4 className="text-cyan-400 font-bold mb-3 border-b border-cyan-500/30 pb-2 text-sm md:text-base flex items-center gap-3"><ArrowUpRight size={18} className="text-cyan-400" /> <span className="tracking-widest">TOTAL OUTPUT</span></h4>
              <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                <div className="flex items-center gap-4 bg-slate-950/70 px-5 py-2.5 rounded-lg border border-cyan-500/30 w-full justify-center">
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Load</span>
                  <span className="text-cyan-400 font-mono text-2xl font-black">{upsData2.upsLoad}%</span>
                </div>
                <div className="text-white font-mono text-2xl md:text-3xl font-black tracking-widest">{upsData2.totalPowerKW} kW <span className="text-cyan-500/60 mx-1.5 font-light">|</span> {upsData2.totalPowerKVA} kVA</div>
              </div>
            </div>
            <div className="bg-slate-900/80 border-[2px] border-blue-500/60 rounded-2xl p-5 shadow-[0_0_20px_rgba(59,130,246,0.25)] relative hover:border-blue-400 transition-all cursor-pointer">
              <h4 className="text-blue-400 font-bold mb-4 border-b border-blue-500/30 pb-2 text-sm md:text-base flex items-center gap-3"><Zap size={18} className="text-blue-400" /> <span>Phase power</span></h4>
              <div className="space-y-4 font-mono text-base md:text-lg mt-4">
                <div className="flex justify-between items-center"><span className="text-slate-400 font-bold">PHASE L1</span> <div className="text-right text-white font-bold"><p>{upsData2.outPowerL1_KW} kW</p><p className="text-blue-300/70 text-sm font-light">{upsData2.outPowerL1_KVA} kVA</p></div></div>
                <div className="flex justify-between items-center"><span className="text-slate-400 font-bold">PHASE L2</span> <div className="text-right text-white font-bold"><p>{upsData2.outPowerL2_KW} kW</p><p className="text-blue-300/70 text-sm font-light">{upsData2.outPowerL2_KVA} kVA</p></div></div>
                <div className="flex justify-between items-center"><span className="text-slate-400 font-bold">PHASE L3</span> <div className="text-right text-white font-bold"><p>{upsData2.outPowerL3_KW} kW</p><p className="text-blue-300/70 text-sm font-light">{upsData2.outPowerL3_KVA} kVA</p></div></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🌟 ฟันธง: ดึงแผงปุ่มทางออก ของ UPS ให้ขยายออกไป 100% ทะลุกรอบเนื้อหาออกมา เพื่อตีกรอบให้เป็น Layer เดียวกับขอบจอด้านบน 🌟 */}
      <div className="fixed bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] md:w-full md:max-w-7xl flex gap-3 md:gap-4 z-[9999]">
        <button
          onClick={handleGoHub}
          className="flex-[1] bg-slate-900/95 hover:bg-slate-800 backdrop-blur-xl border-2 md:border-[3px] border-cyan-500/80 hover:border-cyan-400 text-cyan-400 py-3 md:py-4 rounded-2xl md:rounded-[1.2rem] font-black tracking-widest flex items-center justify-center gap-3 transition-all shadow-[0_10px_30px_rgba(6,182,212,0.4)] active:scale-95 text-[14px] md:text-[18px]"
        >
          <Home size={24} className="text-cyan-400" />
          <span>หน้าหลัก (HOME)</span>
        </button>

        <button
          onClick={handleLogout}
          className="flex-[1] bg-slate-900/95 hover:bg-rose-900/60 backdrop-blur-xl border-2 md:border-[3px] border-rose-600 hover:border-rose-400 text-rose-400 hover:text-rose-300 py-3 md:py-4 rounded-2xl md:rounded-[1.2rem] font-black tracking-widest flex items-center justify-center gap-3 transition-all shadow-[0_10px_30px_rgba(244,63,94,0.4)] active:scale-95 text-[14px] md:text-[18px]"
        >
          <LogOut size={24} className="text-rose-500" />
          <span>ออกจากระบบ</span>
        </button>
      </div>

    </div>
  );
}