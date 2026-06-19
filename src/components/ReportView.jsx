import React from 'react';
import { createPortal } from 'react-dom';
import { 
  CheckCircle, User, Phone, Briefcase, Wrench, Activity, 
  Monitor, AlertCircle, Hash, Building, DoorOpen, Camera, 
  Video, X, Send, RotateCcw 
} from 'lucide-react';
import { ThaiDateFormatter, SciFiSelectModal } from './SharedUI';
import { formatDisplayPhone } from '../lib/utils';
import { equipmentCategories, buildingList } from '../lib/systemData';

export default function ReportView({
  sysTime, showSuccess, handleSubmit, handleResetForm,
  allRosters, technicianList, formData, setFormData,
  formErrors, setFormErrors, handleInputChange,
  showImagePicker, setShowImagePicker, handleMediaUpload,
  handleClipboardPaste, setLightboxImg, isSubmitting
}) {
  return (
    <div className="p-5 pb-32 animate-in slide-in-from-right-4 duration-500 space-y-6 relative">
      {showSuccess ? (
        <div className="fixed inset-0 z-[300] bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in duration-500">
          <div className="absolute w-[300px] h-[300px] bg-emerald-500/40 rounded-full blur-[100px] animate-pulse pointer-events-none z-0"></div>
          <div className="absolute w-[200px] h-[200px] bg-orange-500/30 rounded-full blur-[80px] animate-pulse delay-150 pointer-events-none z-0 translate-x-10 translate-y-10"></div>
          <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-sm">
            <div className="relative mb-8 mt-4">
              <div className="absolute inset-0 border-[6px] border-emerald-400 rounded-full animate-ping opacity-30"></div>
              <div className="absolute -inset-4 border-2 border-dashed border-emerald-400/70 rounded-full animate-[spin_8s_linear_infinite]"></div>
              <div className="relative w-28 h-28 md:w-32 md:h-32 bg-gradient-to-tr from-emerald-500 to-teal-400 text-white rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.8)] border-[3px] border-solid border-white/50">
                <CheckCircle size={60} className="md:w-20 md:h-20 drop-shadow-md" />
              </div>
            </div>
            <div className="bg-slate-900 border-[3px] border-solid border-emerald-500/80 p-8 rounded-3xl shadow-[0_0_40px_rgba(16,185,129,0.4)] w-full text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
              <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-emerald-300 to-emerald-600 drop-shadow-lg mb-4 tracking-wide">
                ส่งข้อมูลสำเร็จ!
              </h2>
              <p className="text-[15px] md:text-lg font-bold text-slate-200 leading-relaxed">
                ระบบบันทึกข้อมูลและส่งแจ้งเตือนให้<br/>
                <span className="text-orange-500 font-black text-lg md:text-xl mt-2 mb-1 inline-block drop-shadow-[0_0_8px_rgba(249,115,22,0.8)] border-b-2 border-dashed border-orange-500">
                  ผู้เกี่ยวข้อง.
                </span><br/>
                รับทราบเรียบร้อยแล้ว!!
              </p>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 w-full">
          <div className="bg-slate-800/60 backdrop-blur-xl border-2 border-solid border-white-600/50 rounded-[1rem] py-4 text-center shadow-[0_0_30px_rgba(0,0,0,0.3)] font-sans tracking-widest text-white font-bold md:text-[18px]">
            {ThaiDateFormatter(sysTime)}
          </div>

          {/* วิดเจ็ตเจ้าหน้าที่เวร SSC */}
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
            const daysThai = ['วันอาทิตย์', 'วันจันทร์', 'วันอังคาร', 'วันพุธ', 'วันพฤหัสบดี', 'วันศุกร์', 'วันเสาร์'];
            const normalBorders = ['border-rose-500/40', 'border-yellow-500/40', 'border-pink-500/40', 'border-emerald-500/40', 'border-orange-500/40', 'border-sky-500/40', 'border-purple-500/40'];
            const normalIcons = ['text-rose-400', 'text-yellow-400', 'text-pink-400', 'text-emerald-400', 'text-orange-400', 'text-sky-400', 'text-purple-400'];
            const dayColors = ['text-rose-400', 'text-yellow-400', 'text-pink-400', 'text-emerald-400', 'text-orange-400', 'text-sky-400', 'text-purple-400'];

            return (
              <div className={`mb-4 mt-4 p-4 md:p-5 rounded-2xl border-[2px] border-dashed ${normalBorders[dayOfWeek]} bg-slate-900/50 flex items-center gap-3.5 md:gap-5 transition-all`}>
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-800 flex items-center justify-center border border-slate-600 shrink-0 shadow-sm">
                  <AlertCircle className={`w-6 h-6 md:w-7 md:h-7 ${normalIcons[dayOfWeek]} animate-pulse`} />
                </div>
                <div className="flex-1">
                  <p className="text-[15px] md:text-[18px] font-bold text-slate-300 leading-tight">
                    วันนี้ <span className={`${dayColors[dayOfWeek]} font-black tracking-wide mx-0.5`}>{daysThai[dayOfWeek]}</span>
                  </p>
                  <p className="text-[13px] md:text-[16px] text-slate-300 font-bold mt-1 leading-snug">
                    มี <span className="text-orange-400 font-black tracking-wide">ผู้รับผิดชอบหลัก</span> พร้อมให้บริการค่ะ!
                  </p>
                </div>
              </div>
            );
          })()}

          {/* กรอบ 1: ข้อมูลผู้แจ้งซ่อม */}
          <div className="relative bg-slate-900/80 backdrop-blur-xl border-[2px] border-solid border-emerald-500/60 rounded-[1.5rem] p-5 md:p-8 shadow-[0_0_30px_rgba(16,185,129,0.5)] mt-6 overflow-hidden">
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-emerald-500/20 blur-[60px] rounded-full pointer-events-none z-0"></div>
            <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8 pb-4 border-b-2 border-dashed border-emerald-500/30 relative z-10">
              <div className="bg-emerald-950 border-[2px] border-solid border-emerald-400 p-2 md:p-3 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                <User className="text-emerald-400 w-5 h-5 md:w-7 md:h-7" strokeWidth={2.5} />
              </div>
              <h2 className="text-[18px] md:text-[24px] font-black text-emerald-400 tracking-widest uppercase drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]">
                1. ข้อมูลผู้แจ้งซ่อม
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5 relative z-10 animate-in fade-in zoom-in-95 duration-500">
              <div className="bg-slate-950/50 border border-emerald-500/30 rounded-2xl p-4 flex items-center gap-4 shadow-inner">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-emerald-900/50 flex items-center justify-center border border-emerald-400/50 shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                   <User className="text-emerald-400 w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-[11px] md:text-[13px] font-bold text-emerald-200/70 uppercase tracking-widest mb-0.5">ชื่อ-นามสกุล</p>
                  <p className="text-[16px] md:text-[20px] font-black text-emerald-300 drop-shadow-sm truncate">{formData.reporter || 'กำลังโหลดข้อมูล...'}</p>
                </div>
              </div>
              <div className="bg-slate-950/50 border border-emerald-500/30 rounded-2xl p-4 flex items-center gap-4 shadow-inner">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-emerald-900/50 flex items-center justify-center border border-emerald-400/50 shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                   <Phone className="text-emerald-400 w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-[11px] md:text-[13px] font-bold text-emerald-200/70 uppercase tracking-widest mb-0.5">เบอร์โทรศัพท์</p>
                  <p className="text-[16px] md:text-[20px] font-black font-mono tracking-wider text-emerald-300 drop-shadow-sm truncate">{formData.reporterContact || 'กำลังโหลดข้อมูล...'}</p>
                </div>
              </div>
              <div className="bg-slate-950/50 border border-emerald-500/30 rounded-2xl p-4 flex items-center gap-4 md:col-span-2 shadow-inner">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-emerald-900/50 flex items-center justify-center border border-emerald-400/50 shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                   <Briefcase className="text-emerald-400 w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-[11px] md:text-[13px] font-bold text-emerald-200/70 uppercase tracking-widest mb-0.5">หน่วยงาน</p>
                  <p className="text-[14px] md:text-[18px] font-black text-emerald-300 drop-shadow-sm truncate">{formData.position ? `${formData.position} | ` : ''} {formData.department || 'ไม่ระบุฝ่าย'} | {formData.bureau}</p>
                </div>
              </div>
            </div>
          </div>

          {/* กรอบ 2: ข้อมูลการแจ้งซ่อม */}
          <div className="relative bg-slate-900/80 backdrop-blur-xl border-[2px] border-solid border-orange-500/60 rounded-[1.5rem] p-5 md:p-8 shadow-[0_0_30px_rgba(249,115,22,0.2)] mt-8 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-orange-500/20 blur-[60px] rounded-full pointer-events-none z-0"></div>
            <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8 pb-4 border-b-2 border-dashed border-orange-500/30 relative z-10">
              <div className="bg-orange-950 border-[2px] border-solid border-orange-400 p-2 md:p-3 rounded-xl shadow-[0_0_15px_rgba(249,115,22,0.4)]">
                <Wrench className="text-orange-400 w-5 h-5 md:w-7 md:h-7" strokeWidth={2.5} />
              </div>
              <h2 className="text-[18px] md:text-[24px] font-black text-orange-400 tracking-widest uppercase drop-shadow-[0_0_10px_rgba(249,115,22,0.8)]">
                2. ข้อมูลการแจ้งซ่อม
              </h2>
            </div>
            
            <div className="space-y-5 md:space-y-6 relative z-10">
              <SciFiSelectModal
                id="field-equipmentCategory" themeColor="amber"
                label={<span className="text-[16px] md:text-[20px] font-black tracking-wide text-orange-300 flex items-center gap-1.5 md:gap-2"><Activity size={18} className="md:w-5 md:h-5"/> กลุ่มงาน / ภารกิจรับผิดชอบ <span className="text-rose-500">*</span></span>}
                placeholder="เลือกกลุ่มงาน/ภารกิจ"
                options={Object.keys(equipmentCategories)}
                value={formData.equipmentCategory}
                onChange={(val) => { setFormData({ ...formData, equipmentCategory: val, equipment: '' }); if (formErrors.equipmentCategory) setFormErrors({ ...formErrors, equipmentCategory: null }); }}
                error={formErrors.equipmentCategory}
              />
              <SciFiSelectModal
                id="field-equipment" themeColor="cyan"
                label={<span className="text-[16px] md:text-[20px] font-black tracking-wide text-orange-300 flex items-center gap-1.5 md:gap-2"><Monitor size={18} className="md:w-5 md:h-5"/> รายการอุปกรณ์ / ระบบ <span className="text-rose-500">*</span></span>}
                placeholder={formData.equipmentCategory ? "เลือกอุปกรณ์" : "กรุณาเลือกกลุ่มงานก่อน"}
                options={formData.equipmentCategory ? equipmentCategories[formData.equipmentCategory] : []}
                value={formData.equipment}
                onChange={(val) => { setFormData({ ...formData, equipment: val }); if (formErrors.equipment) setFormErrors({ ...formErrors, equipment: null }); }}
                error={formErrors.equipment}
              />

              <div className="space-y-1.5 md:space-y-2" id="field-description">
                <label className="text-[16px] md:text-[20px] font-black text-orange-300 uppercase tracking-wide ml-1 flex items-center gap-1.5 md:gap-2"><AlertCircle size={18} className="md:w-5 md:h-5" /> อาการเสีย / รายละเอียดปัญหา <span className="text-rose-500">*</span></label>
                <textarea
                  name="description" autoComplete="on" value={formData.description} onChange={handleInputChange} rows={3}
                  className={`w-full bg-slate-900 border-[2px] border-solid ${formErrors.description ? 'border-rose-500 ring-1 ring-rose-500/30' : 'border-orange-500/40 focus:border-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.1)] focus:shadow-[0_0_25px_rgba(249,115,22,0.8)]'} rounded-2xl px-5 py-4 md:py-5 outline-none text-sm md:text-[16px] font-bold text-orange-100 placeholder:text-orange-200/40 resize-none transition-all duration-300`}
                  placeholder="อธิบายรายละเอียดอาการเสีย"
                />
                {formErrors.description && <div className="text-rose-500 text-[13px] md:text-[15px] font-bold mt-1.5 ml-1 animate-in fade-in">⚠️ {formErrors.description}</div>}
              </div>

              <div className="space-y-1.5 md:space-y-2">
                <label className="text-[16px] md:text-[20px] font-black text-orange-300 uppercase tracking-wide ml-1 flex items-center gap-1.5 md:gap-2"><Hash size={18} className="md:w-5 md:h-5" /> หมายเลขครุภัณฑ์ (หากมี)</label>
                <input
                  name="assetNumber" value={formData.assetNumber} onChange={handleInputChange}
                  className="w-full bg-slate-900 border-[2px] border-solid border-orange-500/40 focus:border-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.2)] focus:shadow-[0_0_25px_rgba(249,115,22,0.5)] rounded-2xl px-5 py-4 md:py-5 text-sm md:text-[16px] font-bold text-orange-100 outline-none font-mono tracking-widest transition-all duration-300 placeholder:text-orange-200/40"
                  placeholder="ระบุหมายเลขครุภัณฑ์"
                />
              </div>

              <SciFiSelectModal
                id="field-building" themeColor="orange"
                label={<span className="text-[16px] md:text-[20px] font-black tracking-wide text-orange-300 flex items-center gap-1.5 md:gap-2"><Building size={18} className="md:w-5 md:h-5"/> อาคาร / ตึก <span className="text-rose-500">*</span></span>}
                placeholder="เลือกอาคาร" options={buildingList} value={formData.building}
                onChange={(val) => { setFormData({ ...formData, building: val }); if (formErrors.building) setFormErrors({ ...formErrors, building: null }); }}
                error={formErrors.building}
              />
              
              <div className="space-y-1.5 md:space-y-2" id="field-room">
                <label className="text-[16px] md:text-[20px] font-black text-orange-300 uppercase tracking-wide ml-1 flex items-center gap-1.5 md:gap-2"><DoorOpen size={18} className="text-orange-400 md:w-5 md:h-5" /> สถานที่ / ห้อง <span className="text-rose-500">*</span></label>
                <input
                  name="room" value={formData.room} onChange={handleInputChange} autoComplete="on"
                  className={`w-full bg-slate-900 border-[2px] border-solid ${formErrors.room ? 'border-rose-500 ring-1 ring-rose-500/30' : 'border-orange-500/30 focus:border-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.2)] focus:shadow-[0_0_25px_rgba(249,115,22,0.8)]'} rounded-2xl px-5 py-4 md:py-5 text-sm md:text-[16px] font-bold text-orange-100 outline-none transition-all duration-300 placeholder:text-slate-500`}
                  placeholder="ระบุสถานที่หรือห้อง"
                />
                {formErrors.room && <div className="text-rose-500 text-[11px] md:text-[13px] font-bold mt-1.5 ml-1 animate-in fade-in">⚠️ {formErrors.room}</div>}
              </div>

              <div className="space-y-4 pt-6 mt-6 border-t-[2px] border-dashed border-orange-500/30" id="field-media">
                <div className="flex justify-between items-center ml-1 mb-2">
                  <label className="text-[16px] md:text-[20px] font-black text-orange-300 uppercase tracking-wide flex items-center gap-1.5 md:gap-2">
                    <Camera className="md:w-5 md:h-5" /> แนบรูปและวิดีโอ <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <div className="bg-orange-950 border border-orange-500/80 text-orange-400 text-[12px] md:text-[14px] font-black px-2 py-1 rounded-lg shadow-[0_0_10px_rgba(249,115,22,0.8)] backdrop-blur-sm">รูป {formData.images.length}/6</div>
                    <div className="bg-purple-950 border border-purple-500/80 text-purple-400 text-[12px] md:text-[14px] font-black px-2 py-1 rounded-lg shadow-[0_0_10px_rgba(168,85,247,0.8)] backdrop-blur-sm">คลิป {(formData.videos || []).length}/1</div>
                  </div>
                </div>

                {((formData.images && formData.images.length > 0) || ((formData.videos || []).length > 0)) && (
                  <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 md:gap-3 mb-3">
                    {formData.images.map((img, i) => (
                      <div key={`img-${i}`} className="relative aspect-square rounded-xl overflow-hidden border-[2px] border-orange-400/80 shadow-[0_0_15px_rgba(249,115,22,0.3)] group cursor-pointer" onClick={() => setLightboxImg(img)}>
                        <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="รูปประกอบ" />
                        <button type="button" onClick={(e) => { e.stopPropagation(); setFormData({ ...formData, images: formData.images.filter((_, idx) => idx !== i) }); }} className="absolute top-1 right-1 bg-rose-500/90 backdrop-blur-sm text-white p-1 rounded-full shadow-lg transition-all active:scale-75 hover:bg-rose-600 border border-rose-400 z-10"><X size={12} className="w-3 h-3 md:w-3.5 md:h-3.5 stroke-[3px]" /></button>
                      </div>
                    ))}
                    {formData.videos.map((vid, i) => (
                      <div key={`vid-${i}`} className="relative aspect-square rounded-xl overflow-hidden border-[2px] border-purple-400/80 bg-slate-950 group">
                        <video src={vid} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/20 transition-colors z-10 cursor-pointer" onClick={(e) => { e.stopPropagation(); setLightboxImg(vid); }}>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-10 h-10 md:w-14 md:h-14 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] hover:scale-110 transition-transform ml-1"><path d="M5 3l14 9-14 9V3z" /></svg>
                        </div>
                        <button type="button" onClick={(e) => { e.stopPropagation(); setFormData({ ...formData, videos: formData.videos.filter((_, idx) => idx !== i) }); }} className="absolute top-1 right-1 bg-rose-500 text-white p-1 rounded-full z-20 shadow-lg active:scale-90 hover:bg-rose-600 transition-all border border-rose-400"><X size={14} className="stroke-[3px]" /></button>
                      </div>
                    ))}
                  </div>
                )}
                
                {(formData.images.length < 6 || (formData.videos || []).length < 1) && (
                  <button type="button" onClick={() => setShowImagePicker(true)} className="w-full h-24 md:h-32 border-2 border-dashed border-cyan-300/80 bg-cyan-950/20 hover:bg-orange-900/40 hover:border-orange-400 rounded-xl flex flex-col items-center justify-center transition-all duration-300 cursor-pointer shadow-[inset_0_0_20px_rgba(6,182,212,0.1)] hover:shadow-[0_0_25px_rgba(249,115,22,0.5)] group">
                    <div className="flex items-center gap-2 mb-1 transition-all">
                      <Camera size={32} className="text-cyan-300/70 group-hover:text-orange-400 transition-all md:w-10 md:h-10" />
                      <span className="text-cyan-300/50 group-hover:text-white text-[24px] md:text-[30px] font-light font-mono mx-1 transition-colors">/</span>
                      <Video size={32} className="text-purple-300/70 group-hover:text-purple-300 transition-all md:w-10 md:h-10" />
                    </div>
                    <span className="font-black tracking-widest text-cyan-300/80 group-hover:text-cyan-300 text-[14px] md:text-[18px]">คลิกแนบรูป/วิดีโอ (วิดีโอยาวไม่เกิน 8 วินาที)</span>
                  </button>
                )}

                {showImagePicker && typeof document !== 'undefined' ? createPortal(
                  <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-slate-800/80 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowImagePicker(false)}>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-orange-600/30 rounded-full blur-[100px] animate-pulse pointer-events-none z-0"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-rose-600/30 rounded-full blur-[80px] animate-pulse pointer-events-none z-0 delay-700"></div>
                    <div className="relative z-10 bg-slate-900/90 backdrop-blur-sm border-[3px] border-solid border-orange-500 rounded-[1.5rem] p-6 md:p-8 w-full max-w-sm shadow-[0_0_60px_rgba(249,115,22,0.5),_inset_0_0_20px_rgba(249,115,22,0.5)] text-center animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
                      <h3 className="text-xl font-black text-orange-100 mb-6 tracking-widest flex items-center justify-center gap-2 drop-shadow-[0_0_10px_rgba(249,115,22,1)]"><Monitor size={22} className="text-orange-400" /> เลือกรูปภาพ/วิดีโอ</h3>
                      <div className="md:hidden flex flex-col gap-3">
                        <div className="grid grid-cols-2 gap-3">
                          <label className="flex flex-col items-center justify-center bg-gradient-to-b from-orange-500 to-orange-700 p-4 rounded-[1rem] cursor-pointer border-[2px] border-solid border-white/60 transition-all duration-300 shadow-[0_0_15px_rgba(249,115,22,0.5)] hover:scale-105 active:scale-95"><input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => { handleMediaUpload(e); setShowImagePicker(false); }} /><Camera size={32} className="text-white mb-2 drop-shadow-md" /><span className="text-white font-black text-sm drop-shadow-md">ถ่ายรูป</span></label>
                          <label className="flex flex-col items-center justify-center bg-gradient-to-b from-purple-500 to-purple-700 p-4 rounded-[1rem] cursor-pointer border-[2px] border-solid border-white/60 transition-all duration-300 shadow-[0_0_15px_rgba(168,85,247,0.5)] hover:scale-105 active:scale-95"><input type="file" accept="video/*" capture="environment" className="hidden" onChange={(e) => { handleMediaUpload(e); setShowImagePicker(false); }} /><Video size={32} className="text-white mb-2 drop-shadow-md" /><span className="text-white font-black text-sm drop-shadow-md">ถ่ายวิดีโอ</span></label>
                        </div>
                        <label className="flex items-center justify-center bg-gradient-to-b from-emerald-500 to-emerald-700 p-4 rounded-[1rem] cursor-pointer border-[2px] border-solid border-white/60 transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.5)] hover:scale-[1.02] active:scale-95"><input type="file" accept="image/*, video/*" multiple className="hidden" onChange={(e) => { handleMediaUpload(e); setShowImagePicker(false); }} /><Monitor size={24} className="text-white mr-2 drop-shadow-md" /><span className="text-white font-black text-[14px] drop-shadow-md">เลือกคลังภาพ/วิดีโอ</span></label>
                      </div>
                      <div className="hidden md:flex flex-col gap-4">
                        <label className="flex flex-col items-center justify-center bg-gradient-to-b from-emerald-500 to-emerald-700 p-8 rounded-xl cursor-pointer border-[2px] border-solid border-white/60 transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:scale-105 group"><input type="file" accept="image/*, video/*" multiple className="hidden" onChange={(e) => { handleMediaUpload(e); setShowImagePicker(false); }} />
                          <div className="flex gap-4 mb-3"><Camera size={40} className="text-white drop-shadow-md transition-all group-hover:scale-110" /><Video size={40} className="text-white drop-shadow-md transition-all group-hover:scale-110" /></div><span className="text-white font-black text-lg drop-shadow-lg group-hover:scale-105 transition-all">เลือกรูปภาพ/วิดีโอ</span><span className="text-emerald-100 text-sm mt-1 font-bold group-hover:text-white">วิดีโอความยาวไม่เกิน 8 วินาที</span>
                        </label>
                        <button type="button" onClick={handleClipboardPaste} className="flex items-center justify-center gap-3 bg-slate-900 border-[2px] border-purple-500/60 p-4 rounded-xl cursor-pointer transition-all duration-300 shadow-[0_0_15px_rgba(168,85,247,0.2)] hover:bg-slate-800 hover:border-purple-400 hover:scale-[1.02] active:scale-95 group">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400 drop-shadow-md group-hover:scale-110 group-hover:text-purple-300 transition-all"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
                          <div className="flex flex-col items-start text-left"><span className="text-purple-400 font-black text-[16px] tracking-wide group-hover:text-purple-300 leading-tight">แคปหน้าจอเสร็จแล้วกดปุ่มนี้</span><span className="text-orange-400/80 text-[15px] font-bold mt-0.5">กด Win + Shift + S หรือ PRT SC</span></div>
                        </button>
                      </div>
                      <button onClick={() => setShowImagePicker(false)} className="w-full mt-6 py-4 bg-slate-800 text-slate-200 font-bold rounded-xl border-[2px] border-white/40 transition-all duration-300 shadow-[0_0_10px_rgba(244,63,94,0.3)] hover:bg-rose-700 hover:text-white active:scale-95 uppercase tracking-widest">ยกเลิก</button>
                    </div>
                  </div>, document.body
                ) : null}

                {(formErrors.images || formErrors.videos) && (
                  <div className="text-rose-500 text-[13px] md:text-[15px] font-bold mt-1.5 ml-1 animate-in fade-in">⚠️ {formErrors.images || formErrors.videos}</div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-6 px-2 md:px-0 flex flex-col md:flex-row items-center gap-4 text-center">
            <button type="submit" disabled={isSubmitting} className="group w-full md:flex-[2] bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-yellow-400 hover:shadow-[0_0_25px_rgba(249,115,22,0.8)] hover:-translate-y-1 text-white font-black text-[20px] md:text-[30px] py-4 md:py-5 rounded-[1rem] md:rounded-2xl shadow-xl shadow-orange-500/30 active:scale-95 transition-all duration-300 flex justify-center items-center gap-3 disabled:grayscale disabled:opacity-50 border-2 border-solid border-white/80">
              <Send size={26} className="md:w-7 md:h-7" /> <span className="tracking-wide">ยืนยันแจ้งซ่อม</span>
            </button>
            <button type="button" onClick={handleResetForm} className="w-full md:flex-[1] bg-emerald-600 text-white hover:bg-rose-500 hover:shadow-[0_0_15px_rgba(244,63,94,0.8)] hover:-translate-y-1 font-bold text-[18px] md:text-[22px] py-3.5 md:py-5 rounded-2xl flex items-center justify-center gap-2 border-2 border-solid border-white/80 active:scale-95 shadow-sm transition-all">
              <RotateCcw size={18} className="md:w-6 md:h-6" /> ล้างข้อมูล
            </button>
          </div>
        </form>
      )}
    </div>
  );
}