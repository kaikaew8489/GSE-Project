import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { db, storage } from '../lib/firebaseConfig';
import { collection, onSnapshot, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { 
  PlusCircle, Clock, AlertTriangle, Search, User, ChevronRight, X, LogOut, Home, 
  Calendar, ChevronLeft, CheckCircle, ChevronDown, Activity, Paperclip, Loader2, 
  Camera, UploadCloud, FileText, CheckCircle2, RotateCcw, ShieldCheck, PlayCircle, PauseCircle, Send, ClipboardPaste, Video, Monitor
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

  // State ระบบอัปโหลดและ Media Picker
  const [isUploading, setIsUploading] = useState(false);
  const [mediaPickerFor, setMediaPickerFor] = useState(null); 

  const thaiMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  const thaiMonthsFull = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
  const thaiDays = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];

  const [newTask, setNewTask] = useState({ 
    title: '', description: '', assignee: '', dueDate: '', priority: 'medium', attachments: [] 
  });

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

  const renderThumbnails = (filesArray, onRemoveFile) => {
    return filesArray.map((file, idx) => {
      const isImage = file.type && file.type.startsWith('image/');
      const isVideo = file.type && file.type.startsWith('video/');

      return (
        <div key={idx} className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border-[2px] border-slate-700 hover:border-emerald-400 group shadow-[0_0_10px_rgba(0,0,0,0.5)] transition-all bg-slate-800 shrink-0">
          <div className="w-full h-full cursor-pointer" onClick={() => window.open(file.url, '_blank')} title="คลิกเพื่อดูรูปเต็ม">
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
        totalPauseMs: 0
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
      result = result.filter(t => t.createdAt && new Date(t.createdAt.toMillis()).toISOString().split('T')[0] === filterDate);
    } else if (filterDateType === 'month' && filterMonth) {
      result = result.filter(t => t.createdAt && new Date(t.createdAt.toMillis()).toISOString().substring(0, 7) === filterMonth);
    }

    return result;
  }, [tasks, searchTerm, filterStatus, filterDateType, filterDate, filterMonth, currentUserRole, currentUserName]);

  const filteredTechs = (technicianList || []).filter(t => (t.name || '').toLowerCase().includes(techSearch.toLowerCase()));
  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  return (
    <div className="p-4 md:p-8 animate-in fade-in duration-500 font-sans h-full flex flex-col w-full relative z-0">
      
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
          
          <span className="text-cyan-400 text-[16px] md:text-[22px] font-black tracking-widest drop-shadow-[0_0_10px_rgba(6,182,212,0.8)] flex items-center gap-3 relative z-10">
            <Clock className="w-6 h-6 md:w-7 md:h-7 animate-pulse"/> 
            วัน{thaiDays[sysTime.getDay()]}ที่ {sysTime.getDate()} {thaiMonthsFull[sysTime.getMonth()]} {sysTime.getFullYear() + 543} 
            <span className="text-slate-500 font-normal px-1 md:px-2">|</span> 
            <span className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">{sysTime.toLocaleTimeString('th-TH')}</span>
          </span>
        </div>
      </div>

      <div className="w-full flex flex-col gap-4 mb-6">
        <div className="relative w-full">
          <div className="absolute inset-0 bg-emerald-500/10 blur-xl rounded-2xl pointer-events-none"></div>
          <div className="bg-[#0f172a]/80 border-[2px] border-emerald-500/50 rounded-2xl p-4 flex flex-col md:flex-row justify-between items-center gap-4 shadow-[0_0_20px_rgba(16,185,129,0.2)] relative z-10">
            
            <div className="relative w-full flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="ค้นหารหัสงาน หรือ ชื่อโปรเจกต์..." 
                className="w-full bg-[#1e293b] border-[2px] border-slate-600 rounded-xl py-3 pl-12 pr-4 text-white focus:border-emerald-400 outline-none transition-all text-[15px] shadow-inner"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {(currentUserRole === 'Commander' || currentUserRole === 'admin') && (
              <button onClick={() => { setIsNewTaskModalOpen(true); setFormError(''); }} className="w-full md:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-black py-3 px-8 rounded-xl border-[2px] border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2 active:scale-95 transition-all text-[15px] shrink-0">
                <PlusCircle className="w-5 h-5" /> มอบหมายงาน
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-2">
          {[
            { id: 'all', label: 'ทั้งหมด', color: 'slate' },
            { id: 'todo', label: 'รอดำเนินการ', color: 'slate' },
            { id: 'doing', label: 'กำลังทำ', color: 'blue' },
            { id: 'blocked', label: 'ติดปัญหา/รอของ', color: 'rose' },
            { id: 'pending_verify', label: 'รอ หน. ยืนยัน', color: 'orange' },
            { id: 'done', label: 'เสร็จสิ้น', color: 'emerald' },
          ].map(f => (
            <button 
              key={f.id} 
              onClick={() => setFilterStatus(f.id)}
              className={`px-4 py-2 rounded-xl font-bold text-[13px] md:text-[14px] transition-all border-[2px] active:scale-95 ${
                filterStatus === f.id 
                ? `bg-${f.color}-500/20 text-${f.color}-400 border-${f.color}-500 shadow-[0_0_15px_rgba(currentColor,0.4)]` 
                : 'bg-[#1e293b] text-slate-400 border-slate-700 hover:border-slate-500'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <button onClick={() => { setFilterDateType('all'); setFilterDate(''); setFilterMonth(''); }} className={`px-5 py-2.5 rounded-xl font-bold text-[14px] transition-all border-[2px] ${filterDateType === 'all' ? 'bg-cyan-600 text-white border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 'bg-[#1e293b] text-slate-400 border-slate-700 hover:border-cyan-500 hover:text-cyan-400'}`}>
            ทุกวัน
          </button>
          <button onClick={() => setShowFilterDateModal(true)} className={`px-5 py-2.5 rounded-xl font-bold text-[14px] transition-all border-[2px] flex items-center gap-2 ${filterDateType === 'date' ? 'bg-[#0f172a] text-cyan-400 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)]' : 'bg-[#0f172a] text-slate-400 border-slate-700 hover:border-cyan-500 hover:text-cyan-400'}`}>
             <Calendar size={16} /> ระบุวัน
          </button>
          <button onClick={() => setShowFilterMonthModal(true)} className={`px-5 py-2.5 rounded-xl font-bold text-[14px] transition-all border-[2px] flex items-center gap-2 ${filterDateType === 'month' ? 'bg-[#0f172a] text-cyan-400 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)]' : 'bg-[#0f172a] text-slate-400 border-slate-700 hover:border-cyan-500 hover:text-cyan-400'}`}>
             <Calendar size={16} /> ระบุเดือน
          </button>
        </div>
        <div className="mt-1 text-orange-500 text-[13px] font-bold flex items-center gap-1.5">
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
            if (tStart) {
              let pauseAcc = task.totalPauseMs || 0;
              if (task.status === 'blocked' && task.lastBlockedAt) {
                 pauseAcc += (sysTime.getTime() - task.lastBlockedAt.toMillis());
              }
              workTime = currentEnd - tStart - pauseAcc;
            }

            const getStatusColor = (s) => {
              if(s==='doing') return 'text-blue-400 bg-blue-500/10 border-blue-500';
              if(s==='blocked') return 'text-rose-400 bg-rose-500/10 border-rose-500';
              if(s==='pending_verify') return 'text-orange-400 bg-orange-500/10 border-orange-500';
              if(s==='done') return 'text-emerald-400 bg-emerald-500/10 border-emerald-500';
              return 'text-slate-400 bg-slate-500/10 border-slate-500';
            };
            const getStatusLabel = (s) => {
              if(s==='doing') return 'กำลังทำ';
              if(s==='blocked') return 'ติดปัญหา';
              if(s==='pending_verify') return 'รอ หน. ยืนยัน';
              if(s==='done') return 'เสร็จสิ้น';
              return 'รอดำเนินการ';
            };

            return (
              <div key={task.dbId} className="w-full bg-[#f8fafc] dark:bg-[#0f172a]/95 rounded-[1.5rem] border-[2px] border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
                
                <div className="p-5 md:p-6 flex flex-col md:flex-row gap-5">
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-lg font-mono font-black text-[13px] border border-emerald-300 dark:border-emerald-500/50">
                        {task.taskId || 'PM-XXXX'}
                      </span>
                      <span className={`px-3 py-1 rounded-lg font-black text-[13px] border shadow-sm ${getStatusColor(task.status)}`}>
                        {getStatusLabel(task.status)}
                      </span>
                      {task.reworkCount > 0 && (
                        <span className="bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 px-2 py-1 rounded-lg font-bold text-[12px] border border-rose-300 animate-pulse">
                          แก้ครั้งที่ {task.reworkCount}
                        </span>
                      )}
                    </div>
                    
                    <h2 className="text-[20px] md:text-[24px] font-black text-slate-800 dark:text-white mb-2 leading-tight">
                      {task.title}
                    </h2>
                    <p className="text-[14px] text-slate-600 dark:text-slate-400 mb-4 bg-slate-100 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                      {task.description || 'ไม่มีรายละเอียด'}
                    </p>

                    <div className="flex flex-wrap gap-4 mt-auto">
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-[#1e293b] px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                        <User size={16} className="text-cyan-500"/> <span className="font-bold text-[13px]">{task.assignee}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-[#1e293b] px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                        <Calendar size={16} className="text-rose-500"/> <span className="font-bold text-[13px]">Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString('th-TH') : '-'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-[350px] flex flex-col gap-3 shrink-0">
                    <div className="bg-orange-50 dark:bg-orange-950/20 border-[2px] border-orange-200 dark:border-orange-500/50 rounded-2xl p-4 shadow-sm relative overflow-hidden">
                      <div className="absolute right-0 top-0 w-32 h-32 bg-orange-200 dark:bg-orange-500/10 blur-[40px] pointer-events-none rounded-full"></div>
                      <div className="flex justify-between items-center mb-2 relative z-10">
                         <span className="text-orange-700 dark:text-orange-400 font-bold text-[13px] flex items-center gap-1.5"><Clock size={14}/> เวลารอดำเนินการ</span>
                         <span className="font-mono font-black text-slate-700 dark:text-slate-300 text-[14px]">{formatDuration(waitTime)}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2 relative z-10">
                         <span className="text-orange-700 dark:text-orange-400 font-bold text-[13px] flex items-center gap-1.5"><Activity size={14}/> เวลาปฏิบัติงาน</span>
                         <span className="font-mono font-black text-orange-600 dark:text-orange-400 text-[14px] drop-shadow-sm">{formatDuration(workTime)}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-orange-200 dark:border-orange-500/30 relative z-10 mt-1">
                         <span className="text-orange-800 dark:text-orange-300 font-black text-[14px]">เวลารวมทั้งหมด</span>
                         <span className="font-mono font-black text-orange-600 dark:text-orange-400 text-[16px]">{formatDuration(waitTime + workTime)}</span>
                      </div>
                    </div>

                    {task.historyLog && task.historyLog.slice().reverse().filter(l => l.type === 'block' || l.type === 'reject').slice(0,1).map((log, idx) => (
                       <div key={idx} className={`border-[2px] rounded-2xl p-4 shadow-sm ${log.type === 'block' ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-500/50' : 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-500/50'}`}>
                         <h4 className={`font-black text-[14px] mb-1 flex items-center gap-1.5 ${log.type === 'block' ? 'text-purple-700 dark:text-purple-400' : 'text-rose-700 dark:text-rose-400'}`}>
                           {log.type === 'block' ? <PauseCircle size={16}/> : <RotateCcw size={16}/>} 
                           {log.type === 'block' ? 'แจ้งเหตุขัดข้อง' : 'ส่งกลับแก้ไข (หน.)'}
                         </h4>
                         <p className="text-slate-600 dark:text-slate-300 text-[13px] font-bold bg-white dark:bg-slate-900 p-2 rounded-lg border border-inherit">สาเหตุ: {log.reason}</p>
                         <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1"><Clock size={12}/> {new Date(log.timestamp).toLocaleString('th-TH')}</p>
                       </div>
                    ))}
                  </div>
                </div>

                {((task.attachments && task.attachments.length > 0) || (task.historyLog && task.historyLog.find(l => l.type === 'submit'))) && (
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-4 border-t border-slate-200 dark:border-slate-700">
                    
                    {task.attachments && task.attachments.length > 0 && (
                      <div className="mb-4">
                        <div className="text-emerald-500 dark:text-emerald-400 text-[13px] font-bold mb-2 flex items-center gap-1.5">
                          <Paperclip size={14}/> ไฟล์แนบอ้างอิงตอนสั่งงาน:
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {task.attachments.map((file, idx) => {
                             const isImage = file.type && file.type.startsWith('image/');
                             const isVideo = file.type && file.type.startsWith('video/');
                             return (
                               <div key={idx} onClick={() => window.open(file.url, '_blank')} className="cursor-pointer w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-[2px] border-slate-300 dark:border-slate-600 hover:border-emerald-400 group bg-slate-200 dark:bg-slate-800 transition-all">
                                 {isImage ? <img src={file.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform" /> : 
                                  isVideo ? <div className="w-full h-full flex items-center justify-center relative"><video src={file.url} className="w-full h-full object-cover opacity-30"/><PlayCircle className="absolute text-white w-6 h-6"/></div> : 
                                  <div className="w-full h-full flex flex-col items-center justify-center p-1"><FileText className="text-emerald-400 w-6 h-6"/><span className="text-[8px] text-slate-500 dark:text-slate-400 w-full truncate text-center">{file.name}</span></div>}
                               </div>
                             );
                          })}
                        </div>
                      </div>
                    )}

                    {task.historyLog && task.historyLog.slice().reverse().find(l => l.type === 'submit') && (() => {
                       const submitLog = task.historyLog.slice().reverse().find(l => l.type === 'submit');
                       return (
                         <div className="pt-3 border-t border-slate-200 dark:border-slate-700/50">
                           <div className="text-cyan-600 dark:text-cyan-400 text-[13px] font-bold mb-2 flex items-center gap-1.5">
                             <CheckCircle2 size={14}/> ไฟล์/หลักฐานการส่งงาน:
                           </div>
                           {submitLog.files && submitLog.files.length > 0 ? (
                             <div className="flex flex-wrap gap-3">
                               {submitLog.files.map((file, idx) => {
                                  const isImage = file.type && file.type.startsWith('image/');
                                  const isVideo = file.type && file.type.startsWith('video/');
                                  return (
                                    <div key={idx} onClick={() => window.open(file.url, '_blank')} className="cursor-pointer w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-[2px] border-slate-300 dark:border-slate-600 hover:border-cyan-400 group bg-slate-200 dark:bg-slate-800 transition-all">
                                      {isImage ? <img src={file.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform" /> : 
                                       isVideo ? <div className="w-full h-full flex items-center justify-center relative"><video src={file.url} className="w-full h-full object-cover opacity-30"/><PlayCircle className="absolute text-white w-6 h-6"/></div> : 
                                       <div className="w-full h-full flex flex-col items-center justify-center p-1"><FileText className="text-cyan-400 w-6 h-6"/><span className="text-[8px] text-slate-500 dark:text-slate-400 w-full truncate text-center">{file.name}</span></div>}
                                    </div>
                                  );
                               })}
                             </div>
                           ) : (
                             <span className="text-slate-500 text-[12px]">- ไม่มีการแนบไฟล์ตอนส่งงาน -</span>
                           )}
                           {submitLog.note && <p className="text-slate-600 dark:text-slate-400 text-[13px] mt-3 bg-white dark:bg-[#0f172a] p-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-inner">📝 บันทึกส่งงาน: {submitLog.note}</p>}
                         </div>
                       );
                    })()}
                  </div>
                )}

                <div className="bg-slate-100 dark:bg-[#1e293b] p-4 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-700">
                    {(currentUserRole === 'reporter' && task.assignee === currentUserName) && (
                      <>
                        {task.status === 'todo' && <button onClick={() => setActionModal({isOpen: true, type: 'start', dbId: task.dbId})} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-black px-6 py-2.5 rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2"><PlayCircle size={18}/> เริ่มปฏิบัติงาน</button>}
                        {task.status === 'doing' && (
                          <>
                            <button onClick={() => setActionModal({isOpen: true, type: 'block', dbId: task.dbId})} className="w-full sm:w-auto bg-rose-600 hover:bg-rose-500 text-white font-black px-4 py-2.5 rounded-xl shadow-[0_0_15px_rgba(225,29,72,0.4)] flex items-center justify-center gap-2"><PauseCircle size={18}/> แจ้งขัดข้อง</button>
                            <button onClick={() => setActionModal({isOpen: true, type: 'submit', dbId: task.dbId})} className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-black px-6 py-2.5 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2"><Send size={18}/> ส่งงาน (รอตรวจ)</button>
                          </>
                        )}
                        {task.status === 'blocked' && <button onClick={() => setActionModal({isOpen: true, type: 'resume', dbId: task.dbId})} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-black px-6 py-2.5 rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2"><PlayCircle size={18}/> ดำเนินการต่อ</button>}
                      </>
                    )}

                    {(currentUserRole === 'Commander' || currentUserRole === 'admin') && task.status === 'pending_verify' && (
                      <>
                        <button onClick={() => setActionModal({isOpen: true, type: 'reject', dbId: task.dbId})} className="w-full sm:w-auto bg-rose-600 hover:bg-rose-500 text-white font-black px-5 py-2.5 rounded-xl shadow-[0_0_15px_rgba(225,29,72,0.4)] flex items-center justify-center gap-2"><RotateCcw size={18}/> ส่งกลับแก้ไข</button>
                        <button onClick={() => setActionModal({isOpen: true, type: 'verify', dbId: task.dbId})} className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-black px-6 py-2.5 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2"><ShieldCheck size={18}/> อนุมัติผ่าน</button>
                      </>
                    )}
                </div>

              </div>
            );
          })
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full mt-6 pt-6 border-t-[2px] border-slate-700/80">
        <button onClick={onGoHome} className="flex-1 py-4 bg-slate-800/80 text-rose-400 font-black rounded-2xl hover:bg-rose-900/50 border-[2px] border-slate-700 hover:border-rose-500 transition-all flex justify-center items-center gap-2 active:scale-95 text-[16px] md:text-[18px] shadow-lg">
          <LogOut size={22}/> ออกจากระบบ
        </button>
        <button onClick={() => setActiveTab('hub')} className="flex-[2] py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black rounded-2xl border-[2px] border-emerald-400 hover:brightness-110 shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all flex justify-center items-center gap-2 active:scale-95 text-[16px] md:text-[18px]">
          <Home size={22}/> กลับหน้าหลัก
        </button>
      </div>

      {/* 🌟 ACTION MODAL กลาง (ครอบจักรวาล) 🌟 */}
      {actionModal.isOpen && createPortal(
        <div className="fixed inset-0 z-[9999999] bg-[#020617]/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className={`bg-[#0f172a] border-[3px] rounded-[2rem] p-6 md:p-8 w-full max-w-md relative animate-in zoom-in-95 ${
            actionModal.type === 'reject' || actionModal.type === 'block' ? 'border-rose-500 shadow-[0_0_50px_rgba(225,29,72,0.4)]' : 
            actionModal.type === 'submit' || actionModal.type === 'verify' ? 'border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.4)]' : 
            'border-blue-500 shadow-[0_0_50px_rgba(59,130,246,0.4)]'
          }`}>
            <button onClick={closeActionModal} className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors z-20 bg-slate-800 p-2 rounded-full hover:bg-slate-700"><X size={24}/></button>
            
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
                <div className="bg-rose-500/10 border border-rose-500 rounded-xl p-3 text-rose-400 font-bold text-[14px]">{formError}</div>
              )}

              {(actionModal.type === 'block' || actionModal.type === 'reject' || actionModal.type === 'submit') && (
                <div>
                  <label className="block text-slate-300 text-[14px] font-bold mb-2">
                    {actionModal.type === 'block' ? 'สาเหตุที่ติดปัญหา *' : actionModal.type === 'reject' ? 'สาเหตุที่ส่งกลับแก้ไข *' : 'บันทึกย่อการส่งงาน'}
                  </label>
                  <textarea rows="3" autoFocus required={actionModal.type !== 'submit'} className="w-full bg-[#020617]/60 border-[2px] border-slate-600 rounded-xl p-3.5 text-white outline-none focus:border-cyan-400 transition-all resize-none text-[15px]" value={actionReason} onChange={e => setActionReason(e.target.value)}></textarea>
                </div>
              )}

              {actionModal.type === 'submit' && (
                <div>
                  <label className="block text-slate-300 text-[14px] font-bold mb-2">แนบหลักฐานการทำงาน</label>
                  {isUploading ? (
                     <div className="w-full bg-emerald-900/10 border-[2px] border-dashed border-emerald-500/50 rounded-xl p-6 flex flex-col items-center justify-center text-emerald-400">
                       <Loader2 className="w-8 h-8 animate-spin mb-2" />
                       <span className="font-bold text-[14px]">กำลังอัปโหลด...</span>
                     </div>
                  ) : (
                     <button type="button" onClick={() => setMediaPickerFor('action')} className="w-full bg-emerald-900/10 border-[2px] border-dashed border-emerald-500/50 shadow-sm rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:border-emerald-400 transition-all">
                       <Camera size={32} className="text-emerald-400/80 drop-shadow-md" />
                       <span className="text-emerald-300/80 font-bold text-[14px]">แตะเพื่อเลือก รูปภาพ / วิดีโอ</span>
                     </button>
                  )}

                  {actionFiles.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-3 p-3 bg-slate-900/50 rounded-2xl border border-slate-700/50">
                      {renderThumbnails(actionFiles, (idx) => setActionFiles(prev => prev.filter((_, i) => i !== idx)))}
                    </div>
                  )}
                </div>
              )}

              {actionModal.type === 'verify' && (
                 <p className="text-slate-300 font-bold text-center py-4 text-[16px]">ยืนยันว่างานนี้เสร็จสมบูรณ์ 100%?</p>
              )}
              {(actionModal.type === 'start' || actionModal.type === 'resume') && (
                 <p className="text-slate-300 font-bold text-center py-4 text-[16px]">ระบบจะเริ่มจับเวลาการทำงานของคุณ</p>
              )}

              <div className="flex gap-3 pt-4 border-t border-slate-700/50">
                <button type="button" onClick={closeActionModal} className="flex-[1] py-3.5 bg-slate-800 text-white font-black rounded-xl hover:bg-slate-700 transition-colors">ยกเลิก</button>
                <button type="submit" disabled={isUploading} className={`flex-[1.5] py-3.5 text-white font-black rounded-xl shadow-lg transition-all ${isUploading ? 'opacity-50' : 'hover:brightness-110 active:scale-95'} ${
                  actionModal.type === 'reject' || actionModal.type === 'block' ? 'bg-gradient-to-r from-rose-600 to-red-600 border-rose-400' : 
                  actionModal.type === 'submit' || actionModal.type === 'verify' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 border-emerald-400' : 
                  'bg-gradient-to-r from-blue-600 to-cyan-600 border-blue-400'
                }`}>
                  ยืนยัน
                </button>
              </div>
            </form>
          </div>
        </div>
      , document.body)}

      {/* 🌟 Modal 1: สร้างงานใหม่ (ของเดิม คงความ Sci-Fi) 🌟 */}
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
                  <button type="button" onClick={() => {setShowTechPickerModal(true); setShowDatePickerModal(false); setFormError('');}} className={`w-full bg-[#020617]/60 border-[2px] ${formError.includes('รับผิดชอบ') ? 'border-rose-500/80' : 'border-emerald-500/50 hover:border-orange-400'} rounded-xl p-3.5 text-white font-bold outline-none text-left flex justify-between items-center text-[15px]`}>
                    {newTask.assignee ? <span>{newTask.assignee}</span> : <span className="text-slate-400 font-normal">-- เลือกผู้รับผิดชอบ --</span>}
                    <ChevronDown className="w-5 h-5 text-emerald-400/80" />
                  </button>
                </div>
                <div className="relative">
                  <label className="block text-slate-300 text-[14px] font-bold mb-2">กำหนดเสร็จสิ้น <span className="text-rose-500">*</span></label>
                  <button type="button" onClick={() => {setShowDatePickerModal(true); setShowTechPickerModal(false); setFormError('');}} className={`w-full bg-[#020617]/60 border-[2px] ${formError.includes('วันที่') ? 'border-rose-500/80' : 'border-emerald-500/50 hover:border-cyan-400'} rounded-xl p-3.5 text-white font-bold outline-none text-left flex justify-between items-center text-[15px]`}>
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

      {/* 🌟 ฟันธง: Media Picker Modal (อัปเกรดแยก PC/Mobile) 🌟 */}
      {mediaPickerFor && createPortal(
        <div className="fixed inset-0 z-[10000000] w-screen h-[100dvh] bg-[#020617]/95 backdrop-blur-3xl flex items-center justify-center p-4 animate-in fade-in zoom-in">
          <div className="bg-[#0f172a] border-[2px] border-orange-500 rounded-[2.5rem] p-6 md:p-8 w-full max-w-sm shadow-[0_0_60px_rgba(249,115,22,0.6),inset_0_0_30px_rgba(249,115,22,0.2)] relative flex flex-col items-center">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-32 bg-orange-500/30 blur-[60px] pointer-events-none rounded-full"></div>
             
             <div className="flex items-center gap-3 text-orange-400 mb-8 relative z-10 drop-shadow-[0_0_10px_rgba(249,115,22,0.8)]">
                <Monitor className="w-8 h-8" />
                <h3 className="text-[20px] md:text-[22px] font-black tracking-wide">เลือกรูปภาพ/วิดีโอ</h3>
             </div>

             <div className="w-full space-y-4 relative z-10">
                
                {/* 📱 โหมด Mobile (md:hidden) */}
                <div className="flex flex-col gap-4 md:hidden">
                  <div className="grid grid-cols-2 gap-4">
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

                {/* 💻 โหมด PC (hidden md:flex) */}
                <div className="hidden md:flex flex-col gap-4">
                   <button type="button" onClick={() => document.getElementById('global-file-input').click()} className="w-full bg-gradient-to-b from-emerald-500 to-emerald-600 hover:brightness-110 text-white rounded-2xl p-6 flex flex-col items-center justify-center gap-2 border-[2px] border-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.5)] active:scale-95 transition-all">
                      <div className="flex gap-3 mb-1">
                         <Camera className="w-8 h-8" /> <Video className="w-8 h-8" />
                      </div>
                      <span className="font-black text-[18px]">เลือกรูปภาพ/วิดีโอ</span>
                      <span className="text-[12px] font-bold text-emerald-100">วิดีโอความยาวไม่เกิน 8 วินาที</span>
                   </button>
                </div>
                
                {/* 📋 ปุ่มวาง Clipboard (Both) */}
                <button type="button" onClick={handleClipboardPaste} className="w-full bg-[#1e293b] hover:bg-slate-800 text-purple-400 rounded-2xl p-4 flex flex-col items-center justify-center gap-1.5 border-[2px] border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)] active:scale-95 transition-all">
                  <div className="flex items-center gap-2">
                     <ClipboardPaste className="w-5 h-5" /> <span className="font-black text-[15px]">แคปหน้าจอเสร็จแล้วกดปุ่มนี้</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-bold">กด <span className="text-orange-400">Win + Shift + S</span> หรือ <span className="text-orange-400">PRT SC</span></span>
                </button>
             </div>

             <button type="button" onClick={() => setMediaPickerFor(null)} className="mt-8 w-full py-4 bg-slate-900 text-slate-300 font-black text-[16px] rounded-2xl border-[2px] border-slate-600 hover:border-rose-500 hover:text-rose-400 hover:shadow-[0_0_20px_rgba(225,29,72,0.3)] transition-all active:scale-95 relative z-10">
               ยกเลิก
             </button>
          </div>
        </div>
      , document.body)}

      {/* 🌟 Popup เลือกลูกน้อง (Sci-Fi Orange Glow) 🌟 */}
      {showTechPickerModal && createPortal(
        <div className="fixed inset-0 z-[9999999] w-screen h-[100dvh] bg-[#020617]/95 backdrop-blur-2xl flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#0f172a] border-[2px] border-orange-500 rounded-[2rem] p-6 w-full max-w-sm shadow-[0_0_60px_rgba(249,115,22,0.5)] flex flex-col max-h-[85vh]">
            <h3 className="text-[18px] md:text-[20px] font-black text-orange-400 mb-4 text-center drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]">เลือกผู้รับผิดชอบ</h3>
            <div className="mb-4">
              <input type="text" placeholder="พิมพ์ค้นหาชื่อ..." autoFocus className="w-full bg-[#1e293b] border border-slate-600 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500 transition-colors" value={techSearch} onChange={(e) => setTechSearch(e.target.value)} />
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-orange-500">
              {filteredTechs.map((t, idx) => (
                <button type="button" key={idx} onClick={() => { setNewTask({...newTask, assignee: t.name}); setShowTechPickerModal(false); setTechSearch(''); setFormError(''); }} className="w-full text-left px-4 py-3.5 bg-[#1e293b] border border-slate-700 hover:border-orange-500 hover:bg-orange-500/20 text-slate-200 hover:text-orange-400 rounded-xl text-[15px] font-bold transition-all">
                  {t.name}
                </button>
              ))}
            </div>
            <button type="button" onClick={() => setShowTechPickerModal(false)} className="mt-5 w-full py-4 bg-[#1e293b] text-slate-300 font-black rounded-2xl border border-slate-600 hover:bg-slate-800 transition-colors">ยกเลิก</button>
          </div>
        </div>
      , document.body)}

      {/* 🌟 Popup เลือกวันที่ (Sci-Fi Cyan Glow) 🌟 */}
      {showDatePickerModal && createPortal(
        <div className="fixed inset-0 z-[9999999] w-screen h-[100dvh] bg-[#020617]/95 backdrop-blur-2xl flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#0f172a] border-[2px] border-cyan-500 rounded-[2rem] p-6 w-full max-w-sm shadow-[0_0_60px_rgba(6,182,212,0.5)]">
            <div className="flex justify-between items-center mb-6">
              <button type="button" onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(calYear-1); } else setCalMonth(calMonth-1); }} className="w-10 h-10 bg-[#1e293b] hover:bg-slate-700 flex items-center justify-center rounded-xl text-white transition-colors border border-slate-600"><ChevronLeft size={20}/></button>
              <div className="flex flex-col items-center">
                <span className="text-slate-400 text-[12px] font-bold tracking-widest uppercase mb-1">เลือกวันที่</span>
                <span className="text-cyan-400 font-black text-[22px] tracking-wide drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">{thaiMonthsFull[calMonth]} {calYear + 543}</span>
              </div>
              <button type="button" onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(calYear+1); } else setCalMonth(calMonth+1); }} className="w-10 h-10 bg-[#1e293b] hover:bg-slate-700 flex items-center justify-center rounded-xl text-white transition-colors border border-slate-600"><ChevronRight size={20}/></button>
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
                    className={`aspect-square rounded-[1rem] flex items-center justify-center text-[15px] font-black transition-all border ${isSelected ? 'bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.8)] border-orange-300' : 'bg-transparent text-slate-300 border-slate-700 hover:border-cyan-400 hover:text-cyan-300'}`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>

            <button type="button" onClick={() => setShowDatePickerModal(false)} className="w-full py-4 bg-cyan-600 text-white font-black text-[16px] rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:bg-cyan-500 transition-all">ยกเลิก</button>
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