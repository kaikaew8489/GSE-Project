import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { db, storage } from '../lib/firebaseConfig';
import { collection, onSnapshot, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { 
  PlusCircle, Clock, AlertTriangle, Search, User, ChevronRight, X, LogOut, Home, 
  Calendar, ChevronLeft, CheckCircle, ChevronDown, Activity, Paperclip, Loader2, 
  Camera, UploadCloud, FileText, CheckCircle2, RotateCcw, ShieldCheck, PlayCircle, PauseCircle, Send, ClipboardPaste, Video, Monitor, ClipboardList, PhoneCall
} from 'lucide-react';

export default function TaskBoardView({ sysTime, currentUserRole, currentUserName, technicianList, setActiveTab, onGoHome }) {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  
  // Custom Pickers State
  const [showTechPickerModal, setShowTechPickerModal] = useState(false);
  const [techSearch, setTechSearch] = useState('');
  
  // Filter State
  const [filterStatus, setFilterStatus] = useState('all'); 
  const [filterDateType, setFilterDateType] = useState('all'); 
  const [filterDate, setFilterDate] = useState('');
  const [filterMonth, setFilterMonth] = useState('');

  const [showFilterDateModal, setShowFilterDateModal] = useState(false);
  const [filterCalMonth, setFilterCalMonth] = useState(sysTime.getMonth());
  const [filterCalYear, setFilterCalYear] = useState(sysTime.getFullYear());

  const [showFilterMonthModal, setShowFilterMonthModal] = useState(false);
  const [filterMonthYear, setFilterMonthYear] = useState(sysTime.getFullYear());

  // Assign Modal
  const [showDatePickerModal, setShowDatePickerModal] = useState(false);
  const [calMonth, setCalMonth] = useState(sysTime.getMonth());
  const [calYear, setCalYear] = useState(sysTime.getFullYear());

  // Action Modals State
  const [actionModal, setActionModal] = useState({ isOpen: false, type: null, dbId: null });
  const [actionReason, setActionReason] = useState('');
  const [actionFiles, setActionFiles] = useState([]);
  const [formError, setFormError] = useState('');

  // State สำหรับเลือกผู้ช่วย (Helpers) ตอนส่งงาน
  const [taskHelpers, setTaskHelpers] = useState([]);
  const [showHelperPickerModal, setShowHelperPickerModal] = useState(false);
  const [helperSearch, setHelperSearch] = useState('');

  // State ระบบอัปโหลดและ Media Picker
  const [isUploading, setIsUploading] = useState(false);
  const [mediaPickerFor, setMediaPickerFor] = useState(null); 

  // State ตรวจจับการเลื่อนหน้าจอ (Auto-Hide Navbar)
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(typeof window !== 'undefined' ? window.scrollY : 0);

  const thaiMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  const thaiMonthsFull = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
  const thaiDays = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];

  const [newTask, setNewTask] = useState({ 
    title: '', description: '', assignee: '', dueDate: '', priority: 'medium', attachments: [] 
  });

  // จับ Event Scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsNavVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsNavVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'pm_tasks'), (snapshot) => {
      try {
        const taskData = [];
        snapshot.forEach((doc) => {
          taskData.push({ dbId: doc.id, ...doc.data() });
        });
        taskData.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
        setTasks(taskData);
      } catch (err) {
        console.error("Task parsing error: ", err);
      }
    });
    return () => unsub();
  }, []);

  const generateTaskId = () => {
    const mm = String(sysTime.getMonth() + 1).padStart(2, '0');
    const yyyy = sysTime.getFullYear() + 543;
    const prefix = `PM-${mm}${String(yyyy).slice(-2)}-`;

    const currentMonthTasks = tasks.filter(t => t.taskId && t.taskId.startsWith(prefix));
    let maxNum = 0;
    currentMonthTasks.forEach(t => {
      const parts = t.taskId.split('-');
      if (parts.length === 3) {
        const num = parseInt(parts[2], 10);
        if (!isNaN(num) && num > maxNum) maxNum = num;
      }
    });
    return `${prefix}${String(maxNum + 1).padStart(4, '0')}`;
  };

  const handleFileUpload = async (e, type) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setIsUploading(true);
    setMediaPickerFor(null); 
    let uploadedUrls = [];
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const folder = type === 'init' ? 'gse_pm_init' : 'gse_pm_action';
        const fileRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(fileRef, file);
        const url = await getDownloadURL(snapshot.ref);
        uploadedUrls.push({ name: file.name, url: url, type: file.type || 'unknown' });
      }
      if (type === 'init') {
        setNewTask(prev => ({ ...prev, attachments: [...prev.attachments, ...uploadedUrls] }));
      } else {
        setActionFiles(prev => [...prev, ...uploadedUrls]);
      }
    } catch (error) {
      alert("❌ อัปโหลดไฟล์ไม่สำเร็จ: " + error.message);
    } finally {
      setIsUploading(false);
      const globalInput = document.getElementById('global-file-input');
      if (globalInput) globalInput.value = '';
    }
  };

  const handleClipboardPaste = async () => {
    if (!mediaPickerFor) return;
    try {
      const clipboardItems = await navigator.clipboard.read();
      for (const clipboardItem of clipboardItems) {
        const imageTypes = clipboardItem.types.filter(type => type.startsWith('image/'));
        if (imageTypes.length > 0) {
          const blob = await clipboardItem.getType(imageTypes[0]);
          const file = new File([blob], `snipped_image_${Date.now()}.png`, { type: blob.type });
          handleFileUpload({ target: { files: [file] } }, mediaPickerFor === 'assign' ? 'init' : 'action');
          return;
        }
      }
      alert("⚠️ ไม่พบรูปภาพที่แคปไว้ใน Clipboard ครับ!");
    } catch (err) {
      alert("⚠️ เบราว์เซอร์ไม่อนุญาต หรือท่านยังไม่ได้แคปรูปไว้ครับ");
    }
  };

  const handleMediaClick = (file) => {
    window.open(file.url, '_blank');
  };

  const renderThumbnails = (filesArray, onRemoveFile) => {
    return filesArray.map((file, idx) => {
      const isImage = file.type && file.type.startsWith('image/');
      const isVideo = file.type && file.type.startsWith('video/');

      return (
        <div key={idx} className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border-[2px] border-slate-700 hover:border-emerald-400 group shadow-[0_0_10px_rgba(0,0,0,0.5)] transition-all bg-slate-800 shrink-0">
          <div className="w-full h-full cursor-pointer" onClick={() => handleMediaClick(file)} title="คลิกเพื่อดูไฟล์เต็ม">
            {isImage ? (
              <img src={file.url} alt="thumbnail" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
            ) : isVideo ? (
              <div className="w-full h-full flex flex-col items-center justify-center relative">
                <video src={file.url} className="w-full h-full object-cover opacity-40" />
                <PlayCircle className="absolute text-white w-8 h-8 drop-shadow-md" />
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-2 group-hover:bg-slate-700 transition-colors">
                <FileText className="text-emerald-400 w-8 h-8 mb-1" />
                <span className="text-[9px] text-slate-300 truncate w-full text-center px-1">{file.name}</span>
              </div>
            )}
          </div>
          <button 
            type="button" 
            onClick={() => onRemoveFile(idx)} 
            className="absolute top-1 right-1 bg-rose-500 hover:bg-rose-600 rounded-full text-white p-0.5 shadow-md z-10 active:scale-90"
            title="ลบไฟล์นี้"
          >
            <X size={14} strokeWidth={3}/>
          </button>
        </div>
      );
    });
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) { setFormError('⚠️ กรุณาระบุ "หัวข้อภารกิจ"'); return; }
    if (!newTask.assignee) { setFormError('⚠️ กรุณาเลือก "ผู้รับผิดชอบ"'); return; }
    if (!newTask.dueDate) { setFormError('⚠️ กรุณากำหนด "วันที่เสร็จสิ้น"'); return; }
    setFormError('');

    try {
      await addDoc(collection(db, 'pm_tasks'), {
        taskId: generateTaskId(), 
        title: newTask.title,
        description: newTask.description,
        assignee: newTask.assignee,
        dueDate: newTask.dueDate,
        priority: newTask.priority,
        status: 'todo',
        createdBy: currentUserName,
        createdAt: serverTimestamp(),
        attachments: newTask.attachments,
        historyLog: [],
        reworkCount: 0,
        totalPauseMs: 0,
        helpers: [] 
      });
      setIsNewTaskModalOpen(false);
      setNewTask({ title: '', description: '', assignee: '', dueDate: '', priority: 'medium', attachments: [] });
    } catch (error) {
      alert("❌ เกิดข้อผิดพลาดในการสร้างงาน: " + error.message);
    }
  };

  const executeTaskAction = async (e) => {
    e.preventDefault();
    const { type, dbId } = actionModal;
    const task = tasks.find(t => t.dbId === dbId);
    if (!task) return;

    if ((type === 'block' || type === 'reject') && !actionReason.trim()) {
      setFormError('⚠️ กรุณาระบุสาเหตุครับ!');
      return;
    }

    try {
      let updates = { updatedAt: serverTimestamp() };
      let newLog = { type, timestamp: new Date().toISOString(), by: currentUserName };

      if (type === 'start') {
        updates.status = 'doing';
        if (!task.startedAt) updates.startedAt = serverTimestamp();
      } 
      else if (type === 'block') {
        updates.status = 'blocked';
        updates.lastBlockedAt = serverTimestamp();
        newLog.reason = actionReason;
      } 
      else if (type === 'resume') {
        updates.status = 'doing';
        if (task.lastBlockedAt) {
          const pauseDuration = new Date().getTime() - task.lastBlockedAt.toMillis();
          updates.totalPauseMs = (task.totalPauseMs || 0) + pauseDuration;
        }
      } 
      else if (type === 'submit') {
        updates.status = 'pending_verify';
        newLog.note = actionReason;
        newLog.files = actionFiles;
        newLog.helpers = taskHelpers; 
        updates.helpers = taskHelpers; 
      }
      else if (type === 'reject') {
        updates.status = 'doing';
        updates.reworkCount = (task.reworkCount || 0) + 1;
        newLog.reason = actionReason;
      } 
      else if (type === 'verify') {
        updates.status = 'done';
        updates.completedAt = serverTimestamp();
      }

      updates.historyLog = [...(task.historyLog || []), newLog];
      
      await updateDoc(doc(db, 'pm_tasks', dbId), updates);
      closeActionModal();
    } catch (error) {
      alert("❌ อัปเดตไม่สำเร็จ: " + error.message);
    }
  };

  const closeActionModal = () => {
    setActionModal({ isOpen: false, type: null, dbId: null });
    setActionReason('');
    setActionFiles([]);
    setFormError('');
    setTaskHelpers([]); 
    setHelperSearch('');
  };

  const formatDuration = (ms) => {
    if (!ms || ms < 0) return "00:00:00";
    const totalSec = Math.floor(ms / 1000);
    const d = Math.floor(totalSec / 86400);
    const h = Math.floor((totalSec % 86400) / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${d > 0 ? `${d} วัน ` : ''}${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  };

  const formatDisplayPhone = (phone) => {
    if (!phone) return '-';
    const p = String(phone).replace(/\D/g, '');
    if (p.length === 10) return `${p.slice(0, 2)}-${p.slice(2, 5)}-${p.slice(5)}`;
    return phone;
  };

  const filteredTasks = useMemo(() => {
    let result = tasks;
    
    if (currentUserRole !== 'Commander' && currentUserRole !== 'admin') {
      result = result.filter(t => t.assignee === currentUserName);
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(t => (t.title || '').toLowerCase().includes(q) || (t.taskId || '').toLowerCase().includes(q));
    }
    if (filterStatus !== 'all') {
      result = result.filter(t => t.status === filterStatus);
    }
    if (filterDateType === 'date' && filterDate) {
      result = result.filter(t => {
        if (!t.createdAt) return false;
        const d = new Date(t.createdAt.toMillis());
        const localDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        return localDate === filterDate;
      });
    } else if (filterDateType === 'month' && filterMonth) {
      result = result.filter(t => {
        if (!t.createdAt) return false;
        const d = new Date(t.createdAt.toMillis());
        const localMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        return localMonth === filterMonth;
      });
    }

    return result;
  }, [tasks, searchTerm, filterStatus, filterDateType, filterDate, filterMonth, currentUserRole, currentUserName]);

  const filteredTechs = (technicianList || [])
    .filter(t => (t.name || '').toLowerCase().includes(techSearch.toLowerCase()));
    
  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  return (
    <div className="p-4 md:p-8 animate-in fade-in duration-500 font-sans h-full flex flex-col w-full relative z-0 pb-32">
      
      <input 
        type="file" 
        multiple 
        id="global-file-input" 
        className="hidden" 
        onChange={(e) => handleFileUpload(e, mediaPickerFor === 'assign' ? 'init' : 'action')} 
      />

      <div className="relative w-full mb-4">
        <div className="absolute inset-0 bg-cyan-500/10 blur-xl rounded-2xl pointer-events-none"></div>
        <div className="bg-[#0f172a]/90 border-[2px] border-cyan-500/60 rounded-2xl p-4 md:p-5 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.3)] relative overflow-hidden">
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-cyan-400/20 blur-[50px] -translate-y-1/2 pointer-events-none"></div>
          <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-blue-500/20 blur-[50px] -translate-y-1/2 pointer-events-none"></div>
          
          <span className={`${['text-red-500', 'text-yellow-400', 'text-pink-400', 'text-green-500', 'text-orange-500', 'text-sky-400', 'text-purple-400'][sysTime.getDay()]} text-[16px] md:text-[22px] font-black tracking-widest drop-shadow-md flex items-center gap-3 relative z-10`}>
            <Clock className="w-6 h-6 md:w-7 md:h-7 animate-pulse"/> 
            วัน{thaiDays[sysTime.getDay()]}ที่ {sysTime.getDate()} {thaiMonthsFull[sysTime.getMonth()]} {sysTime.getFullYear() + 543} 
            <span className="text-slate-500 font-normal px-1 md:px-2">|</span> 
            <span className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">{sysTime.toLocaleTimeString('th-TH')}</span>
          </span>
        </div>
      </div>

      <div className="w-full flex flex-col mb-6 relative z-10">
        <div className="flex flex-col sm:flex-row gap-4 mb-4 relative z-10 w-full">
          <div className="relative w-full flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="ค้นหา รหัส หรือ ชื่อโปรเจกต์..." 
              className="w-full bg-[#0f172a]/90 border-[2px] border-cyan-500/50 hover:border-cyan-400 focus:border-cyan-400 rounded-2xl py-3.5 pl-12 pr-4 text-white outline-none transition-all text-[15px] shadow-[0_0_15px_rgba(6,182,212,0.2)] focus:shadow-[0_0_25px_rgba(6,182,212,0.4)]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {(currentUserRole === 'Commander' || currentUserRole === 'admin') && (
            <button onClick={() => { setIsNewTaskModalOpen(true); setFormError(''); }} className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-black py-3.5 px-8 rounded-2xl border-[2px] border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2 active:scale-95 transition-all text-[15px]">
              <PlusCircle className="w-6 h-6" /> มอบหมายงาน
            </button>
          )}
        </div>

        <div className="flex md:grid md:grid-cols-6 overflow-x-auto gap-2 md:gap-3 w-full relative z-10 mb-2 pb-2 md:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] snap-x">
          {[
            { id: 'all', label: 'ทั้งหมด' },
            { id: 'todo', label: 'รอดำเนินการ' },
            { id: 'doing', label: 'กำลังทำ' },
            { id: 'blocked', label: 'ติดปัญหา' },
            { id: 'pending_verify', label: 'รอยืนยัน' },
            { id: 'done', label: 'เสร็จสิ้น' },
          ].map(f => (
            <button 
              key={f.id} 
              onClick={() => setFilterStatus(f.id)}
              className={`whitespace-nowrap shrink-0 px-5 py-2.5 rounded-xl font-bold text-[14px] transition-all border-[2px] active:scale-95 ${
                filterStatus === f.id 
                ? `bg-gradient-to-b from-orange-500 to-orange-600 text-white border-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.6)]` 
                : 'bg-[#0f172a]/80 text-slate-400 border-slate-700 hover:border-slate-500 hover:text-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

       <div className="grid grid-cols-3 gap-2 md:gap-3 w-full relative z-10 mb-4">
          <button onClick={() => { setFilterDateType('all'); setFilterDate(''); setFilterMonth(''); }} className={`w-full py-2.5 md:py-3 rounded-xl font-bold text-[13px] md:text-[14px] transition-all border-[2px] active:scale-95 flex items-center justify-center ${filterDateType === 'all' ? 'bg-gradient-to-b from-cyan-500 to-blue-600 text-white border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.6)]' : 'bg-[#0f172a]/80 text-slate-400 border-slate-700 hover:border-cyan-500 hover:text-cyan-400'}`}>
            ทุกวัน
          </button>
          <button onClick={() => setShowFilterDateModal(true)} className={`w-full py-2.5 md:py-3 rounded-xl font-bold text-[13px] md:text-[14px] transition-all border-[2px] flex items-center justify-center gap-1 md:gap-1.5 active:scale-95 ${filterDateType === 'date' ? 'bg-gradient-to-b from-cyan-500 to-blue-600 text-white border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.6)]' : 'bg-[#0f172a]/80 text-slate-400 border-slate-700 hover:border-cyan-500 hover:text-cyan-400'}`}>
             <Calendar size={15} className={filterDateType === 'date' ? 'text-white' : ''}/> ระบุวัน
          </button>
          <button onClick={() => setShowFilterMonthModal(true)} className={`w-full py-2.5 md:py-3 rounded-xl font-bold text-[13px] md:text-[14px] transition-all border-[2px] flex items-center justify-center gap-1 md:gap-1.5 active:scale-95 ${filterDateType === 'month' ? 'bg-gradient-to-b from-cyan-500 to-blue-600 text-white border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.6)]' : 'bg-[#0f172a]/80 text-slate-400 border-slate-700 hover:border-cyan-500 hover:text-cyan-400'}`}>
             <Calendar size={15} className={filterDateType === 'month' ? 'text-white' : ''}/> ระบุเดือน
          </button>
        </div>
        
        <div className="mt-2 text-orange-500 text-[13px] font-bold flex items-center gap-1.5 relative z-10 drop-shadow-md">
          <Clock size={16}/> แสดงข้อมูล: {filterDateType === 'all' ? 'ทั้งหมด (ทุกวัน)' : filterDateType === 'date' && filterDate ? `ประจำวันที่ ${new Date(filterDate).toLocaleDateString('th-TH')}` : filterDateType === 'month' && filterMonth ? `ประจำเดือน ${thaiMonthsFull[parseInt(filterMonth.split('-')[1])-1]} ${parseInt(filterMonth.split('-')[0])+543}` : ''}
        </div>
      </div>

      <div className="flex flex-col gap-5 flex-1 w-full pb-8">
        {filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-600 opacity-60 bg-[#0f172a]/50 rounded-[2rem] border-[2px] border-slate-800">
            <CheckCircle className="w-16 h-16 mb-4" />
            <p className="font-black text-[18px] uppercase tracking-widest">NO TASKS</p>
            <p className="text-[14px] mt-1">ไม่พบข้อมูลงาน</p>
          </div>
        ) : (
          filteredTasks.map(task => {
            const tCreated = task.createdAt ? task.createdAt.toMillis() : sysTime.getTime();
            const tStart = task.startedAt ? task.startedAt.toMillis() : null;
            const tCompleted = task.completedAt ? task.completedAt.toMillis() : null;
            const currentEnd = tCompleted || sysTime.getTime();
            
            const waitTime = tStart ? (tStart - tCreated) : (currentEnd - tCreated);
            
            let workTime = 0;
            let totalHoldMs = task.totalPauseMs || 0; // ดึงเวลารวมที่ติดปัญหาทั้งหมด
            
            if (tStart) {
              if (task.status === 'blocked' && task.lastBlockedAt) {
                 totalHoldMs += (sysTime.getTime() - task.lastBlockedAt.toMillis());
              }
              workTime = currentEnd - tStart - totalHoldMs;
            }

            const getStatusColor = (s) => {
              if(s==='doing') return 'border-blue-500 text-blue-600 bg-blue-50';
              if(s==='blocked') return 'border-rose-500 text-rose-600 bg-rose-50';
              if(s==='pending_verify') return 'border-orange-500 text-orange-600 bg-orange-50';
              if(s==='done') return 'border-emerald-500 text-emerald-600 bg-emerald-50';
              return 'border-slate-400 text-slate-500 bg-slate-50';
            };
            const getStatusLabel = (s) => {
              if(s==='doing') return 'กำลังทำ';
              if(s==='blocked') return 'ติดปัญหา';
              if(s==='pending_verify') return 'รอยืนยัน';
              if(s==='done') return 'เสร็จสิ้นสมบูรณ์';
              return 'รอดำเนินการ';
            };

            const styleColor = getStatusColor(task.status);
            
            // ดึงข้อมูลเบอร์โทรช่างจาก systemData
            const techInfo = (technicianList || []).find(t => t.name === task.assignee);
            const techPhone = techInfo ? techInfo.phone : '-';

            return (
              <div key={task.dbId} className={`w-full bg-white dark:bg-[#0f172a]/95 rounded-[2rem] border-l-[12px] ${styleColor.split(' ')[0]} shadow-lg overflow-hidden border-t border-r border-b border-2 transition-all animate-in fade-in zoom-in-95`}>
                
                <div className="p-5 md:p-8 flex flex-col gap-5">
                  
                  {/* 🌟 2. Header (รหัสงาน และ สถานะมุมขวา) 🌟 */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <span className="text-[12px] md:text-[18px] font-mono text-emerald-600 bg-emerald-100 px-3 py-1 md:px-4 md:py-1.5 rounded-lg md:rounded-xl font-black tracking-widest border border-emerald-200 shadow-sm">
                        {task.taskId || 'PM-XXXX'}
                      </span>
                    </div>
                    <div className={`px-3 py-1 md:px-5 md:py-2 rounded-lg md:rounded-xl text-[13px] md:text-[20px] font-bold border border-2 border-solid shadow-sm flex items-center gap-1.5 md:gap-2 ${styleColor}`}>
                      {(task.status === 'todo' || task.status === 'doing' || task.status === 'blocked' || task.status === 'pending_verify') && <div className={`w-1.5 h-1.5 md:w-2.5 md:h-2.5 rounded-full animate-pulse ${task.status === 'todo' ? 'bg-slate-500' : task.status === 'doing' ? 'bg-blue-500' : task.status === 'blocked' ? 'bg-rose-500' : 'bg-orange-500'}`}></div>}
                      {getStatusLabel(task.status)}
                    </div>
                  </div>
                  
                  <h2 className="text-[20px] md:text-[28px] font-black text-slate-800 dark:text-white leading-tight">
                    {task.title}
                  </h2>
                  
                  {/* 🌟 6. กล่องรายละเอียดงาน (สีกรอบฟ้า) 🌟 */}
                  <div className="w-full bg-blue-50/50 dark:bg-[#1e293b] border-[2px] border-solid border-blue-200 dark:border-slate-700 rounded-xl md:rounded-2xl p-4 shadow-sm mt-2">
                    <span className="text-[13px] md:text-[16px] font-black text-blue-700 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                      <ClipboardList className="w-4 h-4 md:w-5 md:h-5 text-blue-500" /> รายละเอียดงานที่ได้รับมอบหมาย:
                    </span>
                    <p className="text-[14px] md:text-[18px] font-bold text-slate-700 dark:text-slate-300 leading-relaxed pl-1">
                      "{task.description || 'ไม่มีรายละเอียด'}"
                    </p>
                  </div>

                  {/* 🌟 4. กล่องผู้รับผิดชอบ (เพิ่มตัวเตือนวันส่งงาน) 🌟 */}
                  <div className="w-full bg-orange-50/40 border-[2px] border-solid border-orange-400 p-4 md:p-6 rounded-xl md:rounded-2xl shadow-sm flex flex-col transition-all hover:shadow-md mt-2">
                    <span className="text-[14px] md:text-[18px] font-black text-orange-600 mb-2 md:mb-3 flex items-center gap-1.5 uppercase tracking-wider">
                      <User className="w-4 h-4 md:w-5 md:h-5" /> ผู้รับผิดชอบงาน
                    </span>
                    <div className="flex flex-col mb-3 md:mb-4">
                      <span className="font-black text-orange-950 flex items-center gap-2 text-[16px] md:text-[24px]">
                        {task.assignee}
                      </span>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between pt-3 border-t-[1.5px] border-dashed border-orange-400/50 gap-3">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[13px] md:text-[16px] font-bold text-slate-500 flex items-center gap-1.5"><Calendar className="w-4 h-4 text-orange-500" /> กำหนดส่งมอบงาน:</span>
                          <span className="text-[14px] md:text-[18px] font-black text-slate-800 drop-shadow-sm">
                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                          </span>
                        </div>
                        {/* ระบบเตือนวัน */}
                        {task.dueDate && task.status !== 'done' && (() => {
                          const diffTime = new Date(task.dueDate).getTime() - sysTime.getTime();
                          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                          return (
                            <div className="font-bold text-[13px] md:text-[15px] text-slate-500 pl-[22px]">
                              เหลือเวลาอีก <span className={`font-black text-[15px] md:text-[18px] ${diffDays <= 3 ? 'text-rose-600 animate-pulse' : 'text-emerald-600'}`}>{diffDays}</span> วัน
                            </div>
                          );
                        })()}
                      </div>
                      
                      {techPhone !== '-' && (
                        <a href={`tel:${String(techPhone).replace(/\D/g, '')}`} className="font-mono text-[14px] md:text-[18px] font-bold bg-orange-100 px-3 py-1.5 rounded-lg text-orange-900 border border-orange-300 shadow-sm hover:bg-orange-200 transition-colors flex items-center justify-center gap-1.5 active:scale-95 w-fit h-fit shrink-0">
                          <PhoneCall className="w-4 h-4 md:w-5 md:h-5 text-orange-600" />{formatDisplayPhone(techPhone)}
                        </a>
                      )}
                    </div>
                  </div>

                  {/* 🌟 5. ไฟล์แนบอ้างอิงตอนสั่งงาน (สีกรอบเขียว) 🌟 */}
                  {task.attachments && task.attachments.length > 0 && (
                    <div className="w-full bg-emerald-50/50 dark:bg-[#1e293b] border-[2px] border-solid border-emerald-200 dark:border-slate-700 p-4 md:p-5 rounded-xl md:rounded-2xl shadow-sm mt-2">
                      <span className="text-[13px] md:text-[16px] font-black text-emerald-700 mb-3 flex items-center gap-1.5 tracking-wide">
                        <Paperclip className="w-4 h-4 md:w-5 md:h-5" /> เอกสารประกอบการมอบหมายงาน:
                      </span>
                      <div className="flex flex-wrap gap-2 md:gap-3 mt-2">
                        {task.attachments.map((file, idx) => {
                            const isImage = file.type && file.type.startsWith('image/');
                            const isVideo = file.type && file.type.startsWith('video/');
                            return (
                              <div key={idx} onClick={() => handleMediaClick(file)} className="cursor-pointer w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-[2px] border-emerald-200 dark:border-slate-600 hover:border-emerald-400 group bg-white dark:bg-slate-800 transition-all shadow-sm p-0.5">
                                {isImage ? <img src={file.url} className="w-full h-full object-cover rounded-lg group-hover:scale-110 transition-transform" /> : 
                                isVideo ? <div className="w-full h-full flex items-center justify-center relative"><video src={file.url} className="w-full h-full object-cover opacity-30 rounded-lg"/><PlayCircle className="absolute text-emerald-600 w-6 h-6"/></div> : 
                                <div className="w-full h-full flex flex-col items-center justify-center p-1"><FileText className="text-emerald-500 w-6 h-6"/><span className="text-[8px] text-slate-500 dark:text-slate-400 w-full truncate text-center leading-tight mt-1">{file.name}</span></div>}
                              </div>
                            );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 🌟 Timeline ประวัติการทำงาน (ดีไซน์กล่องสี) 🌟 */}
                  {task.historyLog && task.historyLog.length > 0 && (
                    <div className="flex flex-col w-full gap-4 mt-2">
                      {task.historyLog.map((log, index) => {
                        const blockCount = task.historyLog.slice(0, index + 1).filter(l => l.type === 'block').length;
                        const rejectCount = task.historyLog.slice(0, index + 1).filter(l => l.type === 'reject').length;
                        const submitCount = task.historyLog.slice(0, index + 1).filter(l => l.type === 'submit').length;
                        const startCount = task.historyLog.slice(0, index + 1).filter(l => l.type === 'start' || l.type === 'resume').length;
                        
                        let displayCount = '';
                        if (log.type === 'block') displayCount = `(ครั้งที่ ${blockCount})`;
                        if (log.type === 'reject') displayCount = `(ครั้งที่ ${rejectCount})`;
                        if (log.type === 'submit') displayCount = `(ครั้งที่ ${submitCount})`;
                        if (log.type === 'start' || log.type === 'resume') displayCount = `(ครั้งที่ ${startCount})`;

                        const currentTime = index < task.historyLog.length - 1 ? new Date(task.historyLog[index + 1].timestamp).getTime() : sysTime.getTime();
                        const startTime = new Date(log.timestamp).getTime();
                        const durationMs = Math.max(0, currentTime - startTime);
                        const hours = Math.floor(durationMs / 3600000);
                        const minutes = Math.floor((durationMs % 3600000) / 60000);
                        const seconds = Math.floor((durationMs % 60000) / 1000);
                        const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                        
                        const eventDate = new Date(log.timestamp);
                        const eventDateString = `${eventDate.getDate()} ${thaiMonths[eventDate.getMonth()]} ${eventDate.getFullYear() + 543}`;
                        const eventTimeString = `${String(eventDate.getHours()).padStart(2,'0')}:${String(eventDate.getMinutes()).padStart(2,'0')} น.`;

                        let boxStyle = ""; let icon = null; let title = ""; let badgeColor = "";

                        if (log.type === 'block') {
                          boxStyle = "bg-purple-50 dark:bg-purple-900/10 border-purple-400";
                          title = "แจ้งติดปัญหา";
                          icon = <PauseCircle className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />;
                          badgeColor = "bg-purple-600 text-white border-purple-400";
                        } else if (log.type === 'reject') {
                          boxStyle = "bg-rose-50 dark:bg-rose-900/10 border-rose-400";
                          title = "ส่งกลับแก้ไข (หน.)";
                          icon = <RotateCcw className="w-5 h-5 md:w-6 md:h-6 text-rose-600" />;
                          badgeColor = "bg-rose-600 text-white border-rose-400";
                        } else if (log.type === 'submit') {
                          boxStyle = "bg-cyan-50 dark:bg-cyan-900/10 border-cyan-400";
                          title = "ส่งงาน (รอตรวจ)";
                          icon = <Send className="w-5 h-5 md:w-6 md:h-6 text-cyan-600" />;
                          badgeColor = "bg-cyan-600 text-white border-cyan-400";
                        } else if (log.type === 'start' || log.type === 'resume') {
                          boxStyle = "bg-orange-50 dark:bg-orange-900/10 border-orange-400";
                          title = log.type === 'start' ? "เริ่มปฏิบัติงาน" : "ดำเนินการต่อ";
                          icon = <PlayCircle className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />;
                          badgeColor = "bg-orange-600 text-white border-orange-400";
                        } else if (log.type === 'verify') {
                           boxStyle = "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-400";
                           title = "อนุมัติผ่าน (จบงาน)";
                           icon = <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />;
                           badgeColor = "bg-emerald-600 text-white border-emerald-400";
                        }

                        if (!boxStyle) return null;

                        return (
                          <div key={index} className={`w-full rounded-2xl border-[2px] border-solid overflow-hidden shadow-sm mb-2 ${boxStyle}`}>
                            <div className="p-4 flex items-center gap-2.5 md:gap-3">
                              {icon}
                              <span className={`font-black text-[15px] md:text-[18px] uppercase tracking-wider ${boxStyle.includes('purple') ? 'text-purple-800 dark:text-purple-400' : boxStyle.includes('rose') ? 'text-rose-800 dark:text-rose-400' : boxStyle.includes('cyan') ? 'text-cyan-800 dark:text-cyan-400' : boxStyle.includes('emerald') ? 'text-emerald-800 dark:text-emerald-400' : 'text-orange-800 dark:text-orange-400'}`}>
                                {title}
                              </span>
                            </div>

                            {(log.reason || log.note) && (
                              <div className="px-4 pb-3">
                                <p className="font-bold text-[13px] md:text-[14px] text-slate-700 dark:text-slate-300 leading-snug bg-white dark:bg-[#0f172a] p-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-inner">
                                  {log.type === 'submit' ? '📝 บันทึกส่งงาน: ' : 'สาเหตุ: '}{log.reason || log.note}
                                </p>
                              </div>
                            )}

                            {log.helpers && log.helpers.length > 0 && (
                              <div className="px-4 pb-3">
                                 <div className="flex flex-wrap gap-2 items-center">
                                   <span className="text-cyan-600 dark:text-cyan-400 text-[12px] font-bold">ทีมงาน/ผู้ช่วย:</span>
                                   {log.helpers.map((h, i) => (
                                     <span key={i} className="text-[12px] font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 px-2.5 py-1 rounded-lg shadow-sm">{h}</span>
                                   ))}
                                 </div>
                              </div>
                            )}

                            {log.files && log.files.length > 0 && (
                              <div className="px-4 pb-4 w-full">
                                <label className={`text-[12px] md:text-[13px] font-black flex items-center gap-1.5 mb-2 ${boxStyle.includes('purple') ? 'text-purple-700' : boxStyle.includes('rose') ? 'text-rose-700' : 'text-cyan-700'}`}>
                                  <Camera className="w-4 h-4 md:w-5 md:h-5" /> ภาพหลักฐาน:
                                </label>
                                <div className="flex flex-wrap gap-2 w-full">
                                  {log.files.map((file, idx) => {
                                    const isImage = file.type && file.type.startsWith('image/');
                                    const isVideo = file.type && file.type.startsWith('video/');
                                    return (
                                      <div key={idx} onClick={() => handleMediaClick(file)} className={`relative w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-lg overflow-hidden border-2 shadow-sm cursor-pointer hover:scale-105 transition-all bg-slate-200 dark:bg-slate-800 ${boxStyle.includes('purple') ? 'border-purple-300' : boxStyle.includes('rose') ? 'border-rose-300' : 'border-cyan-300'}`}>
                                         {isImage ? <img src={file.url} className="w-full h-full object-cover" /> : 
                                          isVideo ? <div className="w-full h-full flex items-center justify-center relative"><video src={file.url} className="w-full h-full object-cover opacity-50"/><PlayCircle className="absolute text-white w-6 h-6"/></div> : 
                                          <div className="w-full h-full flex flex-col items-center justify-center p-1"><FileText className="text-cyan-500 w-6 h-6"/><span className="text-[8px] text-slate-500 truncate w-full text-center">{file.name}</span></div>}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            <div className={`px-4 py-3 border-t-[1.5px] border-dashed bg-white/50 dark:bg-black/10 flex justify-between items-center gap-2 ${boxStyle.includes('purple') ? 'border-purple-400' : boxStyle.includes('rose') ? 'border-rose-400' : boxStyle.includes('cyan') ? 'border-cyan-400' : boxStyle.includes('emerald') ? 'border-emerald-400' : 'border-orange-400'}`}>
                                <div className="flex flex-col gap-1">
                                  <span className={`text-[12px] md:text-[14px] font-black opacity-90 uppercase tracking-widest ${boxStyle.includes('purple') ? 'text-purple-700' : boxStyle.includes('rose') ? 'text-rose-700' : boxStyle.includes('cyan') ? 'text-cyan-700' : boxStyle.includes('emerald') ? 'text-emerald-700' : 'text-orange-700'}`}>
                                    {log.type === 'start' || log.type === 'resume' ? `ระยะเวลาที่ทำ ${displayCount}` : log.type === 'verify' ? 'ปิดงานสำเร็จ' : `ระยะเวลาที่หยุด ${displayCount}`}
                                  </span>
                                  <div className="text-[11px] md:text-[13px] font-bold flex items-center gap-1.5 opacity-80 text-slate-600 dark:text-slate-400">
                                    <Clock className="w-3.5 h-3.5" /> บันทึกเมื่อ: {eventDateString} | {eventTimeString}
                                  </div>
                                </div>
                                <span className={`font-mono font-black text-[14px] md:text-[18px] px-3 py-1.5 md:px-4 md:py-2 rounded-xl border-[2px] border-solid shadow-sm tracking-widest shrink-0 ${badgeColor}`}>
                                  {formattedTime}
                                </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* 🌟 1. กล่องสรุปเวลารวม (ย้ายมาลงล่างสุด ขยายเต็ม) 🌟 */}
                  <div className="w-full mt-2">
                    <div className="bg-orange-50 dark:bg-orange-950/20 border-[2px] border-orange-200 dark:border-orange-500/50 rounded-2xl p-4 md:p-6 shadow-sm relative overflow-hidden">
                      <div className="absolute right-0 top-0 w-32 h-32 bg-orange-200 dark:bg-orange-500/10 blur-[40px] pointer-events-none rounded-full"></div>
                      <div className="flex justify-between items-center mb-3 relative z-10">
                         <span className="text-slate-500 font-bold text-[13px] md:text-[16px] flex items-center gap-1.5"><Clock size={16}/> เวลารอดำเนินการ</span>
                         <span className="font-mono font-black text-slate-500 text-[14px] md:text-[18px]">{formatDuration(waitTime)}</span>
                      </div>
                      <div className="flex justify-between items-center mb-3 relative z-10">
                         <span className="text-orange-700 dark:text-orange-400 font-bold text-[13px] md:text-[16px] flex items-center gap-1.5"><Activity size={16}/> เวลาปฏิบัติงาน</span>
                         <span className="font-mono font-black text-orange-600 dark:text-orange-400 text-[14px] md:text-[18px] drop-shadow-sm">{formatDuration(workTime)}</span>
                      </div>
                      <div className="flex justify-between items-center mb-3 relative z-10">
                         <span className="text-purple-700 dark:text-purple-400 font-bold text-[13px] md:text-[16px] flex items-center gap-1.5"><PauseCircle size={16}/> เวลาติดปัญหา</span>
                         <span className="font-mono font-black text-purple-600 dark:text-purple-400 text-[14px] md:text-[18px] drop-shadow-sm">{formatDuration(totalHoldMs)}</span>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-orange-200 dark:border-orange-500/30 relative z-10 mt-2">
                         <span className="text-emerald-700 dark:text-emerald-400 font-black text-[15px] md:text-[20px]">เวลารวมทั้งหมด</span>
                         <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-[16px] md:text-[22px] drop-shadow-[0_0_5px_rgba(16,185,129,0.8)]">{formatDuration(waitTime + workTime + totalHoldMs)}</span>
                      </div>
                    </div>
                  </div>

                  {/* 🌟 ปุ่ม Action ด้านล่างสุด 🌟 */}
                  <div className="bg-slate-100 dark:bg-[#1e293b] p-4 rounded-xl flex flex-col sm:flex-row items-center justify-end gap-3 border border-slate-200 dark:border-slate-700 mt-2">
                      {(task.assignee === currentUserName) && (
                        <>
                          {task.status === 'todo' && <button onClick={() => setActionModal({isOpen: true, type: 'start', dbId: task.dbId})} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-black px-6 py-2.5 rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2 active:scale-95 transition-all"><PlayCircle size={18}/> เริ่มปฏิบัติงาน</button>}
                          {task.status === 'doing' && (
                            <>
                              <button onClick={() => setActionModal({isOpen: true, type: 'block', dbId: task.dbId})} className="w-full sm:w-auto bg-rose-600 hover:bg-rose-500 text-white font-black px-4 py-2.5 rounded-xl shadow-[0_0_15px_rgba(225,29,72,0.4)] flex items-center justify-center gap-2 active:scale-95 transition-all"><PauseCircle size={18}/> แจ้งติดปัญหา</button>
                              <button onClick={() => setActionModal({isOpen: true, type: 'submit', dbId: task.dbId})} className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-black px-6 py-2.5 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 active:scale-95 transition-all"><Send size={18}/> ส่งงาน (รอตรวจ)</button>
                            </>
                          )}
                          {task.status === 'blocked' && <button onClick={() => setActionModal({isOpen: true, type: 'resume', dbId: task.dbId})} className="w-full sm:w-auto bg-orange-600 hover:bg-orange-500 text-white font-black px-6 py-2.5 rounded-xl shadow-[0_0_15px_rgba(249,115,22,0.4)] flex items-center justify-center gap-2 active:scale-95 transition-all"><PlayCircle size={18}/> ดำเนินการต่อ</button>}
                        </>
                      )}

                      {(currentUserRole === 'Commander' || currentUserRole === 'admin') && task.status === 'pending_verify' && (
                        <>
                          <button onClick={() => setActionModal({isOpen: true, type: 'reject', dbId: task.dbId})} className="w-full sm:w-auto bg-rose-600 hover:bg-rose-500 text-white font-black px-5 py-2.5 rounded-xl shadow-[0_0_15px_rgba(225,29,72,0.4)] flex items-center justify-center gap-2 active:scale-95 transition-all"><RotateCcw size={18}/> ส่งกลับแก้ไข</button>
                          <button onClick={() => setActionModal({isOpen: true, type: 'verify', dbId: task.dbId})} className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-black px-6 py-2.5 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 active:scale-95 transition-all"><ShieldCheck size={18}/> อนุมัติผ่าน</button>
                        </>
                      )}
                      
                      {task.status === 'done' && (
                          <div className="w-full bg-emerald-50 border-2 border-emerald-400 text-emerald-700 font-black text-[16px] md:text-[24px] text-center py-3.5 rounded-xl shadow-sm flex items-center justify-center gap-2 cursor-default"><CheckCircle className="w-[18px] h-[18px] md:w-8 md:h-8" /> ปิดงาน (เสร็จสิ้นสมบูรณ์)</div>
                      )}
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 🌟 ACTION MODAL กลาง (ครอบจักรวาล) 🌟 */}
      {actionModal.isOpen && createPortal(
        <div className="fixed inset-0 z-[9999999] bg-[#020617]/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className={`bg-[#0f172a] border-[3px] rounded-[2rem] p-6 md:p-8 w-full max-w-md relative animate-in zoom-in-95 ${
            actionModal.type === 'reject' || actionModal.type === 'block' ? 'border-rose-500 shadow-[0_0_50px_rgba(225,29,72,0.4)]' : 
            actionModal.type === 'submit' || actionModal.type === 'verify' ? 'border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.4)]' : 
            'border-blue-500 shadow-[0_0_50px_rgba(59,130,246,0.4)]'
          }`}>
            <button onClick={closeActionModal} className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors z-20 bg-slate-800 p-2 rounded-full hover:bg-slate-700 border border-slate-600"><X size={24}/></button>
            
            <h2 className={`text-[22px] md:text-[26px] font-black mb-5 flex items-center gap-3 border-b border-slate-700/50 pb-4 ${
              actionModal.type === 'reject' || actionModal.type === 'block' ? 'text-rose-400' : 
              actionModal.type === 'submit' || actionModal.type === 'verify' ? 'text-emerald-400' : 'text-blue-400'
            }`}>
              {actionModal.type === 'block' && <><AlertTriangle/> แจ้งติดปัญหา</>}
              {actionModal.type === 'submit' && <><Send/> ส่งงาน (รอตรวจ)</>}
              {actionModal.type === 'reject' && <><RotateCcw/> ส่งกลับแก้ไข</>}
              {actionModal.type === 'start' && <><PlayCircle/> เริ่มปฏิบัติงาน</>}
              {actionModal.type === 'resume' && <><PlayCircle/> ดำเนินการต่อ</>}
              {actionModal.type === 'verify' && <><ShieldCheck/> อนุมัติผ่าน (จบงาน)</>}
            </h2>

            <form onSubmit={executeTaskAction} className="space-y-5">
              {formError && (
                <div className="bg-rose-500/10 border border-rose-500 rounded-xl p-3 text-rose-400 font-bold text-[14px] shadow-[0_0_15px_rgba(225,29,72,0.3)]">{formError}</div>
              )}

              {/* 🌟 บล็อกรวมเนื้อหาของ Popup (รหัสงาน, เหตุผล, เลือกผู้ช่วย, อัปโหลดไฟล์) 🌟 */}
              {(actionModal.type === 'block' || actionModal.type === 'reject' || actionModal.type === 'submit') && (
                <div className="space-y-4 pt-2">
                  
                  {/* แสดงรหัสงานที่หัว Popup */}
                  <p className="text-orange-400 font-bold text-center text-[14px] mb-2">
                    งานรหัส: {tasks.find(t => t.dbId === actionModal.dbId)?.taskId}
                  </p>

                  {/* กล่องเหตุผล */}
                  <div>
                    <label className="block text-slate-300 text-[14px] font-bold mb-2">
                      {actionModal.type === 'block' ? 'สาเหตุที่ติดปัญหา *' : actionModal.type === 'reject' ? 'สาเหตุที่ส่งกลับแก้ไข *' : 'บันทึกย่อการส่งงาน'}
                    </label>
                    <textarea 
                      rows="3" 
                      autoFocus 
                      required={actionModal.type !== 'submit'} 
                      className={`w-full bg-[#020617]/60 border-[2px] border-slate-600 rounded-xl p-3.5 text-white outline-none ${actionModal.type === 'block' ? 'focus:border-rose-400' : 'focus:border-cyan-400'} transition-all resize-none text-[15px] ${formError ? 'border-rose-500' : ''}`} 
                      value={actionReason} 
                      onChange={e => {setActionReason(e.target.value); setFormError('');}}
                    ></textarea>
                  </div>

                  {/* ส่วนเลือกผู้ช่วย (แสดงเฉพาะตอน Submit งาน) */}
                  {actionModal.type === 'submit' && (
                    <div className="bg-[#1e293b]/50 border border-slate-700/50 rounded-xl p-3.5 shadow-inner">
                      <label className="block text-cyan-400 text-[14px] font-bold mb-3 flex items-center gap-2"><User size={16}/> ผู้ช่วยปฏิบัติงาน (ให้เครดิตทีม)</label>
                      <div className="flex flex-wrap gap-2">
                        {taskHelpers.map((h, idx) => (
                          <span key={idx} className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 px-3 py-1.5 rounded-lg text-[13px] font-bold flex items-center gap-2 shadow-sm animate-in zoom-in">
                            {h} <button type="button" onClick={() => setTaskHelpers(prev => prev.filter(x => x !== h))} className="text-cyan-400 hover:text-rose-400 transition-colors"><X size={14}/></button>
                          </span>
                        ))}
                        <button type="button" onClick={() => setShowHelperPickerModal(true)} className="bg-slate-800 hover:bg-slate-700 border border-slate-600 border-dashed text-slate-300 px-4 py-1.5 rounded-lg text-[13px] font-bold flex items-center gap-1.5 transition-all active:scale-95">
                          <PlusCircle size={15}/> เพิ่มชื่อเพื่อนร่วมงาน
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ส่วนแนบหลักฐาน (แสดงทุก Type) */}
                  <div className="pt-2">
                    <label className="text-[13px] font-black text-slate-300 mb-2 flex items-center gap-2">
                      <Camera size={16} className={actionModal.type === 'block' ? 'text-rose-400' : 'text-cyan-400'} /> แนบหลักฐาน (ถ้ามี)
                    </label>
                    {isUploading ? (
                      <div className="w-full bg-slate-800 border-[2px] border-dashed border-slate-600 rounded-xl p-4 flex flex-col items-center justify-center text-slate-400">
                        <Loader2 className="animate-spin mb-2"/> กำลังอัปโหลด...
                      </div>
                    ) : (
                      <button type="button" onClick={() => setMediaPickerFor('action')} className="w-full h-20 border-[2px] border-dashed border-slate-600 hover:border-cyan-400 bg-slate-900/50 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95">
                        <Camera size={24} className="text-slate-500" /> <span className="font-bold text-[13px] text-slate-400">คลิกเพื่อแนบรูปภาพ/วิดีโอ</span>
                      </button>
                    )}
                    {actionFiles.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {renderThumbnails(actionFiles, (idx) => setActionFiles(prev => prev.filter((_, i) => i !== idx)))}
                      </div>
                    )}
                  </div>

                </div>
              )}

              {actionModal.type === 'verify' && <p className="text-slate-300 font-bold text-center py-4 text-[16px]">ยืนยันว่างานนี้เสร็จสมบูรณ์ 100%?</p>}
              {(actionModal.type === 'start' || actionModal.type === 'resume') && <p className="text-slate-300 font-bold text-center py-4 text-[16px]">ระบบจะเริ่มจับเวลาการทำงานของคุณ</p>}

              <div className="flex gap-3 pt-4 border-t border-slate-700/50">
                <button type="button" onClick={closeActionModal} className="flex-[1] py-3.5 bg-slate-800 text-white font-black rounded-xl hover:bg-slate-700 border border-slate-600 transition-colors active:scale-95">ยกเลิก</button>
                <button type="submit" disabled={isUploading} className={`flex-[1.5] py-3.5 text-white font-black rounded-xl shadow-lg transition-all active:scale-95 ${isUploading ? 'opacity-50' : 'hover:brightness-110'} ${
                  actionModal.type === 'reject' || actionModal.type === 'block' ? 'bg-gradient-to-r from-rose-600 to-red-600 border border-rose-400' : 
                  actionModal.type === 'submit' || actionModal.type === 'verify' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 border border-emerald-400' : 
                  'bg-gradient-to-r from-blue-600 to-cyan-600 border border-blue-400'
                }`}>
                  ยืนยัน
                </button>
              </div>
            </form>
          </div>
        </div>
      , document.body)}

      {/* 🌟 Modal 1: สร้างงานใหม่ 🌟 */}
      {isNewTaskModalOpen && createPortal(
        <div className="fixed inset-0 z-[9999999] bg-[#020617]/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#0f172a]/95 border-[2px] border-emerald-500/80 rounded-[2rem] p-6 md:p-8 w-full max-w-2xl shadow-[0_0_50px_rgba(16,185,129,0.4),inset_0_0_20px_rgba(16,185,129,0.15)] relative animate-in zoom-in-95 max-h-[95vh] overflow-y-auto [&::-webkit-scrollbar]:hidden overflow-hidden">
            
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-emerald-500/20 blur-[70px] pointer-events-none rounded-full"></div>
            <div className="absolute bottom-0 right-0 w-64 h-48 bg-cyan-500/10 blur-[70px] pointer-events-none rounded-full"></div>

            <button onClick={() => { setIsNewTaskModalOpen(false); setFormError(''); }} className="absolute top-5 right-5 text-slate-400 hover:text-rose-400 transition-colors z-20 bg-slate-800 p-2 rounded-full hover:bg-slate-700 border border-slate-600"><X size={24}/></button>

            <h2 className="text-[22px] md:text-[26px] font-black text-emerald-400 mb-5 flex items-center gap-3 border-b border-emerald-500/30 pb-4 relative z-10 drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]">
              <PlusCircle className="w-8 h-8"/> มอบหมายงานใหม่
            </h2>
            
            <form onSubmit={handleCreateTask} className="space-y-5 relative z-10">
              {formError && (
                <div className="bg-rose-500/10 border-[2px] border-rose-500/80 rounded-xl p-3 mb-2 flex items-center gap-3 animate-in fade-in zoom-in shadow-[0_0_20px_rgba(225,29,72,0.4)]">
                  <AlertTriangle className="text-rose-400 w-5 h-5 animate-pulse drop-shadow-[0_0_8px_rgba(225,29,72,0.8)]" />
                  <span className="text-rose-400 font-bold text-[14px] md:text-[15px] tracking-wide drop-shadow-sm">{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-slate-300 text-[14px] font-bold mb-2">หัวข้อภารกิจ <span className="text-rose-500">*</span></label>
                <input type="text" placeholder="ระบุชื่อโปรเจกต์ หรืองาน PM..." className={`w-full bg-[#020617]/60 border-[2px] rounded-xl p-3.5 text-white font-bold outline-none transition-colors text-[15px] ${formError.includes('หัวข้อ') ? 'border-rose-500/80 shadow-[0_0_15px_rgba(225,29,72,0.3)]' : 'border-emerald-500/50 focus:border-emerald-400'}`} value={newTask.title} onChange={e => { setNewTask({...newTask, title: e.target.value}); setFormError(''); }} />
              </div>
              
              <div>
                <label className="block text-slate-300 text-[14px] font-bold mb-2">รายละเอียดงาน / บรีฟเบื้องต้น</label>
                <textarea rows="3" placeholder="อธิบายรายละเอียดสิ่งที่ต้องทำ..." className="w-full bg-[#020617]/60 border-[2px] border-emerald-500/50 rounded-xl p-3.5 text-white outline-none focus:border-emerald-400 transition-colors resize-none text-[15px]" value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})}></textarea>
              </div>

              <div>
                <label className="block text-slate-300 text-[14px] font-bold mb-2">แนบรูปภาพ / ไฟล์อ้างอิง</label>
                {isUploading ? (
                   <div className="w-full bg-emerald-900/10 border-[2px] border-dashed border-emerald-500/50 rounded-xl p-6 flex flex-col items-center justify-center text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]">
                     <Loader2 className="w-8 h-8 animate-spin mb-2" />
                     <span className="font-bold text-[14px]">กำลังอัปโหลด...</span>
                   </div>
                ) : (
                   <button type="button" onClick={() => setMediaPickerFor('assign')} className="w-full bg-emerald-900/10 border-[2px] border-dashed border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)] rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all">
                     <div className="flex gap-3 text-emerald-400/80 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]">
                        <Camera size={32} /> <Video size={32} /> <FileText size={32} />
                     </div>
                     <span className="text-emerald-300/80 font-bold text-[14px]">คลิกเพื่อเลือก รูปภาพ / วิดีโอ / ไฟล์</span>
                   </button>
                )}

                {newTask.attachments.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-3 p-3 bg-slate-900/50 rounded-2xl border border-slate-700/50">
                    {renderThumbnails(newTask.attachments, (idx) => setNewTask(prev => ({...prev, attachments: prev.attachments.filter((_, i) => i !== idx)})))}
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 relative z-40">
                <div className="relative">
                  <label className="block text-slate-300 text-[14px] font-bold mb-2">ผู้รับผิดชอบ <span className="text-rose-500">*</span></label>
                  <button type="button" onClick={() => {setShowTechPickerModal(true); setShowDatePickerModal(false); setFormError('');}} className={`w-full bg-[#020617]/60 border-[2px] ${formError.includes('รับผิดชอบ') ? 'border-rose-500/80 shadow-[0_0_15px_rgba(225,29,72,0.3)]' : 'border-emerald-500/50 hover:border-orange-400'} rounded-xl p-3.5 text-white font-bold outline-none text-left flex justify-between items-center text-[15px]`}>
                    {newTask.assignee ? <span>{newTask.assignee}</span> : <span className="text-slate-400 font-normal">-- เลือกผู้รับผิดชอบ --</span>}
                    <ChevronDown className="w-5 h-5 text-emerald-400/80" />
                  </button>
                </div>
                <div className="relative">
                  <label className="block text-slate-300 text-[14px] font-bold mb-2">กำหนดเสร็จสิ้น <span className="text-rose-500">*</span></label>
                  <button type="button" onClick={() => {setShowDatePickerModal(true); setShowTechPickerModal(false); setFormError('');}} className={`w-full bg-[#020617]/60 border-[2px] ${formError.includes('วันที่') ? 'border-rose-500/80 shadow-[0_0_15px_rgba(225,29,72,0.3)]' : 'border-emerald-500/50 hover:border-cyan-400'} rounded-xl p-3.5 text-white font-bold outline-none text-left flex justify-between items-center text-[15px]`}>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-emerald-400/80" />
                      {newTask.dueDate ? <span>{new Date(newTask.dueDate).toLocaleDateString('th-TH')}</span> : <span className="text-slate-400 font-normal">dd/mm/yyyy</span>}
                    </div>
                  </button>
                </div>
              </div>
              
              <div className="relative z-30 pt-2">
                <label className="block text-slate-300 text-[14px] font-bold mb-2">ระดับความสำคัญ (Priority)</label>
                <div className="relative">
                  <select className="w-full bg-[#020617]/60 border-[2px] border-emerald-500/50 rounded-xl p-3.5 pl-10 text-white font-bold outline-none focus:border-emerald-400 text-[15px] appearance-none cursor-pointer" value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})}>
                    <option value="low">ระดับทั่วไป (Low)</option>
                    <option value="medium">ระดับปานกลาง (Medium)</option>
                    <option value="high">ด่วนมาก (High)</option>
                  </select>
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none drop-shadow-md">
                     {newTask.priority === 'high' ? '🔴' : newTask.priority === 'medium' ? '🟠' : '🟢'}
                  </div>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400/80 pointer-events-none" />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6 pt-5 border-t border-emerald-500/30">
                <button type="button" onClick={() => { setIsNewTaskModalOpen(false); setFormError(''); }} className="flex-[1] py-3.5 md:py-4 bg-slate-900/50 text-rose-400 font-black text-[16px] rounded-xl hover:text-white hover:bg-rose-600/80 border-[2px] border-rose-500/50 transition-all active:scale-95">ยกเลิก</button>
                <button type="submit" disabled={isUploading} className={`flex-[1.5] py-3.5 md:py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-[16px] rounded-xl border-[2px] border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all hover:brightness-110 active:scale-95`}>
                  ยืนยันมอบหมายงาน
                </button>
              </div>
            </form>
          </div>
        </div>
      , document.body)}

      {/* 🌟 Media Picker Modal 🌟 */}
      {mediaPickerFor && createPortal(
        <div className="fixed inset-0 z-[10000000] w-screen h-[100dvh] bg-[#020617]/95 backdrop-blur-3xl flex items-center justify-center p-4 animate-in fade-in zoom-in">
          <div className="bg-[#0f172a] border-[2px] border-orange-500 rounded-[2.5rem] p-6 md:p-8 w-full max-w-sm shadow-[0_0_60px_rgba(249,115,22,0.6),inset_0_0_30px_rgba(249,115,22,0.2)] relative flex flex-col items-center">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-32 bg-orange-500/30 blur-[60px] pointer-events-none rounded-full"></div>
             
             <div className="flex items-center gap-3 text-orange-400 mb-8 relative z-10 drop-shadow-[0_0_10px_rgba(249,115,22,0.8)]">
                <Monitor className="w-8 h-8" />
                <h3 className="text-[20px] md:text-[22px] font-black tracking-wide">เลือกรูปภาพ/วิดีโอ</h3>
             </div>

             <div className="w-full space-y-4 relative z-10">
                <div className="flex flex-col gap-4">
                  {/* ซ่อนปุ่มถ่ายรูป/วิดีโอบนโหมด PC */}
                  <div className="grid grid-cols-2 gap-4 md:hidden">
                    <button type="button" onClick={() => document.getElementById('global-file-input').click()} className="bg-gradient-to-b from-orange-500 to-orange-600 hover:brightness-110 text-white rounded-2xl p-4 flex flex-col items-center justify-center gap-2 border-[2px] border-orange-300 shadow-[0_0_20px_rgba(249,115,22,0.5)] active:scale-95 transition-all">
                      <Camera className="w-8 h-8" />
                      <span className="font-black text-[14px]">ถ่ายรูป</span>
                    </button>
                    <button type="button" onClick={() => document.getElementById('global-file-input').click()} className="bg-gradient-to-b from-purple-500 to-purple-600 hover:brightness-110 text-white rounded-2xl p-4 flex flex-col items-center justify-center gap-2 border-[2px] border-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.5)] active:scale-95 transition-all">
                      <Video className="w-8 h-8" />
                      <span className="font-black text-[14px]">ถ่ายวิดีโอ</span>
                    </button>
                  </div>
                  <button type="button" onClick={() => document.getElementById('global-file-input').click()} className="w-full bg-gradient-to-b from-emerald-500 to-teal-600 hover:brightness-110 text-white rounded-2xl p-4 flex items-center justify-center gap-3 border-[2px] border-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.5)] active:scale-95 transition-all font-black text-[15px]">
                    <Monitor className="w-6 h-6" /> เลือกคลังภาพ/วิดีโอ/ไฟล์
                  </button>
                </div>

                {/* โหมด PC มีปุ่มแคปหน้าจอ */}
                <div className="hidden md:flex flex-col gap-4">
                   <button type="button" onClick={handleClipboardPaste} className="w-full bg-[#1e293b] hover:bg-slate-800 text-purple-400 rounded-2xl p-4 flex flex-col items-center justify-center gap-1.5 border-[2px] border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)] active:scale-95 transition-all">
                     <div className="flex items-center gap-2">
                        <ClipboardPaste className="w-5 h-5" /> <span className="font-black text-[15px]">แคปหน้าจอเสร็จแล้วกดปุ่มนี้</span>
                     </div>
                     <span className="text-[11px] text-slate-400 font-bold">กด <span className="text-orange-400">Win + Shift + S</span> หรือ <span className="text-orange-400">PRT SC</span></span>
                   </button>
                </div>
             </div>

             <button type="button" onClick={() => setMediaPickerFor(null)} className="mt-8 w-full py-4 bg-slate-900 text-slate-300 font-black text-[16px] rounded-2xl border-[2px] border-slate-600 hover:border-rose-500 hover:text-rose-400 hover:shadow-[0_0_20px_rgba(225,29,72,0.3)] transition-all active:scale-95 relative z-10">
               ยกเลิก
             </button>
          </div>
        </div>
      , document.body)}

      {/* 🌟 Popup เลือกผู้ช่วย (Sci-Fi Cyan Glow) 🌟 */}
      {showHelperPickerModal && createPortal(
        <div className="fixed inset-0 z-[99999999] w-screen h-[100dvh] bg-[#020617]/95 backdrop-blur-2xl flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#0f172a] border-[2px] border-cyan-500 rounded-[2rem] p-6 w-full max-w-sm shadow-[0_0_60px_rgba(6,182,212,0.5)] flex flex-col max-h-[85vh] relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-32 bg-cyan-500/20 blur-[60px] pointer-events-none rounded-full"></div>
            
            <h3 className="text-[18px] md:text-[20px] font-black text-cyan-400 mb-4 text-center drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] relative z-10 flex justify-center items-center gap-2"><User size={20}/> เลือกผู้ช่วยปฏิบัติงาน</h3>
            
            <div className="mb-4 relative z-10">
              <input type="text" placeholder="พิมพ์ค้นหาชื่อเพื่อน..." autoFocus className="w-full bg-[#1e293b] border border-slate-600 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500 transition-colors shadow-inner text-[15px]" value={helperSearch} onChange={(e) => setHelperSearch(e.target.value)} />
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-cyan-500 [&::-webkit-scrollbar-thumb]:rounded-full relative z-10">
              {(technicianList || [])
                .filter(t => (t.name || '').toLowerCase().includes(helperSearch.toLowerCase()) && !taskHelpers.includes(t.name) && t.name !== currentUserName)
                .map((t, idx) => (
                <button type="button" key={idx} onClick={() => { setTaskHelpers(prev => [...prev, t.name]); setShowHelperPickerModal(false); setHelperSearch(''); }} className="w-full text-left px-4 py-3.5 bg-[#1e293b] border border-slate-700 hover:border-cyan-500 hover:bg-cyan-500/20 text-slate-200 hover:text-cyan-400 cursor-pointer rounded-xl text-[15px] font-bold transition-all active:scale-95 shadow-sm flex items-center gap-3">
                  <PlusCircle size={16}/> {t.name}
                </button>
              ))}
              {(technicianList || []).filter(t => (t.name || '').toLowerCase().includes(helperSearch.toLowerCase()) && !taskHelpers.includes(t.name) && t.name !== currentUserName).length === 0 && <div className="p-4 text-center text-slate-500 text-sm font-bold bg-slate-900/50 rounded-xl">ไม่พบรายชื่อ หรือถูกเลือกไปแล้ว</div>}
            </div>
            
            <button type="button" onClick={() => setShowHelperPickerModal(false)} className="mt-5 w-full py-4 bg-[#1e293b] text-slate-300 font-black text-[16px] rounded-2xl border border-slate-600 hover:bg-slate-800 hover:text-white transition-colors active:scale-95 relative z-10">ปิดหน้าต่าง</button>
          </div>
        </div>
      , document.body)}

      {/* 🌟 Popup เลือกลูกน้อง (Sci-Fi Orange Glow) 🌟 */}
      {showTechPickerModal && createPortal(
        <div className="fixed inset-0 z-[9999999] w-screen h-[100dvh] bg-[#020617]/95 backdrop-blur-2xl flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#0f172a] border-[2px] border-orange-500 rounded-[2rem] p-6 w-full max-w-sm shadow-[0_0_60px_rgba(249,115,22,0.5)] flex flex-col max-h-[85vh]">
            <h3 className="text-[18px] md:text-[20px] font-black text-orange-400 mb-4 text-center drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]">เลือกผู้รับผิดชอบ</h3>
            <div className="mb-4">
              <input type="text" placeholder="พิมพ์ค้นหาชื่อ..." autoFocus className="w-full bg-[#1e293b] border border-slate-600 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500 transition-colors shadow-inner" value={techSearch} onChange={(e) => setTechSearch(e.target.value)} />
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-orange-500 [&::-webkit-scrollbar-thumb]:rounded-full">
              {filteredTechs.map((t, idx) => (
                <button type="button" key={idx} onClick={() => { setNewTask({...newTask, assignee: t.name}); setShowTechPickerModal(false); setTechSearch(''); setFormError(''); }} className="w-full text-left px-4 py-3.5 bg-[#1e293b] border border-slate-700 hover:border-orange-500 hover:bg-orange-500/20 text-slate-200 hover:text-orange-400 cursor-pointer rounded-xl text-[15px] font-bold transition-all active:scale-95 shadow-sm">
                  {t.name}
                </button>
              ))}
              {filteredTechs.length === 0 && <div className="p-4 text-center text-slate-500 text-sm font-bold">ไม่พบรายชื่อช่าง</div>}
            </div>
            <button type="button" onClick={() => setShowTechPickerModal(false)} className="mt-5 w-full py-4 bg-[#1e293b] text-slate-300 font-black text-[16px] rounded-2xl border border-slate-600 hover:bg-slate-800 hover:text-white transition-colors active:scale-95">ยกเลิก</button>
          </div>
        </div>
      , document.body)}

      {/* 🌟 Popup เลือกวันที่ (Sci-Fi Cyan Glow) 🌟 */}
      {showDatePickerModal && createPortal(
        <div className="fixed inset-0 z-[9999999] w-screen h-[100dvh] bg-[#020617]/95 backdrop-blur-2xl flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#0f172a] border-[2px] border-cyan-500 rounded-[2rem] p-6 w-full max-w-sm shadow-[0_0_60px_rgba(6,182,212,0.5)]">
            <div className="flex justify-between items-center mb-6">
              <button type="button" onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(calYear-1); } else setCalMonth(calMonth-1); }} className="w-10 h-10 bg-[#1e293b] hover:bg-slate-700 flex items-center justify-center rounded-xl text-white transition-colors border border-slate-600 active:scale-95"><ChevronLeft size={20}/></button>
              <div className="flex flex-col items-center">
                <span className="text-slate-400 text-[12px] font-bold tracking-widest uppercase mb-1">เลือกวันที่</span>
                <span className="text-cyan-400 font-black text-[22px] tracking-wide drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">{thaiMonthsFull[calMonth]} {calYear + 543}</span>
              </div>
              <button type="button" onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(calYear+1); } else setCalMonth(calMonth+1); }} className="w-10 h-10 bg-[#1e293b] hover:bg-slate-700 flex items-center justify-center rounded-xl text-white transition-colors border border-slate-600 active:scale-95"><ChevronRight size={20}/></button>
            </div>
            
            <div className="grid grid-cols-7 gap-2 text-center mb-3">
              {['อา','จ','อ','พ','พฤ','ศ','ส'].map((d, i) => <span key={d} className={`text-[14px] font-black ${i===0?'text-rose-400':i===6?'text-sky-400':'text-slate-300'}`}>{d}</span>)}
            </div>
            
            <div className="grid grid-cols-7 gap-2 mb-6">
              {Array.from({ length: getFirstDayOfMonth(calMonth, calYear) }).map((_, i) => <div key={`empty-${i}`}/>)}
              {Array.from({ length: getDaysInMonth(calMonth, calYear) }).map((_, i) => {
                const d = i + 1;
                const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                const isSelected = newTask.dueDate === dateStr;
                return (
                  <button 
                    type="button" 
                    key={d} 
                    onClick={() => { setNewTask({...newTask, dueDate: dateStr}); setShowDatePickerModal(false); setFormError(''); }} 
                    className={`aspect-square rounded-[1rem] flex items-center justify-center text-[15px] font-black transition-all active:scale-90 border ${isSelected ? 'bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.8)] border-orange-300' : 'bg-transparent text-slate-300 border-slate-700 hover:border-cyan-400 hover:text-cyan-300'}`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>

            <button type="button" onClick={() => setShowDatePickerModal(false)} className="w-full py-4 bg-cyan-600 text-white font-black text-[16px] rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:bg-cyan-500 transition-all active:scale-95">ยกเลิก</button>
          </div>
        </div>
      , document.body)}

      {/* 🌟 Filter Date Modal (Sci-Fi Cyan) 🌟 */}
      {showFilterDateModal && createPortal(
        <div className="fixed inset-0 z-[9999999] w-screen h-[100dvh] bg-[#020617]/95 backdrop-blur-2xl flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#0f172a] border-[2px] border-cyan-500 rounded-[2rem] p-6 md:p-8 w-full max-w-sm shadow-[0_0_60px_rgba(6,182,212,0.5)]">
            <div className="flex justify-between items-center mb-6">
              <button type="button" onClick={() => { if (filterCalMonth === 0) { setFilterCalMonth(11); setFilterCalYear(filterCalYear-1); } else setFilterCalMonth(filterCalMonth-1); }} className="w-10 h-10 bg-[#1e293b] hover:bg-slate-700 flex items-center justify-center rounded-xl text-white transition-colors border border-slate-600"><ChevronLeft size={20}/></button>
              <div className="flex flex-col items-center">
                <span className="text-slate-400 text-[12px] font-bold tracking-widest uppercase mb-1">เลือกวันที่</span>
                <span className="text-cyan-400 font-black text-[22px] tracking-wide drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">{thaiMonthsFull[filterCalMonth]} {filterCalYear + 543}</span>
              </div>
              <button type="button" onClick={() => { if (filterCalMonth === 11) { setFilterCalMonth(0); setFilterCalYear(filterCalYear+1); } else setFilterCalMonth(filterCalMonth+1); }} className="w-10 h-10 bg-[#1e293b] hover:bg-slate-700 flex items-center justify-center rounded-xl text-white transition-colors border border-slate-600"><ChevronRight size={20}/></button>
            </div>
            
            <div className="grid grid-cols-7 gap-2 text-center mb-3">
              {['อา','จ','อ','พ','พฤ','ศ','ส'].map((d, i) => <span key={d} className={`text-[14px] font-black ${i===0?'text-rose-400':i===6?'text-sky-400':'text-slate-300'}`}>{d}</span>)}
            </div>
            
            <div className="grid grid-cols-7 gap-2 mb-6">
              {Array.from({ length: getFirstDayOfMonth(filterCalMonth, filterCalYear) }).map((_, i) => <div key={`empty-${i}`}/>)}
              {Array.from({ length: getDaysInMonth(filterCalMonth, filterCalYear) }).map((_, i) => {
                const d = i + 1;
                const dateStr = `${filterCalYear}-${String(filterCalMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                const isSelected = filterDate === dateStr && filterDateType === 'date';
                return (
                  <button 
                    type="button" 
                    key={d} 
                    onClick={() => { setFilterDateType('date'); setFilterDate(dateStr); setShowFilterDateModal(false); }} 
                    className={`aspect-square rounded-[1rem] flex items-center justify-center text-[15px] font-black transition-all border active:scale-90 ${isSelected ? 'bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.8)] border-orange-300' : 'bg-transparent text-slate-300 border-slate-700 hover:bg-cyan-500/30 hover:border-cyan-400 hover:text-cyan-300'}`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>

            <button type="button" onClick={() => setShowFilterDateModal(false)} className="w-full py-4 bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-black text-[16px] rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all active:scale-95">ยกเลิก</button>
          </div>
        </div>
      , document.body)}

      {/* 🌟 Filter Month Modal (Sci-Fi Cyan) 🌟 */}
      {showFilterMonthModal && createPortal(
        <div className="fixed inset-0 z-[9999999] w-screen h-[100dvh] bg-[#020617]/95 backdrop-blur-2xl flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#0f172a] border-[2px] border-cyan-500 rounded-[2rem] p-6 md:p-8 w-full max-w-sm shadow-[0_0_60px_rgba(6,182,212,0.5)]">
            <div className="flex justify-between items-center mb-6">
              <button type="button" onClick={() => setFilterMonthYear(filterMonthYear-1)} className="w-10 h-10 bg-[#1e293b] hover:bg-slate-700 flex items-center justify-center rounded-xl text-white transition-colors border border-slate-600"><ChevronLeft size={20}/></button>
              <div className="flex flex-col items-center">
                <span className="text-slate-400 text-[12px] font-bold tracking-widest uppercase mb-1">เลือกเดือน</span>
                <span className="text-cyan-400 font-black text-[26px] tracking-wide drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">{filterMonthYear + 543}</span>
              </div>
              <button type="button" onClick={() => setFilterMonthYear(filterMonthYear+1)} className="w-10 h-10 bg-[#1e293b] hover:bg-slate-700 flex items-center justify-center rounded-xl text-white transition-colors border border-slate-600"><ChevronRight size={20}/></button>
            </div>
            
            <div className="grid grid-cols-3 gap-3 mb-8">
              {thaiMonths.map((m, i) => {
                const monthStr = `${filterMonthYear}-${String(i + 1).padStart(2, '0')}`;
                const isSelected = filterMonth === monthStr && filterDateType === 'month';
                return (
                  <button 
                    type="button" 
                    key={i} 
                    onClick={() => { setFilterDateType('month'); setFilterMonth(monthStr); setShowFilterMonthModal(false); }} 
                    className={`py-4 rounded-2xl text-[16px] font-black transition-all border active:scale-95 ${isSelected ? 'bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.8)] border-orange-300' : 'bg-[#1e293b] text-slate-300 border-slate-700 hover:border-cyan-400 hover:text-cyan-300'}`}
                  >
                    {m}
                  </button>
                );
              })}
            </div>

            <button type="button" onClick={() => setShowFilterMonthModal(false)} className="w-full py-4 bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-black text-[16px] rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all active:scale-95">ยกเลิก</button>
          </div>
        </div>
      , document.body)}

    </div>
  );
}