import React from 'react';
import { createPortal } from 'react-dom';
import { 
  Search, Calendar, ChevronDown, Clock, User, Phone, 
  AlertCircle, Wrench, ShieldCheck, CheckCircle, 
  RotateCcw, PauseCircle, XCircle, AlertTriangle, 
  Building, MapPin, ChevronRight, Star, PhoneCall, Camera, Video,
  ShieldAlert 
} from 'lucide-react';
import { formatDisplayPhone, formatDateTimeString, formatMinutesToText, getMinutesDiff } from '../lib/utils';

export default function TrackingView({
  sysTime, currentUserRole, currentUserName, tickets, filteredTickets,
  searchTerm, setSearchTerm, filterStatus, setFilterStatus,
  trackTimeframe, setTrackTimeframe, trackMonth, setTrackMonth, trackDate, setTrackDate,
  showTrackMonthPicker, setShowTrackMonthPicker, showTrackDatePicker, setShowTrackDatePicker,
  trackCalMonth, setTrackCalMonth, trackCalYear, setTrackCalYear,
  allRosters, technicianList, setActionModal, updateTicketStatus, 
  setRatingModal, setLightboxImg, getLiveStopwatch
}) {
  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-10 pb-32 md:pb-40 animate-in slide-in-from-left-4 duration-500 text-left">
      
      {/* 🌟 เมนูควบคุม (ค้นหา, กรองสถานะ, กรองเวลา) */}
      <div className="relative pt-1 pb-4 md:pb-6 space-y-3 md:space-y-4 mb-2 md:mb-6 border-b-2 border-slate-700/50 animate-in fade-in duration-500">
        <div className="flex-grow flex items-center bg-slate-900 border-2 border-solid border-cyan-800/80 rounded-xl md:rounded-2xl p-3 md:p-4 shadow-inner shadow-[0_0_8px_rgba(34,211,238,1)] hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,1)] transition-all duration-300 cursor-text group">
          <Search size={22} className="md:w-6 md:h-6 text-cyan-300 shrink-0 group-hover:text-cyan-100 group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,1)] transition-all" />
          <input
            type="text"
            placeholder="ค้นหา รหัส หรือ อุปกรณ์..."
            className="bg-transparent flex-grow outline-none text-white px-3 md:px-4 font-bold md:text-[20px] placeholder:text-slate-500 placeholder:font-normal placeholder:md:text-[20px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2 md:gap-4 overflow-x-auto py-2 md:py-3 px-1 snap-x w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {[
            { id: 'all', label: 'ทั้งหมด' },
            { id: 'pending', label: 'รอดำเนินการ' },
            { id: 'fixing', label: 'กำลังซ่อม' },
            { id: 'on_hold', label: 'แจ้งขัดข้อง' },
            { id: 'verify', label: 'รอยืนยัน' },
            { id: 'cancelled', label: 'ยกเลิก' },
            { id: 'completed', label: 'เสร็จสิ้น' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => { setFilterStatus(f.id); setSearchTerm(''); }}
              className={`flex-none md:flex-1 px-4 md:px-0 py-2 md:py-3.5 text-[13px] md:text-[18px] font-black rounded-lg md:rounded-xl transition-all duration-300 snap-center whitespace-nowrap flex items-center justify-center ${filterStatus === f.id ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-[2px] border-solid border-orange-300 shadow-[0_0_15px_rgba(249,115,22,0.8)] z-10' : 'bg-slate-900 text-cyan-300 border-[2px] border-solid border-cyan-400/30 shadow-[0_0_8px_rgba(34,211,238,0.4)] hover:bg-cyan-900/60 hover:text-white hover:border-cyan-300 hover:shadow-[0_0_20px_rgba(34,211,238,1)] hover:-translate-y-1'}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2 md:gap-4 md:mt-2 w-full">
          <button onClick={() => setTrackTimeframe('all')} className={`flex-1 py-2 md:py-3.5 rounded-lg md:rounded-xl font-black text-[14px] md:text-[18px] transition-all duration-300 whitespace-nowrap flex items-center justify-center ${trackTimeframe === 'all' ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.8)] border-[2px] border-solid border-cyan-300 scale-[1.02] z-10' : 'bg-slate-950 text-cyan-300 border-[2px] border-solid border-cyan-400/30 shadow-[0_0_8px_rgba(34,211,238,0.4)] hover:bg-cyan-900/60 hover:text-white hover:border-cyan-300 hover:shadow-[0_0_20px_rgba(34,211,238,1)] hover:-translate-y-1'}`}>
            ทุกวัน
          </button>

          {/* ระบุวัน */}
          <div className="relative flex-1">
            <button onClick={() => setShowTrackDatePicker(true)} className={`w-full h-full py-2 md:py-3.5 rounded-lg md:rounded-xl font-black text-[14px] md:text-[18px] flex items-center justify-center gap-1.5 md:gap-2 transition-all duration-300 whitespace-nowrap ${trackTimeframe === 'custom_date' ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.8)] border-[2px] border-solid border-cyan-300 scale-[1.02] z-10' : 'bg-slate-950 text-cyan-300 border-[2px] border-solid border-cyan-400/30 shadow-[0_0_8px_rgba(34,211,238,0.4)] hover:bg-cyan-900/60 hover:text-white hover:border-cyan-300 hover:shadow-[0_0_20px_rgba(34,211,238,1)] hover:-translate-y-1'}`}>
              <Calendar size={14} className={`md:w-5 md:h-5 ${trackTimeframe === 'custom_date' ? 'text-white animate-pulse' : 'text-cyan-400'}`}/> ระบุวัน
            </button>
            {showTrackDatePicker && createPortal(
              <div className="fixed inset-0 z-[9999] bg-slate-900/80 backdrop-blur-md flex p-4 animate-in fade-in items-center justify-center" onClick={() => setShowTrackDatePicker(false)}>
                <div className="relative z-10 m-auto bg-slate-900 border-[2px] border-solid border-white rounded-[2rem] shadow-[0_0_60px_rgba(6,182,212,0.8)] w-[90%] max-w-[320px] sm:max-w-[340px] md:max-w-[550px] p-4 sm:p-5 md:p-10 text-center animate-in zoom-in-95 flex flex-col h-auto overflow-hidden outline-none" onClick={(e) => e.stopPropagation()}>
                  <div className="absolute -top-20 -left-20 w-40 h-40 md:w-60 md:h-60 bg-cyan-500/60 rounded-full blur-[50px] pointer-events-none z-0"></div>
                  <div className="absolute -bottom-20 -right-20 w-40 h-40 md:w-60 md:h-60 bg-blue-500/60 rounded-full blur-[50px] pointer-events-none z-0"></div>
                  
                  <div className="relative z-10 flex justify-between items-center mb-6 md:mb-8 pb-5 md:pb-6 border-b border-white/20">
                    <button onClick={() => { if (trackCalMonth === 0) { setTrackCalMonth(11); setTrackCalYear(y => y - 1); } else setTrackCalMonth(m => m - 1); }} className="p-2.5 md:p-4 bg-slate-800 text-white rounded-xl md:rounded-2xl hover:bg-cyan-500 transition-colors border border-slate-600 active:scale-95 shadow-inner"><ChevronDown className="w-5 h-5 md:w-8 md:h-8 rotate-90" /></button>
                    <div className="flex flex-col items-center">
                      <span className="text-[14px] md:text-[18px] font-black text-white tracking-widest uppercase mb-0.5 md:mb-2 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">เลือกวันที่</span>
                      <span className="text-xl md:text-3xl font-black text-cyan-400 tracking-widest drop-shadow-[0_0_15px_rgba(6,182,212,0.9)]">{['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'][trackCalMonth]} {trackCalYear + 543}</span>
                    </div>
                    <button onClick={() => { if (trackCalMonth === 11) { setTrackCalMonth(0); setTrackCalYear(y => y + 1); } else setTrackCalMonth(m => m + 1); }} className="p-2.5 md:p-4 bg-slate-800 text-white rounded-xl md:rounded-2xl hover:bg-cyan-500 transition-colors border border-slate-600 active:scale-95 shadow-inner"><ChevronDown className="w-5 h-5 md:w-8 md:h-8 -rotate-90" /></button>
                  </div>
                  
                  <div className="relative z-10">
                    <div className="grid grid-cols-7 gap-1 md:gap-2 mb-3 md:mb-5">
                      {['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'].map(day => (<div key={day} className={`text-[13px] md:text-[20px] font-black ${day === 'อา' ? 'text-rose-400' : day === 'ส' ? 'text-sky-400' : 'text-slate-300'}`}>{day}</div>))}
                    </div>
                    <div className="grid grid-cols-7 gap-1.5 md:gap-3">
                      {Array.from({ length: new Date(trackCalYear, trackCalMonth, 1).getDay() }).map((_, i) => (<div key={`empty-${i}`} />))}
                      {Array.from({ length: new Date(trackCalYear, trackCalMonth + 1, 0).getDate() }).map((_, i) => {
                        const day = i + 1;
                        const dateString = `${trackCalYear}-${String(trackCalMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        const isSelected = trackDate === dateString;
                        const todayLocal = new Date(sysTime);
                        const isToday = todayLocal.getFullYear() === trackCalYear && todayLocal.getMonth() === trackCalMonth && todayLocal.getDate() === day;
                        const isSunday = new Date(dateString).getDay() === 0;
                        const isSaturday = new Date(dateString).getDay() === 6;

                        return (
                          <button 
                            key={day} 
                            onClick={() => { setTrackDate(dateString); setTrackTimeframe('custom_date'); setShowTrackDatePicker(false); }}
                            className={`aspect-square flex items-center justify-center rounded-xl md:rounded-2xl text-[15px] md:text-[22px] font-black transition-all duration-300 active:scale-95 ${
                              isSelected 
                                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.9)] border-[2px] border-solid border-cyan-300 scale-110 z-20' 
                                : isToday 
                                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-[0_0_25px_rgba(249,115,22,1)] border-[2px] border-solid border-orange-300 z-10 animate-pulse' 
                                : 'bg-slate-800 ' + (isSunday ? 'text-rose-400 drop-shadow-[0_0_5px_rgba(251,113,133,0.8)]' : isSaturday ? 'text-sky-400 drop-shadow-[0_0_5px_rgba(56,189,248,0.8)]' : 'text-slate-200') + ' hover:bg-cyan-500/50 hover:border-cyan-400 border border-white/60 shadow-inner'
                            }`}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <button onClick={() => setShowTrackDatePicker(false)} className="relative z-10 mt-8 md:mt-10 w-full py-4 md:py-6 rounded-xl md:rounded-2xl font-black text-white bg-cyan-600 hover:bg-rose-500 border-[2px] border-solid border-white shadow-[0_0_20px_rgba(6,182,212,0.7)] transition-all duration-300 active:scale-95 tracking-widest uppercase md:text-[22px]">ยกเลิก</button>
                </div>
              </div>, document.body
            )}
          </div>

          {/* ระบุเดือน */}
          <div className="relative flex-1">
            <button onClick={() => setShowTrackMonthPicker(true)} className={`w-full h-full py-2 md:py-3.5 rounded-lg md:rounded-xl font-black text-[14px] md:text-[18px] flex items-center justify-center gap-1.5 md:gap-2 transition-all duration-300 whitespace-nowrap ${trackTimeframe === 'custom_month' ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.8)] border-[2px] border-solid border-cyan-300 scale-[1.02] z-10' : 'bg-slate-950 text-cyan-300 border-[2px] border-solid border-cyan-400/30 shadow-[0_0_8px_rgba(34,211,238,0.4)] hover:bg-cyan-900/60 hover:text-white hover:border-cyan-300 hover:shadow-[0_0_20px_rgba(34,211,238,1)] hover:-translate-y-1'}`}>
              <Calendar size={14} className={`md:w-5 md:h-5 ${trackTimeframe === 'custom_month' ? 'text-white animate-pulse' : 'text-cyan-400'}`}/> ระบุเดือน
            </button>
            {showTrackMonthPicker && createPortal(
              <div className="fixed inset-0 z-[9999] bg-slate-900/80 backdrop-blur-md flex p-4 animate-in fade-in items-center justify-center" onClick={() => setShowTrackMonthPicker(false)}>
                <div className="absolute w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-cyan-500/40 rounded-full blur-[80px] pointer-events-none z-0"></div>
                <div className="relative z-10 m-auto bg-slate-900 border-[2px] border-solid border-white rounded-[2rem] shadow-[0_0_60px_rgba(6,182,212,0.8)] w-[90%] max-w-[320px] sm:max-w-[340px] md:max-w-[550px] p-4 sm:p-5 md:p-10 text-center animate-in zoom-in-95 flex flex-col h-auto overflow-hidden outline-none" onClick={(e) => e.stopPropagation()}>
                  <div className="relative z-10 flex justify-between items-center mb-6 md:mb-8 pb-5 md:pb-6 border-b border-white/20">
                    <button onClick={() => setTrackCalYear(y => y - 1)} className="p-2.5 md:p-4 bg-slate-800 text-white rounded-xl md:rounded-2xl hover:bg-cyan-500 transition-colors active:scale-95 shadow-inner border border-slate-600"><ChevronDown className="w-5 h-5 md:w-8 md:h-8 rotate-90" /></button>
                    <div className="flex flex-col items-center">
                      <span className="text-[14px] md:text-[18px] font-black text-white tracking-widest uppercase mb-0.5 md:mb-2 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">เลือกเดือน</span>
                      <span className="text-2xl md:text-4xl font-black text-cyan-400 tracking-widest drop-shadow-[0_0_15px_rgba(6,182,212,0.9)]">{trackCalYear + 543}</span>
                    </div>
                    <button onClick={() => setTrackCalYear(y => y + 1)} className="p-2.5 md:p-4 bg-slate-800 text-white rounded-xl md:rounded-2xl hover:bg-cyan-500 transition-colors active:scale-95 shadow-inner border border-slate-600"><ChevronDown className="w-5 h-5 md:w-8 md:h-8 -rotate-90" /></button>
                  </div>
                  <div className="relative z-10 grid grid-cols-3 gap-3 md:gap-5">
                    {['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'].map((m, i) => {
                      const monthValue = `${trackCalYear}-${String(i + 1).padStart(2, '0')}`;
                      const isSelected = trackMonth === monthValue;
                      const todayLocal = new Date(sysTime);
                      const isCurrentMonth = todayLocal.getFullYear() === trackCalYear && todayLocal.getMonth() === i;
                      return (
                        <button 
                          key={m} 
                          onClick={() => { setTrackMonth(monthValue); setTrackTimeframe('custom_month'); setShowTrackMonthPicker(false); }}
                          className={`py-3.5 md:py-6 rounded-xl md:rounded-2xl text-[15px] md:text-[24px] font-black transition-all duration-300 active:scale-95 ${
                            isSelected 
                              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.9)] border-[2px] border-solid border-cyan-300 scale-110 z-10' 
                              : isCurrentMonth 
                              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-[0_0_25px_rgba(249,115,22,1)] border-[2px] border-solid border-orange-300 z-10 animate-pulse' 
                              : 'bg-slate-800/80 text-slate-200 hover:bg-cyan-500/40 hover:border-cyan-400 border border-white/60 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] shadow-inner'
                          }`}
                        >
                          {m}
                        </button>
                      )
                    })}
                  </div>
                  <button onClick={() => setShowTrackMonthPicker(false)} className="relative z-10 mt-8 md:mt-10 w-full py-4 md:py-6 rounded-xl md:rounded-2xl font-black text-white bg-cyan-600 hover:bg-rose-500 border-[2px] border-solid border-white shadow-[0_0_20px_rgba(6,182,212,0.7)] transition-all duration-300 active:scale-95 tracking-widest uppercase md:text-[22px]">ยกเลิก</button>
                </div>
              </div>, document.body
            )}
          </div>
        </div>
        
        {/* ป้ายบอกวันที่ */}
        <div className="flex items-center gap-1.5 px-1 pt-0.5 animate-in fade-in">
          <Clock size={20} className="text-orange-500" />
          <span className="text-[14px] md:text-[18px] font-bold text-emerald-400 tracking-widest drop-shadow-sm">
            {trackTimeframe === 'custom_date' && trackDate 
              ? `แสดงข้อมูลวันที่: ${parseInt(trackDate.split('-')[2])} ${['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'][parseInt(trackDate.split('-')[1])-1]} ${parseInt(trackDate.split('-')[0]) + 543}` 
            : trackTimeframe === 'custom_month' && trackMonth 
              ? `แสดงข้อมูลเดือน: ${['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'][parseInt(trackMonth.split('-')[1])-1]} ${parseInt(trackMonth.split('-')[0]) + 543}` 
            : trackTimeframe === 'week'
              ? 'แสดงข้อมูล: สัปดาห์นี้'
            : 'แสดงข้อมูล: ทั้งหมด (ทุกวัน)'}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:gap-10 font-sans">
        {filteredTickets.length === 0 ? (
          <div className="text-center py-16 text-orange-500 flex flex-col items-center">
            <CheckCircle size={60} className="mx-auto mb-4 opacity-50" />
            <p className="font-bold text-[26px] text-lg">ไม่มีรายการ</p>
            <p className="text-[22px] text-white-500 mt-1">ที่คุณเลือก</p>
          </div>
        ) : (
          filteredTickets.map((t) => {
            const ticketDate = new Date(t.date).toISOString().split('T')[0];
            const sscRosterForDate = allRosters.find(r => r.date === ticketDate);
            const sscName = sscRosterForDate ? sscRosterForDate.techName : null;
            const sscPhone = sscRosterForDate ? sscRosterForDate.techPhone : null; 

            const isPending = t.status === 'pending' || t.status === 'รอช่างเข้าดำเนินการ';
            const isFixing = ['acknowledged', 'in_progress', 'on_hold'].includes(t.status);
            const isDone = t.status === 'completed' || t.status === 'verified';
            const isCancelled = t.status === 'cancelled';
            const fixingMin = getMinutesDiff(t.startedAt || t.date, sysTime);
            const waitingMin = getMinutesDiff(t.date, sysTime);
            
            const styleColor = isPending ? 'border-rose-500 text-rose-600 bg-rose-50' : isDone ? 'border-emerald-500 text-emerald-600 bg-emerald-50' : isCancelled ? 'border-slate-400 text-slate-500 bg-slate-50' : t.status === 'on_hold' ? 'border-purple-500 text-purple-600 bg-purple-50' : 'border-orange-500 text-orange-600 bg-orange-50';
            
            const statusLabel = isPending ? (t.status === 'รอช่างเข้าดำเนินการ' ? 'รอช่างหลักเข้าซ่อม' : 'รอดำเนินการ') : t.status === 'acknowledged' ? 'รับทราบแล้ว' : t.status === 'in_progress' ? 'กำลังซ่อม' : t.status === 'on_hold' ? 'แจ้งขัดข้อง' : isCancelled ? 'ยกเลิกแล้ว' : t.status === 'verified' ? '✅ เสร็จสิ้นสมบูรณ์' : t.status === 'รอผู้รับผิดชอบยืนยัน' ? '✅ รอช่างหลักยืนยัน' : '⏳ รอผู้แจ้งยืนยัน';

            return (
              <div key={t.dbId || t.id} className={`bg-white rounded-[1rem] md:rounded-[2rem] border-l-[6px] md:border-l-[12px] ${styleColor.split(' ')[0]} overflow-hidden shadow-sm border-t border-r border-b border-2 border-orange-400/70 transition-all ${isCancelled ? 'opacity-70' : ''}`}>
                
                {/* 🌟 1. Header Block 🌟 */}
                <div className="p-5 md:p-8 md:px-10 border-b border-slate-100 bg-slate-50/50">
                  <div className="flex justify-between items-start mb-4 md:mb-6">
                    <div className="flex items-center">
                      <span className="text-[12px] md:text-[24px] font-mono text-emerald-600 bg-emerald-100 px-3 py-1 md:px-5 md:py-2 rounded-lg md:rounded-xl font-black tracking-widest border border-emerald-200 shadow-sm">{String(t.id)}</span>
                      {t.isOutOfHours && <span className="ml-2 md:ml-4 text-[10px] md:text-[24px] font-black text-rose-600 bg-rose-100 border border-rose-200 px-2 py-0.5 md:px-4 md:py-1.5 rounded-md md:rounded-xl animate-pulse">วันหยุด</span>}
                    </div>
                    <div className={`px-3 py-1 md:px-6 md:py-3 rounded-lg md:rounded-2xl text-[13px] md:text-[26px] font-bold border border-2 border-solid shadow-sm flex items-center gap-1.5 md:gap-3 ${styleColor}`}>
                      {isPending && <div className="w-1.5 h-1.5 md:w-3 md:h-3 rounded-full bg-rose-500 animate-pulse"></div>}
                      {statusLabel}
                    </div>
                  </div>

                  {t.status === 'verified' && t.rating && (() => {
                    const rColor = t.rating === 5 ? { text: 'text-emerald-400', border: 'border-emerald-500', glow: 'shadow-[0_0_25px_rgba(16,185,129,0.4)]', flare: 'bg-emerald-500', starFill: '#34d399' } : t.rating === 4 ? { text: 'text-cyan-400', border: 'border-cyan-500', glow: 'shadow-[0_0_25px_rgba(34,211,238,0.4)]', flare: 'bg-cyan-500', starFill: '#22d3ee' } : t.rating === 3 ? { text: 'text-yellow-400', border: 'border-yellow-500', glow: 'shadow-[0_0_25px_rgba(250,204,21,0.4)]', flare: 'bg-yellow-500', starFill: '#facc15' } : t.rating === 2 ? { text: 'text-orange-400', border: 'border-orange-500', glow: 'shadow-[0_0_25px_rgba(249,115,22,0.4)]', flare: 'bg-orange-500', starFill: '#fb923c' } : { text: 'text-rose-400', border: 'border-rose-500', glow: 'shadow-[0_0_25px_rgba(225,29,72,0.4)]', flare: 'bg-rose-500', starFill: '#fb7185' };
                    return (
                      <div className="mt-3 mb-5 md:mt-6 md:mb-8 animate-in slide-in-from-top-2 duration-500 relative z-10 w-full flex flex-col items-center gap-4 md:gap-5">
                        <div className={`relative bg-slate-900 border-[3px] border-solid ${rColor.border} rounded-xl md:rounded-[1rem] p-4 md:p-6 ${rColor.glow} overflow-hidden flex flex-row items-center justify-between w-full`}>
                          <div className={`absolute inset-0 m-auto w-[150%] h-[150%] rounded-full blur-[50px] md:blur-[70px] opacity-20 pointer-events-none z-0 ${rColor.flare}`}></div>
                          <span className={`text-[15px] sm:text-[16px] md:text-[22px] font-black ${rColor.text} uppercase tracking-widest ml-1 relative z-10 drop-shadow-md shrink-0`}>
                            {currentUserRole === 'reporter' ? 'คุณให้คะแนนงานนี้:' : 'คุณได้คะแนนงานนี้:'}
                          </span>
                          <div className="flex gap-1.5 md:gap-3 relative z-10 shrink-0">
                            {[1, 2, 3, 4, 5].map((s) => (<Star key={s} className={`w-[18px] h-[18px] sm:w-5 sm:h-5 md:w-8 md:h-8 transition-all duration-300 ${t.rating >= s ? `${rColor.text} drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] scale-110` : 'text-slate-700/50'}`} fill={t.rating >= s ? rColor.starFill : "none"} stroke={t.rating >= s ? "none" : "#475569"} strokeWidth={t.rating >= s ? 0 : 2} />))}
                          </div>
                        </div>
                       {(t.ratingComment || (t.ratingTags && t.ratingTags.length > 0)) && (
                          <div className={`relative bg-slate-900 border-[3px] border-dashed ${rColor.border} rounded-xl md:rounded-[1rem] p-5 md:p-6 w-full text-left mb-2 md:mb-4 ${rColor.glow} overflow-hidden mt-2 md:mt-4`}>
                            <div className={`absolute inset-0 m-auto w-[150%] h-[150%] rounded-full blur-[50px] md:blur-[70px] opacity-20 pointer-events-none z-0 ${rColor.flare}`}></div>
                            <div className="relative z-10 flex flex-col gap-3 md:gap-4">
                              <span className={`block text-[16px] md:text-[24px] font-black uppercase tracking-widest ${rColor.text} drop-shadow-md`}>💬 สิ่งที่ประทับใจ / ข้อเสนอแนะ:</span>
                              
                              {/* ส่วนแสดง Tags */}
                              {t.ratingTags && t.ratingTags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-1">
                                  {t.ratingTags.map((tag, i) => (
                                    <span key={i} className={`text-[12px] md:text-[16px] font-bold px-3 py-1.5 rounded-full border border-current ${rColor.text} bg-slate-800/80 shadow-sm`}>
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}

                              {/* ส่วนแสดงข้อความ */}
                              {t.ratingComment && (
                                <p className={`text-white text-[14px] md:text-[20px] font-bold leading-relaxed drop-shadow-sm ${(t.ratingTags && t.ratingTags.length > 0) ? 'border-t-[1.5px] border-dashed border-slate-700/80 pt-3 md:pt-4 mt-1' : ''}`}>
                                  "{String(t.ratingComment)}"
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                        {currentUserRole === 'reporter' && (
                          <div className={`relative bg-slate-900 border-[3px] border-solid ${rColor.border} rounded-xl md:rounded-[1rem] p-5 md:p-6 ${rColor.glow} overflow-hidden flex flex-col items-center justify-center text-center w-full`}>
                            <div className={`absolute inset-0 m-auto w-[150%] h-[150%] rounded-full blur-[60px] md:blur-[80px] opacity-20 pointer-events-none z-0 ${rColor.flare}`}></div>
                            <ShieldCheck className={`w-10 h-10 md:w-14 md:h-14 ${rColor.text} shrink-0 drop-shadow-[0_0_12px_rgba(255,255,255,0.3)] mb-3 relative z-10`} />
                            <div className="space-y-1 md:space-y-2 relative z-10">
                              <h4 className={`${rColor.text} font-black text-[16px] md:text-[20px] drop-shadow-sm`}>ฝ่ายวิศวกรรมระบบปฏิบัติการดาวเทียม (ฝวด.)</h4>
                              <p className="text-white text-[14px] md:text-[18px] font-bold leading-relaxed px-2 md:px-6">ขอบพระคุณสำหรับทุกคะแนนประเมินและเสียงสะท้อน เราจะนำไปพัฒนาและยกระดับมาตรฐานการบริการให้ดียิ่งขึ้นต่อไป</p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  <h3 className={`text-lg md:text-[34px] font-black mb-1.5 md:mb-4 leading-tight ${isCancelled ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                    {String(t.equipment)}
                  </h3>

                  <div className="flex flex-col gap-1 md:gap-3 mt-4 bg-indigo-50/50 p-3 px-4 md:p-6 md:px-8 rounded-xl md:rounded-2xl border-2 border-solid border-indigo-500">
                    <div className="flex items-start gap-1.5 md:gap-3 text-orange-600/90">
                      <Building className="w-[18px] h-[18px] md:w-8 md:h-8 shrink-0 mt-0.5 md:mt-0" />
                      <span className="text-[18px] md:text-[28px] font-bold leading-snug">{t.building || 'ไม่ระบุอาคาร'}</span>
                    </div>
                    <div className="flex items-start gap-1.5 md:gap-3 text-indigo-500/90">
                      <MapPin className="w-[18px] h-[18px] md:w-8 md:h-8 shrink-0 mt-0.5 md:mt-0" />
                      <span className="text-[15px] md:text-[24px] font-bold leading-snug">ห้อง: {t.room || 'ไม่ระบุห้อง'}</span>
                    </div>
                  </div>

                  {!isCancelled && (
                    <div className="w-full mt-2 md:mt-4 border-[1.5px] border-2 border-solid border-orange-600 rounded-2xl md:rounded-[1rem] p-5 md:p-8 bg-orange-200/30 shadow-sm flex flex-col gap-4 md:gap-6 relative">
                      <div className="flex justify-between items-center pl-1 md:pl-4">
                        <div className="flex items-center gap-3 md:gap-4">
                          <Clock className={`w-5 h-5 md:w-6 md:h-6 ${isPending ? 'text-rose-500 animate-pulse' : 'text-slate-500'}`} />
                          <span className={`text-[13px] md:text-[22px] font-black ${isPending ? 'text-rose-600' : 'text-slate-400'}`}>เวลารอดำเนินการ</span>
                        </div>
                        <span className={`text-[13px] md:text-[24px] font-bold font-mono tracking-tighter ${isPending ? 'text-rose-600' : 'text-slate-400'}`}>
                          {getLiveStopwatch(t.date, t.acceptedAt, sysTime)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pl-1 md:pl-4">
                        <div className="flex items-center gap-3 md:gap-4">
                          <Clock className={`w-5 h-5 md:w-6 md:h-6 ${isFixing && t.status !== 'on_hold' ? 'text-orange-600 animate-pulse' : 'text-slate-500'}`} />
                          <span className={`text-[13px] md:text-[22px] font-black ${isFixing && t.status !== 'on_hold' ? 'text-orange-500' : 'text-slate-400'}`}>เวลาปฏิบัติงาน</span>
                        </div>
                        <span className={`text-[13px] md:text-[24px] font-bold font-mono tracking-tighter ${isFixing && t.status !== 'on_hold' ? 'text-orange-600' : 'text-slate-400'}`}>
                          {t.startedAt ? getLiveStopwatch(t.startedAt, t.completedAt, sysTime, t.totalPauseMs || 0, t.status === 'on_hold', t.lastHoldAt) : '00:00:00'}
                        </span>
                      </div>
                      {(() => {
                        const currentHoldMs = t.status === 'on_hold' && t.lastHoldAt ? sysTime.getTime() - new Date(t.lastHoldAt).getTime() : 0;
                        const totalHoldMs = (t.totalPauseMs || 0) + currentHoldMs;
                        if (totalHoldMs > 0) {
                          const isHolding = t.status === 'on_hold';
                          const hrs = Math.floor(totalHoldMs / 3600000);
                          const days = Math.floor(hrs / 24);
                          const remainHrs = hrs % 24;
                          const mins = Math.floor((totalHoldMs % 3600000) / 60000);
                          const secs = Math.floor((totalHoldMs % 60000) / 1000);
                          const timeStr = `${String(remainHrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
                          const displayTime = days > 0 ? `${days} วัน ${timeStr}` : timeStr;
                          return (
                            <div className="flex justify-between items-center pl-1 md:pl-4">
                              <div className="flex items-center gap-3 md:gap-4">
                                <Clock className={`w-5 h-5 md:w-6 md:h-6 ${isHolding ? 'text-purple-600 animate-pulse' : 'text-slate-500'}`} />
                                <span className={`text-[13px] md:text-[22px] font-black ${isHolding ? 'text-purple-600' : 'text-slate-400'}`}>เวลาเหตุขัดข้อง</span>
                              </div>
                              <span className={`text-[13px] md:text-[24px] font-bold font-mono tracking-tighter ${isHolding ? 'text-purple-600' : 'text-slate-400'}`}>{displayTime}</span>
                            </div>
                          );
                        }
                        return null;
                      })()}
                      <div className="flex justify-between items-center pl-1 md:pl-4">
                        <div className="flex items-center gap-3 md:gap-4">
                          <Clock className={`w-5 h-5 md:w-6 md:h-6 ${isDone ? 'text-emerald-600' : 'text-slate-500'}`} />
                          <span className={`text-[13px] md:text-[22px] font-black ${isDone ? 'text-emerald-500' : 'text-slate-400'}`}>เวลารวมทั้งหมด</span>
                        </div>
                        <span className={`text-[13px] md:text-[24px] font-bold font-mono tracking-tighter ${isDone ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {getLiveStopwatch(t.date, t.completedAt, sysTime, t.totalPauseMs || 0, t.status === 'on_hold', t.lastHoldAt)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 🌟 2. Body Block 🌟 */}
                <div className="px-5 md:px-10 pb-5 md:pb-10 pt-2 flex flex-col w-full relative z-10">
                  
                  {/* Cancel Reason */}
                  {t.status === 'cancelled' && t.cancelReason && (
                    <div className="bg-rose-100/70 border-l-[4px] border-2 border-solid border-rose-600 rounded-xl md:rounded-2xl p-3 md:p-5 flex gap-3 md:gap-4 w-full mt-4 md:mt-6">
                      <XCircle className="w-5 h-5 md:w-8 md:h-8 shrink-0 mt-0.5 text-rose-600" />
                      <div className="w-full">
                        <span className="block mb-1 text-rose-600/80 text-[16px] md:text-[22px] font-bold uppercase">เหตุผลที่ยกเลิก:</span>
                        <span className="text-[16px] md:text-[26px] text-rose-900 font-bold">{String(t.cancelReason)}</span>
                      </div>
                    </div>
                  )}

                  {/* History Log */}
                  {t.historyLog && t.historyLog.length > 0 && (
                    <div className="flex flex-col w-full gap-4 md:gap-6 mt-6">
                      {t.historyLog.map((log, index) => {
                        if (log.type !== 'hold' && log.type !== 'resume') return null;
                        if (!log.timestamp) return null;

                        const isHold = log.type === 'hold';
                        const holdCount = t.historyLog.slice(0, index + 1).filter(l => l.type === 'hold').length;
                        const resumeCount = t.historyLog.slice(0, index + 1).filter(l => l.type === 'resume').length;
                        const displayCount = isHold ? holdCount : resumeCount;
                        const currentTime = index < t.historyLog.length - 1 ? new Date(t.historyLog[index + 1].timestamp).getTime() : new Date().getTime();
                        const startTime = new Date(log.timestamp).getTime();
                        const durationMs = Math.max(0, currentTime - startTime);
                        const pad = (num) => String(num).padStart(2, '0');
                        const hours = Math.floor(durationMs / 3600000);
                        const minutes = Math.floor((durationMs % 3600000) / 60000);
                        const seconds = Math.floor((durationMs % 60000) / 1000);
                        const formattedTime = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
                        const eventDate = new Date(log.timestamp);
                        const eventDateString = `${eventDate.getDate()} ${['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'][eventDate.getMonth()]} ${eventDate.getFullYear() + 543}`;
                        const eventTimeString = `${pad(eventDate.getHours())}:${pad(eventDate.getMinutes())} น.`;

                        return (
                          <div key={index} className={`w-full rounded-2xl md:rounded-[2rem] border-[2px] border-solid overflow-hidden ${isHold ? 'bg-purple-50 border-purple-400' : 'bg-orange-50 border-orange-400'}`}>
                            <div className="p-4 md:p-6 flex items-center gap-3">
                              {isHold ? <PauseCircle className="w-6 h-6 md:w-8 md:h-8 text-purple-600" /> : <Wrench className="w-6 h-6 md:w-8 md:h-8 text-orange-600" />}
                              <span className={`font-black text-[15px] md:text-[22px] uppercase tracking-wider ${isHold ? 'text-purple-800' : 'text-orange-800'}`}>
                                {isHold ? 'แจ้งเหตุขัดข้อง' : 'ดำเนินการต่อ'}
                              </span>
                            </div>
                            <div className="px-4 md:px-6 pb-2 md:pb-4">
                              <p className="font-bold text-[16px] md:text-[24px] text-emerald-600 leading-snug">{String(log.reason)}</p>
                            </div>
                            {log.attachments && log.attachments.length > 0 && (
                              <div className="px-4 md:px-6 pb-4 md:pb-6 w-full">
                                <label className={`text-[13px] md:text-[16px] font-black flex items-center gap-1.5 mb-2 ${isHold ? 'text-purple-700' : 'text-orange-700'}`}>
                                  <Camera className={`w-6 h6 md:w-8 md:h-8 ${isHold ? 'text-purple-600' : 'text-orange-600'}`} /> 
                                  {isHold ? 'ภาพหลักฐานเหตุขัดข้อง:' : 'ภาพหลักฐานอะไหล่/ดำเนินการต่อ:'}
                                </label>
                                <div className="flex flex-wrap gap-2 pb-2 w-full">
                                  {log.attachments.map((url, idx) => (
                                    <div key={`timeline-img-${index}-${idx}`} className={`relative w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-lg overflow-hidden border shadow-sm cursor-pointer hover:scale-105 transition-all ${isHold ? 'border-purple-300' : 'border-orange-300'}`} onClick={(e) => { e.stopPropagation(); setLightboxImg(url); }}>
                                      {url.includes('video') || url.includes('.mp4') ? (
                                        <><video src={url} className="w-full h-full object-cover opacity-80" /><div className="absolute inset-0 flex items-center justify-center bg-black/30"><svg viewBox="0 0 24 24" fill="white" className="w-8 h-8 drop-shadow-md"><path d="M5 3l14 9-14 9V3z" /></svg></div></>
                                      ) : ( <img src={url} className="w-full h-full object-cover" /> )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            <div className={`px-4 md:px-6 py-4 md:py-5 border-t-[1.5px] border-dashed ${isHold ? 'border-purple-400' : 'border-orange-400'} bg-white/50 flex justify-between items-center gap-2`}>
                                <div className="flex flex-col gap-1 md:gap-2">
                                  <span className={`text-[15px] md:text-[22px] font-black opacity-90 uppercase tracking-widest ${isHold ? 'text-purple-700' : 'text-orange-700'}`}>
                                    {isHold ? `ระยะเวลาที่หยุด (ครั้งที่ ${displayCount})` : `ระยะเวลาที่ซ่อม (ครั้งที่ ${displayCount})`}
                                  </span>
                                  <div className={`text-[13px] md:text-[20px] font-bold flex items-center gap-1.5 opacity-80 ${isHold ? 'text-purple-800' : 'text-orange-800'}`}>
                                    <Clock className="w-4 h-4 md:w-5 md:h-5" /> บันทึกเมื่อ: {eventDateString} | {eventTimeString}
                                  </div>
                                </div>
                                <span className={`font-mono font-black text-[16px] md:text-[24px] px-4 py-2 md:px-6 md:py-2.5 rounded-xl border-[2px] border-solid shadow-sm tracking-widest shrink-0 ${isHold ? 'bg-purple-600 text-white border-purple-400' : 'bg-orange-600 text-white border-orange-400'}`}>
                                  {formattedTime}
                                </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Images & Videos */}
                  {( (t.images && t.images.length > 0) || (t.videos && t.videos.length > 0) ) && (
                    <div className="bg-slate-100 border-2 border-solid border-emerald-500 p-4 md:p-6 rounded-2xl md:rounded-[1.5rem] shadow-sm w-full mt-4 md:mt-6">
                      <span className="text-[14px] md:text-[22px] font-black text-rose-700 mb-3 md:mb-4 flex items-center gap-2">📸 ภาพประกอบและวิดีโอการแจ้งซ่อม:</span>
                      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 md:gap-3 mt-2">
                        {t.images && t.images.map((img, i) => (
                          <img key={`img-${i}`} src={img} alt={`ภาพประกอบ ${i+1}`} className="rounded-lg md:rounded-xl w-full aspect-square object-cover border border-slate-300 shadow-sm hover:scale-110 transition-transform cursor-pointer" onClick={() => setLightboxImg(img)} />
                        ))}
                        {t.videos && t.videos.map((vid, i) => (
                          <div key={`main-vid-${i}`} className="relative rounded-lg md:rounded-xl w-full aspect-square overflow-hidden border border-slate-300 shadow-sm bg-slate-900 group">
                            <video src={vid} className="w-full h-full object-cover opacity-90 transition-opacity group-hover:opacity-100" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/20 transition-colors z-10 cursor-pointer" onClick={() => setLightboxImg(vid)}>
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-12 h-12 md:w-16 md:h-16 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] hover:scale-110 transition-transform ml-1 md:ml-1.5"><path d="M5 3l14 9-14 9V3z" /></svg>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Description & Asset */}
                  <div className="bg-orange-100/70 border-l-[4px] border-2 border-solid border-indigo-600 rounded-xl md:rounded-2xl p-3 md:p-5 flex gap-3 md:gap-4 w-full mt-4 md:mt-6">
                    <div className="mb-2 md:mb-4">
                      <span className="text-[13px] md:text-[22px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1.5 md:gap-3">
                        <AlertCircle className="w-3 h-3 md:w-6 md:h-6 text-rose-600" /> รายละเอียดอาการเสีย:
                      </span>
                      <p className={`text-[14px] md:text-[26px] font-black mt-1.5 md:mt-3 leading-relaxed pl-1 md:pl-2 ${isCancelled ? 'text-slate-400 line-through' : 'text-rose-600 drop-shadow-sm'}`}>
                        "{String(t.description)}"
                      </p>
                    </div>
                    {t.assetNumber && (
                      <div className="mt-3 md:mt-5 pt-3 md:pt-5 border-t border-slate-200">
                        <p className="text-[12px] md:text-[20px] text-slate-500 font-mono mt-0 mb-0">
                          <span className="font-bold text-slate-400">Asset No:</span> {t.assetNumber}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Team Info Container */}
                  <div className="flex flex-col gap-4 md:gap-6 mt-6 w-full">
                    
                    {/* Reporter */}
                    <div className="bg-emerald-50/40 border-2 border-solid border-emerald-400 p-4 md:p-6 rounded-2xl md:rounded-[1.5rem] shadow-sm flex flex-col w-full transition-all hover:shadow-md">
                      <span className="text-[16px] md:text-[20px] font-black text-emerald-700 mb-2 md:mb-4 flex items-center gap-1.5 md:gap-2 uppercase tracking-wider">
                        <User className="w-4 h-4 md:w-5 md:h-5" /> ผู้แจ้งปัญหา
                      </span>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-black text-emerald-950 flex items-center gap-2 text-[16px] md:text-[28px]">{String(t.reporter)}</span>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center justify-between mt-auto pt-3 border-t-[1.5px] border-dashed border-emerald-400/50 gap-3">
                        <span className="text-[16px] md:text-[22px] font-bold text-blue-600 flex items-center gap-1.5">
                          <Clock className="w-3 h-3 md:w-4 md:h-4 text-emerald-600" />
                          {(() => {
                            const d = new Date(t.date);
                            return isNaN(d.getTime()) ? '' : `${d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })} | ${d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} น.`;
                          })()}
                        </span>
                        <a href={`tel:${String(t.reporterContact).replace(/\D/g, '')}`} className="font-mono text-[16px] md:text-[22px] font-bold bg-emerald-100 px-3 py-1.5 rounded-lg text-emerald-800 border border-emerald-300 shadow-sm hover:bg-emerald-200 transition-colors flex items-center gap-1.5 active:scale-95 w-fit md:w-auto">
                          <Phone className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />{formatDisplayPhone(t.reporterContact)}
                        </a>
                      </div>
                    </div>

                    {/* Primary Tech */}
                    <div className="bg-orange-50/40 border-2 border-solid border-orange-400 p-4 md:p-6 rounded-2xl md:rounded-[1.5rem] shadow-sm flex flex-col w-full transition-all hover:shadow-md">
                      <span className="text-[16px] md:text-[20px] font-black text-orange-600 mb-2 md:mb-4 flex items-center gap-1.5 md:gap-2 uppercase tracking-wider">
                        <Wrench className="w-5 h-5 md:w-6 md:h-6" /> ผู้รับผิดชอบหลัก
                      </span>
                      <div className="flex flex-col mb-3">
                        <span className="font-black text-orange-950 flex items-center gap-2 text-[16px] md:text-[28px]">
                          {t.techName && t.techName !== 'รอเจ้าหน้าที่รับงาน' ? String(t.techName) : "ทีมช่าง ฝวด."}
                        </span>
                        {t.equipmentCategory && (
                          <span className="text-[15px] md:text-[18px] font-bold text-orange-700/80 mt-1 md:mt-2">ผู้รับผิดชอบ: {t.equipmentCategory}</span>
                        )}
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center justify-between mt-auto pt-3 border-t-[1.5px] border-dashed border-orange-400/50 gap-3">
                        {t.acceptedAt ? (
                          <div className="flex items-center gap-1.5 md:gap-2 flex-wrap">
                            <span className="text-[14px] md:text-[18px] font-bold text-slate-500 flex items-center gap-1.5"><Clock className="w-4 h-4 md:w-5 md:h-5 text-orange-500" /> เวลากดรับงาน:</span>
                            <span className="text-[16px] md:text-[22px] font-black text-blue-600 drop-shadow-sm">
                              {(() => {
                                const d = new Date(t.acceptedAt);
                                return isNaN(d.getTime()) ? '' : `${d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })} | ${d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} น.`;
                              })()}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[14px] md:text-[18px] font-bold text-slate-400 flex items-center gap-1.5 flex-wrap italic"><Clock className="w-4 h-4 md:w-5 md:h-5 text-slate-400 shrink-0" /> รอผู้รับผิดชอบหลักกดรับงาน</span>
                        )}
                        <a href={`tel:${String(t.techPhone || '').replace(/\D/g, '')}`} className="font-mono text-[16px] md:text-[22px] font-bold bg-orange-100 px-3 py-1.5 rounded-lg text-orange-900 border border-orange-300 shadow-sm hover:bg-orange-200 transition-colors flex items-center gap-1.5 active:scale-95 w-fit md:w-auto shrink-0">
                          <Phone className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />{formatDisplayPhone(t.techPhone) || 'ไม่มีเบอร์โทร'}
                        </a>
                      </div>
                    </div>

                    {/* SSC Note */}
                    {t.sscNote && (
                      <div className="bg-blue-50/40 border-2 border-solid border-blue-400 p-4 md:p-6 rounded-2xl md:rounded-[1.5rem] shadow-sm flex flex-col w-full transition-all hover:shadow-md mt-2">
                        <span className="text-[16px] md:text-[20px] font-black text-blue-600 mb-2 md:mb-4 flex items-center gap-1.5 md:gap-2 uppercase tracking-wider">
                          <ShieldAlert className="w-5 h-5 md:w-6 md:h-6" /> บันทึกการแก้ไขเบื้องต้น (เวร SSC)
                        </span>
                        <div className="flex flex-col mb-3">
                          <span className="font-black text-blue-950 flex items-center gap-2 text-[16px] md:text-[28px]">
                            {t.sscTechName || sscName || "เจ้าหน้าที่เวร SSC"}
                          </span>
                          <span className="text-[15px] md:text-[18px] font-bold text-blue-700/80 mt-1 md:mt-2">ผู้ปฏิบัติงาน: นอกเวลาราชการ/วันหยุด</span>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center justify-between mt-auto pt-3 border-t-[1.5px] border-dashed border-blue-400/50 gap-3">
                          <div className="flex items-center gap-1.5 md:gap-2 flex-wrap">
                            <span className="text-[14px] md:text-[18px] font-bold text-slate-500 flex items-center gap-1.5"><Clock className="w-4 h-4 md:w-5 md:h-5 text-blue-500" /> เวลากดรับงาน:</span>
                            <span className="text-[16px] md:text-[22px] font-black text-blue-600 drop-shadow-sm">
                              {(() => {
                                const d = t.updatedAt ? (t.updatedAt.toDate ? t.updatedAt.toDate() : new Date(t.updatedAt)) : new Date(t.date);
                                return isNaN(d.getTime()) ? 'รอเวร SSC บันทึก' : `${d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })} | ${d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} น.`;
                              })()}
                            </span>
                          </div>
                          {(() => {
                             let displaySscPhone = t.sscTechPhone || sscPhone;
                             if (!displaySscPhone || displaySscPhone === '-') {
                               const techInfo = technicianList.find(tech => tech.name === (t.sscTechName || sscName));
                               if (techInfo && techInfo.phone) displaySscPhone = techInfo.phone;
                             }
                             if (displaySscPhone && displaySscPhone !== '-') {
                               return (
                                 <a href={`tel:${String(displaySscPhone).replace(/\D/g, '')}`} className="font-mono text-[16px] md:text-[22px] font-bold bg-blue-100 px-3 py-1.5 rounded-lg text-blue-900 border border-blue-300 shadow-sm hover:bg-blue-200 transition-colors flex items-center gap-1.5 active:scale-95 w-fit md:w-auto shrink-0">
                                   <Phone className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />{formatDisplayPhone(displaySscPhone)}
                                 </a>
                               );
                             }
                             return null;
                          })()}
                        </div>
                        <div className="bg-white/80 border border-blue-200 p-4 md:p-6 rounded-xl shadow-inner mt-4 md:mt-5 relative">
                          <p className="text-[15px] md:text-[22px] font-bold text-blue-900 leading-relaxed whitespace-pre-wrap">
                            "{String(t.sscNote)}"
                          </p>
                          {t.sscAttachments && t.sscAttachments.length > 0 && (
                            <div className="flex gap-2 mt-4 pt-4 border-t-[1.5px] border-dashed border-blue-200 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                              {t.sscAttachments.map((file, idx) => (
                                <div key={`ssc-media-${idx}`} className="relative w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-xl overflow-hidden border-2 border-solid border-blue-300 cursor-pointer hover:scale-105 transition-transform shadow-sm bg-slate-900" onClick={() => setLightboxImg(file)}>
                                  {file.includes('video') || file.includes('.mp4') || file.includes('data:video') ? (
                                    <><video src={file} className="w-full h-full object-cover opacity-80" /><div className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/20 transition-colors z-10"><Video className="w-6 h-6 text-white opacity-80" /></div></>
                                  ) : ( <img src={file} className="w-full h-full object-cover" /> )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div> {/* End Team Info */}

                  {/* Tech Actions */}
                  {(currentUserRole !== 'reporter') && !isCancelled && (
                    <div className="flex flex-col gap-2.5 md:gap-6 mt-4 md:mt-8">
                      {isPending && (
                        <div className="flex flex-col gap-3 w-full animate-in slide-in-from-bottom-2 fade-in">
                          {(() => {
                            const isCommander = currentUserRole === 'Commander';
                            const isPrimary = currentUserName === t.techName;
                            const tDate = new Date(t.date || Date.now());
                            const tDateStr = `${tDate.getFullYear()}-${String(tDate.getMonth() + 1).padStart(2, '0')}-${String(tDate.getDate()).padStart(2, '0')}`;
                            const sscDuty = allRosters.find(r => r.date === tDateStr);
                            const hasSSC = !!(sscDuty && sscDuty.techName && sscDuty.techName.trim() !== '');
                            const sscName = hasSSC ? sscDuty.techName : null;
                            const isSSCToday = hasSSC && (sscName === currentUserName);
                            const isSamePerson = hasSSC && (sscName === t.techName);
                            const hasSscActed = !!t.sscNote; 
                            
                            let showGreen = false; let enableGreen = false; let greenText = "รับงานซ่อม (ในฐานะผู้รับผิดชอบหลัก)";
                            let showOrange = false; let enableOrange = false;

                            if (hasSSC && !isSamePerson) {
                              if (!hasSscActed) {
                                if (isSSCToday || isCommander) { showOrange = true; enableOrange = true; }
                                if (isPrimary || isCommander) { showGreen = true; enableGreen = isCommander; greenText = isCommander ? "รับงานซ่อม (แอดมินข้ามคิว SSC)" : "รอเวร SSC ตรวจสอบเบื้องต้น..."; }
                              } else {
                                if (isPrimary || isCommander) { showGreen = true; enableGreen = true; greenText = "รับงานต่อจากเวร SSC (เริ่มซ่อมจริง)"; }
                              }
                            } else {
                              if (isPrimary || isCommander || (isSamePerson && isSSCToday)) { showGreen = true; enableGreen = true; greenText = "รับงานซ่อม (เริ่มปฏิบัติงาน)"; }
                            }

                            return (
                              <>
                                {showGreen && (
                                  <button disabled={!enableGreen} onClick={() => { setActionModal({ isOpen: true, ticketId: t.id, type: 'accept' }); setSelectedTech(t.techName && t.techName !== 'รอเจ้าหน้าที่รับงาน' ? t.techName : currentUserName); }} className={`w-full font-black text-[16px] md:text-[20px] py-3.5 md:py-4 rounded-xl transition-all flex items-center justify-center gap-2 ${enableGreen ? 'bg-emerald-600/90 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)] active:scale-95' : 'bg-slate-800 border-2 border-dashed border-slate-600 text-slate-500 cursor-not-allowed grayscale'}`}>
                                    <Wrench className="w-5 h-5 md:w-6 md:h-6" /> {greenText}
                                  </button>
                                )}
                                {showOrange && (
                                  <button disabled={!enableOrange} onClick={() => setActionModal({ isOpen: true, ticketId: t.id, type: 'ssc' })} className={`w-full font-black text-[16px] md:text-[20px] py-3.5 md:py-4 rounded-xl transition-all flex items-center justify-center gap-2 ${enableOrange ? 'bg-orange-500/90 hover:bg-orange-400 text-white shadow-[0_0_15px_rgba(249,115,22,0.4)] active:scale-95' : 'bg-slate-800 border-2 border-dashed border-orange-900/50 text-orange-800/50 cursor-not-allowed grayscale'}`}>
                                    <ShieldAlert className="w-5 h-5 md:w-6 md:h-6" /> บันทึกการแก้ไขเบื้องต้น (ในฐานะเวร SSC)
                                  </button>
                                )}
                                {!showGreen && !showOrange && (
                                  <div className="w-full bg-slate-800/80 text-slate-400 font-bold text-[14px] md:text-[16px] text-center py-3.5 rounded-xl border border-dashed border-slate-600 shadow-inner">🔒 เฉพาะผู้รับผิดชอบที่กำหนดเท่านั้น</div>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      )}

                      {t.status === 'acknowledged' && (
                        <button onClick={() => updateTicketStatus(t.id, { status: 'in_progress', startedAt: new Date().toISOString() })} className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border border-emerald-400 font-bold py-3.5 md:py-6 rounded-xl md:rounded-3xl shadow-[0_0_15px_rgba(16,185,129,0.4)] active:scale-95 transition-all text-[15px] md:text-[28px] hover:shadow-[0_0_25px_rgba(16,185,129,0.8)] hover:brightness-110 hover:-translate-y-1">เริ่มดำเนินการซ่อม</button>
                      )}

                      {(t.status === 'in_progress' || t.status === 'on_hold' || t.status === 'รอผู้รับผิดชอบยืนยัน') && (
                        <div className="flex gap-2.5 md:gap-6 w-full flex-col sm:flex-row">
                          {(t.status === 'in_progress' || t.status === 'on_hold') && (
                            <button onClick={() => { if (t.status === 'on_hold') { setActionModal({ isOpen: true, ticketId: t.id, type: 'resume' }); } else { setActionModal({ isOpen: true, ticketId: t.id, type: 'hold' }); } }} className="flex-1 bg-gradient-to-r from-orange-400 to-orange-500 text-white border border-orange-300 font-bold py-3.5 md:py-6 rounded-xl md:rounded-3xl shadow-[0_0_15px_rgba(249,115,22,0.4)] active:scale-95 transition-all text-[18px] md:text-[30px] hover:shadow-[0_0_25px_rgba(249,115,22,0.8)] hover:brightness-110 hover:-translate-y-1">
                              {t.status === 'on_hold' ? 'ดำเนินการต่อ' : 'แจ้งขัดข้อง'}
                            </button>
                          )}
                          {t.status !== 'on_hold' && (
                            (t.status !== 'รอผู้รับผิดชอบยืนยัน' || currentUserName === t.techName || currentUserRole === 'Commander') ? (
                              <button onClick={() => setActionModal({ isOpen: true, ticketId: t.id, type: 'finish' })} className="flex-[1.5] w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border border-emerald-400 font-bold py-3.5 md:py-6 rounded-xl md:rounded-3xl shadow-[0_0_15px_rgba(16,185,129,0.4)] active:scale-95 transition-all text-[15px] md:text-[26px] hover:shadow-[0_0_25px_rgba(16,185,129,0.8)] hover:brightness-110 hover:-translate-y-1">
                                {t.status === 'รอผู้รับผิดชอบยืนยัน' ? '✅ ยืนยันการปิดงาน' : 'ปิดงานซ่อม'}
                              </button>
                            ) : (
                              <div className="flex-[1.5] w-full bg-slate-800/80 text-emerald-400/50 font-bold text-[14px] md:text-[20px] text-center py-3.5 md:py-6 rounded-xl md:rounded-3xl border border-dashed border-emerald-900/50 shadow-inner flex items-center justify-center">🔒 รอช่างหลักยืนยันปิดงาน</div>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Reporter Actions */}
                  {currentUserRole === 'reporter' && !isCancelled && (
                    <div className="flex flex-col gap-2.5 md:gap-6 mt-4 md:mt-8">
                      {isPending && (
                        <div className="flex flex-col gap-2.5 md:gap-6">
                          {waitingMin > 60 && <div className="bg-green-600/20 border-2 border-solid border-rose-500 text-rose-600 text-[14px] md:text-[22px] font-bold px-4 py-2.5 md:py-5 rounded-xl md:rounded-2xl flex items-center gap-2 md:gap-4 mb-1 md:mb-3"><AlertTriangle className="w-[15px] h-[15px] md:w-8 md:h-8 animate-pulse shrink-0" /> รอดำเนินการเกิน 1 ชั่วโมง (SLA Breach)</div>}
                          <div className="flex gap-2 md:gap-5">
                            <button onClick={() => setActionModal({ isOpen: true, ticketId: t.id, type: 'cancel' })} className="flex-[1] bg-orange text-rose-500 border-2 border-solid border-orange-500 font-bold py-3.5 md:py-6 rounded-xl md:rounded-3xl flex justify-center items-center gap-1.5 md:gap-3 active:scale-95 text-[18px] md:text-[28px] transition-colors shadow-sm hover:bg-rose-50"><XCircle className="w-[22px] h-[22px] md:w-9 md:h-9" /> ยกเลิก</button>
                            <a href="tel:0835293836" className="flex-[1.5] bg-gradient-to-r from-orange-500 to-amber-500 text-white border-2 border-solid border-white/50 font-black py-4 md:py-6 rounded-2xl md:rounded-[2rem] flex justify-center items-center gap-1.5 sm:gap-2 md:gap-4 shadow-[0_0_15px_rgba(249,115,22,0.4)] active:scale-95 transition-all text-[16px] sm:text-[18px] md:text-[28px] tracking-wide whitespace-nowrap hover:shadow-[0_0_25px_rgba(249,115,22,0.8)]"><PhoneCall className="w-6 h-6 md:w-10 md:h-10 animate-pulse shrink-0" /> สายด่วน หน.ฝวด.</a>
                          </div>
                        </div>
                      )}
                      {t.status === 'in_progress' && fixingMin > 5 * 24 * 60 && (
                        <div className="flex flex-col gap-2 md:gap-6 mt-1 md:mt-3">
                          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[13px] md:text-[22px] font-bold px-4 py-2.5 md:py-5 rounded-xl md:rounded-2xl flex items-center gap-2 md:gap-4"><AlertTriangle className="w-[14px] h-[14px] md:w-8 md:h-8 animate-pulse shrink-0" /> ดำเนินการซ่อมเกินกำหนด 5 วัน (SLA Breach)</div>
                          <a href="tel:0835293836" className="flex-[1.5] bg-gradient-to-r from-rose-600 to-red-700 text-white border-2 border-solid border-white/50 font-black py-4 md:py-8 rounded-2xl md:rounded-[2rem] flex justify-center items-center gap-1.5 sm:gap-2 md:gap-4 shadow-[0_0_15px_rgba(225,29,72,0.4)] active:scale-95 transition-all text-[13px] sm:text-[15px] md:text-[30px] tracking-wide whitespace-nowrap hover:shadow-[0_0_25px_rgba(225,29,72,0.8)]"><PhoneCall className="w-6 h-6 md:w-10 md:h-10 animate-pulse shrink-0" /> สายด่วน หน.ฝวด. (กรณีล่าช้า)</a>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Completed Box */}
                  {['completed', 'verified'].includes(t.status) && (
                    <div className="relative bg-gradient-to-b from-emerald-50 to-white backdrop-blur-xl border-[2px] border-solid border-emerald-400/80 rounded-[1.5rem] p-5 md:p-8 shadow-[0_10px_30px_rgba(16,185,129,0.15)] overflow-hidden mt-6 w-full">
                      <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-400/20 rounded-full blur-[60px] pointer-events-none z-0"></div>
                      <div className="relative z-10 space-y-6 md:space-y-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b-2 border-dashed border-emerald-200">
                          <div className="flex items-center gap-3 md:gap-4">
                            <div className="bg-white border-[2px] border-solid border-emerald-400 p-2.5 md:p-3 rounded-xl shadow-[0_5px_15px_rgba(16,185,129,0.2)] shrink-0"><CheckCircle className="text-emerald-500 w-6 h-6 md:w-8 md:h-8" strokeWidth={2.5} /></div>
                            <div><h3 className="text-[18px] md:text-[24px] font-black text-emerald-800 drop-shadow-sm tracking-wide">ดำเนินการแก้ไขเสร็จสิ้นเรียบร้อย</h3></div>
                          </div>
                          {t.completedAt && (
                            <div className="bg-white border border-emerald-200 px-4 py-2.5 rounded-xl flex items-center gap-2.5 text-emerald-700 shadow-sm self-start md:self-center font-mono"><Clock className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" /><span className="text-[13px] md:text-[16px] font-black tracking-wider">ปิดงานเมื่อ: {formatDateTimeString(t.completedAt)}</span></div>
                          )}
                        </div>
                        {t.cause && (
                          <div className="space-y-2"><h4 className="text-emerald-700 font-black text-[14px] md:text-[16px] tracking-widest uppercase flex items-center gap-2">สรุปผลการซ่อมและข้อแนะนำ</h4><div className="w-full bg-white border border-emerald-200 rounded-xl p-4 md:p-5 text-slate-700 text-[15px] md:text-[17px] font-bold leading-relaxed shadow-sm">"{String(t.cause)}"</div></div>
                        )}
                        {t.finishAttachments && t.finishAttachments.length > 0 && (
                          <div className="space-y-3">
                            <h4 className="text-emerald-700 font-black text-[14px] md:text-[16px] tracking-widest uppercase flex items-center gap-2"><span className="text-base">📸</span> ภาพถ่ายหลักฐานหลังเสร็จสิ้นภารกิจ</h4>
                            <div className="flex flex-wrap gap-3 md:gap-4">
                              {t.finishAttachments.map((url, idx) => (
                                <div key={`finish-${idx}`} className="relative w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-xl overflow-hidden border-2 border-emerald-300 hover:border-emerald-500 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 group cursor-pointer" onClick={() => setLightboxImg(url)}>
                                  {url.includes('video') || url.includes('.mp4') ? ( <><video src={url} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" /><div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors"><svg viewBox="0 0 24 24" fill="white" className="w-8 h-8 drop-shadow-md"><path d="M5 3l14 9-14 9V3z" /></svg></div></> ) : ( <img src={url} className="w-full h-full object-cover group-hover:brightness-105 transition-all" /> )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {t.helpers && t.helpers.length > 0 && (
                          <div className="pt-5 border-t border-emerald-200">
                            <h4 className="text-emerald-700 font-black text-[14px] md:text-[16px] mb-3.5 flex items-center gap-2 tracking-wider"><span className="text-base">🤝</span> ทีมสนับสนุน / ผู้ร่วมดำเนินการในภารกิจนี้</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {t.helpers.map((helper, idx) => (
                                <div key={idx} className="bg-white border border-emerald-200 rounded-xl p-3 flex items-center gap-3.5 hover:border-emerald-400 hover:shadow-md transition-all duration-300 shadow-sm">
                                  <div className="w-9 h-9 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center shrink-0"><User size={16} className="text-emerald-600" /></div>
                                  <div className="overflow-hidden"><p className="text-emerald-900 font-black text-[13px] md:text-[14px] truncate">{helper.name}</p><p className="text-emerald-600/80 font-bold text-[10px] md:text-[11px] truncate mt-0.5 tracking-wide">{helper.position} <span className="text-emerald-300 mx-1">|</span> {helper.department}</p></div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Final Actions */}
                  <div className="w-full mt-4 md:mt-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
                    
                    {/* ของช่าง/แอดมิน */}
                    {(currentUserRole !== 'reporter') && !isCancelled && (t.status === 'completed' || t.status === 'verified') && (
                      <div className="w-full">
                        {t.status === 'verified' ? (
                          <div className="w-full bg-emerald-50 border-2 border-emerald-400 text-emerald-700 font-black text-[16px] md:text-[24px] text-center py-3.5 md:py-6 rounded-xl md:rounded-3xl shadow-sm flex items-center justify-center gap-2 cursor-default"><CheckCircle className="w-[18px] h-[18px] md:w-8 md:h-8" /> ปิดงานซ่อม (เสร็จสิ้นสมบูรณ์)</div>
                        ) : (
                          <button onClick={() => updateTicketStatus(t.id, { status: 'in_progress', completedAt: null, cause: null })} className="w-full bg-orange-100 text-orange-800 border-2 border-solid border-orange-400 font-bold py-3.5 md:py-6 rounded-xl md:rounded-3xl hover:bg-orange-200 hover:text-orange-900 active:scale-95 transition-all text-[15px] md:text-[24px] shadow-sm flex justify-center items-center gap-2 md:gap-4 hover:shadow-[0_0_15px_rgba(249,115,22,0.4)]"><RotateCcw className="w-[18px] h-[18px] md:w-8 md:h-8 animate-spin-slow" /> ดึงงานกลับมาแก้ไข</button>
                        )}
                      </div>
                    )}

                    {/* ของผู้แจ้งซ่อม */}
                    {currentUserRole === 'reporter' && !isCancelled && (
                      <div className="w-full">
                        {t.status === 'completed' && (
                          <button onClick={() => { const techData = technicianList.find(x => x.name === t.techName); setRatingModal({ isOpen: true, ticketId: t.id, rating: 0, comment: '', techName: t.techName, techPhotoUrl: techData ? techData.photo : '' }); }} className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border border-emerald-400 font-bold py-4 md:py-8 rounded-xl md:rounded-[2rem] flex justify-center items-center gap-2 md:gap-4 shadow-[0_0_15px_rgba(16,185,129,0.4)] active:scale-95 transition-all text-[16px] md:text-[32px] hover:shadow-[0_0_25px_rgba(16,185,129,0.6)]"><Star className="w-5 h-5 md:w-10 md:h-10 animate-pulse text-yellow-300" fill="currentColor" /> ยืนยันผลและให้คะแนนช่าง</button>
                        )}
                        {t.status === 'verified' && (
                          <div className="w-full bg-emerald-100 border-2 border-solid border-emerald-400 py-3.5 md:py-6 rounded-xl md:rounded-3xl flex justify-center items-center gap-2 md:gap-4 text-emerald-600 font-bold text-[16px] md:text-[30px] shadow-inner"><CheckCircle className="w-6 h-6 md:w-10 md:h-10" /> เสร็จสิ้นสมบูรณ์</div>
                        )}
                      </div>
                    )}

                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}