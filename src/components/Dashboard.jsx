import React from 'react';
import { createPortal } from 'react-dom';
import { 
    Settings, User, Phone, Calendar, ChevronDown, Activity, 
    PieChart, AlertCircle, Wrench, XCircle, CheckCircle, 
    Flame, Star, Building, MapPin, Clock, AlertTriangle, PhoneCall, ChevronRight, FileText
  } from 'lucide-react';
import { ThaiDateFormatter } from './SharedUI';
import { getMinutesDiff, formatMinutesToText, formatDisplayPhone } from '../lib/utils';

export default function Dashboard({
  sysTime, stats, tickets, allRosters, technicianList,
  dashTimeframe, setDashTimeframe,
  customMonth, setCustomMonth, showMonthPicker, setShowMonthPicker, pickerYear, setPickerYear,
  customDate, setCustomDate, showDatePicker, setShowDatePicker, calMonth, setCalMonth, calYear, setCalYear,
  currentUserRole, currentUserName, handleNavigateToTracking, setShowAdminRoster
}) {

  const completionRate = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

  const longestPendingTicket = tickets
    .filter((t) => {
      if (t.status !== 'pending') return false;
      const waitingMin = getMinutesDiff(t.date, sysTime);
      return waitingMin > 60; 
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  const longestFixingTicket = tickets
    .filter((t) => {
      if (t.status !== 'in_progress' && t.status !== 'on_hold') return false;
      const fixingMin = getMinutesDiff(t.startedAt || t.date, sysTime);
      return fixingMin > 240; 
    })
    .sort((a, b) => {
      const timeA = new Date(a.startedAt || a.date).getTime();
      const timeB = new Date(b.startedAt || b.date).getTime();
      return timeA - timeB;
    })[0];

  const getTimeframeLabel = () => {
    const now = new Date(sysTime);
    const monthsFull = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
    const monthsShort = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

    if (dashTimeframe === 'custom' && customMonth) {
      const [year, month] = customMonth.split('-');
      return `ผลงานเดือน ${monthsFull[parseInt(month) - 1]} ${parseInt(year) + 543}`;
    }
    if (dashTimeframe === 'custom_date' && customDate) {
      const d = new Date(customDate);
      return `ผลงานวันที่ ${d.getDate()} ${monthsFull[d.getMonth()]} ${d.getFullYear() + 543}`;
    }
    if (dashTimeframe === 'today') return `วันที่ ${now.getDate()} ${monthsFull[now.getMonth()]} ${now.getFullYear() + 543}`;
    if (dashTimeframe === 'week') {
      const day = now.getDay();
      const diffToMonday = day === 0 ? -6 : 1 - day;
      const first = new Date(now);
      first.setDate(now.getDate() + diffToMonday); 
      const last = new Date(first);
      last.setDate(first.getDate() + 6); 
      return `${first.getDate()} ${monthsShort[first.getMonth()]} - ${last.getDate()} ${monthsShort[last.getMonth()]} ${last.getFullYear() + 543}`;
    }
    if (dashTimeframe === 'month') return `เดือน ${monthsFull[now.getMonth()]} ${now.getFullYear() + 543}`;
    return 'ตั้งแต่เริ่มระบบ (All Time)';
  };

  return (
    <div className="px-5 pb-5 pt-2 space-y-5 animate-in fade-in duration-500 pb-32">
        <div className="bg-slate-800/60 backdrop-blur-xl border-2 border-solid border-white/50 rounded-[1rem] py-4 md:py-5 text-[16px] md:text-[28px] lg:text-[32px] flex items-center justify-between px-4 shadow-[0_0_20px_rgba(249,115,22,0.4)] font-sans tracking-widest text-white font-bold relative">
        <div className="w-10"></div> 
        <div className="flex-1 text-center">
          <span className="!text-[24px] md:!text-[32px] lg:!text-[36px] font-black inline-block">
            {ThaiDateFormatter(sysTime)}
          </span>
        </div>
        <button onClick={() => setShowAdminRoster(true)} className="w-10 flex justify-center items-center">
          <Settings className="w-6 h-6 md:w-8 md:h-8 text-slate-400 hover:text-white transition-colors" />
        </button>
      </div>

      {(() => {
        const today = new Date(sysTime);
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        const sscRosterForDate = allRosters.find(r => r.date === todayStr);
        let autoSscPhone = sscRosterForDate?.techPhone;
        if (sscRosterForDate?.techName) {
          const foundTech = technicianList.find(t => t.name === sscRosterForDate.techName);
          if (foundTech && foundTech.phone && foundTech.phone !== '-') autoSscPhone = foundTech.phone;
        }

        const dutyPerson = sscRosterForDate ? { techName: sscRosterForDate.techName, techPhone: autoSscPhone, isHoliday: sscRosterForDate.isHoliday, holidayName: sscRosterForDate.holidayName } : null;
        const dayOfWeek = today.getDay();

        if (dutyPerson?.techName) {
          let wTheme = {};
          if (dutyPerson?.isHoliday) {
            wTheme = { bg: 'bg-orange-500/20', border: 'border-orange-500/80', textHead: 'text-orange-400', textName: 'text-orange-400', glow: 'shadow-[0_0_30px_rgba(249,115,22,0.3)]', iconGlow: 'shadow-[0_0_10px_rgba(249,115,22,1)]', iconText: 'text-orange-400', dayLabel: `วันหยุดนักขัตฤกษ์ (${dutyPerson.holidayName})` };
          } else {
            const dayThemes = {
              0: { bg: 'bg-rose-500/20', border: 'border-rose-500/80', textHead: 'text-rose-400', textName: 'text-rose-400', glow: 'shadow-[0_0_30px_rgba(225,29,72,0.3)]', iconGlow: 'shadow-[0_0_10px_rgba(225,29,72,1)]', iconText: 'text-rose-400', dayLabel: 'วันอาทิตย์' },
              1: { bg: 'bg-yellow-500/20', border: 'border-yellow-500/80', textHead: 'text-yellow-400', textName: 'text-yellow-400', glow: 'shadow-[0_0_30px_rgba(234,179,8,0.3)]', iconGlow: 'shadow-[0_0_10px_rgba(234,179,8,1)]', iconText: 'text-yellow-400', dayLabel: 'วันจันทร์' },
              2: { bg: 'bg-pink-500/20', border: 'border-pink-500/80', textHead: 'text-pink-400', textName: 'text-pink-400', glow: 'shadow-[0_0_30px_rgba(244,114,182,0.3)]', iconGlow: 'shadow-[0_0_10px_rgba(244,114,182,1)]', iconText: 'text-pink-400', dayLabel: 'วันอังคาร' },
              3: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/80', textHead: 'text-emerald-400', textName: 'text-emerald-400', glow: 'shadow-[0_0_30px_rgba(16,185,129,0.3)]', iconGlow: 'shadow-[0_0_10px_rgba(16,185,129,1)]', iconText: 'text-emerald-400', dayLabel: 'วันพุธ' },
              4: { bg: 'bg-orange-500/20', border: 'border-orange-500/80', textHead: 'text-orange-400', textName: 'text-orange-400', glow: 'shadow-[0_0_30px_rgba(249,115,22,0.3)]', iconGlow: 'shadow-[0_0_10px_rgba(249,115,22,1)]', iconText: 'text-orange-400', dayLabel: 'วันพฤหัสบดี' },
              5: { bg: 'bg-sky-500/20', border: 'border-sky-500/80', textHead: 'text-sky-400', textName: 'text-sky-400', glow: 'shadow-[0_0_30px_rgba(14,165,233,0.3)]', iconGlow: 'shadow-[0_0_10px_rgba(14,165,233,1)]', iconText: 'text-sky-400', dayLabel: 'วันศุกร์' },
              6: { bg: 'bg-purple-500/20', border: 'border-purple-500/80', textHead: 'text-purple-400', textName: 'text-purple-400', glow: 'shadow-[0_0_30px_rgba(168,85,247,0.3)]', iconGlow: 'shadow-[0_0_10px_rgba(168,85,247,1)]', iconText: 'text-purple-400', dayLabel: 'วันเสาร์' }
            };
            wTheme = dayThemes[dayOfWeek];
          }

          return (
            <div className={`relative bg-slate-900/80 backdrop-blur-xl border-[2px] border-solid ${wTheme.border} rounded-[1.5rem] p-5 md:p-8 ${wTheme.glow} mt-4 mb-4 overflow-hidden`}>
              <div className={`absolute -top-20 -left-20 w-40 h-40 ${wTheme.bg} blur-[60px] rounded-full pointer-events-none z-0`}></div>
              <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8 pb-4 border-b-2 border-dashed border-slate-600/50 relative z-10">
                <div className={`bg-slate-950 border-[2px] border-solid ${wTheme.border} p-2 md:p-3 rounded-xl shadow-sm relative`}>
                  <User className={`${wTheme.iconText} w-5 h-5 md:w-7 md:h-7`} strokeWidth={2.5} />
                  <span className={`absolute -top-1 -right-1 w-2.5 h-2.5 md:w-3 md:h-3 bg-emerald-500 rounded-full animate-pulse border-2 border-slate-900 ${wTheme.iconGlow}`}></span>
                </div>
                <h2 className={`text-[16px] md:text-[22px] font-black ${wTheme.textHead} tracking-widest uppercase drop-shadow-sm`}>
                  เจ้าหน้าที่เวร SSC | {wTheme.dayLabel}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5 relative z-10 animate-in fade-in zoom-in-95 duration-500">
                <div className={`bg-slate-950/50 border ${wTheme.border.replace('80', '30')} rounded-2xl p-4 flex items-center gap-4 shadow-inner`}>
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full ${wTheme.bg} flex items-center justify-center border ${wTheme.border.replace('80', '50')} shrink-0`}>
                     <User className={`${wTheme.iconText} w-5 h-5 md:w-6 md:h-6`} />
                  </div>
                  <div className="overflow-hidden">
                    <p className={`text-[13px] md:text-[16px] font-bold ${wTheme.textHead} opacity-70 uppercase tracking-widest mb-0.5`}>ชื่อ-นามสกุล</p>
                    <p className={`text-[16px] md:text-[20px] font-black ${wTheme.textName} drop-shadow-sm truncate`}>{dutyPerson.techName}</p>
                  </div>
                </div>
                <div className={`bg-slate-950/50 border ${wTheme.border.replace('80', '30')} rounded-2xl p-4 flex items-center gap-4 shadow-inner`}>
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full ${wTheme.bg} flex items-center justify-center border ${wTheme.border.replace('80', '50')} shrink-0`}>
                     <Phone className={`${wTheme.iconText} w-5 h-5 md:w-6 md:h-6`} />
                  </div>
                  <div className="overflow-hidden flex-1">
                    <p className={`text-[16px] md:text-[20x] font-bold ${wTheme.textHead} opacity-70 uppercase tracking-widest mb-0.5`}>เบอร์โทรศัพท์</p>
                    {dutyPerson.techPhone && dutyPerson.techPhone !== '-' ? (
                       <a href={`tel:${dutyPerson.techPhone.replace(/\D/g, '')}`} className={`text-[16px] md:text-[20px] font-black font-mono tracking-wider ${wTheme.textName} drop-shadow-sm truncate hover:opacity-80 transition-opacity block`}>{formatDisplayPhone(dutyPerson.techPhone)}</a>
                    ) : ( <p className={`text-[16px] md:text-[20px] font-black font-mono tracking-wider text-slate-500 drop-shadow-sm truncate`}>ไม่มีข้อมูล</p> )}
                  </div>
                </div>
              </div>
            </div>
          );
        }
        return null;
      })()}

      <div className="flex gap-2 bg-slate-800/80 p-2 rounded-2xl border-[2px] border-solid border-slate-700 shadow-inner mt-4 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] snap-x">
        {[
          { id: 'today', label: 'วันนี้' },
          { id: 'week', label: 'สัปดาห์นี้' },
          { id: 'month', label: 'เดือนนี้' },
        ].map((tf) => (
          <button
            key={tf.id}
            onClick={() => setDashTimeframe(tf.id)}
            className={`flex-1 min-w-[75px] shrink-0 text-[16px] md:text-[20px] font-black py-2.5 md:py-3.5 rounded-xl transition-all duration-300 snap-center whitespace-nowrap ${
              dashTimeframe === tf.id
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-[2px] border-solid border-orange-300 shadow-[0_0_15px_rgba(249,115,22,0.8)] scale-[1.02] z-10' 
                : 'bg-slate-950 text-cyan-300 border-[2px] border-solid border-cyan-400/30 shadow-[0_0_8px_rgba(34,211,238,0.3)] hover:bg-slate-900 hover:text-cyan-200 hover:border-cyan-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.6)] hover:-translate-y-0.5' 
            }`}
          >
            {tf.label}
          </button>
        ))}

        <div className="relative flex-1 min-w-[95px] shrink-0 flex justify-center snap-center">
           <button 
             onClick={() => setShowDatePicker(true)}
             className={`w-full relative z-10 text-[16px] md:text-[20px] font-black py-2.5 md:py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 whitespace-nowrap ${
               dashTimeframe === 'custom_date' 
                 ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-[2px] border-solid border-orange-300 shadow-[0_0_15px_rgba(249,115,22,0.8)] scale-[1.02] z-10' 
                 : 'bg-slate-950 text-cyan-300 border-[2px] border-solid border-cyan-400/30 shadow-[0_0_8px_rgba(34,211,238,0.3)] hover:bg-slate-900 hover:text-cyan-200 hover:border-cyan-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.6)] hover:-translate-y-0.5' 
             }`}>
             <Calendar className={`w-4 h-4 md:w-5 md:h-5 ${dashTimeframe === 'custom_date' ? 'text-white' : 'text-cyan-400'}`} /> 
             <span>ระบุวัน</span>
           </button>

            {showDatePicker && createPortal(
            <div className="fixed inset-0 z-[9999] bg-slate-900/80 backdrop-blur-md flex p-4 animate-in fade-in items-center justify-center" onClick={() => setShowDatePicker(false)}>
              <div className="relative m-auto bg-slate-900 border-[2px] border-solid border-white rounded-[2rem] shadow-[0_0_60px_rgba(255,255,255,0.2)] w-[90%] max-w-[320px] sm:max-w-[340px] md:max-w-[550px] p-4 sm:p-5 md:p-10 text-center animate-in zoom-in-95 flex flex-col h-auto overflow-hidden outline-none" onClick={(e) => e.stopPropagation()}>

                <div className="absolute -top-20 -left-20 w-40 h-40 md:w-60 md:h-60 bg-orange-500/80 rounded-full blur-[50px] pointer-events-none z-0"></div>
                <div className="absolute -bottom-20 -right-20 w-40 h-40 md:w-60 md:h-60 bg-amber-500/80 rounded-full blur-[50px] pointer-events-none z-0"></div>
                
                <div className="relative z-10 flex justify-between items-center mb-6 md:mb-8 pb-5 md:pb-6 border-b border-white/20">
                  <button onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); } else setCalMonth(m => m - 1); }} className="p-2.5 md:p-4 bg-slate-800 text-white rounded-xl md:rounded-2xl hover:bg-orange-500 transition-colors border border-slate-600 active:scale-95 shadow-inner"><ChevronDown className="w-5 h-5 md:w-8 md:h-8 rotate-90" /></button>
                  <div className="flex flex-col items-center">
                    <span className="text-[12px] md:text-[18px] font-black text-white tracking-widest uppercase mb-0.5 md:mb-2 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">เลือกวันที่</span>
                    <span className="text-xl md:text-3xl font-black text-orange-400 tracking-widest drop-shadow-[0_0_15px_rgba(249,115,22,0.9)]">
                      {['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'][calMonth]} {calYear + 543}
                    </span>
                  </div>
                  <button onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); } else setCalMonth(m => m + 1); }} className="p-2.5 md:p-4 bg-slate-800 text-white rounded-xl md:rounded-2xl hover:bg-orange-500 transition-colors border border-slate-600 active:scale-95 shadow-inner"><ChevronDown className="w-5 h-5 md:w-8 md:h-8 -rotate-90" /></button>
                </div>
                
                <div className="relative z-10">
                  <div className="grid grid-cols-7 gap-1 md:gap-2 mb-3 md:mb-5">
                    {['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'].map(day => (<div key={day} className={`text-[13px] md:text-[20px] font-black ${day === 'อา' ? 'text-rose-400' : day === 'ส' ? 'text-sky-400' : 'text-slate-300'}`}>{day}</div>))}
                  </div>
                  <div className="grid grid-cols-7 gap-1.5 md:gap-3">
                    {Array.from({ length: new Date(calYear, calMonth, 1).getDay() }).map((_, i) => (<div key={`empty-${i}`} />))}
                    {Array.from({ length: new Date(calYear, calMonth + 1, 0).getDate() }).map((_, i) => {
                      const day = i + 1;
                      const dateString = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                      const isSelected = customDate === dateString;
                      const todayLocal = new Date(sysTime); 
                      const isToday = todayLocal.getFullYear() === calYear && todayLocal.getMonth() === calMonth && todayLocal.getDate() === day;
                      const isSunday = new Date(dateString).getDay() === 0;
                      const isSaturday = new Date(dateString).getDay() === 6;

                      return (
                        <button 
                          key={day} 
                          onClick={() => { setCustomDate(dateString); setDashTimeframe('custom_date'); setShowDatePicker(false); }}
                          className={`aspect-square flex items-center justify-center rounded-xl md:rounded-2xl text-[15px] md:text-[22px] font-black transition-all duration-300 active:scale-95 ${
                            isSelected 
                              ? 'bg-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.9)] border-[2px] border-solid border-white scale-110 z-20' 
                              : isToday 
                              ? 'bg-orange-500/80 text-white shadow-[0_0_25px_rgba(249,115,22,1)] border-[2px] border-solid border-orange-300 z-10 animate-pulse' 
                              : 'bg-slate-800 ' + (isSunday ? 'text-rose-400 drop-shadow-[0_0_5px_rgba(251,113,133,0.8)]' : isSaturday ? 'text-sky-400 drop-shadow-[0_0_5px_rgba(56,189,248,0.8)]' : 'text-slate-200') + ' hover:bg-orange-500/50 hover:border-orange-400 border border-white/60 shadow-inner'
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <button onClick={() => setShowDatePicker(false)} className="relative z-10 mt-8 md:mt-10 w-full py-4 md:py-6 rounded-xl md:rounded-2xl font-black text-white bg-orange-500 hover:bg-rose-500 border-[2px] border-solid border-white shadow-[0_0_20px_rgba(249,115,22,0.7)] active:scale-95 tracking-widest uppercase md:text-[22px]">ยกเลิก</button>
              </div>
            </div>,
            document.body
          )}
        </div>

        <div className="relative flex-1 min-w-[95px] shrink-0 flex justify-center snap-center">
          <button onClick={() => setShowMonthPicker(true)}
            className={`w-full relative z-10 text-[16px] md:text-[20px] font-black py-2.5 md:py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 whitespace-nowrap ${
              dashTimeframe === 'custom' 
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-[2px] border-solid border-orange-300 shadow-[0_0_15px_rgba(249,115,22,0.8)] scale-[1.02] z-10' 
                : 'bg-slate-950 text-cyan-300 border-[2px] border-solid border-cyan-400/30 shadow-[0_0_8px_rgba(34,211,238,0.3)] hover:bg-slate-900 hover:text-cyan-200 hover:border-cyan-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.6)] hover:-translate-y-0.5'
            }`}>
            <Calendar className={`w-4 h-4 md:w-5 md:h-5 ${dashTimeframe === 'custom' ? 'text-white' : 'text-cyan-400'}`} /> 
            <span>ระบุเดือน</span>
          </button>
          
            {showMonthPicker && createPortal(
            <div className="fixed inset-0 z-[9999] bg-slate-900/80 backdrop-blur-md flex p-4 animate-in fade-in items-center justify-center" onClick={() => setShowMonthPicker(false)}>
              <div className="relative m-auto bg-slate-900 border-[2px] border-solid border-white rounded-[2rem] shadow-[0_0_60px_rgba(255,255,255,0.2)] w-[90%] max-w-[320px] sm:max-w-[340px] md:max-w-[550px] p-4 sm:p-5 md:p-10 text-center animate-in zoom-in-95 flex flex-col h-auto overflow-hidden outline-none" onClick={(e) => e.stopPropagation()}>

                <div className="absolute -top-20 -right-20 w-40 h-40 md:w-60 md:h-60 bg-orange-500/80 rounded-full blur-[50px] pointer-events-none z-0"></div>
                <div className="absolute -bottom-20 -left-20 w-40 h-40 md:w-60 md:h-60 bg-amber-500/80 rounded-full blur-[50px] pointer-events-none z-0"></div>
                
                <div className="relative z-10 flex justify-between items-center mb-6 md:mb-8 pb-5 md:pb-6 border-b border-white/20">
                  <button onClick={() => setPickerYear(y => y - 1)} className="p-2.5 md:p-4 bg-slate-800 text-white rounded-xl md:rounded-2xl hover:bg-orange-500 transition-colors border border-slate-600 active:scale-95 shadow-inner"><ChevronDown className="w-5 h-5 md:w-8 md:h-8 rotate-90" /></button>
                  <div className="flex flex-col items-center">
                    <span className="text-[12px] md:text-[18px] font-black text-white tracking-widest uppercase mb-0.5 md:mb-2 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
                      เลือกเดือน
                    </span>
                    <span className="text-2xl md:text-4xl font-black text-orange-400 tracking-widest drop-shadow-[0_0_15px_rgba(249,115,22,0.9)]">
                      {pickerYear + 543}
                    </span>
                  </div>
                  <button onClick={() => setPickerYear(y => y + 1)} className="p-2.5 md:p-4 bg-slate-800 text-white rounded-xl md:rounded-2xl hover:bg-orange-500 transition-colors border border-slate-600 active:scale-95 shadow-inner"><ChevronDown className="w-5 h-5 md:w-8 md:h-8 -rotate-90" /></button>
                </div>
                <div className="relative z-10 grid grid-cols-3 gap-3 md:gap-5">
                  {['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'].map((m, i) => {
                    const monthValue = `${pickerYear}-${String(i + 1).padStart(2, '0')}`;
                    const isSelected = customMonth === monthValue;
                    const todayLocal = new Date(sysTime);
                    const isCurrentMonth = todayLocal.getFullYear() === pickerYear && todayLocal.getMonth() === i;
                    return (
                      <button 
                        key={m} 
                        onClick={() => { setCustomMonth(monthValue); setDashTimeframe('custom'); setShowMonthPicker(false); }}
                        className={`py-3.5 md:py-6 rounded-xl md:rounded-2xl text-[15px] md:text-[24px] font-black transition-all duration-300 active:scale-95 ${
                          isSelected 
                            ? 'bg-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.9)] border-[2px] border-solid border-white scale-110 z-10' 
                            : isCurrentMonth 
                            ? 'bg-orange-500/80 text-white shadow-[0_0_25px_rgba(249,115,22,1)] border-[2px] border-solid border-orange-300 z-10 animate-pulse' 
                            : 'bg-slate-800/80 text-slate-200 hover:bg-orange-500/40 hover:border-orange-400 border border-white/60 hover:shadow-[0_0_15px_rgba(249,115,22,0.4)] shadow-inner'
                        }`}
                      >
                        {m}
                      </button>
                    )
                  })}
                </div>
                <button onClick={() => setShowMonthPicker(false)} className="relative z-10 mt-8 md:mt-10 w-full py-4 md:py-6 rounded-xl md:rounded-2xl font-black text-white bg-orange-500 hover:bg-rose-500 border-[2px] border-solid border-white shadow-[0_0_20px_rgba(249,115,22,0.7)] active:scale-95 tracking-widest uppercase md:text-[22px]">ยกเลิก</button>
          </div>
          </div>,
          document.body
          )}
        </div>
      </div>

      {/* 📊 3. กล่องแสดงตัวเลขรวม */}
      <div className="bg-slate-900/80 backdrop-blur-xl border-[2px] border-solid border-orange-500/80 rounded-[1.5rem] p-5 md:p-8 shadow-[0_0_30px_rgba(249,115,22,0.4)] hover:shadow-[0_0_40px_rgba(249,115,22,0.5)] transition-all relative overflow-hidden mt-6">
        <div className="absolute top-0 right-0 w-40 h-40 md:w-60 md:h-60 bg-orange-500/10 rounded-full blur-[60px] pointer-events-none"></div>
        <div className="relative z-10 flex flex-col h-full gap-4">
          <div className="flex justify-between items-start w-full">
            <div>
              <p className="text-slate-300 text-[16px] md:text-[20px] font-black uppercase tracking-widest mb-1 md:mb-2 drop-shadow-sm">จำนวนงานทั้งหมด</p>
              <div className="flex items-baseline gap-2">
                <span className="text-7xl md:text-[6.5rem] font-black font-mono tracking-tighter leading-none text-orange-400 drop-shadow-[0_0_15px_rgba(249,115,22,0.6)]">
                  {String(stats.total).padStart(2, '0')}
                </span>
                <span className="text-slate-300 text-[16px] md:text-[22px] font-bold tracking-widest ml-1">รายการ</span>
              </div>
            </div>
            <div className="bg-slate-950/60 border-[2px] border-solid border-emerald-500/50 px-4 md:px-6 py-4 md:py-6 rounded-2xl flex flex-col items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.5)] shrink-0">
              <span className="text-[13px] md:text-[16px] font-black uppercase tracking-widest text-emerald-400 mb-1">อัตราปิดงาน</span>
              <div className="flex items-center gap-1.5 md:gap-2 text-emerald-300">
                <PieChart className="w-5 h-5 md:w-8 md:h-8 animate-pulse" />
                <span className="text-[30px] md:text-[44px] font-black drop-shadow-[0_0_15px_rgba(16,185,129,0.5)] leading-none">{completionRate}%</span>
              </div>
            </div>
          </div>
          <div className="w-full bg-slate-950 border-[2px] border-solid border-orange-500/50 text-orange-300 text-[16px] md:text-[20px] font-black px-4 py-3 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.8)]">
            {getTimeframeLabel()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:gap-6">
        <div onClick={() => handleNavigateToTracking('pending')} className="bg-slate-800/40 backdrop-blur-xl p-5 md:p-8 rounded-[1.5rem] border-[2px] border-solid border-rose-500 hover:bg-slate-700/50 flex flex-col items-center shadow-lg active:scale-95 transition-all cursor-pointer relative overflow-hidden hover:shadow-[0_0_25px_rgba(244,63,94,0.5)] hover:-translate-y-1 hover:border-rose-400">
          <div className="absolute top-0 w-full h-1 md:h-2 bg-rose-500"></div>
          <div className="bg-rose-50 p-3 md:p-4 rounded-2xl md:rounded-3xl mb-3 md:mb-5">
            <AlertCircle className="w-6 h-6 md:w-8 md:h-8 text-rose-500 animate-pulse" />
          </div>
          <div className="text-4xl md:text-[4rem] md:mb-2 font-black text-rose-400 font-mono tracking-tighter leading-none">{stats.pending}</div>
          <div className="text-[13px] md:text-[18px] font-bold text-rose-500 uppercase mt-2 tracking-widest">รอดำเนินการ</div>
        </div>
        
        <div onClick={() => handleNavigateToTracking('fixing')} className="bg-slate-800/40 backdrop-blur-xl p-5 md:p-8 rounded-[1.5rem] border-[2px] border-solid border-orange-500 hover:bg-slate-700/50 flex flex-col items-center shadow-lg active:scale-95 transition-all cursor-pointer relative overflow-hidden hover:shadow-[0_0_25px_rgba(249,115,22,0.5)] hover:-translate-y-1 hover:border-orange-400">
          <div className="absolute top-0 w-full h-1 md:h-2 bg-orange-400"></div>
          <div className="bg-orange-50 p-3 md:p-4 rounded-2xl md:rounded-3xl mb-3 md:mb-5">
            <Wrench className="w-6 h-6 md:w-8 md:h-8 text-orange-500" />
          </div>
          <div className="text-4xl md:text-[4rem] md:mb-2 font-black text-orange-500 font-mono tracking-tighter leading-none">{stats.fixing}</div>
          <div className="text-[13px] md:text-[18px] font-bold text-orange-500 uppercase mt-2 tracking-widest">กำลังซ่อม</div>
        </div>

        <div onClick={() => handleNavigateToTracking('cancelled')} className="bg-slate-800/40 backdrop-blur-xl p-5 md:p-8 rounded-[1.5rem] border-[2px] border-solid border-slate-500 hover:bg-slate-700/50 flex flex-col items-center shadow-lg active:scale-95 transition-all cursor-pointer relative overflow-hidden hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:-translate-y-1 hover:border-slate-400">
          <div className="absolute top-0 w-full h-1 md:h-2 bg-slate-400"></div>
          <div className="bg-slate-50 p-3 md:p-4 rounded-2xl md:rounded-3xl mb-3 md:mb-5">
            <XCircle className="w-6 h-6 md:w-8 md:h-8 text-slate-500" />
          </div>
          <div className="text-4xl md:text-[4rem] md:mb-2 font-black text-slate-300 font-mono tracking-tighter leading-none">{stats.cancelled}</div>
          <div className="text-[14px] md:text-[16px] font-bold text-slate-300 uppercase mt-2 tracking-widest">ยกเลิก</div>
        </div>

        <div onClick={() => handleNavigateToTracking('completed')} className="bg-slate-800/40 backdrop-blur-xl p-5 md:p-8 rounded-[1.5rem] border-[2px] border-solid border-emerald-500 hover:bg-slate-700/50 flex flex-col items-center shadow-lg active:scale-95 transition-all cursor-pointer relative overflow-hidden hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] hover:-translate-y-1 hover:border-emerald-400">
          <div className="absolute top-0 w-full h-1 md:h-2 bg-emerald-500"></div>
          <div className="bg-emerald-50 p-3 md:p-4 rounded-2xl md:rounded-3xl mb-3 md:mb-5">
            <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-emerald-500"/>
          </div>
          <div className="text-4xl md:text-[4rem] md:mb-2 font-black text-emerald-400 font-mono tracking-tighter leading-none">{stats.done}</div>
          <div className="text-[14px] md:text-[20px] font-bold text-emerald-500 uppercase mt-2 tracking-widest">เสร็จสิ้น</div>
        </div> 
      </div>

      {stats.missionBreakdown && stats.missionBreakdown.length > 0 && (
        <div className="w-full bg-slate-800/60 backdrop-blur-xl p-5 md:p-8 rounded-[1.5rem] border-2 border-solid border-cyan-500/60 shadow-[0_0_20px_rgba(6,182,212,0.15)] mt-6 md:mt-8 hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] transition-all">
          <h3 className="text-[18px] md:text-[22px] font-black text-cyan-400 uppercase tracking-widest mb-4 md:mb-6 flex items-center gap-2 md:gap-3 drop-shadow-sm">
            <Activity className="w-5 h-5 md:w-7 md:h-7 text-cyan-400 animate-pulse" /> 
            สรุปจำนวนงานแยกตามภารกิจ
          </h3>
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {stats.missionBreakdown.map((item, idx) => {
              let theme = { bg: 'bg-slate-900/80', border: 'border-slate-500/40', hover: 'hover:border-slate-400', textHead: 'text-slate-200', textSub: 'text-slate-400', icon: 'text-slate-500', numBox: 'bg-slate-800 border-slate-600', numText: 'text-slate-300 drop-shadow-sm' };
              
              if (item.category.includes('จานสายอากาศ')) {
                theme = { bg: 'bg-orange-950/80', border: 'border-orange-500/50', hover: 'hover:border-orange-400 hover:shadow-[0_0_15px_rgba(249,115,22,0.4)]', textHead: 'text-orange-400', textSub: 'text-orange-500', icon: 'text-orange-500', numBox: 'bg-orange-900/50 border-orange-500/30 shadow-[0_0_10px_rgba(249,115,22,0.2)]', numText: 'text-orange-400 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]' };
              } else if (item.category.includes('คอมพิวเตอร์')) {
                theme = { bg: 'bg-cyan-950/80', border: 'border-cyan-500/50', hover: 'hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]', textHead: 'text-cyan-400', textSub: 'text-cyan-500', icon: 'text-cyan-500', numBox: 'bg-cyan-900/50 border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]', numText: 'text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]' };
              } else if (item.category.includes('โครงสร้างพื้นฐาน')) {
                theme = { bg: 'bg-rose-950/80', border: 'border-rose-500/50', hover: 'hover:border-rose-400 hover:shadow-[0_0_15px_rgba(244,63,94,0.4)]', textHead: 'text-rose-400', textSub: 'text-rose-500', icon: 'text-rose-500', numBox: 'bg-rose-900/50 border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.2)]', numText: 'text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]' };
              } else if (item.category.includes('SSC')) {
                theme = { bg: 'bg-emerald-950/80', border: 'border-emerald-500/50', hover: 'hover:border-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]', textHead: 'text-emerald-400', textSub: 'text-emerald-500', icon: 'text-emerald-500', numBox: 'bg-emerald-900/50 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]', numText: 'text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]' };
              }

              const isSingle = stats.missionBreakdown.length === 1;

              return (
                <div key={idx} className={`${isSingle ? 'lg:col-span-2' : ''} ${theme.bg} border-l-[6px] border border-solid ${theme.border} rounded-2xl p-4 md:p-5 flex items-center justify-between shadow-inner transition-all duration-300 ${theme.hover} group cursor-default`}>
                  <div className="flex flex-col min-w-0 pr-4">
                    <span className={`text-[16px] md:text-[20px] font-black ${theme.textHead} truncate drop-shadow-sm`}>{item.category}</span>
                    <span className={`text-[13px] md:text-[16px] font-bold ${theme.textSub} mt-1.5 flex items-center gap-1.5 truncate`}>
                      <User className={`w-4 h-4 ${theme.icon} shrink-0`} /> 
                      <span className="truncate">{item.techs}</span>
                    </span>
                  </div>
                  <div className={`flex items-baseline gap-1.5 px-4 py-2.5 rounded-xl border border-solid shrink-0 ${theme.numBox}`}>
                    <span className={`text-[24px] md:text-[32px] font-black font-mono leading-none ${theme.numText}`}>
                      {String(item.count).padStart(2, '0')}
                    </span>
                    <span className={`text-[13px] md:text-[16px] font-bold ${theme.textSub}`}>งาน</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {stats.done > 0 && (
          <div className="bg-slate-800/60 backdrop-blur-xl p-5 md:p-8 rounded-[1.5rem] border-[2px] border-solid border-yellow-500/80 shadow-[0_0_20px_rgba(250,204,21,0.8)] mt-4 md:mt-8 relative overflow-hidden flex items-center justify-between hover:shadow-[0_0_30px_rgba(250,204,21,0.8)] transition-all">
            <div className="absolute -left-10 -top-10 w-32 h-32 md:w-48 md:h-48 bg-yellow-500/30 blur-[30px] rounded-full pointer-events-none animate-pulse"></div>
            <div className="relative z-10 flex flex-col">
              <span className="text-[14px] md:text-[20px] font-black text-yellow-400 uppercase tracking-widest drop-shadow-sm mb-1 md:mb-2">
                คะแนนความพึงพอใจเฉลี่ย
              </span>
              <div className="flex items-center gap-3 md:gap-5 mt-1">
                <span className="text-5xl md:text-[5rem] font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] tracking-tighter">
                  {stats.avgRating > 0 ? stats.avgRating : '-'}
                </span>
                <div className="flex flex-col md:mt-2">
                  <div className="flex gap-0.5 md:gap-1">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} className={`w-6 h-6 md:w-8 md:h-8 ${Math.round(stats.avgRating) >= s ? "drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]" : ""}`} fill={Math.round(stats.avgRating) >= s ? "#facc15" : "none"} stroke={Math.round(stats.avgRating) >= s ? "#facc15" : "#475569"} strokeWidth={2} />
                    ))}
                  </div>
                  <span className="text-[14px] md:text-[18px] font-bold text-slate-400 mt-1 md:mt-2">
                    จากผู้แจ้ง <span className="text-yellow-400 font-black">{stats.ratedCount}</span> รายการ
                  </span>
                </div>
              </div>
            </div>
            <div className="relative z-10 bg-slate-900 border-[2px] border-solid border-yellow-500/50 p-3.5 md:p-6 rounded-2xl md:rounded-3xl shadow-[0_0_15px_rgba(250,204,21,0.3)] flex flex-col items-center justify-center shrink-0">
               <Star className="w-8 h-8 md:w-12 md:h-12 text-yellow-400 mb-1 md:mb-2 animate-bounce" fill="currentColor" />
               <span className="text-[10px] md:text-[14px] font-black text-yellow-500 tracking-widest uppercase">CSAT KPI</span>
            </div>
          </div>
        )}

        {(longestPendingTicket || longestFixingTicket) && (
          <div className="bg-slate-800/60 backdrop-blur-xl p-5 md:p-8 rounded-[1rem] md:rounded-[1.5rem] border-2 border-solid border-orange-500/80 shadow-[0_0_20px_rgba(249,115,22,0.8)] mt-6 md:mt-8 overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 md:w-56 md:h-56 bg-rose-500/10 rounded-full blur-2xl"></div>
            <h3 className="text-[18px] md:text-[22px] font-black text-white uppercase tracking-widest mb-4 md:mb-6 flex items-center gap-2 md:gap-3 relative z-10">
              <Flame className="w-5 h-5 md:w-7 md:h-7 text-white-500 animate-pulse" /> 
              งานที่รอเกินระยะเวลากำหนด
            </h3>
            <div className="flex flex-col gap-3 md:gap-5 relative z-10 w-full">
              
              {longestPendingTicket && (
                <div
                  onClick={() => handleNavigateToTracking('all', longestPendingTicket.id)}
                  className="bg-white p-4 md:p-6 rounded-2xl border-2 border-solid border-rose-400 shadow-[0_4px_10px_rgba(225,29,72,0.1)] cursor-pointer hover:border-rose-500 hover:bg-rose-50 hover:shadow-md transition-all active:scale-[0.98]"
                >
                  {(() => {
                    const waitHrs = getMinutesDiff(longestPendingTicket.date, sysTime) / 60;
                    let pendingName = "⏳ คิวนี้อีกยาวไกล (แอบท้อ)";
                    if (waitHrs > 24) pendingName = "🦖 รอจนเป็นฟอสซิล (รากงอก)";
                    else if (waitHrs > 12) pendingName = "🧂 เค็มจัดปลัดบอก (ดองข้ามคืน)";
                    else if (waitHrs > 4) pendingName = "🏺 ดองได้ที่ (เริ่มเปรี้ยว)";

                    return (
                      <div className="flex flex-col gap-2.5 md:gap-3 mb-3 md:mb-5">
                        <div className="flex justify-between items-center">
                          <span className="text-[15px] md:text-[20px] font-mono font-bold text-slate-600 bg-white px-2 md:px-3 py-0.5 md:py-1 rounded-md md:rounded-lg border-2 border-solid border-orange-400/70 tracking-widest shadow-sm">
                            {longestPendingTicket.id}
                          </span>
                          <span className="text-[12px] md:text-[16px] font-black text-rose-500 bg-rose-100/80 border border-rose-200 px-2 py-1 rounded-lg">
                            รอดำเนินการ
                          </span>
                        </div>
                        <div className="flex justify-between items-center w-full">
                          <span className="text-[13px] md:text-[18px] font-black text-rose-700 bg-rose-200/80 px-2 py-1 rounded-lg shadow-inner">
                            {pendingName}
                          </span>
                          <span className="text-[14px] md:text-[20px] font-mono font-black text-rose-600 drop-shadow-sm">
                            {formatMinutesToText(getMinutesDiff(longestPendingTicket.date, sysTime))}
                          </span>
                        </div>
                      </div>
                    );
                  })()}

                  <h4 className="text-[15px] md:text-[20px] font-black text-rose-800 truncate mb-1 md:mb-3">
                    {longestPendingTicket.equipment}
                  </h4>
                  <div className="flex flex-col gap-0.5 md:gap-1 mt-2 md:mt-3">
                    <span className="text-[13px] md:text-[16px] font-bold text-slate-600 tracking-widest">ผู้แจ้งปัญหา:</span>
                    <p className="text-[13px] md:text-[16px] font-bold text-orange-600 flex items-center gap-1.5 md:gap-2">
                      <User className="w-3.5 h-3.5 md:w-5 md:h-5 text-orange-500" />
                      {longestPendingTicket.reporter}
                    </p>
                  </div>
                </div>
              )}
              
              {longestFixingTicket && (
                <div
                  onClick={() => handleNavigateToTracking('all', longestFixingTicket.id)}
                  className="bg-white p-4 md:p-6 rounded-2xl border-2 border-solid border-orange-400 shadow-[0_4px_10px_rgba(249,115,22,0.1)] cursor-pointer hover:border-orange-500 hover:bg-orange-50 hover:shadow-md transition-all active:scale-[0.98]"
                >
                  {(() => {
                    const fixHrs = getMinutesDiff(longestFixingTicket.startedAt || longestFixingTicket.date, sysTime) / 60;
                    let marathonName = "🏃‍♂️ มินิมาราธอน (แอบหอบ)";
                    if (fixHrs > 48) marathonName = "💀 อัลตร้ามาราธอน (ลากเลือด)";
                    else if (fixHrs > 24) marathonName = "🥵 ฟูลมาราธอน (ข้ามวันข้ามคืน)";
                    else if (fixHrs > 8) marathonName = "🏃‍♀️ ฮาล์ฟมาราธอน (เหงื่อตก)";

                    return (
                      <div className="flex flex-col gap-2.5 md:gap-3 mb-3 md:mb-5">
                        <div className="flex justify-between items-center">
                          <span className="text-[15px] md:text-[20px] font-mono font-bold text-slate-600 bg-white px-2 md:px-3 py-0.5 md:py-1 rounded-md md:rounded-lg border-2 border-solid border-orange-400/70 tracking-widest shadow-sm">
                            {longestFixingTicket.id}
                          </span>
                          <span className={`text-[12px] md:text-[16px] font-black px-2 py-1 rounded-lg border ${
                            longestFixingTicket.status === 'on_hold' 
                              ? 'text-purple-600 bg-purple-100 border-purple-300' 
                              : 'text-orange-600 bg-orange-100 border-orange-300'
                          }`}>
                            {longestFixingTicket.status === 'on_hold' ? 'แจ้งขัดข้อง' : 'กำลังซ่อม'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center w-full">
                          <span className="text-[13px] md:text-[18px] font-black text-orange-700 bg-orange-200/80 px-2 py-1 rounded-lg shadow-inner">
                            {marathonName}
                          </span>
                          <span className="text-[14px] md:text-[20px] font-mono font-black text-orange-600 drop-shadow-sm">
                            {formatMinutesToText(getMinutesDiff(longestFixingTicket.startedAt || longestFixingTicket.date, sysTime))}
                          </span>
                        </div>
                      </div>
                    );
                  })()}

                  <h4 className="text-[18px] md:text-[20px] font-black text-rose-800 truncate mb-1 md:mb-3">
                    {longestFixingTicket.equipment}
                  </h4>
                  <div className="flex flex-col gap-0.5 md:gap-1 mt-2 md:mt-3">
                    <span className="text-[13px] md:text-[16px] font-bold text-slate-400 tracking-widest">ผู้รับผิดชอบ:</span>
                    <p className="text-[15px] md:text-[18px] font-bold text-emerald-600 flex items-center gap-1.5 md:gap-2">
                      <Wrench className="w-3.5 h-3.5 md:w-5 md:h-5 text-emerald-500" />
                      {longestFixingTicket.techName || 'กำลังดำเนินการ'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="bg-slate-800/60 backdrop-blur-xl p-5 md:p-8 rounded-[1rem] md:rounded-[1.5rem] border-2 border-solid border-orange-500/80 shadow-[0_0_20px_rgba(249,115,22,0.15)] mt-6 md:mt-8 hover:shadow-[0_0_20px_rgba(249,115,22,0.8)]">
          <h3 className="text-[18px] md:text-[22px] font-black text-white uppercase tracking-widest mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
            <FileText className="w-5 h-5 md:w-7 md:h-7 text-white-800" /> รายการล่าสุด
          </h3>
          <div className="space-y-3 md:space-y-5">
            {tickets.filter(t => {
              if (currentUserRole === 'Commander' || currentUserRole === 'reporter') return true;
              const isMyJob = t.techName === currentUserName || t.sscTechName === currentUserName;
              const isUnassigned = !t.techName || t.techName === 'รอเจ้าหน้าที่รับงาน';
              return isMyJob || isUnassigned;
            }).slice(0, 3).map((t) => (
              <div
                key={t.id}
                onClick={() => handleNavigateToTracking('all', t.id)}
                className={`flex flex-col p-4 md:p-6 bg-slate-50 rounded-2xl border-2 cursor-pointer active:scale-[0.98] transition-all shadow-sm ${
                  t.status === 'pending'
                    ? 'border-rose-400 hover:bg-rose-100 hover:border-rose-500'
                    : t.status === 'in_progress' || t.status === 'on_hold'
                    ? 'border-orange-400 hover:bg-orange-100 hover:border-orange-500'
                    : 'border-emerald-400 hover:bg-emerald-100 hover:border-emerald-500'
                } relative`}
              >
                <div className="flex items-center justify-between mb-2 md:mb-4 w-full gap-1 md:gap-2">
                  <div className="flex-1 flex justify-start items-center overflow-hidden">
                    <span className="text-[15px] md:text-[20px] font-mono font-bold text-slate-600 bg-white px-2 md:px-3 py-0.5 md:py-1 rounded-md md:rounded-lg border border-2 border-solid border-orange-400/70 tracking-widest shadow-sm truncate">
                      {t.id}
                    </span>
                  </div>
                  <div className="flex-shrink-0 flex justify-center items-center">
                    {t.isOutOfHours && (
                      <span className="text-[15px] md:text-[20px] font-black text-rose-600 bg-rose-100 border border-solid border-rose-200 px-1.5 md:px-2 py-0.5 md:py-1 rounded-md md:rounded-lg animate-pulse whitespace-nowrap">
                        เวร SSC
                      </span>
                    )}
                  </div>
                  <div className="flex-1 flex justify-end items-center">
                    <span
                      className={`text-[15px] md:text-[20px] font-black uppercase px-2 md:px-3 py-0.5 md:py-1 rounded-md md:rounded-lg whitespace-nowrap ${
                        t.status === 'pending'
                          ? 'bg-rose-100 text-rose-600'
                          : t.status === 'in_progress' || t.status === 'on_hold'
                          ? 'bg-orange-100 text-orange-600'
                          : t.status === 'verified'
                          ? 'bg-emerald-500 text-white shadow-sm' 
                          : 'bg-emerald-100 text-emerald-600'
                      }`}
                    >
                      {t.status === 'pending' ? 'รอดำเนินการ' : t.status === 'verified' ? 'เสร็จสิ้นสมบูรณ์' : t.status === 'completed' ? 'รอผู้แจ้งยืนยัน' : 'กำลังซ่อม'}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center pr-1 md:pr-2">
                  <div className="min-w-0 flex-1">
                    <h4 className="text-[16px] md:text-[20px] font-bold text-blue-800 truncate mb-4 md:mb-6">
                      {t.equipment}
                    </h4>
                    <p className="text-[15px] md:text-[20px] text-orange-500 truncate flex items-center gap-1.5 md:gap-2">
                      <AlertCircle className="w-[17px] h-[17px] md:w-7 md:h-7 text-orange-600 shrink-0" /> {t.description}
                    </p>
                    {t.sscTechName && (
                      <div className="bg-purple-50 border border-purple-200 p-3 rounded-lg mt-3">
                        <p className="text-rose-700 font-bold text-[14px] md:text-[20px] flex items-center gap-2">
                          <AlertTriangle size={18} /> เจ้าหน้าที่เวร SSC:
                        </p>
                        <p className="text-purple-900 font-bold text-[15px] md:text-[20px] mt-0.5">
                          {t.sscTechName}
                        </p>
                      </div>
                    )}
                  </div>
                  <ChevronRight className="w-[18px] h-[18px] md:w-6 md:h-6 text-slate-300 shrink-0 ml-2 md:ml-4" />
                </div>
                <div className="mt-3 md:mt-5 pt-3 md:pt-5 border-t border-2 border-orange-400/70 flex justify-between items-end">
                  <div className="flex flex-col gap-2.5 md:gap-4">
                    <div className="flex flex-col gap-0.5 md:gap-1">
                      <span className="text-[13px] md:text-[20px] font-bold text-slate-600 tracking-widest">ผู้แจ้งปัญหา:</span>
                      <span className="text-[15px] md:text-[20px] font-bold text-emerald-600 flex items-center gap-1.5 md:gap-2">
                        <User className="w-[14px] h-[14px] md:w-[20px] md:h-[20px] text-emerald-500 shrink-0" />
                        <span className="truncate max-w-[140px] md:max-w-[250px]">{t.reporter}</span>
                      </span>
                    </div>
                    {t.techName && (
                      <div className="flex flex-col gap-0.5 md:gap-1">
                        <span className="text-[13px] md:text-[20px] font-bold text-slate-600 tracking-widest">ผู้รับผิดชอบ:</span>
                        <span className="text-[15px] md:text-[20px] font-bold text-orange-600 flex items-center gap-1.5 md:gap-2">
                          <Wrench className="w-[14px] h-[14px] md:w-[20px] md:h-[20px] text-orange-500 shrink-0" />
                          <span className="truncate max-w-[140px] md:max-w-[250px]">{t.techName}</span>
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="text-[16px] md:text-[20px] font-bold font-mono text-orange-500 flex items-center gap-1 md:gap-2 shrink-0 mb-0.5 md:mb-1">
                    <Clock className="w-4 h-4 md:w-5 md:h-5 text-orange-500" /> 
                    {new Date(t.date).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.
                  </span>
                </div>
              </div>
            ))}
            
            {tickets.filter(t => {
              if (currentUserRole === 'Commander' || currentUserRole === 'reporter') return true;
              const isMyJob = t.techName === currentUserName || t.sscTechName === currentUserName;
              const isUnassigned = !t.techName || t.techName === 'รอเจ้าหน้าที่รับงาน';
              return isMyJob || isUnassigned;
            }).length === 0 && (
              <p className="text-center text-xs md:text-base font-bold text-slate-500 py-4 md:py-8">
                ไม่มีรายการซ่อมบำรุง
              </p>
           )}
           </div>
         </div>
    </div>
  );
}