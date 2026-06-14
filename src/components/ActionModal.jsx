import React from 'react';
import { createPortal } from 'react-dom';
import { Wrench, PauseCircle, ClipboardCheck, XCircle, AlertTriangle, FileText, Users, X, Search, User, CheckCircle2, Phone, ClipboardList, Camera, PlusCircle } from 'lucide-react';

export default function ActionModal({ 
  isOpen, onClose, type, ticketId, 
  currentUserRole, selectedTech, setSelectedTech, currentUserName, 
  technicianList, actionText, setActionText, selectedHelpers, setSelectedHelpers, 
  helperSearch, setHelperSearch, employeeList, actionAttachments, setActionAttachments, 
  setLightboxImg, sscSuccess, setSscSuccess, executeActionModal 
}) {
  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999999] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-lg animate-in fade-in" onClick={onClose}>
      <div className={`absolute w-[300px] h-[300px] rounded-full blur-[80px] animate-pulse pointer-events-none z-0 ${type === 'finish' ? 'bg-emerald-500/20' : type === 'hold' || type === 'cancel' ? 'bg-rose-500/20' : 'bg-orange-500/20'}`}></div>

      <div className={`relative m-auto z-10 bg-slate-900 border-[2px] border-solid rounded-[2rem] w-[95%] max-w-[320px] sm:max-w-sm md:max-w-md h-auto max-h-[85dvh] overflow-y-auto overscroll-contain [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] p-5 sm:p-8 md:p-10 pb-12 text-center space-y-4 sm:space-y-7 ${type === 'finish' ? 'border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.5)]' : type === 'hold' || type === 'cancel' ? 'border-rose-500 shadow-[0_0_50px_rgba(225,29,72,0.5)]' : 'border-orange-500 shadow-[0_0_50px_rgba(249,115,22,0.6)]'}`} onClick={(e) => e.stopPropagation()}>
        
        {/* ไอคอนเรืองแสง */}
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto border-[3px] border-solid bg-slate-950 transition-all duration-300 ${type === 'finish' ? 'text-emerald-500 border-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.8)]' : type === 'hold' || type === 'cancel' ? 'text-rose-500 border-rose-500 shadow-[0_0_25px_rgba(225,29,72,0.8)]' : 'text-orange-500 border-orange-500 shadow-[0_0_25px_rgba(249,115,22,0.8)]'}`}>
          {type === 'accept' && <Wrench size={44} className="animate-pulse" />}
          {type === 'hold' && <PauseCircle size={44} className="animate-pulse" />}
          {type === 'finish' && <ClipboardCheck size={44} className="animate-pulse" />}
          {type === 'cancel' && <XCircle size={44} className="animate-pulse" />}
          {type === 'ssc' && <AlertTriangle size={44} className="animate-pulse" />}
          {type === 'resume' && <Wrench size={44} className="animate-pulse" />}
        </div>

        {/* ข้อความหัวข้อ */}
        <div>
           <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight drop-shadow-lg mb-2.5">
             {type === 'accept' ? 'รับงานซ่อมระบบ?' : type === 'cancel' ? 'ยกเลิกงานแจ้งซ่อม?' : type === 'finish' ? 'บันทึกปิดงานซ่อม' : type === 'hold' ? 'แจ้งเหตุขัดข้อง?' : type === 'resume' ? 'ดำเนินการซ่อมต่อ' : 'บันทึกเวร SSC'}
           </h3>
           <p className="text-[14px] md:text-[15px] text-slate-300 font-bold leading-relaxed px-2 md:px-4">
             {type === 'accept' ? <>คุณกำลังจะกดยอมรับงานซ่อมรหัส<br/><span className="text-orange-400 font-extrabold">{ticketId}</span></> :
              type === 'cancel' ? <>คุณแน่ใจหรือไม่ว่าต้องการยกเลิกงาน<br/><span className="text-rose-400 font-extrabold">{ticketId}</span></> :
              type === 'finish' ? <>โปรดตรวจสอบข้อมูลให้ถูกต้อง ก่อนส่งผล<br/><span className="text-orange-400 font-extrabold">{ticketId}</span></> :
              type === 'hold' ? <>โปรดระบุเหตุผลที่ทำให้การซ่อมล่าช้า<br/>งานรหัส <span className="text-orange-400 font-extrabold">{ticketId}</span></> :
              type === 'resume' ? <>โปรดระบุรายละเอียดสำหรับรหัสงาน<br/><span className="text-orange-400 font-extrabold">{ticketId}</span></> :
              <>โปรดระบุการแก้ไขเบื้องต้นสำหรับงาน<br/><span className="text-orange-400 font-extrabold">{ticketId}</span></>}
           </p>
        </div>

        {/* ช่องกรอกข้อมูล */}
        <div className="text-left space-y-5">
          {type === 'accept' ? (
             <div className="space-y-3">
               <label className="text-[14px] md:text-[16px] font-black text-emerald-400 tracking-wider flex items-center justify-center gap-1.5">👨‍🔧 ยืนยันผู้รับผิดชอบงาน</label>
               {currentUserRole === 'Commander' ? (
                 <select value={selectedTech} onChange={(e) => setSelectedTech(e.target.value)} className="w-full bg-slate-800 border-[2px] border-solid border-emerald-500/50 text-emerald-300 font-bold rounded-xl px-4 py-3.5 outline-none text-center">
                   <option value="" disabled>-- โปรดเลือกผู้รับผิดชอบ --</option>
                   {technicianList.map((tech) => <option key={tech.name} value={tech.name}>{tech.name}</option>)}
                 </select>
               ) : (
                 <div className="w-full bg-emerald-950/40 border-[2px] border-solid border-emerald-500/80 text-emerald-400 font-black rounded-xl px-4 py-4 text-center">{selectedTech || currentUserName}</div>
               )}
             </div>
          ) : (
             <div className="space-y-2">
               <label className={`text-sm font-black tracking-wider flex items-center gap-1.5 ${type === 'finish' ? 'text-emerald-400' : type === 'hold' || type === 'cancel' ? 'text-rose-400' : 'text-orange-400'}`}>
                 <FileText size={16} /> {type === 'hold' ? 'เหตุผลที่ทำให้เกิดความล่าช้า' : type === 'cancel' ? 'ระบุเหตุผลการยกเลิก' : type === 'finish' ? 'สรุปผลการซ่อม/ข้อแนะนำ' : 'บันทึกเหตุผลที่ต้องดำเนินการต่อ'}
               </label>
               <textarea value={actionText} onChange={(e) => setActionText(e.target.value)} placeholder="ระบุรายละเอียดลงที่นี่..." rows={4} className="w-full bg-slate-800 border-[2px] border-solid border-white/50 rounded-xl px-5 py-3.5 text-white font-bold text-sm outline-none" />
             </div>
          )}

          {/* ทีมสนับสนุน */}
          {type === 'finish' && (
            <div className="mt-4 mb-4 relative z-50">
              <label className="text-[14px] md:text-[16px] font-black text-cyan-400 uppercase tracking-wide flex items-center gap-2 mb-2"><Users size={18} /> 🤝 ทีมสนับสนุน / ผู้ร่วมดำเนินการ</label>
              {selectedHelpers.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedHelpers.map((helper, idx) => (
                    <div key={idx} className="bg-cyan-950 border border-cyan-500/50 rounded-lg px-3 py-1.5 flex items-center gap-2">
                      <p className="text-cyan-300 font-bold text-[13px]">{helper.name}</p>
                      <button type="button" onClick={() => setSelectedHelpers(prev => prev.filter((_, i) => i !== idx))} className="text-rose-400"><X size={14} /></button>
                    </div>
                  ))}
                </div>
              )}
              <div className="relative">
                <div className="flex items-center bg-slate-900 border-[2px] border-cyan-500/30 rounded-xl px-4 py-3"><Search size={18} className="text-cyan-500/50 mr-3" />
                  <input type="text" value={helperSearch} onChange={(e) => setHelperSearch(e.target.value)} placeholder="พิมพ์ชื่อ..." className="w-full bg-transparent text-cyan-100 outline-none font-bold text-[14px]" />
                </div>
                {helperSearch.length > 0 && (
                  <div className="absolute top-full left-0 w-full mt-2 bg-slate-800 border border-cyan-500/50 rounded-xl max-h-52 overflow-y-auto z-[9999]">
                    {employeeList.filter(emp => emp.name.toLowerCase().includes(helperSearch.toLowerCase())).map((emp, idx) => (
                      <div key={idx} onClick={() => { setSelectedHelpers(prev => [...prev, emp]); setHelperSearch(''); }} className="px-4 py-3 hover:bg-cyan-900/60 cursor-pointer">
                        <p className="text-cyan-100 font-black">{emp.name}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* แนบสื่อ */}
          {['ssc', 'finish', 'hold', 'resume'].includes(type) && (
             <div className="mt-4 flex flex-col gap-2 text-left">
               <label className="text-sm font-black text-cyan-400 flex items-center gap-1.5"><Camera size={16} /> 📸 แนบหลักฐาน</label>
               <div className="flex flex-wrap gap-2 pb-2">
                 {actionAttachments.map((file, idx) => (
                   <div key={idx} className="relative w-20 h-20 rounded-xl border border-cyan-500 overflow-hidden">
                     <img src={file} onClick={() => setLightboxImg(file)} className="w-full h-full object-cover" />
                     <button type="button" onClick={() => setActionAttachments(prev => prev.filter((_, i) => i !== idx))} className="absolute top-1 right-1 bg-rose-500 text-white rounded-full p-1"><X size={12} /></button>
                   </div>
                 ))}
                 <label className="w-20 h-20 rounded-xl border-2 border-dashed border-cyan-500 flex items-center justify-center cursor-pointer text-cyan-400">
                    <PlusCircle size={24} />
                    <input type="file" accept="image/*, video/*" multiple className="hidden" onChange={async (e) => {
                      const files = Array.from(e.target.files);
                      for (const file of files) {
                        const reader = new FileReader(); reader.readAsDataURL(file);
                        reader.onload = (ev) => setActionAttachments(prev => [...prev, ev.target.result]);
                      }
                    }} />
                 </label>
               </div>
             </div>
          )}

          {/* ปุ่ม Action */}
          <div className="flex gap-4 pt-4">
             <button onClick={onClose} className="flex-1 py-3.5 rounded-xl font-bold text-white bg-slate-800 border border-slate-600">ยกเลิก</button>
             <button onClick={executeActionModal} className="flex-[1.5] py-3.5 rounded-xl font-black text-white bg-orange-600">ยืนยัน</button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}