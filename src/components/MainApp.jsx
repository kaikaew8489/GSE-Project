import React, { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  Home, PlusCircle, CheckCircle, AlertCircle, Wrench, MapPin, User, Camera, X, Monitor, Activity, Phone, CheckSquare, ThumbsUp, Search, PieChart, LayoutDashboard, ClipboardCheck, Mail, AlertTriangle, FileText, PauseCircle, Send, Loader2, ChevronRight, ChevronDown, XCircle, RotateCcw, Hash, DoorOpen, Building, Clock, TrendingUp, Calendar, PhoneCall, Flame, Settings, Star, Briefcase, Users, Landmark, Maximize2, Save, ShieldAlert, CheckCircle2, ClipboardList, Moon, ShieldCheck, Lock, LogOut, Eye, EyeOff, Video, BatteryCharging, Timer, ArrowRightLeft, Thermometer, Zap, Package, Globe, ArrowUpRight, ShieldMinus, HelpCircle
} from 'lucide-react';

import { auth, db, storage } from '../lib/firebaseConfig';
import { signInAnonymously, onAuthStateChanged, signOut, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { collection, addDoc, onSnapshot, doc, updateDoc, query, orderBy, limit, serverTimestamp, writeBatch, getDocs, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import ActionModal from './ActionModal';
import AdminRosterSettings from './AdminRosterSettings';
import UPSStatusCard from './UPSStatusCard';
import SatelliteStatusCard from './SatelliteStatusCard';
import Dashboard from './Dashboard';
import ReportView from './ReportView';
import TrackingView from './TrackingView';
import { ThaiDateFormatter, ErrorBoundary, SearchableDropdown, SciFiSelectModal, SarabunFontEmbed } from './SharedUI';

import { employeeList, techMapping, equipmentCategories, buildingList, technicianList, fixedHolidays, dynamicHolidays } from '../lib/systemData';
import { formatDateTimeString, getNextReqId, formatDisplayPhone, getMinutesDiff, formatMinutesToText, calculateDuration } from '../lib/utils';

export default function MainApp({ onGoHome, initialRole }) {
  const [activeTab, setActiveTab] = useState(() => sessionStorage.getItem('activeTab') || (initialRole !== 'reporter' ? 'hub' : 'report'));
  const [currentUserRole, setCurrentUserRole] = useState(initialRole || 'reporter');
  const [currentUserName, setCurrentUserName] = useState(() => localStorage.getItem('gse_remembered_name') || '');
  const [user, setUser] = useState(null);
  
  const [sysTime, setSysTime] = useState(new Date());
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [hasNewTicket, setHasNewTicket] = useState(false);
  const isFirstLoad = useRef(true);
  
  const [isOutOfHours, setIsOutOfHours] = useState(false);
  const [allRosters, setAllRosters] = useState([]);
  const [showAdminRoster, setShowAdminRoster] = useState(false);
  const [isHoliday, setIsHoliday] = useState(false);
  
  const [dashTimeframe, setDashTimeframe] = useState('today');
  const [customMonth, setCustomMonth] = useState(''); 
  const [showMonthPicker, setShowMonthPicker] = useState(false); 
  const [pickerYear, setPickerYear] = useState(new Date().getFullYear()); 
  const [customDate, setCustomDate] = useState(''); 
  const [showDatePicker, setShowDatePicker] = useState(false); 
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  
  const [trackTimeframe, setTrackTimeframe] = useState('all'); 
  const [trackMonth, setTrackMonth] = useState('');
  const [trackDate, setTrackDate] = useState('');
  const [showTrackMonthPicker, setShowTrackMonthPicker] = useState(false);
  const [showTrackDatePicker, setShowTrackDatePicker] = useState(false);
  const [trackCalMonth, setTrackCalMonth] = useState(new Date().getMonth());
  const [trackCalYear, setTrackCalYear] = useState(new Date().getFullYear());

  const [formData, setFormData] = useState({ reporter: '', reporterContact: '', position: '', department: '', bureau: 'สำนักปฏิบัติการดาวเทียม', equipment: '', description: '', assetNumber: '', building: '', room: '', equipmentCategory: '', images: [], videos: [], isSsc: false });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  
  const [actionModal, setActionModal] = useState({ isOpen: false, ticketId: null, type: null });
  const [selectedTech, setSelectedTech] = useState('');
  const [actionText, setActionText] = useState('');
  const [actionAttachments, setActionAttachments] = useState([]);
  const [selectedHelpers, setSelectedHelpers] = useState([]);
  const [helperSearch, setHelperSearch] = useState('');
  const [sscSuccess, setSscSuccess] = useState(false);
  const [lightboxImg, setLightboxImg] = useState(null);
  const [ratingModal, setRatingModal] = useState({ isOpen: false, ticketId: null, rating: 0, comment: '', techName: '', techPhotoUrl: '', tags: [] });

  useEffect(() => {
    const bypassAuth = () => setUser({ uid: 'public-bypass-user' });
    const initAuth = async () => {
      if (!auth.currentUser) {
        try { await signInAnonymously(auth); } catch (error) { bypassAuth(); }
      }
    };
    initAuth();

    const unsubscribeAuth = onAuthStateChanged(auth, async (u) => {
      if (u) setUser(u);
      else bypassAuth();

      if (initialRole !== 'reporter') {
        try {
          const savedPhone = localStorage.getItem('gse_staff_phone');
          if (savedPhone) {
            const cleanPhone = savedPhone.replace(/-/g, '');
            const q = query(collection(db, 'staff_roles'), where('phone', '==', cleanPhone));
            const snap = await getDocs(q);
            if (!snap.empty) {
              const staffData = snap.docs[0].data();
              const dbPhone = String(staffData.phone || '').replace(/\D/g, '');
              const dbName = String(staffData.fullName || '').trim();
              
              let exactName = dbName;
              const matchedTech = technicianList.find(t => (t.phone && String(t.phone).replace(/\D/g, '') === dbPhone) || (t.name && t.name.includes(dbName)));
              const mappedTech = Object.values(techMapping).find(t => (t.phone && String(t.phone).replace(/\D/g, '') === dbPhone) || (t.name && t.name.includes(dbName)));

              if (matchedTech) exactName = matchedTech.name;
              else if (mappedTech) exactName = mappedTech.name;

              setCurrentUserName(exactName);
              localStorage.setItem('gse_remembered_name', exactName);
            }
          }
        } catch (err) { console.error("กู้คืนชื่อไม่สำเร็จ", err); }
      }
    });

    return () => unsubscribeAuth();
  }, [initialRole]);

  useEffect(() => {
    if (!user) return; 
    setIsLoading(true);
    const ticketsRef = query(collection(db, 'tickets'), orderBy('date', 'desc'), limit(500));

    const unsubscribeData = onSnapshot(ticketsRef, (snapshot) => {
      try {
        const ticketsData = [];
        snapshot.forEach((doc) => {
          ticketsData.push({ dbId: doc.id, ...doc.data() });
        });
        
        ticketsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setTickets(ticketsData);
        setIsLoading(false); 

        if (isFirstLoad.current) { 
          isFirstLoad.current = false; 
        } else {
          snapshot.docChanges().forEach(change => { 
            if (change.type === "added" && activeTab !== 'dashboard') setHasNewTicket(true); 
          });
        }
      } catch (e) {
        console.error('Data Parse Error:', e);
        setIsLoading(false);
      }
    }, (error) => {
      console.error('Firebase Read Error:', error);
      setIsLoading(false);
    });

    return () => unsubscribeData();
  }, [user]);

  useEffect(() => {
    sessionStorage.setItem('activeTab', activeTab);
    if (activeTab === 'dashboard') setHasNewTicket(false);
  }, [activeTab]);

  useEffect(() => {
    const timer = setInterval(() => setSysTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const checkOutOfHours = () => {
      const now = sysTime;
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const day = now.getDay(); 
      const timeNum = hours * 100 + minutes;
      const isAfterHours = (day === 0 || day === 6) || (timeNum < 830 || timeNum > 1630) || isHoliday;
      setIsOutOfHours(isAfterHours);
    };
    checkOutOfHours();
  }, [sysTime, isHoliday]);

  useEffect(() => {
    const q = collection(db, 'rosters');
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(doc => ({ ...doc.data(), date: doc.id }));
      setAllRosters(data);
      const todayStr = sysTime.toISOString().split('T')[0];
      const todayRoster = data.find(r => r.date === todayStr);
      setIsHoliday(!!(todayRoster && todayRoster.isHoliday));
    });
    return () => unsub();
  }, [sysTime]);

  const handleResetForm = () => {
    let savedName = localStorage.getItem('gse_remembered_name') || currentUserName || '';
    const savedPhone = localStorage.getItem('gse_remembered_phone') || '';
    
    let formattedPhone = savedPhone;
    if (savedPhone.length === 10) {
      formattedPhone = `${savedPhone.substring(0, 2)}-${savedPhone.substring(2, 6)}-${savedPhone.substring(6)}`;
    }

    if (!savedName || savedName.trim() === '') {
      const rawPhone = savedPhone.replace(/\D/g, '');
      const matchedTech = technicianList.find(t => t.phone && t.phone.replace(/\D/g, '') === rawPhone);
      if (matchedTech) {
        savedName = matchedTech.name; 
        localStorage.setItem('gse_remembered_name', savedName);
        setCurrentUserName(savedName);
      } else {
        savedName = 'ผู้ใช้งานระบบ'; 
      }
    }

    const emp = employeeList.find((x) => x.name === savedName) || technicianList.find((x) => x.name === savedName);

    if (!formattedPhone && emp && emp.phone && emp.phone !== '-') {
      formattedPhone = emp.phone;
    }

    setFormData({
      reporter: savedName,
      reporterContact: formattedPhone,
      position: emp?.position || '',
      department: emp?.department || '',
      bureau: 'สำนักปฏิบัติการดาวเทียม',
      equipment: '',
      description: '',
      assetNumber: '',
      building: '',
      room: '',
      equipmentCategory: '',
      images: [],
      videos: [],
      isSsc: false,
    });
    setFormErrors({});
  };

  useEffect(() => {
    if (activeTab === 'report') {
      handleResetForm();
    }
  }, [activeTab, currentUserName]);

  const getLiveStopwatch = (dateStart, dateEnd, sysTime, totalPauseMs = 0, isHolding = false, lastHoldAt = null) => {
    if (!dateStart) return "00:00:00";
    const start = new Date(dateStart).getTime();
    const end = dateEnd ? new Date(dateEnd).getTime() : sysTime.getTime();
    let duration = end - start - totalPauseMs;
    if (isHolding && lastHoldAt) {
      const pauseDuration = sysTime.getTime() - new Date(lastHoldAt).getTime();
      duration -= pauseDuration;
    }
    if (duration < 0) duration = 0;
    const hours = Math.floor(duration / 3600000);
    const minutes = Math.floor((duration % 3600000) / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleMediaUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    let newImages = []; let newVideos = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('video/')) {
        try {
          const fileRef = ref(storage, `gse_reports/videos/${Date.now()}_${file.name}`);
          const snapshot = await uploadBytes(fileRef, file);
          newVideos.push(await getDownloadURL(snapshot.ref));
        } catch (error) { console.error("Video Upload Error:", error); }
      } else if (file.type.startsWith('image/')) {
        try {
          const fileRef = ref(storage, `gse_reports/images/${Date.now()}_${file.name}`);
          const snapshot = await uploadBytes(fileRef, file);
          newImages.push(await getDownloadURL(snapshot.ref));
        } catch (error) { console.error("Image Upload Error:", error); }
      }
    }
    setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages].slice(0, 6), videos: [...prev.videos, ...newVideos].slice(0, 1) }));
  };

  const handleClipboardPaste = async () => {
    try {
      const clipboardItems = await navigator.clipboard.read();
      for (const clipboardItem of clipboardItems) {
        const imageTypes = clipboardItem.types.filter(type => type.startsWith('image/'));
        if (imageTypes.length > 0) {
          const blob = await clipboardItem.getType(imageTypes[0]);
          const file = new File([blob], `snipped_image_${Date.now()}.png`, { type: blob.type });
          handleMediaUpload({ target: { files: [file] } });
          setShowImagePicker(false);
          return;
        }
      }
      alert("⚠️ ไม่พบรูปภาพที่แคปไว้ครับ!");
    } catch (err) { alert("⚠️ เบราว์เซอร์ไม่อนุญาต หรือท่านยังไม่ได้แคปรูปไว้ครับ"); }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.reporter) errors.reporter = 'กรุณาระบุชื่อผู้แจ้ง';
    const phone = formData.reporterContact ? String(formData.reporterContact).replace(/\D/g, '') : '';
    if (phone.length !== 10) errors.reporterContact = 'เบอร์โทรต้องมี 10 หลัก';
    if (!formData.equipmentCategory) errors.equipmentCategory = 'กรุณาระบุกลุ่มงาน/ภารกิจ';
    if (!formData.equipment) errors.equipment = 'กรุณาระบุอุปกรณ์/ระบบ';
    if (!formData.building) errors.building = 'กรุณาระบุอาคาร/ตึก';
    if (!formData.room) errors.room = 'กรุณาระบุสถานที่/ห้อง';
    if (!formData.description) errors.description = 'กรุณาระบุอาการเสีย';
    if (!formData.images || formData.images.length === 0) errors.images = 'กรุณาแนบภาพอย่างน้อย 1 รูป';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateForm();
    if (Object.keys(errs).length > 0) { 
      setFormErrors(errs); 
      alert("⚠️ ข้อมูลยังไม่ครบ หรือ เบอร์โทรศัพท์ไม่ถูกต้องครับ!\n\n(หากชื่อ/เบอร์โทร หรือแผนกหายไป กรุณาตรวจสอบให้ครบถ้วน)");
      return; 
    }
    
    setIsSubmitting(true);
    const newId = getNextReqId(tickets);
    const selectedCategory = formData.equipmentCategory; 
    const autoAssignedTech = techMapping[selectedCategory];

    const newTicket = {
      id: newId,
      reporter: formData.reporter || '',
      reporterContact: formData.reporterContact || '',
      position: formData.position || '',
      department: formData.department || '',
      bureau: formData.bureau || 'สำนักปฏิบัติการดาวเทียม',
      equipment: formData.equipment || '',
      description: formData.description || '',
      assetNumber: formData.assetNumber || '',
      building: formData.building || '',
      room: formData.room || '',
      equipmentCategory: formData.equipmentCategory || '',
      images: formData.images || [],
      videos: formData.videos || [],
      isSsc: formData.isSsc || false,
      techName: autoAssignedTech ? autoAssignedTech.name : 'รอเจ้าหน้าที่รับงาน',
      techPhone: autoAssignedTech ? autoAssignedTech.phone : '-',
      status: 'pending',
      date: new Date().toISOString(),
    };

    try {
      await addDoc(collection(db, 'tickets'), newTicket);
      if (newTicket.reporterContact) {
        localStorage.setItem('gse_remembered_phone', String(newTicket.reporterContact).replace(/\D/g, ''));
        localStorage.setItem('gse_remembered_name', newTicket.reporter);
      }
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        handleResetForm(); 
        setFilterStatus('all');
        setActiveTab('tracking');
      }, 5000);
    } catch (e) {
      alert("❌ เกิดข้อผิดพลาดในการส่งข้อมูล: " + e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateTicketStatus = async (ticketId, updates) => {
    const target = tickets.find((t) => t.id === ticketId);
    if (!target || !target.dbId) return;
    try { await updateDoc(doc(db, 'tickets', target.dbId), updates); } catch (e) { console.error(e); }
  };

  const executeActionModal = async () => {
    const { ticketId, type } = actionModal;
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return;

    try {
      // 🌟 ด่านที่ 1: อัปโหลดรูปภาพเข้า Storage ก่อน! (แก้ปัญหา Error 1MB ทะลุหลอด)
      let finalUrls = [];
      if (actionAttachments && actionAttachments.length > 0) {
        for (let fileStr of actionAttachments) {
          if (typeof fileStr === 'string' && fileStr.startsWith('data:image')) {
            const response = await fetch(fileStr);
            const blob = await response.blob();
            const fileRef = ref(storage, `gse_actions/${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`);
            const snapshot = await uploadBytes(fileRef, blob);
            const downloadUrl = await getDownloadURL(snapshot.ref);
            finalUrls.push(downloadUrl);
          } else {
            finalUrls.push(fileStr); // กรณีเป็น URL อยู่แล้ว
          }
        }
      }

      // 🌟 ด่านที่ 2: เตรียมข้อมูลอัปเดต (ใช้ finalUrls แทนรูปดิบๆ)
      let updateData = {};
      if (type === 'hold') {
        const log = { type: 'hold', timestamp: sysTime.toISOString(), reason: actionText || 'รออะไหล่/อุปกรณ์', attachments: finalUrls };
        updateData = { status: 'on_hold', lastHoldAt: log.timestamp, historyLog: [...(ticket.historyLog || []), log] };
      } else if (type === 'resume') {
        const holdStart = new Date(ticket.lastHoldAt).getTime();
        const pauseDurationMs = sysTime.getTime() - holdStart;
        const log = { type: 'resume', timestamp: sysTime.toISOString(), reason: actionText || 'ได้รับอะไหล่/ดำเนินการต่อ', attachments: finalUrls };
        updateData = { status: 'in_progress', totalPauseMs: (ticket.totalPauseMs || 0) + pauseDurationMs, historyLog: [...(ticket.historyLog || []), log] };
      } else if (type === 'ssc') {
        updateData = { sscTechName: currentUserName, sscTechPhone: formatDisplayPhone(auth.currentUser?.email === 'admin@mail.com' ? '0812345678' : ''), sscNote: actionText, sscAttachments: finalUrls, status: 'pending', updatedAt: serverTimestamp() };
      } else if (type === 'cancel') {
        updateData = { status: 'cancelled', cancelReason: actionText, completedAt: serverTimestamp() };
      } else if (type === 'accept') {
        const log = { type: 'accepted', timestamp: sysTime.toISOString(), by: selectedTech || currentUserName };
        updateData = { status: 'in_progress', acceptedAt: log.timestamp, startedAt: sysTime.toISOString(), historyLog: [...(ticket.historyLog || []), log], techName: selectedTech || currentUserName, techPhone: technicianList.find(x => x.name === (selectedTech || currentUserName))?.phone || '-' };
      } else if (type === 'finish') {
        updateData = { status: 'completed', cause: actionText, completedAt: sysTime.toISOString(), finishAttachments: finalUrls, helpers: selectedHelpers };
      }
      
      // อัปเดตขึ้น Firestore ด้วยรหัสหลังบ้าน (dbId)
      await updateDoc(doc(db, "tickets", ticket.dbId), { ...updateData, updatedAt: serverTimestamp() });
      
      // ปิดหน้าต่างและล้างค่าทั้งหมด
      setActionModal({ isOpen: false, ticketId: null, type: null });
      setActionText('');
      setActionAttachments([]);
      setSelectedHelpers([]);
      setHelperSearch('');
    } catch (e) { 
      console.error(e); 
      alert("เกิดข้อผิดพลาดในการอัปเดตข้อมูล: " + e.message); 
    }
  };

  const submitRating = async () => {
    if (ratingModal.rating === 0) {
      alert("⚠️ กรุณาให้คะแนนอย่างน้อย 1 ดาวครับ");
      return;
    }
    try {
      const target = tickets.find((t) => t.id === ratingModal.ticketId);
      if (!target || !target.dbId) return;
      
      await updateDoc(doc(db, "tickets", target.dbId), {
        status: 'verified',
        rating: ratingModal.rating,
        ratingTags: ratingModal.tags || [],
        ratingComment: ratingModal.comment,
        verifiedAt: serverTimestamp()
      });
      
      setRatingModal({ isOpen: false, ticketId: null, rating: 0, comment: '', techName: '', techPhotoUrl: '', tags: [] });
    } catch (e) {
      console.error(e);
      alert("❌ เกิดข้อผิดพลาดในการบันทึกคะแนน");
    }
  };

  // =========================================================================
  // 🌟 ฟันธง 1: ระบบ Data Privacy (Role-Based Access Control) คัดกรองความลับ!
  // =========================================================================
  const permittedTickets = useMemo(() => {
    return tickets.filter((t) => {
      // 1. หัวหน้า (Commander) เห็นทุกงาน
      if (currentUserRole === 'Commander') return true; 
      
      // 2. ผู้แจ้ง (Reporter) เห็นแค่งานตัวเอง
      if (currentUserRole === 'reporter') {
        return t.reporter === currentUserName;
      }
      
      // 3. ช่าง ฝวด. (Technician)
      const todayStr = sysTime.toISOString().split('T')[0];
      const todayDuty = allRosters.find(r => r.date === todayStr);
      const isSSCToday = todayDuty && todayDuty.techName === currentUserName;

      const isPrimary = t.techName === currentUserName; // งานของตัวเอง
      const isSSCActed = t.sscTechName === currentUserName; // งานที่เคยรับเป็น SSC
      const isMyReport = t.reporter === currentUserName; // งานที่ตัวเองเป็นคนแจ้งซ่อม
      const isPendingForSSC = isSSCToday && (t.status === 'pending' || t.status === 'รอช่างเข้าดำเนินการ'); // งานใหม่ที่รอรับสาย (เฉพาะคนเป็นเวรวันนี้)

      // ถ้าไม่ตรงเงื่อนไขข้างบนเลย = ซ่อนทิ้งไป!
      return isPrimary || isSSCActed || isMyReport || isPendingForSSC;
    });
  }, [tickets, currentUserRole, currentUserName, allRosters, sysTime]);


  const handleNavigateToTracking = (status) => {
    setActiveTab('tracking'); setFilterStatus(status); setSearchTerm('');
    if (dashTimeframe === 'today') { setTrackTimeframe('custom_date'); const d = new Date(sysTime); setTrackDate(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`); }
    else if (dashTimeframe === 'month') { setTrackTimeframe('custom_month'); const d = new Date(sysTime); setTrackMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`); }
    else if (dashTimeframe === 'week') setTrackTimeframe('week');
    else setTrackTimeframe('all');
  };

  // 🌟 ฟันธง 2: ดึงข้อมูลไปกรองต่อในหน้า Tracking (ใช้ permittedTickets)
  const filteredTickets_forTracking = useMemo(() => {
    return permittedTickets.filter((t) => {
      const searchStr = String(searchTerm || '').toLowerCase();
      if (searchStr && !String(t.equipment).toLowerCase().includes(searchStr) && !String(t.id).toLowerCase().includes(searchStr)) return false;
      
      if (filterStatus !== 'all') {
        if (filterStatus === 'fixing') {
          if (!['acknowledged', 'in_progress'].includes(t.status)) return false;
        } else if (filterStatus === 'verify') {
          if (!['completed', 'รอผู้รับผิดชอบยืนยัน'].includes(t.status)) return false;
        } else if (filterStatus === 'completed') {
          if (t.status !== 'verified') return false;
        } else if (t.status !== filterStatus) {
          return false;
        }
      }

      if (!t.date) return false;
      const tDateObj = new Date(t.date);
      if (isNaN(tDateObj.getTime())) return true;

      const tDateStr = tDateObj.toISOString().split('T')[0];
      const tMonthStr = tDateStr.substring(0, 7);

      if (trackTimeframe === 'custom_date' && trackDate) {
        if (tDateStr !== trackDate) return false;
      } else if (trackTimeframe === 'custom_month' && trackMonth) {
        if (tMonthStr !== trackMonth) return false;
      } else if (trackTimeframe === 'week') {
        const diffTime = sysTime.getTime() - tDateObj.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24); 
        if (diffDays > 7 || diffDays < 0) return false;
      }

      return true;
    });
  }, [permittedTickets, searchTerm, filterStatus, trackTimeframe, trackDate, trackMonth, sysTime]);

  // 🌟 ฟันธง 3: ดึงข้อมูลไปทำสถิติในหน้า Dashboard (ใช้ permittedTickets)
  const dashStats = useMemo(() => {
    return {
      total: permittedTickets.length,
      pending: permittedTickets.filter(t => t.status === 'pending').length,
      fixing: permittedTickets.filter(t => ['acknowledged', 'in_progress'].includes(t.status)).length,
      cancelled: permittedTickets.filter(t => t.status === 'cancelled').length,
      done: permittedTickets.filter(t => ['completed', 'verified'].includes(t.status)).length,
    };
  }, [permittedTickets]);

  const [isNavVisible, setIsNavVisible] = useState(true);
  const lastScrollY = useRef(0);
  const handleMainScroll = (e) => {
    const currentScrollY = e.target.scrollTop;
    if (currentScrollY > lastScrollY.current && currentScrollY > 20) setIsNavVisible(false);
    else setIsNavVisible(true);
    lastScrollY.current = currentScrollY;
  };

  const renderHub = () => {
    const apps = [
      { id: 'dashboard', name: 'แผงควบคุม', desc: 'จัดการงานซ่อม', icon: <Wrench size={28} className="drop-shadow-md" />, color: 'orange', active: true, themeClasses: 'from-orange-500 to-amber-600 border-orange-500 shadow-orange-500/40 text-orange-400 hover:border-orange-400' },

      
      { id: 'monitoring', name: 'IoT Monitor', desc: 'สถานะ UPS', icon: <Activity size={28} className="drop-shadow-md" />, color: 'cyan', active: true, themeClasses: 'from-cyan-500 to-blue-600 border-cyan-500 shadow-cyan-500/40 text-cyan-400 hover:border-cyan-400' },

      // 🌟 ฟันธง: เติมปุ่มดาวเทียมกลับเข้าไปตรงนี้ครับ! 🌟
      { id: 'satellite', name: 'Sat Signals', desc: 'สถานะสัญญาณดาวเทียม', icon: <Globe size={28} className="drop-shadow-md" />, color: 'purple', active: true, themeClasses: 'from-fuchsia-500 to-purple-600 border-fuchsia-500 shadow-fuchsia-500/40 text-fuchsia-400 hover:border-fuchsia-400' },


      { id: 'pm', name: 'ระบบ PM', desc: 'บำรุงรักษา', icon: <CheckSquare size={28} className="drop-shadow-md" />, color: 'emerald', active: false, themeClasses: 'from-emerald-500 to-teal-600 border-emerald-500 shadow-emerald-500/40 text-emerald-400 hover:border-emerald-400' },


      { id: 'leave', name: 'วันลา/เข้าสาย', desc: 'ระบบบุคคล', icon: <Calendar size={28} className="drop-shadow-md" />, color: 'rose', active: false, themeClasses: 'from-rose-500 to-red-600 border-rose-500 shadow-rose-500/40 text-rose-400 hover:border-rose-400' },


      { id: 'report', name: 'Daily Report', desc: 'รายงานประจำวัน', icon: <FileText size={28} className="drop-shadow-md" />, color: 'purple', active: false, themeClasses: 'from-purple-500 to-fuchsia-600 border-purple-500 shadow-purple-500/40 text-purple-400 hover:border-purple-400' },


      { id: 'inventory', name: 'อะไหล่/ครุภัณฑ์', desc: 'บริการงานจัดการ', icon: <Package size={28} className="drop-shadow-md" />, color: 'indigo', active: false, themeClasses: 'from-indigo-500 to-violet-600 border-indigo-500 shadow-indigo-500/40 text-indigo-400 hover:border-indigo-400' },


      { id: 'procurement', name: 'งานจัดซื้อจัดจ้าง', desc: 'จัดการเอกสาร/เบิก', icon: <Briefcase size={28} className="drop-shadow-md" />, color: 'blue', active: false, themeClasses: 'from-blue-500 to-sky-600 border-blue-500 shadow-blue-500/40 text-blue-400 hover:border-blue-400' },


      { id: 's3ee', name: 'งานบริการ S3EE', desc: 'ระบบบริการลูกค้า', icon: <Globe size={28} className="drop-shadow-md" />, color: 'pink', active: false, themeClasses: 'from-pink-500 to-rose-600 border-pink-500 shadow-pink-500/40 text-pink-400 hover:border-pink-400' },
    ];

    return (
      <div className="p-4 md:p-8 pb-32 flex flex-col items-center justify-center min-h-[85vh] relative w-full">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] md:w-[900px] md:h-[600px] bg-red-500/20 blur-[130px] rounded-[100%] pointer-events-none z-0"></div>
        <div className="w-full max-w-md md:max-w-5xl bg-slate-900/80 backdrop-blur-md border-[2px] md:border-[3px] border-solid border-orange-500/90 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-[0_0_50px_rgba(239,68,68,0.5),inset_0_0_30px_rgba(249,115,22,0.2)] relative z-10 flex flex-col items-center animate-in zoom-in-95 duration-500 mt-6">
            <div className="w-[95%] max-w-[400px] mb-8 md:mb-10 mt-2">
              <div className="bg-slate-900/90 backdrop-blur-md border-[2px] md:border-[3px] border-solid border-cyan-400 rounded-2xl md:rounded-3xl py-3 md:py-4 px-4 text-center shadow-[0_0_25px_rgba(34,211,238,0.6),inset_0_0_10px_rgba(34,211,238,0.3)] relative flex flex-col items-center justify-center">
                <h2 className="text-[18px] md:text-[24px] font-black tracking-widest leading-tight flex items-center justify-center gap-2 md:gap-3 flex-wrap">
                  <span className="text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">ศูนย์ปฏิบัติการ</span>
                  <span className="text-orange-400 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]">ฝวด.</span>
                </h2>
                <div className="mt-2 md:mt-3 flex items-center justify-center gap-3 w-[90%] opacity-80">
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-slate-400/60"></div>
                  <h3 className="text-[10px] md:text-[12px] font-bold text-slate-300 tracking-[0.25em] uppercase drop-shadow-md">GSE Operations Hub</h3>
                  <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-slate-400/60"></div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 w-full">
              {apps.map((app, idx) => (
                <button key={idx} onClick={() => app.active ? setActiveTab(app.id) : alert('🚀 ล็อกเป้าหมายเรียบร้อย! กำลังพัฒนาระบบใน Phase ถัดไปครับ!')} 
                  className={`relative p-4 md:p-6 rounded-[1rem] md:rounded-[1.5rem] border-[2px] flex flex-col items-center justify-center text-center transition-all duration-300 group overflow-hidden ${app.active ? `bg-slate-900/80 backdrop-blur-md border-slate-700 hover:bg-slate-800 hover:scale-[1.05] ${app.themeClasses.split(' ').find(c => c.startsWith('hover:border-'))} hover:shadow-[0_0_25px_rgba(255,255,255,0.1)] cursor-pointer` : 'bg-slate-900/40 backdrop-blur-sm border-slate-700/50 grayscale opacity-60 hover:opacity-100 hover:grayscale-0 hover:scale-[1.02] cursor-not-allowed'}`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${app.themeClasses.split(' ').filter(c => c.startsWith('from-') || c.startsWith('to-')).join(' ')} opacity-0 ${app.active ? 'group-hover:opacity-15' : 'group-hover:opacity-5'} transition-opacity duration-300`}></div>
                  <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center mb-2 md:mb-4 transition-transform duration-500 ${app.active ? 'group-hover:scale-110 group-hover:rotate-3' : ''} ${app.active ? `bg-gradient-to-br ${app.themeClasses.split(' ').filter(c => c.startsWith('from-') || c.startsWith('to-')).join(' ')} text-white shadow-lg` : 'bg-slate-800 text-slate-500 border border-slate-600'}`}>{app.icon}</div>
                  <h3 className={`text-[13px] md:text-[17px] font-black tracking-wide mb-1 md:mb-1.5 leading-tight ${app.active ? 'text-white' : 'text-slate-400'}`}>{app.name}</h3>
                  <p className={`text-[10px] md:text-[12px] font-bold leading-tight ${app.active ? app.themeClasses.split(' ').find(c => c.startsWith('text-')) : 'text-slate-500'}`}>{app.desc}</p>
                  {!app.active && (<div className="absolute top-2 right-2 bg-slate-800 border border-slate-600 px-2 py-0.5 rounded text-[8px] md:text-[10px] font-black text-slate-400 uppercase shadow-md">Soon</div>)}
                </button>
              ))}
            </div>
            <div className="w-full md:w-3/5 mt-8 md:mt-12 pt-6 md:pt-8 border-t border-orange-500/30 flex justify-center relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[60px] bg-rose-500/20 blur-[30px] rounded-full pointer-events-none z-0"></div>
              <button onClick={onGoHome} className="w-full max-w-[280px] md:max-w-[320px] relative z-10 bg-slate-900/90 border-[2px] border-rose-500 text-rose-400 hover:bg-rose-600 hover:text-white hover:border-rose-400 py-3 md:py-4 rounded-2xl flex items-center justify-center gap-3 font-black transition-all shadow-[0_0_20px_rgba(225,29,72,0.6)] hover:shadow-[0_0_30px_rgba(225,29,72,0.9)] active:scale-95 backdrop-blur-md">
                <LogOut size={22} className="w-6 h-6" /> <span className="tracking-widest uppercase text-[16px] md:text-[18px]">ออกจากระบบ</span>
              </button>
            </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 w-full h-[100dvh] bg-slate-900 flex justify-center overflow-hidden">
      <div className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 pointer-events-none" style={{ backgroundImage: "url('/bg-earth-new.webp')" }}></div>
      <div className={`relative z-10 flex flex-col h-[100dvh] w-full max-w-md md:max-w-6xl backdrop-blur-md overflow-hidden text-slate-100 font-sans select-none bg-slate-900/40 border-x border-solid transition-all duration-1000 ${
        activeTab === 'dashboard' ? 'shadow-[0_0_60px_-5px_rgba(249,115,22,1)] border-orange-500/50' :
        activeTab === 'report' ? 'shadow-[0_0_60px_-5px_rgba(16,185,129,1)] border-emerald-500/50' :
        (activeTab === 'tracking' && currentUserRole !== 'reporter' ? 'shadow-[0_0_60px_-5px_rgba(6,182,212,1)] border-cyan-500/50' :
        'shadow-[0_0_60px_-5px_rgba(244,63,94,1)] border-rose-500/50')
      }`}>

        {activeTab !== 'hub' && activeTab !== 'satellite' && activeTab !== 'monitoring' && (
          <div className="bg-slate-900/50 backdrop-blur-xl pl-5 md:pl-8 pr-4 py-3 md:py-2.5 flex items-center justify-between sticky top-4 z-50 border-2 border-solid border-orange-500 rounded-2xl md:rounded-xl mt-4 md:mt-3 transition-all duration-500 shadow-[0_0_15px_rgba(249,115,22,0.5)] mx-4 md:mx-6">
            <div className="flex items-center gap-3.5 md:gap-4 z-10">
              <div className="bg-white w-14 h-14 md:w-12 md:h-12 rounded-2xl md:rounded-xl shadow-md border-2 border-solid flex items-center justify-center shrink-0 text-orange-500 border-orange-300">
                {activeTab === 'dashboard' ? <LayoutDashboard className="w-8 h-8 md:w-6 md:h-6" strokeWidth={2.5} /> : 
                 activeTab === 'report' ? <PlusCircle className="w-8 h-8 md:w-6 md:h-6" strokeWidth={2.5} /> : 
                 currentUserRole !== 'reporter' ? <Wrench className="w-8 h-8 md:w-6 md:h-6" strokeWidth={2.5} /> : 
                 <ClipboardCheck className="w-8 h-8 md:w-6 md:h-6" strokeWidth={2.5} />}
              </div>
              <div>
                <div className="font-bold text-[14px] md:text-[18px] tracking-widest mb-1 text-orange-300">
                  สวัสดีครับคุณ {currentUserName || 'ผู้ใช้งาน'}
                </div>
                <h1 className="font-black text-white text-2xl md:text-4xl tracking-widest leading-tight drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] md:py-1">
                  {activeTab === 'dashboard' ? 'แผงควบคุม' : 
                   activeTab === 'report' ? 'แจ้งซ่อม' : 
                   currentUserRole !== 'reporter' ? 'จัดการงานซ่อม' : 'ติดตามสถานะ'}
                </h1>
              </div>
            </div>
          </div>
        )}

        <div id="gse-main-scroll" onScroll={handleMainScroll} className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-32 md:pb-40 px-0 md:px-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-40 text-slate-400 opacity-80">
              <Loader2 size={60} className="animate-spin mb-4 text-orange-500" />
              <p className="font-bold text-xl uppercase tracking-widest">Loading...</p>
            </div>
          ) : (
            <>
              {activeTab === 'hub' && (currentUserRole !== 'reporter') && renderHub()}

              {activeTab === 'satellite' && <SatelliteStatusCard setActiveTab={setActiveTab} onGoHome={onGoHome} />}

              {activeTab === 'monitoring' && <UPSStatusCard setActiveTab={setActiveTab} onGoHome={onGoHome} />}

              
              {/* 🌟 ฟันธง: สังเกตว่าส่ง permittedTickets ไปใช้แทน tickets ทั้งคู่เลยครับ 100% ปลอดภัย! */}
              {activeTab === 'dashboard' && (currentUserRole !== 'reporter') && <Dashboard sysTime={sysTime} stats={dashStats} tickets={permittedTickets} allRosters={allRosters} technicianList={technicianList} dashTimeframe={dashTimeframe} setDashTimeframe={setDashTimeframe} customMonth={customMonth} setCustomMonth={setCustomMonth} showMonthPicker={showMonthPicker} setShowMonthPicker={setShowMonthPicker} pickerYear={pickerYear} setPickerYear={setPickerYear} customDate={customDate} setCustomDate={setCustomDate} showDatePicker={showDatePicker} setShowDatePicker={setShowDatePicker} calMonth={calMonth} setCalMonth={setCalMonth} calYear={calYear} setCalYear={setCalYear} currentUserRole={currentUserRole} currentUserName={currentUserName} handleNavigateToTracking={handleNavigateToTracking} setShowAdminRoster={setShowAdminRoster} />}


              {activeTab === 'report' && <ReportView sysTime={sysTime} showSuccess={showSuccess} handleSubmit={handleSubmit} handleResetForm={handleResetForm} allRosters={allRosters} technicianList={technicianList} formData={formData} setFormData={setFormData} formErrors={formErrors} setFormErrors={setFormErrors} handleInputChange={handleInputChange} showImagePicker={showImagePicker} setShowImagePicker={setShowImagePicker} handleMediaUpload={handleMediaUpload} handleClipboardPaste={handleClipboardPaste} setLightboxImg={setLightboxImg} isSubmitting={isSubmitting} />}


              {activeTab === 'tracking' && <TrackingView sysTime={sysTime} currentUserRole={currentUserRole} currentUserName={currentUserName} tickets={permittedTickets} filteredTickets={filteredTickets_forTracking} searchTerm={searchTerm} setSearchTerm={setSearchTerm} filterStatus={filterStatus} setFilterStatus={setFilterStatus} trackTimeframe={trackTimeframe} setTrackTimeframe={setTrackTimeframe} trackMonth={trackMonth} setTrackMonth={setTrackMonth} trackDate={trackDate} setTrackDate={setTrackDate} showTrackMonthPicker={showTrackMonthPicker} setShowTrackMonthPicker={setShowTrackMonthPicker} showTrackDatePicker={showTrackDatePicker} setShowTrackDatePicker={setShowTrackDatePicker} trackCalMonth={trackCalMonth} setTrackCalMonth={setTrackCalMonth} trackCalYear={trackCalYear} setTrackCalYear={setTrackCalYear} allRosters={allRosters} technicianList={technicianList} setActionModal={setActionModal} updateTicketStatus={updateTicketStatus} setRatingModal={setRatingModal} setLightboxImg={setLightboxImg} getLiveStopwatch={getLiveStopwatch} />}


              {activeTab === 'manage' && <TrackingView sysTime={sysTime} currentUserRole={currentUserRole} currentUserName={currentUserName} tickets={permittedTickets} filteredTickets={filteredTickets_forTracking} searchTerm={searchTerm} setSearchTerm={setSearchTerm} filterStatus={filterStatus} setFilterStatus={setFilterStatus} trackTimeframe={trackTimeframe} setTrackTimeframe={setTrackTimeframe} trackMonth={trackMonth} setTrackMonth={setTrackMonth} trackDate={trackDate} setTrackDate={setTrackDate} showTrackMonthPicker={showTrackMonthPicker} setShowTrackMonthPicker={setShowTrackMonthPicker} showTrackDatePicker={showTrackDatePicker} setShowTrackDatePicker={setShowTrackDatePicker} trackCalMonth={trackCalMonth} setTrackCalMonth={setTrackCalMonth} trackCalYear={trackCalYear} setTrackCalYear={setTrackCalYear} allRosters={allRosters} technicianList={technicianList} setActionModal={setActionModal} updateTicketStatus={updateTicketStatus} setRatingModal={setRatingModal} setLightboxImg={setLightboxImg} getLiveStopwatch={getLiveStopwatch} />}
            </>
          )}
        </div>

        {activeTab !== 'hub' && activeTab !== 'satellite' && activeTab !== 'monitoring' && (
          <div className={`fixed left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] md:w-[calc(100%-3rem)] max-w-md md:max-w-[calc(72rem-3rem)] py-2 md:py-4 bg-slate-900/95 backdrop-blur-xl border-2 md:border-[3px] border-solid border-orange-500 shadow-[0_10px_30px_rgba(249,115,22,0.4)] md:shadow-[0_15px_40px_rgba(249,115,22,0.6)] rounded-2xl md:rounded-[2rem] z-[9999] transform-gpu transition-all duration-500 ease-in-out ${isNavVisible ? 'bottom-4 md:bottom-8 opacity-100 translate-y-0' : '-bottom-32 opacity-0 translate-y-full pointer-events-none'}`}>
            <div className="w-full flex justify-evenly items-center px-1 md:px-8">
              <button onClick={onGoHome} className="flex flex-col items-center justify-center gap-1.5 md:gap-3 active:scale-95 transition-all shrink-0 group">
                <div className="p-2.5 md:p-4 rounded-full bg-transparent text-slate-400 group-hover:text-rose-400 transition-colors"><LogOut className="w-6 h-6 md:w-12 md:h-12" /></div>
                <span className="block text-[14px] md:text-[22px] font-black text-slate-400 group-hover:text-rose-400 tracking-widest whitespace-nowrap shrink-0 transition-colors">ออกจากระบบ</span>
              </button>
              {currentUserRole === 'reporter' ? (
                <>
                  <button onClick={() => setActiveTab('report')} className="flex flex-col items-center justify-center gap-1.5 md:gap-3 transition-all shrink-0 active:scale-95 group">
                    <div className={`p-2.5 md:p-4 rounded-full transition-all ${activeTab === 'report' ? 'bg-gradient-to-b from-orange-400 to-orange-600 text-white shadow-[0_0_15px_rgba(249,115,22,0.8)] border-[2px] border-white scale-110' : 'bg-transparent text-slate-400 group-hover:text-orange-300'}`}><PlusCircle className={`w-6 h-6 md:w-12 md:h-12 ${activeTab === 'report' ? 'stroke-[3px]' : ''}`} /></div>
                    <span className={`block text-[14px] md:text-[22px] font-black tracking-widest whitespace-nowrap shrink-0 transition-all ${activeTab === 'report' ? 'text-orange-400 drop-shadow-md md:mt-1' : 'text-slate-400 group-hover:text-orange-300'}`}>แจ้งซ่อม</span>
                  </button>
                  <button onClick={() => { setActiveTab('tracking'); setSearchTerm(''); }} className="flex flex-col items-center justify-center gap-1.5 md:gap-3 transition-all shrink-0 active:scale-95 group">
                    <div className={`p-2.5 md:p-4 rounded-full transition-all ${activeTab === 'tracking' ? 'bg-gradient-to-b from-orange-400 to-orange-600 text-white shadow-[0_0_15px_rgba(249,115,22,0.8)] border-[2px] border-white scale-110' : 'bg-transparent text-slate-400 group-hover:text-orange-300'}`}><ClipboardCheck className={`w-6 h-6 md:w-12 md:h-12 ${activeTab === 'tracking' ? 'stroke-[3px]' : ''}`} /></div>
                    <span className={`block text-[14px] md:text-[22px] font-black tracking-widest whitespace-nowrap shrink-0 transition-all ${activeTab === 'tracking' ? 'text-orange-400 drop-shadow-md md:mt-1' : 'text-slate-400 group-hover:text-orange-300'}`}>ติดตามสถานะ</span>
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => setActiveTab('hub')} className="flex flex-col items-center justify-center gap-1.5 md:gap-3 transition-all shrink-0 active:scale-95 group">
                    <div className="p-2.5 md:p-4 rounded-full transition-all bg-transparent text-slate-400 group-hover:text-cyan-300"><Home className="w-6 h-6 md:w-12 md:h-12" /></div>
                    <span className="block text-[14px] md:text-[22px] font-black tracking-widest whitespace-nowrap shrink-0 transition-all text-slate-400 group-hover:text-cyan-300">เมนูหลัก</span>
                  </button>
                  <button onClick={() => setActiveTab('dashboard')} className="flex flex-col items-center justify-center gap-1.5 md:gap-3 transition-all shrink-0 active:scale-95 group">
                    <div className={`p-2.5 md:p-4 rounded-full transition-all ${activeTab === 'dashboard' ? 'bg-gradient-to-b from-orange-400 to-orange-600 text-white shadow-[0_0_15px_rgba(249,115,22,0.8)] border-[2px] border-white scale-110' : 'bg-transparent text-slate-400 group-hover:text-orange-300'}`}><LayoutDashboard className={`w-6 h-6 md:w-12 md:h-12 ${activeTab === 'dashboard' ? 'stroke-[3px]' : ''}`} /></div>
                    <span className={`block text-[14px] md:text-[22px] font-black tracking-widest whitespace-nowrap shrink-0 transition-all ${activeTab === 'dashboard' ? 'text-orange-400 drop-shadow-md md:mt-1' : 'text-slate-400 group-hover:text-orange-300'}`}>แผงควบคุม</span>
                  </button>
                  <button onClick={() => setActiveTab('tracking')} className="flex flex-col items-center justify-center gap-1.5 md:gap-3 transition-all shrink-0 active:scale-95 group">
                    <div className={`p-2.5 md:p-4 rounded-full transition-all ${activeTab === 'tracking' ? 'bg-gradient-to-b from-orange-400 to-orange-600 text-white shadow-[0_0_15px_rgba(249,115,22,0.8)] border-[2px] border-white scale-110' : 'bg-transparent text-slate-400 group-hover:text-orange-300'}`}><Wrench className={`w-6 h-6 md:w-12 md:h-12 ${activeTab === 'tracking' ? 'stroke-[3px]' : ''}`} /></div>
                    <span className={`block text-[14px] md:text-[22px] font-black tracking-widest whitespace-nowrap shrink-0 transition-all ${activeTab === 'tracking' ? 'text-orange-400 drop-shadow-md md:mt-1' : 'text-slate-400 group-hover:text-orange-300'}`}>จัดการงาน</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <ActionModal 
        isOpen={actionModal.isOpen} 
        onClose={() => {
          // 🌟 ฟันธง: สั่งล้างข้อมูลให้เกลี้ยงทุกครั้งที่กดปิดหน้าต่าง
          setActionModal({ isOpen: false, ticketId: null, type: null });
          setActionText('');
          setActionAttachments([]);
          setSelectedHelpers([]);
          setHelperSearch('');
        }} 
        type={actionModal.type} 
        ticketId={actionModal.ticketId} 
        currentUserRole={currentUserRole} 
        selectedTech={selectedTech} 
        setSelectedTech={setSelectedTech} 
        currentUserName={currentUserName} 
        technicianList={technicianList} 
        employeeList={employeeList} 
        actionText={actionText} 
        setActionText={setActionText} 
        actionAttachments={actionAttachments} 
        setActionAttachments={setActionAttachments} 
        selectedHelpers={selectedHelpers} 
        setSelectedHelpers={setSelectedHelpers} 
        helperSearch={helperSearch} 
        setHelperSearch={setHelperSearch} 
        setLightboxImg={setLightboxImg} 
        executeActionModal={executeActionModal} 
      />
      
      {showAdminRoster && (
        <div className="fixed inset-0 z-[99999] bg-slate-950 overflow-y-auto pb-20">
          <div className="sticky top-0 right-0 p-4 md:p-6 flex justify-end z-[100] bg-gradient-to-b from-slate-950/90 to-transparent pointer-events-none"></div>
          <div className="-mt-16 md:-mt-20">
            <AdminRosterSettings sysTime={sysTime} allRosters={allRosters} technicianList={technicianList} onClose={() => setShowAdminRoster(false)} />
          </div>
        </div>
      )}

      {/* 🌟 ฟันธง: กล่องประเมินดาวฉบับ World Class เปลี่ยนสี Dynamic ทุกจุด (กรอบ/แสง/ปุ่ม) 100%! 🌟 */}
      {ratingModal.isOpen && (() => {
        const getRatingColors = (rating) => {
          switch(rating) {
            case 1: return { text: 'text-rose-400', star: 'text-rose-400', outline: 'border-rose-500', flare: 'bg-rose-500', mainBtn: 'bg-rose-500 hover:bg-rose-600', tagActive: 'border-rose-500 bg-rose-500/20', emojiText: 'ต้องปรับปรุง 😞', shadow: 'shadow-[0_0_50px_rgba(225,29,72,0.4)]' };
            case 2: return { text: 'text-orange-400', star: 'text-orange-400', outline: 'border-orange-500', flare: 'bg-orange-500', mainBtn: 'bg-orange-500 hover:bg-orange-600', tagActive: 'border-orange-500 bg-orange-500/20', emojiText: 'พอใช้ 😐', shadow: 'shadow-[0_0_50px_rgba(249,115,22,0.4)]' };
            case 3: return { text: 'text-yellow-400', star: 'text-yellow-400', outline: 'border-yellow-400', flare: 'bg-yellow-400', mainBtn: 'bg-yellow-500 hover:bg-yellow-600', tagActive: 'border-yellow-400 bg-yellow-400/20', emojiText: 'ปานกลาง 🙂', shadow: 'shadow-[0_0_50px_rgba(250,204,21,0.3)]' };
            case 4: return { text: 'text-lime-400', star: 'text-lime-400', outline: 'border-lime-500', flare: 'bg-lime-500', mainBtn: 'bg-lime-500 hover:bg-lime-600', tagActive: 'border-lime-500 bg-lime-500/20', emojiText: 'ดี 😃', shadow: 'shadow-[0_0_50px_rgba(132,204,22,0.3)]' };
            case 5: return { text: 'text-emerald-400', star: 'text-emerald-400', outline: 'border-emerald-500', flare: 'bg-emerald-500', mainBtn: 'bg-emerald-500 hover:bg-emerald-600', tagActive: 'border-emerald-500 bg-emerald-500/20', emojiText: 'ยอดเยี่ยม 😍', shadow: 'shadow-[0_0_50px_rgba(16,185,129,0.4)]' };
            // สถานะเริ่มต้น (0 ดาว) ให้เป็นสีเทากลางๆ เพื่อให้สีโผล่มาตอนกด
            default: return { text: 'text-slate-300', star: 'text-slate-600', outline: 'border-slate-600', flare: 'bg-slate-600', mainBtn: 'bg-emerald-600 hover:bg-emerald-500', tagActive: 'border-emerald-500 bg-slate-700/80', emojiText: '', shadow: 'shadow-[0_0_40px_rgba(255,255,255,0.05)]' };
          }
        };
        const ratingColors = getRatingColors(ratingModal.rating);
        
        return (
          <div className="fixed inset-0 z-[99999] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
            {/* 🌟 ปรับ Flare Background ให้ใหญ่ สว่าง และเปลี่ยนสีตามดาว 🌟 */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] md:w-[500px] md:h-[500px] ${ratingColors.flare}/30 blur-[100px] md:blur-[120px] rounded-full pointer-events-none z-0 transition-colors duration-500`}></div>
            
            {/* 🌟 กรอบ Modal ด้านนอกสุด ดึงสี Dynamic มาใส่ที่ Border และ Shadow 🌟 */}
            <div className={`bg-[#0f172a] border-[2px] md:border-[3px] ${ratingColors.outline} rounded-[2rem] p-6 md:p-8 w-full max-w-md ${ratingColors.shadow} relative flex flex-col items-center overflow-y-auto max-h-[90vh] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] transition-all duration-500`}>
              
              <button onClick={() => setRatingModal({ isOpen: false, ticketId: null, rating: 0, comment: '', techName: '', techPhotoUrl: '', tags: [] })} className="absolute top-4 right-4 md:top-6 md:right-6 text-slate-400 hover:text-rose-400 transition-colors z-20"><X size={28}/></button>
              
              <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full border-[3px] ${ratingColors.outline} overflow-hidden mb-3 md:mb-4 bg-slate-800 flex items-center justify-center shadow-inner shrink-0 transition-colors duration-500`}>
                {ratingModal.techPhotoUrl ? (
                  <img src={ratingModal.techPhotoUrl} alt="Tech" className="w-full h-full object-cover" />
                ) : (
                  <User size={40} className={ratingColors.star} />
                )}
              </div>

              <h2 className="text-[20px] md:text-[24px] font-black text-white text-center mb-1 relative z-10">{ratingModal.techName || 'ช่างผู้รับผิดชอบ'}</h2>
              <p className="text-slate-400 text-[12px] md:text-[14px] mb-6 text-center relative z-10">ผู้รับผิดชอบรหัสงาน <span className={`${ratingColors.text} font-mono transition-colors duration-500`}>{ratingModal.ticketId}</span></p>

              <p className={`${ratingColors.text} font-bold text-[16px] md:text-[18px] mb-4 text-center relative z-10 transition-colors duration-500`}>คุณพึงพอใจการซ่อมระดับไหน?</p>

              <div className={`border-[2px] ${ratingColors.outline} rounded-2xl p-3 md:p-4 mb-3 flex gap-2 md:gap-3 bg-slate-900/80 shadow-inner w-full justify-center relative z-10 transition-colors duration-500`}>
                {[1,2,3,4,5].map(star => (
                  <button key={star} onClick={() => setRatingModal({...ratingModal, rating: star})} className="focus:outline-none transition-transform hover:scale-125 active:scale-95">
                    <Star size={36} className={ratingModal.rating >= star ? `${ratingColors.star} drop-shadow-[0_0_15px_currentColor]` : "text-slate-600"} fill={ratingModal.rating >= star ? "currentColor" : "none"} />
                  </button>
                ))}
              </div>

              <div className="h-8 mb-4 relative z-10">
                {ratingModal.rating > 0 && (
                  <span className={`text-[18px] md:text-[20px] font-black ${ratingColors.text} animate-in zoom-in flex items-center justify-center`}>
                    {ratingColors.emojiText}
                  </span>
                )}
              </div>

              <p className="text-slate-300 font-bold text-[13px] md:text-[15px] mb-3 text-center relative z-10">ท่านประทับใจส่วนไหนเป็นพิเศษ? (เลือกได้หลายข้อ)</p>
              <div className="flex flex-col gap-2.5 w-full mb-6 px-2 relative z-10">
                {['💡 ซ่อมเสร็จก่อนกำหนด', '🛠️ แก้ปัญหาเด็ดขาด', '🤝 บริการดีเยี่ยม/สุภาพ', '🛡️ ให้คำแนะนำป้องกัน'].map(tag => {
                  const isSelected = (ratingModal.tags || []).includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => {
                        const currentTags = ratingModal.tags || [];
                        const newTags = isSelected ? currentTags.filter(t => t !== tag) : [...currentTags, tag];
                        setRatingModal({...ratingModal, tags: newTags});
                      }}
                      className={`py-2.5 px-4 rounded-full text-[14px] md:text-[16px] font-bold border-[2px] transition-all active:scale-95 text-center ${
                        isSelected
                          ? `text-white ${ratingColors.tagActive} ${ratingColors.outline} shadow-[0_0_15px_currentColor]`
                          : `bg-slate-800/50 text-slate-400 border-slate-700 hover:${ratingColors.outline}`
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>

              <div className="w-full mb-6 relative z-10">
                <textarea
                  className={`w-full bg-slate-800/80 border-[2px] border-slate-700 focus:${ratingColors.outline} rounded-xl p-4 text-white placeholder-slate-500 outline-none transition-colors text-[14px] md:text-[16px] resize-none`}
                  rows="3"
                  placeholder="พิมพ์ข้อเสนอแนะเพิ่มเติม..."
                  value={ratingModal.comment}
                  onChange={(e) => setRatingModal({...ratingModal, comment: e.target.value})}
                ></textarea>
              </div>

              <div className="flex w-full gap-3 relative z-10">
                <button
                  onClick={() => setRatingModal({ isOpen: false, ticketId: null, rating: 0, comment: '', techName: '', techPhotoUrl: '', tags: [] })}
                  className="flex-[1] py-3.5 md:py-4 rounded-xl font-black text-rose-400 bg-rose-950/30 border border-rose-900/50 hover:bg-rose-900/50 transition-colors active:scale-95 text-[16px]"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={submitRating}
                  className={`flex-[1.5] py-3.5 md:py-4 rounded-xl font-black text-white ${ratingColors.mainBtn} ${ratingColors.shadow} transition-colors active:scale-95 text-[16px] border border-white/20`}
                >
                  ยืนยันการประเมิน
                </button>
              </div>

            </div>
          </div>
        );
      })()}

    {/* 🌟 ฟันธงแก้จุดเดียว: อัปเกรด Lightbox ให้แยกแยะรูปภาพและวิดีโอได้ */}
    {lightboxImg && (
        <div className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in" onClick={() => setLightboxImg(null)}>
          <button className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-full bg-slate-800 border border-slate-700 active:scale-95" onClick={() => setLightboxImg(null)}><X size={24} /></button>
          
          {(lightboxImg.includes('video') || lightboxImg.includes('.mp4')) ? (
            <video 
              src={lightboxImg} 
              controls 
              autoPlay 
              className="max-w-full max-h-full rounded-2xl shadow-2xl border-2 border-slate-700" 
              onClick={(e) => e.stopPropagation()} 
            />
          ) : (
            <img 
              src={lightboxImg} 
              className="max-w-full max-h-full rounded-2xl shadow-2xl border-2 border-slate-700" 
              alt="Full size view" 
            />
          )}
        </div>
      )}
    </div>
  );
}