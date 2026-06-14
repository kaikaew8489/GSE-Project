import React, { useState, useEffect } from 'react';
import { Activity, BatteryCharging, Zap, ArrowUpRight } from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebaseConfig';

export default function UPSStatusCard() {
  const [upsData, setUpsData] = useState({
    batteryCapacity: 0, runtimeRemaining: 0, upsLoad: 0, batteryTemp: 0, upsStatus: 2, lastUpdated: "",
    upsMode: "Normal operation", systemMode: "Inverter",
    outVolL1L2: 0, outVolL2L3: 0, outVolL3L1: 0,
    outCurL1: 0, outCurL2: 0, outCurL3: 0,
    outFreq: 0,
    totalPowerKW: 0, totalPowerKVA: 0,
    outPowerL1_KW: 0, outPowerL1_KVA: 0,
    outPowerL2_KW: 0, outPowerL2_KVA: 0,
    outPowerL3_KW: 0, outPowerL3_KVA: 0
  });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "ups_monitoring", "station_1"), (docSnap) => {
      if (docSnap.exists()) setUpsData(prev => ({ ...prev, ...docSnap.data() }));
    });
    return () => unsub();
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
    <div className="w-full bg-slate-950/60 backdrop-blur-2xl border-[3px] border-solid border-cyan-400/80 rounded-[1rem] p-4 md:p-6 shadow-[0_0_70px_rgba(6,182,212,0.25)] mt-4 relative overflow-hidden animate-in fade-in duration-700">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] md:w-[750px] md:h-[750px] bg-cyan-500/20 blur-[0px] rounded-[1.5rem] pointer-events-none z-0"></div>
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 pb-5 border-b border-cyan-500/30 gap-4 relative z-20">
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-900 border-[2px] border-cyan-500 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.4)]">
              <Activity size={24} className="text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] animate-pulse" />
            </div>
            <h3 className="text-xl md:text-2xl font-black text-white tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">Galaxy VS 120kW</h3>
          </div>
          <div className="flex md:hidden items-center gap-1.5 bg-emerald-500/15 px-2 py-1 rounded-lg border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
            <span className="text-emerald-400 text-[9px] font-bold tracking-widest uppercase">Active</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          <div className="hidden md:flex items-center gap-2 bg-emerald-500/15 px-3 py-1 rounded-lg border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
             <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
             <span className="text-emerald-400 text-xs font-bold tracking-widest uppercase">System Active</span>
          </div>
          <div className="flex items-baseline gap-2 md:gap-3 bg-slate-900/60 px-4 py-2 rounded-xl border border-slate-700 shadow-[inset_0_0_10px_rgba(255,255,255,0.03)] w-full md:w-auto justify-center">
            <span className={`text-xs md:text-sm font-bold drop-shadow-lg ${getDayColorClass(upsData.lastUpdated)}`}>
              {formatThaiDate(upsData.lastUpdated)}
            </span>
            <span className="text-lg md:text-2xl font-black font-mono text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] tracking-wider">
              {upsData.lastUpdated ? new Date(upsData.lastUpdated).toLocaleTimeString('th-TH') : '--:--:--'} น.
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-20">
        <div className="space-y-6">
          <div className="bg-slate-900/80 border-[2px] border-yellow-500/60 rounded-2xl p-5 shadow-[0_0_20px_rgba(234,179,8,0.25),inset_0_0_10px_rgba(234,179,8,0.1)] relative overflow-hidden group hover:border-yellow-400 transition-all cursor-pointer">
            <h4 className="text-yellow-400 font-bold mb-4 border-b border-yellow-500/30 pb-2 text-sm md:text-base flex items-center gap-3">
                <Zap size={18} className="text-yellow-400" /> <span>Output voltage</span>
            </h4>
            <div className="space-y-1 font-mono text-base md:text-xl">
              <div className="flex justify-between"><span className="text-slate-400">L1-2 :</span> <span className="text-white font-bold">{upsData.outVolL1L2} V</span></div>
              <div className="flex justify-between"><span className="text-slate-400">L2-3 :</span> <span className="text-white font-bold">{upsData.outVolL2L3} V</span></div>
              <div className="flex justify-between"><span className="text-slate-400">L3-1 :</span> <span className="text-white font-bold">{upsData.outVolL3L1} V</span></div>
            </div>
          </div>
          <div className="bg-slate-900/80 border-[2px] border-orange-500/60 rounded-2xl p-5 shadow-[0_0_20px_rgba(249,115,22,0.25),inset_0_0_10px_rgba(249,115,22,0.1)] relative overflow-hidden group hover:border-orange-400 transition-all cursor-pointer">
            <h4 className="text-orange-400 font-bold mb-4 border-b border-orange-500/30 pb-2 text-sm md:text-base flex items-center gap-3">
                <Activity size={18} className="text-orange-400" /> <span>Output current</span>
            </h4>
            <div className="space-y-1 font-mono text-base md:text-xl">
              <div className="flex justify-between items-center gap-4"><span className="text-slate-400">L1 :</span> <span className="text-white font-bold flex items-center gap-2">{upsData.outCurL1} A <div className={`w-2 h-4 ${upsData.outCurL1 > 0 ? 'bg-orange-500' : 'bg-slate-700'}`}></div></span></div>
              <div className="flex justify-between items-center gap-4"><span className="text-slate-400">L2 :</span> <span className="text-white font-bold flex items-center gap-2">{upsData.outCurL2} A <div className={`w-2 h-4 ${upsData.outCurL2 > 0 ? 'bg-orange-500' : 'bg-slate-700'}`}></div></span></div>
              <div className="flex justify-between items-center gap-4"><span className="text-slate-400">L3 :</span> <span className="text-white font-bold flex items-center gap-2">{upsData.outCurL3} A <div className={`w-2 h-4 ${upsData.outCurL3 > 0 ? 'bg-orange-500' : 'bg-slate-700'}`}></div></span></div>
            </div>
          </div>
          <div className="bg-slate-900/80 border-[2px] border-rose-500/60 rounded-2xl p-4 shadow-[0_0_20px_rgba(225,29,72,0.25)] text-center flex flex-col justify-center hover:border-rose-400 transition-all">
            <h4 className="text-rose-400 font-bold mb-1 text-xs">Output frequency</h4>
            <span className="text-white font-mono text-3xl font-black tracking-widest">{upsData.outFreq} <span className="text-sm text-rose-500">Hz</span></span>
          </div>
        </div>

        <div className="space-y-6 flex flex-col justify-between">
          <div className="bg-slate-900/80 border-[2px] border-emerald-500/60 rounded-2xl p-5 shadow-[0_0_20px_rgba(16,185,129,0.25),inset_0_0_10px_rgba(16,185,129,0.1)] flex flex-col items-center justify-center min-h-[180px] relative overflow-hidden group hover:border-emerald-400 transition-all cursor-pointer">
            <h4 className="text-emerald-400 font-bold mb-5 w-full text-center text-sm md:text-base border-b border-emerald-500/30 pb-2 flex items-center justify-center gap-3">
                <BatteryCharging size={18} className="text-emerald-400" /> <span>Battery Status</span>
            </h4>
            <div className="flex items-center justify-center gap-5 w-full">
              <div className="text-right">
                <span className="block text-white font-mono text-xl md:text-2xl font-bold">{Math.floor(upsData.runtimeRemaining / 60)} Hr</span>
                <span className="block text-white font-mono text-xl md:text-2xl font-bold">{upsData.runtimeRemaining % 60} Mn</span>
              </div>
              <div className="relative w-16 h-10 border-2 border-emerald-500 rounded-sm p-0.5 flex items-center bg-slate-950">
                <div className="absolute -right-[6px] top-2 w-1 h-4 bg-emerald-500 rounded-r-sm"></div>
                <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${upsData.batteryCapacity}%` }}></div>
              </div>
              <span className="text-emerald-400 font-mono text-2xl md:text-3xl font-black">{upsData.batteryCapacity}%</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-slate-900/80 border-[2px] border-emerald-500/40 rounded-xl p-3 text-center">
              <h4 className="text-emerald-400 font-bold text-sm mb-2">UPS mode</h4>
              <div className="bg-emerald-500/20 border border-emerald-500/50 w-full py-2 rounded-lg text-emerald-400 font-black text-xs md:text-sm">{upsData.upsMode}</div>
            </div>
            <div className="bg-slate-900/80 border-[2px] border-emerald-500/40 rounded-xl p-3 text-center">
              <h4 className="text-emerald-400 font-bold text-sm mb-2">System mode</h4>
              <div className="bg-emerald-500/20 border border-emerald-500/50 w-full py-2 rounded-lg text-emerald-400 font-black text-xs md:text-sm">{upsData.systemMode}</div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900/90 border-[2px] border-cyan-500/60 rounded-2xl p-5 shadow-[0_0_20px_rgba(34,211,238,0.25)] min-h-[150px] flex flex-col hover:border-cyan-400 transition-all cursor-pointer">
            <h4 className="text-cyan-400 font-bold mb-3 border-b border-cyan-500/30 pb-2 text-sm md:text-base flex items-center gap-3">
                <ArrowUpRight size={18} className="text-cyan-400" /> <span className="tracking-widest">TOTAL OUTPUT</span>
            </h4>
            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
              <div className="flex items-center gap-4 bg-slate-950/70 px-5 py-2.5 rounded-lg border border-cyan-500/30 w-full justify-center">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Load</span>
                <span className="text-cyan-400 font-mono text-2xl font-black">{upsData.upsLoad}%</span>
              </div>
              <div className="text-white font-mono text-2xl md:text-3xl font-black tracking-widest">
                {upsData.totalPowerKW} kW <span className="text-cyan-500/60 mx-1.5 font-light">|</span> {upsData.totalPowerKVA} kVA
              </div>
            </div>
          </div>
          <div className="bg-slate-900/80 border-[2px] border-blue-500/60 rounded-2xl p-5 shadow-[0_0_20px_rgba(59,130,246,0.25)] relative hover:border-blue-400 transition-all cursor-pointer">
            <h4 className="text-blue-400 font-bold mb-4 border-b border-blue-500/30 pb-2 text-sm md:text-base flex items-center gap-3">
                <Zap size={18} className="text-blue-400" /> <span>Phase power</span>
            </h4>
            <div className="space-y-4 font-mono text-base md:text-lg mt-4">
              <div className="flex justify-between items-center"><span className="text-slate-400 font-bold">PHASE L1</span> <div className="text-right text-white font-bold"><p>{upsData.outPowerL1_KW} kW</p><p className="text-blue-300/70 text-sm font-light">{upsData.outPowerL1_KVA} kVA</p></div></div>
              <div className="flex justify-between items-center"><span className="text-slate-400 font-bold">PHASE L2</span> <div className="text-right text-white font-bold"><p>{upsData.outPowerL2_KW} kW</p><p className="text-blue-300/70 text-sm font-light">{upsData.outPowerL2_KVA} kVA</p></div></div>
              <div className="flex justify-between items-center"><span className="text-slate-400 font-bold">PHASE L3</span> <div className="text-right text-white font-bold"><p>{upsData.outPowerL3_KW} kW</p><p className="text-blue-300/70 text-sm font-light">{upsData.outPowerL3_KVA} kVA</p></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}