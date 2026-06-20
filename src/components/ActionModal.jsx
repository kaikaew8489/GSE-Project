import React, { useRef, useState } from 'react'; // 🌟 ฟันธง 1: เพิ่ม useState ตรงนี้!
import { createPortal } from 'react-dom'; // 🌟 ฟันธง 2: ต้อง Import createPortal ด้วย เพราะป๊อบอัพใช้
import { X, Camera, ShieldCheck, CheckCircle, PauseCircle, Wrench, FileText, PlusCircle, XCircle, Search, User, Check, Monitor, Video } from 'lucide-react'; // 🌟 ฟันธง 3: เพิ่มไอคอน Monitor, Video

export default function ActionModal({
  isOpen, onClose, type, ticketId, 
  actionText, setActionText, actionAttachments, setActionAttachments,
  selectedHelpers, setSelectedHelpers, helperSearch, setHelperSearch, employeeList,
  executeActionModal, selectedTech, currentUserName
}) {
  const fileInputRef = useRef(null);
  
  // 🌟 ฟันธง 4: ประกาศสวิตช์ปิดเปิดป๊อบอัพฝังไว้ตรงนี้!
  const [showImagePicker, setShowImagePicker] = useState(false);

  if (!isOpen) return null;

  // 🌟 Logic ปุ่มสีเทา: บังคับกรอกเหตุผล + แนบรูป
  let isConfirmDisabled = false;
  if (['hold', 'resume', 'finish', 'ssc', 'cancel'].includes(type)) {
    if (!actionText || actionText.trim() === '') {
      isConfirmDisabled = true;
    }
    if (['hold', 'resume', 'finish', 'ssc'].includes(type) && (!actionAttachments || actionAttachments.length === 0)) {
      isConfirmDisabled = true;
    }
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    const currentCount = (actionAttachments || []).length;
    const allowedCount = 6 - currentCount;
    
    if (files.length > allowedCount) {
      alert(`⚠️ สามารถแนบหลักฐานเพิ่มได้อีก ${allowedCount} ไฟล์เท่านั้นครับ (สูงสุด 6 ไฟล์)`);
    }

    const filesToAdd = files.slice(0, allowedCount);
    
    filesToAdd.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => setActionAttachments(prev => [...(prev || []), reader.result]);
      reader.readAsDataURL(file);
    });
    
    if(fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (index) => {
    setActionAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // 🌟 ระบบเลือกทีมสนับสนุน
  const toggleHelper = (emp) => {
    const current = selectedHelpers || [];
    const isSelected = current.find(h => h.name === emp.name);
    if (isSelected) {
      setSelectedHelpers(current.filter(h => h.name !== emp.name));
    } else {
      setSelectedHelpers([...current, emp]);
      setHelperSearch(''); // ล้างช่องค้นหาอัตโนมัติ
    }
  };

  const filteredEmployees = (employeeList || []).filter(emp => 
    emp.name.toLowerCase().includes((helperSearch || '').toLowerCase()) || 
    emp.department.toLowerCase().includes((helperSearch || '').toLowerCase())
  );

  const isExactMatch = filteredEmployees.some(emp => emp.name === (helperSearch || '').trim());

  // 🌟 จัดหมวดหมู่สีสัน แสงเฟลอร์ ไอคอน
  let modalConfig = { title: '', desc: '', icon: null, color: '', bgGlow: '', btnGlow: '', borderColor: '', shadowGlow: '' };
  switch (type) {
    case 'hold': modalConfig = { title: 'แจ้งเหตุขัดข้อง?', desc: `โปรดระบุเหตุผลที่ทำให้การซ่อมล่าช้า\nงานรหัส ${ticketId}`, icon: <PauseCircle size={48} className="text-orange-500 drop-shadow-[0_0_10px_rgba(249,115,22,0.8)]" />, color: 'text-orange-500', bgGlow: 'bg-orange-500/40', btnGlow: 'from-orange-500 to-amber-600 shadow-[0_0_20px_rgba(249,115,22,0.6)] border-orange-400', borderColor: 'border-orange-500', shadowGlow: 'shadow-[0_0_40px_rgba(249,115,22,0.35)]' }; break;
    case 'resume': modalConfig = { title: 'ดำเนินการต่อ?', desc: `ระบุความคืบหน้าหรือการได้อะไหล่\nงานรหัส ${ticketId}`, icon: <Wrench size={48} className="text-emerald-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]" />, color: 'text-emerald-500', bgGlow: 'bg-emerald-500/40', btnGlow: 'from-emerald-500 to-teal-600 shadow-[0_0_20px_rgba(16,185,129,0.6)] border-emerald-400', borderColor: 'border-emerald-500', shadowGlow: 'shadow-[0_0_40px_rgba(16,185,129,0.35)]' }; break;
    case 'finish': modalConfig = { title: 'ปิดงานซ่อม?', desc: `สรุปผลการแก้ไขปัญหา\nงานรหัส ${ticketId}`, icon: <CheckCircle size={48} className="text-emerald-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]" />, color: 'text-emerald-500', bgGlow: 'bg-emerald-500/50', btnGlow: 'from-emerald-500 to-teal-600 shadow-[0_0_20px_rgba(16,185,129,0.6)] border-emerald-400', borderColor: 'border-emerald-500', shadowGlow: 'shadow-[0_0_50px_rgba(16,185,129,0.35)]' }; break;
    case 'ssc': modalConfig = { title: 'บันทึกการแก้ไขเบื้องต้น?', desc: `(สำหรับเวร SSC)\nงานรหัส ${ticketId}`, icon: <ShieldCheck size={48} className="text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]" />, color: 'text-blue-500', bgGlow: 'bg-blue-500/40', btnGlow: 'from-blue-500 to-cyan-600 shadow-[0_0_20px_rgba(59,130,246,0.6)] border-blue-400', borderColor: 'border-blue-500', shadowGlow: 'shadow-[0_0_40px_rgba(59,130,246,0.35)]' }; break;
    case 'accept': modalConfig = { title: 'รับงานซ่อมระบบ?', desc: `คุณกำลังจะกดยอมรับงานซ่อมรหัส\n${ticketId}`, icon: <Wrench size={48} className="text-orange-500 drop-shadow-[0_0_10px_rgba(249,115,22,0.8)]" />, color: 'text-orange-500', bgGlow: 'bg-orange-500/40', btnGlow: 'from-orange-500 to-amber-600 shadow-[0_0_20px_rgba(249,115,22,0.6)] border-orange-400', borderColor: 'border-orange-500', shadowGlow: 'shadow-[0_0_40px_rgba(249,115,22,0.35)]' }; break;
    case 'cancel': modalConfig = { title: 'ยกเลิกงานซ่อม?', desc: `ระบุเหตุผลที่ต้องการยกเลิกงาน\nรหัส ${ticketId}`, icon: <XCircle size={48} className="text-rose-500 drop-shadow-[0_0_10px_rgba(225,29,72,0.8)]" />, color: 'text-rose-500', bgGlow: 'bg-rose-500/40', btnGlow: 'from-rose-500 to-red-600 shadow-[0_0_20px_rgba(225,29,72,0.6)] border-rose-400', borderColor: 'border-rose-500', shadowGlow: 'shadow-[0_0_40px_rgba(225,29,72,0.35)]' }; break;
    default: break;
  }

  return (
    <div className="fixed inset-0 z-[99999] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      {/* 🌟 แสง Flare Background เรืองแสงทะลุทะลวง */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[450px] md:h-[450px] ${modalConfig.bgGlow} blur-[80px] md:blur-[120px] rounded-full pointer-events-none z-0`}></div>
      
      {/* 🌟 กรอบสีสันชัดเจน 100% พร้อมเงาเรืองแสงสุดๆ */}
      <div className={`bg-[#0f172a] border-[2px] md:border-[3px] ${modalConfig.borderColor} rounded-[2rem] p-6 md:p-8 w-full max-w-md ${modalConfig.shadowGlow} relative flex flex-col max-h-[90vh] overflow-y-auto animate-in zoom-in-95 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`}>
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-rose-400 transition-colors z-20"><X size={28}/></button>

        <div className="flex flex-col items-center text-center relative z-10 mb-6 shrink-0">
          <div className={`w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center mb-5 border-[2px] ${modalConfig.borderColor} shadow-inner`}>
            {modalConfig.icon}
          </div>
          <h2 className={`text-[24px] md:text-[32px] font-black ${modalConfig.color} drop-shadow-md`}>{modalConfig.title}</h2>
          <p className="text-slate-300 font-bold text-[14px] md:text-[16px] whitespace-pre-line mt-2 leading-relaxed opacity-90">{modalConfig.desc}</p>
        </div>

        {type === 'accept' && (
          <div className="relative z-10 flex flex-col items-center w-full gap-2 mt-2 mb-6 shrink-0 animate-in slide-in-from-bottom-2 fade-in duration-300">
            <label className="text-[14px] md:text-[16px] font-bold flex items-center gap-2 text-emerald-400 mb-1">
              👨‍🔧 ยืนยันผู้รับผิดชอบงาน
            </label>
            <div className="w-full bg-slate-900 border-[2px] border-emerald-500/50 rounded-xl py-3.5 px-4 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <span className="text-[16px] md:text-[20px] font-black text-emerald-400 tracking-wide">
                {selectedTech || currentUserName}
              </span>
            </div>
          </div>
        )}

        {['hold', 'resume', 'finish', 'ssc', 'cancel'].includes(type) && (
          <div className="relative z-10 flex flex-col gap-5 shrink-0">
            <div className="flex flex-col gap-2">
              <label className={`text-[14px] md:text-[16px] font-bold flex items-center gap-2 ${modalConfig.color}`}>
                <FileText size={18}/> {type === 'finish' ? 'สรุปผลการซ่อมแซม' : 'เหตุผล/รายละเอียด'} <span className="text-rose-500">*</span>
              </label>
              <textarea
                className={`w-full bg-slate-900 border-[1.5px] ${modalConfig.borderColor} focus:border-white rounded-xl p-4 text-white placeholder-slate-500 outline-none transition-colors text-[14px] md:text-[16px] resize-none shadow-inner`}
                rows="3"
                placeholder="ระบุรายละเอียดที่นี่..."
                value={actionText || ''}
                onChange={(e) => setActionText(e.target.value)}
              />
            </div>

            {['hold', 'resume', 'finish', 'ssc'].includes(type) && (
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center mb-1">
                  <label className={`text-[14px] md:text-[16px] font-bold flex items-center gap-2 ${modalConfig.color}`}>
                    <Camera size={18}/> แนบหลักฐาน <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <span className="text-[10px] md:text-[12px] font-bold px-2 py-0.5 rounded-lg bg-orange-900/60 text-orange-400 border border-orange-500/50 shadow-sm tracking-widest">
                      รูป {(actionAttachments || []).length}/6
                    </span>
                  </div>
                </div>

                {(!actionAttachments || actionAttachments.length === 0) ? (
                  <button 
                    onClick={() => setShowImagePicker(true)} 
                    className={`w-full py-8 flex flex-col items-center justify-center gap-3 rounded-2xl border-[2px] border-dashed ${modalConfig.borderColor} bg-slate-900/50 text-slate-400 hover:text-white hover:bg-slate-800 transition-all shadow-inner hover:shadow-[0_0_15px_currentColor]`}
                  >
                    <Camera size={40} className={modalConfig.color} />
                    <span className="text-[14px] md:text-[16px] font-bold">คลิกเพื่อแนบรูป / วิดีโอ</span>
                  </button>
                ) : (
                  <div className="w-full flex flex-wrap gap-3">
                    {(actionAttachments || []).map((file, idx) => (
                      <div key={idx} className={`relative w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden border-2 ${modalConfig.borderColor} bg-slate-800 group shadow-sm`}>
                        {file.includes('video') || file.includes('mp4') || file.includes('data:video') ? (
                          <video src={file} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                        ) : (
                          <img src={file} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="preview" />
                        )}
                        <button onClick={() => removeAttachment(idx)} className="absolute top-1 right-1 bg-rose-500 text-white rounded-full p-0.5 opacity-80 hover:opacity-100 shadow-md"><X size={14}/></button>
                      </div>
                    ))}
                    
                    {(actionAttachments.length < 6) && (
                      <button 
                        onClick={() => setShowImagePicker(true)} 
                        className={`w-20 h-20 md:w-24 md:h-24 rounded-xl border-2 border-dashed ${modalConfig.borderColor} flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shadow-inner`}
                      >
                        <PlusCircle size={28} className={modalConfig.color} />
                      </button>
                    )}
                  </div>
                )}
                {/* ซ่อน Native Input ไว้ ให้ป๊อบอัพเราทำงานแทน */}
                <input type="file" multiple accept="image/*,video/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
              </div>
            )}
          </div>
        )}

        {/* 🌟 ทีมสนับสนุน (เฉพาะตอนปิดงาน) */}
        {type === 'finish' && (
          <div className="relative z-10 flex flex-col gap-2 mt-6 shrink-0 border-t-[2px] border-dashed border-emerald-500/30 pt-6">
            <label className={`text-[14px] md:text-[16px] font-black flex items-center gap-2 ${modalConfig.color}`}>
              <User size={18}/> ทีมสนับสนุน (ถ้ามี)
            </label>
            
            <div className="relative w-full mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="พิมพ์ชื่อเพื่อค้นหาบุคลากร..." 
                value={helperSearch || ''} 
                onChange={(e) => setHelperSearch(e.target.value)} 
                className={`w-full bg-slate-900 border-[1.5px] ${modalConfig.borderColor} rounded-xl py-3 pl-10 pr-4 text-white text-[14px] md:text-[16px] focus:border-white outline-none transition-colors shadow-inner`}
              />
            </div>

            {/* แสดงรายชื่อ "เฉพาะตอนที่มีการพิมพ์ค้นหา" เท่านั้น */}
            {helperSearch && helperSearch.trim() !== '' && (
              <div className="animate-in slide-in-from-top-2 fade-in duration-200">
                {!isExactMatch && (
                  <div onClick={() => toggleHelper({ name: helperSearch.trim(), position: 'บุคคลภายนอก', department: '-' })} className="flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all bg-orange-500/10 border-[2px] border-orange-500/50 hover:bg-orange-500/20 mb-2 shadow-sm">
                    <div>
                      <p className="text-[14px] md:text-[16px] font-black text-orange-400 flex items-center gap-2"><PlusCircle size={16}/> เพิ่ม "{helperSearch.trim()}"</p>
                      <p className="text-[11px] md:text-[13px] text-orange-500/80 font-bold mt-0.5">บุคคลภายนอก / ไม่ระบุสังกัด</p>
                    </div>
                  </div>
                )}

                {filteredEmployees.length > 0 && (
                  <div className={`max-h-40 overflow-y-auto rounded-xl border-[1.5px] ${modalConfig.borderColor} bg-slate-900/80 p-2 space-y-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-emerald-700 [&::-webkit-scrollbar-track]:bg-transparent shadow-[0_0_15px_rgba(16,185,129,0.15)] mb-2`}>
                    {filteredEmployees.map((emp, i) => {
                      const isSelected = (selectedHelpers || []).find(h => h.name === emp.name);
                      return (
                        <div key={i} onClick={() => toggleHelper(emp)} className={`flex items-center justify-between p-2.5 md:p-3 rounded-lg cursor-pointer transition-all ${isSelected ? 'bg-emerald-500/30 border border-emerald-500' : 'hover:bg-slate-800 border border-transparent'}`}>
                          <div>
                            <p className={`text-[14px] md:text-[15px] font-bold ${isSelected ? 'text-emerald-400' : 'text-slate-200'}`}>{emp.name}</p>
                            <p className="text-[11px] md:text-[12px] text-slate-500">{emp.position} | {emp.department}</p>
                          </div>
                          {isSelected && <CheckCircle size={20} className="text-emerald-500" />}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {selectedHelpers && selectedHelpers.length > 0 && (
              <div className="flex flex-wrap justify-start items-center gap-1.5 mt-2 bg-slate-900/40 p-2.5 rounded-xl border border-slate-700/50 w-full overflow-hidden">
                {selectedHelpers.map((h, i) => (
                  <div key={i} className="inline-flex items-center gap-1 bg-emerald-900/80 text-emerald-300 font-bold text-[11px] md:text-[13px] px-2.5 py-1 rounded-full border border-emerald-500 shadow-sm whitespace-nowrap w-max">
                    <span className="truncate max-w-[160px] md:max-w-[200px]">{h.name}</span>
                    {h.position === 'บุคคลภายนอก' && <span className="text-[10px] text-orange-400 shrink-0 ml-0.5">(ภายนอก)</span>}
                    <X size={14} className="cursor-pointer hover:text-rose-400 shrink-0 ml-0.5" onClick={() => toggleHelper(h)} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 🌟 ปุ่มกดยกเลิกและยืนยัน */}
        <div className="flex w-full gap-3 mt-8 relative z-10 shrink-0">
          <button onClick={onClose} className="flex-[1] py-3.5 md:py-4 rounded-2xl font-black text-slate-300 bg-slate-800 border border-slate-600 hover:bg-slate-700 hover:text-white transition-all shadow-[0_0_10px_rgba(255,255,255,0.05)] hover:shadow-[0_0_15px_rgba(244,63,94,0.4)] active:scale-95 text-[16px] md:text-[18px]">
            ยกเลิก
          </button>
          
          <button 
            onClick={executeActionModal} 
            disabled={isConfirmDisabled}
            className={`flex-[1.5] py-3.5 md:py-4 rounded-2xl font-black text-[16px] md:text-[20px] transition-all duration-300 border-[2px] 
              ${isConfirmDisabled 
                ? 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed grayscale shadow-none' 
                : `bg-gradient-to-r ${modalConfig.btnGlow} text-white hover:brightness-110 hover:shadow-[0_0_30px_currentColor] active:scale-95`
              }`}
          >
            ยืนยัน
          </button>
        </div>

      </div>

      {/* 🌟 ฟันธง: เติมก้อนนี้เข้ามา เพื่อให้แสดงป๊อบอัพสวยๆ แบบหน้าแจ้งซ่อม 🌟 */}
      {showImagePicker && typeof document !== 'undefined' ? createPortal(
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-slate-800/80 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowImagePicker(false)}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-blue-600/30 rounded-full blur-[100px] animate-pulse pointer-events-none z-0"></div>
          <div className="relative z-10 bg-slate-900/90 backdrop-blur-sm border-[3px] border-solid border-blue-500 rounded-[1.5rem] p-6 w-full max-w-sm shadow-[0_0_60px_rgba(59,130,246,0.5)] text-center animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-black text-blue-100 mb-6 tracking-widest flex items-center justify-center gap-2 drop-shadow-[0_0_10px_rgba(59,130,246,1)]"><Monitor size={22} className="text-blue-400" /> เลือกรูปภาพ/วิดีโอ</h3>
            {/* 🌟 ฟันธง: แยก Layout มือถือ กับ PC ให้เหมือนหน้าแจ้งซ่อมเป๊ะ! 🌟 */}
            <div className="w-full flex flex-col gap-3">
                {/* 📱 โหมดมือถือ (Mobile View) - จะโชว์แค่ในจอมือถือ */}
                <div className="md:hidden flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <label className="flex flex-col items-center justify-center bg-gradient-to-b from-blue-500 to-blue-700 p-4 rounded-[1rem] cursor-pointer border-[2px] border-solid border-white/60 transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:scale-105 active:scale-95"><input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => { handleFileChange(e); setShowImagePicker(false); }} /><Camera size={32} className="text-white mb-2 drop-shadow-md" /><span className="text-white font-black text-sm drop-shadow-md">ถ่ายรูป</span></label>
                    <label className="flex flex-col items-center justify-center bg-gradient-to-b from-purple-500 to-purple-700 p-4 rounded-[1rem] cursor-pointer border-[2px] border-solid border-white/60 transition-all duration-300 shadow-[0_0_15px_rgba(168,85,247,0.5)] hover:scale-105 active:scale-95"><input type="file" accept="video/*" capture="environment" className="hidden" onChange={(e) => { handleFileChange(e); setShowImagePicker(false); }} /><Video size={32} className="text-white mb-2 drop-shadow-md" /><span className="text-white font-black text-sm drop-shadow-md">ถ่ายวิดีโอ</span></label>
                  </div>
                  <label className="flex items-center justify-center bg-gradient-to-b from-emerald-500 to-emerald-700 p-4 rounded-[1rem] cursor-pointer border-[2px] border-solid border-white/60 transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.5)] hover:scale-[1.02] active:scale-95"><input type="file" accept="image/*, video/*" multiple className="hidden" onChange={(e) => { handleFileChange(e); setShowImagePicker(false); }} /><Monitor size={24} className="text-white mr-2 drop-shadow-md" /><span className="text-white font-black text-[14px] drop-shadow-md">เลือกคลังภาพ/วิดีโอ</span></label>
                </div>

                {/* 💻 โหมดคอมพิวเตอร์ (PC View) - จะโชว์แค่ในจอคอมพ์ */}
                <div className="hidden md:flex flex-col gap-4">
                  <label className="flex flex-col items-center justify-center bg-gradient-to-b from-emerald-500 to-emerald-700 p-8 rounded-xl cursor-pointer border-[2px] border-solid border-white/60 transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:scale-105 group">
                    <input type="file" accept="image/*, video/*" multiple className="hidden" onChange={(e) => { handleFileChange(e); setShowImagePicker(false); }} />
                    <div className="flex gap-4 mb-3"><Camera size={40} className="text-white drop-shadow-md transition-all group-hover:scale-110" /><Video size={40} className="text-white drop-shadow-md transition-all group-hover:scale-110" /></div>
                    <span className="text-white font-black text-lg drop-shadow-lg group-hover:scale-105 transition-all">เลือกรูปภาพ/วิดีโอ</span>
                    <span className="text-emerald-100 text-sm mt-1 font-bold group-hover:text-white">คลิกเพื่ออัปโหลดจากคอมพิวเตอร์</span>
                  </label>
                  
                  <button type="button" onClick={async () => {
                    try {
                      const clipboardItems = await navigator.clipboard.read();
                      for (const clipboardItem of clipboardItems) {
                        const imageTypes = clipboardItem.types.filter(type => type.startsWith('image/'));
                        if (imageTypes.length > 0) {
                          const blob = await clipboardItem.getType(imageTypes[0]);
                          const reader = new FileReader();
                          reader.onloadend = () => { setActionAttachments(prev => [...(prev || []), reader.result]); setShowImagePicker(false); };
                          reader.readAsDataURL(blob);
                          return;
                        }
                      }
                      alert("⚠️ ไม่พบรูปภาพในคลิปบอร์ดครับ โปรดแคปหน้าจอใหม่อีกครั้ง");
                    } catch (err) { alert("⚠️ เบราว์เซอร์ไม่อนุญาตให้ดึงรูปจากคลิปบอร์ดครับ โปรดตรวจสอบการอนุญาตของเบราว์เซอร์"); }
                  }} className="flex items-center justify-center gap-3 bg-slate-900 border-[2px] border-purple-500/60 p-4 rounded-xl cursor-pointer transition-all duration-300 shadow-[0_0_15px_rgba(168,85,247,0.2)] hover:bg-slate-800 hover:border-purple-400 hover:scale-[1.02] active:scale-95 group">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400 drop-shadow-md group-hover:scale-110 group-hover:text-purple-300 transition-all"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
                    <div className="flex flex-col items-start text-left"><span className="text-purple-400 font-black text-[16px] tracking-wide group-hover:text-purple-300 leading-tight">แคปหน้าจอเสร็จแล้วกดปุ่มนี้</span><span className="text-orange-400/80 text-[15px] font-bold mt-0.5">กด Win + Shift + S หรือ PRT SC</span></div>
                  </button>
                </div>
              </div>
            <button onClick={() => setShowImagePicker(false)} className="w-full mt-6 py-4 bg-slate-800 text-slate-200 font-bold rounded-xl border-[2px] border-white/40 transition-all duration-300 shadow-[0_0_10px_rgba(244,63,94,0.3)] hover:bg-rose-700 hover:text-white active:scale-95 uppercase tracking-widest">ยกเลิก</button>
          </div>
        </div>, document.body
      ) : null}
      
    </div>
  );
}