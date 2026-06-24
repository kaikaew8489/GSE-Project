import React, { useState, useMemo, useEffect } from 'react';
import { 
  Package, Search, Filter, Camera, Wrench, ShieldCheck, AlertTriangle, 
  MapPin, Hash, Calendar, DollarSign, Box, Cpu, Sofa, MonitorSmartphone,
  ChevronRight, X, CheckCircle2, Edit3, Save, Video, FileText, Monitor, ClipboardPaste, PlayCircle, Loader2,
  Beaker, Building2, PlusCircle, User
} from 'lucide-react';
import { createPortal } from 'react-dom';
import { db, storage } from '../lib/firebaseConfig';
import { collection, onSnapshot, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function InventoryView({ sysTime, currentUserRole, currentUserName, setActiveTab, onGoHome }) {
  
  const [assets, setAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});

  const [showAddModal, setShowAddModal] = useState(false);
  const [addFormData, setAddFormData] = useState({
    name: '', id: '', brand: '', priceStr: '', location: '', category: 'IT', responsible_person: ''
  });

  const [evidenceFiles, setEvidenceFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [lightboxMedia, setLightboxMedia] = useState(null);

  const [showUserPicker, setShowUserPicker] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [pickerTarget, setPickerTarget] = useState(''); 
  
  const techList = [
    'นายนวัตกรณ์ ไก่แก้ว', 'นายทศพล ชินนิวัฒน์', 'นายนรัตว์ ศรีสวัสดิ์พงษ์',
    'นายประมินทร์ พิชิตการค้า', 'นายธนกาญจน์ ไตรปิฎก', 'นายชุติพงษ์ ลาวงศ์เกิด',
    'น.ส.จินวะรา สุรัตนกุล', 'น.ส.พิชชาภรณ์ อัมพรายน์', 'น.ส.ฐิตาภรณ์ ทองคำภา',
    'นายวิชญ์ภาส ตรบัณฑิต'
  ];

  // 🌟 ฟันธง: ลบ Other ออกจากสเปกสี 🌟
  const catStyles = {
    All: { iconColor: 'text-slate-300', textClass: 'text-slate-400', active: 'bg-slate-700 text-white border-slate-400 shadow-[0_0_15px_rgba(148,163,184,0.5)]', hover: 'hover:border-slate-500' },
    Engineering: { iconColor: 'text-emerald-400', textClass: 'text-emerald-400', active: 'bg-emerald-600 text-white border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]', hover: 'hover:border-emerald-500' },
    Facility: { iconColor: 'text-sky-400', textClass: 'text-sky-400', active: 'bg-sky-600 text-white border-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.5)]', hover: 'hover:border-sky-500' },
    Furniture: { iconColor: 'text-orange-400', textClass: 'text-orange-400', active: 'bg-orange-600 text-white border-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.5)]', hover: 'hover:border-orange-500' },
    IT: { iconColor: 'text-yellow-400', textClass: 'text-yellow-400', active: 'bg-yellow-500 text-slate-950 border-yellow-300 shadow-[0_0_15px_rgba(234,179,8,0.6)] font-black', hover: 'hover:border-yellow-400' },
    Scientific: { iconColor: 'text-pink-400', textClass: 'text-pink-400', active: 'bg-pink-600 text-white border-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.5)]', hover: 'hover:border-pink-500' },
    Software: { iconColor: 'text-purple-400', textClass: 'text-purple-400', active: 'bg-purple-600 text-white border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.5)]', hover: 'hover:border-purple-500' }
  };

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'assets'), (snapshot) => {
      try {
        const loadedAssets = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            dbId: doc.id, 
            id: data.asset_number || 'N/A',
            name: data.asset_name || 'ไม่ระบุชื่อ',
            brand: data.brand || '-',
            model: data.model || '-',
            priceStr: data.price || '0',
            location: data.storage_location || data.place_name || '-',
            category: data.category || 'IT', // 🌟 เปลี่ยน Default เป็น IT 🌟
            status: data.status || 'active',
            year: data.purchase_date ? String(data.purchase_date).split(' ').pop() : (data.year || '-'),
            asset_class: data.asset_class || '',
            system_group: data.system_group || '',
            responsible_person: data.responsible_person || '-',
            attachedFiles: data.attachedFiles || [],
            ...data 
          };
        });
        
        loadedAssets.sort((a, b) => (b.year || 0) - (a.year || 0));
        setAssets(loadedAssets);
        setIsLoading(false);
      } catch (err) {
        console.error("Asset fetching error: ", err);
        setIsLoading(false);
      }
    });
    return () => unsub();
  }, []);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setIsUploading(true);
    
    setTimeout(() => {
      const newFiles = files.map(file => ({
        name: file.name,
        url: URL.createObjectURL(file), 
        type: file.type || 'unknown',
        rawFile: file
      }));
      setEvidenceFiles(prev => [...prev, ...newFiles]);
      setIsUploading(false);
    }, 500); 
    
    const globalInput = document.getElementById('global-file-input');
    if (globalInput) globalInput.value = '';
  };

  const handleMediaClick = (file) => {
    if (file.type && (file.type.startsWith('image/') || file.type.startsWith('video/'))) {
      setLightboxMedia({ url: file.url, type: file.type }); 
    } else {
      window.open(file.url, '_blank'); 
    }
  };

  const removeFile = (index) => {
    setEvidenceFiles(prev => prev.filter((_, i) => i !== index));
  };

  const renderThumbnails = (filesArray, isOld = false) => {
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
          {!isOld && (
            <button type="button" onClick={(e) => { e.stopPropagation(); removeFile(idx); }} className="absolute top-1 right-1 bg-rose-500 hover:bg-rose-600 rounded-full text-white p-0.5 shadow-md z-10 active:scale-90">
              <X size={14} strokeWidth={3}/>
            </button>
          )}
        </div>
      );
    });
  };

  const processedData = useMemo(() => {
    return assets.map(item => {
      const priceString = item.priceStr ? String(item.priceStr) : "0";
      const cleanPrice = parseFloat(priceString.replace(/,/g, '').replace(/ บาท/g, '').trim()) || 0;
      return { ...item, numericPrice: cleanPrice };
    });
  }, [assets]);

  const filteredAssets = useMemo(() => {
    return processedData.filter(item => {
      const itemName = item.name ? String(item.name).toLowerCase() : "";
      const itemId = item.id ? String(item.id).toLowerCase() : "";
      const search = searchTerm.toLowerCase();
      
      const matchSearch = itemName.includes(search) || itemId.includes(search);
      const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [processedData, searchTerm, selectedCategory]);

  const totalValue = processedData.reduce((sum, item) => sum + item.numericPrice, 0);

  const getCategoryIcon = (cat) => {
    const color = catStyles[cat]?.iconColor || 'text-slate-400';
    switch(cat) {
      case 'IT': return <MonitorSmartphone size={16} className={color} />;
      case 'Software': return <Cpu size={16} className={color} />;
      case 'Furniture': return <Sofa size={16} className={color} />;
      case 'Engineering': return <Wrench size={16} className={color} />;
      case 'Scientific': return <Beaker size={16} className={color} />;
      case 'Facility': return <Building2 size={16} className={color} />;
      default: return <Box size={16} className={color} />;
    }
  };

  const handleEditClick = () => {
    setEditFormData({ ...selectedAsset });
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    try {
      if (!editFormData.dbId) {
        alert("❌ ข้อมูลนี้ยังไม่ได้เชื่อมต่อกับฐานข้อมูล Cloud");
        return;
      }
      
      setIsUploading(true);

      const newAttachedFiles = [];
      for (const fileObj of evidenceFiles) {
        if (fileObj.rawFile) {
          const fileName = `${Date.now()}_${fileObj.rawFile.name}`;
          const fileRef = ref(storage, `assets/${fileName}`);
          const snapshot = await uploadBytes(fileRef, fileObj.rawFile);
          const downloadUrl = await getDownloadURL(snapshot.ref);
          newAttachedFiles.push({ url: downloadUrl, type: fileObj.type, name: fileObj.rawFile.name });
        }
      }

      const { dbId, ...updateData } = editFormData;
      const finalAttachedFiles = updateData.attachedFiles ? [...updateData.attachedFiles, ...newAttachedFiles] : newAttachedFiles;

      await updateDoc(doc(db, 'assets', dbId), {
        asset_name: updateData.name,
        asset_number: updateData.id,
        brand: updateData.brand,
        price: updateData.priceStr,
        storage_location: updateData.location,
        responsible_person: updateData.responsible_person || '-',
        attachedFiles: finalAttachedFiles,
        lastUpdated: serverTimestamp() 
      });

      setIsUploading(false);
      setSelectedAsset({ ...editFormData, attachedFiles: finalAttachedFiles });
      setIsEditing(false);
      setEvidenceFiles([]);
    } catch (error) {
      setIsUploading(false);
      console.error("Error updating document: ", error);
      alert("❌ เกิดข้อผิดพลาดในการบันทึกข้อมูล: " + error.message);
    }
  };

  const handleSaveNewAsset = async () => {
    try {
      if (!addFormData.name || !addFormData.id) {
        alert("⚠️ กรุณากรอกชื่อครุภัณฑ์ และเลขครุภัณฑ์ (SN) ให้ครบถ้วนครับ!");
        return;
      }

      setIsUploading(true);

      const attachedFilesData = [];
      for (const fileObj of evidenceFiles) {
        if (fileObj.rawFile) {
          const fileName = `${Date.now()}_${fileObj.rawFile.name}`;
          const fileRef = ref(storage, `assets/${fileName}`);
          const snapshot = await uploadBytes(fileRef, fileObj.rawFile);
          const downloadUrl = await getDownloadURL(snapshot.ref);
          
          attachedFilesData.push({
            url: downloadUrl,
            type: fileObj.type, 
            name: fileObj.rawFile.name
          });
        }
      }

      await addDoc(collection(db, 'assets'), {
        asset_name: addFormData.name,
        asset_number: addFormData.id,
        brand: addFormData.brand || '-',
        price: addFormData.priceStr || '0',
        storage_location: addFormData.location || '-',
        responsible_person: addFormData.responsible_person || currentUserName || '-',
        category: addFormData.category || 'IT', // 🌟 เปลี่ยน Default เป็น IT 🌟
        status: 'active', 
        year: sysTime ? sysTime.getFullYear() + 543 : new Date().getFullYear() + 543, 
        attachedFiles: attachedFilesData,
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp() 
      });

      setIsUploading(false);
      setShowAddModal(false);
      setAddFormData({ name: '', id: '', brand: '', priceStr: '', location: '', category: 'IT', responsible_person: '' });
      setEvidenceFiles([]);
      alert("✅ เพิ่มข้อมูลครุภัณฑ์ใหม่เข้าสู่ระบบสำเร็จ!");
      
    } catch (error) {
      setIsUploading(false);
      console.error("Error adding document: ", error);
      alert("❌ เกิดข้อผิดพลาดในการบันทึกข้อมูล: " + error.message);
    }
  };

  const handleClipboardPaste = async () => {
    try {
      const clipboardItems = await navigator.clipboard.read();
      for (const clipboardItem of clipboardItems) {
        const imageTypes = clipboardItem.types.filter(type => type.startsWith('image/'));
        if (imageTypes.length > 0) {
          const blob = await clipboardItem.getType(imageTypes[0]);
          const file = new File([blob], `snipped_image_${Date.now()}.png`, { type: blob.type });
          handleFileUpload({ target: { files: [file] } });
          setShowMediaPicker(false);
          return;
        }
      }
      alert("⚠️ ไม่พบรูปภาพที่แคปไว้ใน Clipboard ครับ!");
    } catch (err) {
      alert("⚠️ เบราว์เซอร์ไม่อนุญาต หรือท่านยังไม่ได้แคปรูปไว้ครับ");
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500 pb-16 relative z-10 pt-4 md:pt-6">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-slate-900/80 backdrop-blur-xl border-[2px] border-indigo-500/50 rounded-3xl p-6 shadow-[0_0_30px_rgba(99,102,241,0.2)] relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 text-indigo-500/10 group-hover:text-indigo-500/20 transition-colors"><Package size={120} /></div>
          <h3 className="text-slate-400 font-bold text-[14px] tracking-widest uppercase mb-1">Total Assets</h3>
          <div className="text-[36px] font-black text-white flex items-end gap-2 drop-shadow-md">
            {isLoading ? <Loader2 className="animate-spin w-8 h-8 text-indigo-400" /> : processedData.length} 
            <span className="text-[16px] text-indigo-400 mb-2">รายการ</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">*(ระบบ Cloud: Real-time Data)</div>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-xl border-[2px] border-emerald-500/50 rounded-3xl p-6 shadow-[0_0_30px_rgba(16,185,129,0.2)] relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 text-emerald-500/10 group-hover:text-emerald-500/20 transition-colors"><DollarSign size={120} /></div>
          <h3 className="text-slate-400 font-bold text-[14px] tracking-widest uppercase mb-1">Total Value</h3>
          <div className="text-[32px] font-black text-emerald-400 flex items-end gap-2 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)] truncate">
            {isLoading ? <Loader2 className="animate-spin w-8 h-8 text-emerald-400" /> : totalValue.toLocaleString()} 
            <span className="text-[16px] text-slate-300 mb-1.5">THB</span>
          </div>
        </div>
      </div>

      <div className="bg-[#0f172a]/90 backdrop-blur-xl border-[2px] border-slate-700 rounded-2xl p-4 flex flex-col gap-4 shadow-lg w-full">
        
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between w-full">
          <div className="relative w-full md:flex-1 shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400" size={20} />
            <input 
              type="text" 
              placeholder="ค้นหา เลขครุภัณฑ์, ชื่อ, หรือสถานที่..." 
              className="w-full bg-slate-900 border-[2px] border-slate-600 rounded-xl py-3 pl-12 pr-4 text-white font-bold text-[14px] focus:border-indigo-500 focus:shadow-[0_0_20px_rgba(99,102,241,0.3)] outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button onClick={() => { setAddFormData({ name: '', id: '', brand: '', priceStr: '', location: '', category: 'IT', responsible_person: '' }); setEvidenceFiles([]); setShowAddModal(true); }} className="w-full md:w-auto shrink-0 bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-black py-3 px-8 rounded-xl border-[2px] border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 active:scale-95 transition-all">
            <PlusCircle size={18} /> เพิ่มครุภัณฑ์
          </button>
        </div>

        {/* 🌟 ฟันธง: ลบ Other ออกจากแถบปุ่ม Filter 🌟 */}
        <div className="flex w-full overflow-x-auto gap-2 pb-2 md:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {['All', 'Engineering', 'Facility', 'Furniture', 'IT', 'Scientific', 'Software'].map(cat => {
            const style = catStyles[cat] || catStyles.IT;
            return (
              <button 
                key={cat} onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 flex-1 px-4 py-2.5 rounded-xl font-bold text-[13px] md:text-[14px] border-[2px] transition-all active:scale-95 flex items-center justify-center gap-2 ${
                  selectedCategory === cat ? style.active : `bg-slate-800 text-slate-400 border-slate-700 ${style.hover}`
                }`}
              >
                {getCategoryIcon(cat)} <span className="whitespace-nowrap">{cat === 'All' ? 'ทั้งหมด' : cat}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {isLoading ? (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-indigo-400 gap-4">
             <Loader2 className="w-12 h-12 animate-spin" />
             <span className="font-bold text-[16px] tracking-widest animate-pulse">กำลังซิงค์ข้อมูลคลังสินทรัพย์...</span>
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-500 font-bold bg-slate-900/50 rounded-3xl border-2 border-slate-800">
            ไม่มีรายการที่ตรงกับการค้นหา หรือกำลังโหลดข้อมูล...
          </div>
        ) : (
          filteredAssets.map(asset => (
            <div key={asset.dbId || asset.id} onClick={() => {setSelectedAsset(asset); setIsEditing(false); setShowAuditModal(false); setEvidenceFiles([]);}} className="bg-slate-900/80 backdrop-blur-md border-[2px] border-slate-700 hover:border-indigo-500 rounded-[1.5rem] p-5 cursor-pointer group transition-all shadow-lg hover:shadow-[0_0_25px_rgba(99,102,241,0.3)] hover:-translate-y-1">
              <div className="flex justify-between items-start mb-3">
                <span className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/50 px-2.5 py-1 rounded-lg font-mono font-black text-[12px] shadow-sm flex items-center gap-1.5"><Hash size={12}/> {asset.id}</span>
                <span className={`px-2.5 py-1 rounded-lg font-black text-[10px] uppercase tracking-wider border ${asset.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' : 'bg-rose-500/20 text-rose-400 border-rose-500/50 animate-pulse'}`}>
                  {asset.status === 'active' ? '🟢 ปกติ' : '🔴 ส่งซ่อม'}
                </span>
              </div>
              <h4 className="text-white font-black text-[16px] md:text-[18px] leading-tight mb-2 line-clamp-2 group-hover:text-indigo-300 transition-colors">{asset.name}</h4>
              
              <div className="space-y-2 mt-4 pt-4 border-t border-slate-700/50">
                <div className="flex items-center gap-2 text-slate-400 text-[12px] font-bold"><MapPin size={14} className="text-orange-400 shrink-0"/> <span className="truncate">{asset.location || '-'}</span></div>
                <div className="flex items-center justify-between text-[12px] font-bold">
                  <div className="flex items-center gap-2 text-slate-400"><Calendar size={14} className="text-cyan-400"/> ปี {asset.year || '-'}</div>
                  <div className="text-emerald-400 font-mono tracking-wide">{asset.numericPrice > 0 ? `${asset.numericPrice.toLocaleString()} ฿` : 'N/A'}</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal หน้าต่างฟอร์มเพิ่มครุภัณฑ์ใหม่ */}
      {showAddModal && createPortal(
        <div className="fixed inset-0 z-[999999] bg-[#020617]/95 backdrop-blur-2xl flex items-center justify-center p-4 animate-in fade-in zoom-in-95">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none"></div>
          
          <div className="bg-[#0f172a] border-[3px] border-emerald-500 rounded-[2rem] w-full max-w-lg shadow-[0_0_60px_rgba(16,185,129,0.5)] relative flex flex-col overflow-hidden max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden">
            <div className="absolute top-5 right-5 z-20">
              <button onClick={() => { setShowAddModal(false); setEvidenceFiles([]); }} className="text-slate-400 hover:text-rose-400 bg-slate-800 p-2 rounded-full border border-slate-600 shadow-md transition-colors"><X size={18}/></button>
            </div>
            
            <div className="bg-slate-900 p-6 border-b border-slate-800 pt-8">
              <h2 className="text-[20px] md:text-[22px] font-black text-emerald-400 flex items-center gap-2"><PlusCircle size={24}/> เพิ่มข้อมูลครุภัณฑ์ใหม่</h2>
            </div>

            <div className="p-6 space-y-4 bg-slate-900/50">
              <div>
                <label className="text-emerald-400 text-[11px] font-bold">ชื่อครุภัณฑ์ <span className="text-rose-500">*</span></label>
                <textarea rows="2" placeholder="ระบุชื่ออุปกรณ์..." className="w-full bg-[#020617] border border-emerald-500/50 rounded-lg p-2 text-white font-bold text-[14px] outline-none mt-1 resize-none shadow-inner" value={addFormData.name} onChange={e => setAddFormData({...addFormData, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-emerald-400 text-[11px] font-bold">เลขครุภัณฑ์ (SN) <span className="text-rose-500">*</span></label>
                  <input type="text" placeholder="เช่น G1-F01-..." className="w-full bg-[#020617] border border-emerald-500/50 rounded-lg p-2 text-slate-400 font-mono text-[14px] outline-none mt-1 shadow-inner" value={addFormData.id} onChange={e => setAddFormData({...addFormData, id: e.target.value})} />
                </div>
                <div>
                  <label className="text-emerald-400 text-[11px] font-bold">หมวดหมู่ (Category)</label>
                  {/* 🌟 ฟันธง: ลบ Other ออกจาก Dropdown ตัวเลือก 🌟 */}
                  <select className="w-full bg-[#020617] border border-emerald-500/50 rounded-lg p-2 text-white font-bold text-[14px] outline-none mt-1 shadow-inner" value={addFormData.category} onChange={e => setAddFormData({...addFormData, category: e.target.value})}>
                    {['Engineering', 'Facility', 'Furniture', 'IT', 'Scientific', 'Software'].map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-emerald-400 text-[11px] font-bold">แบรนด์/ยี่ห้อ</label>
                  <input type="text" placeholder="ระบุยี่ห้อ" className="w-full bg-[#020617] border border-emerald-500/50 rounded-lg p-2 text-white font-bold text-[14px] outline-none mt-1 shadow-inner" value={addFormData.brand} onChange={e => setAddFormData({...addFormData, brand: e.target.value})} />
                </div>
                <div>
                  <label className="text-emerald-400 text-[11px] font-bold">ราคา (บาท)</label>
                  <input type="text" placeholder="เช่น 15000" className="w-full bg-[#020617] border border-emerald-500/50 rounded-lg p-2 text-emerald-400 font-mono font-bold text-[14px] outline-none mt-1 shadow-inner" value={addFormData.priceStr} onChange={e => setAddFormData({...addFormData, priceStr: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="text-emerald-400 text-[11px] font-bold flex items-center gap-1"><MapPin size={12}/> สถานที่เก็บ</label>
                <textarea rows="2" placeholder="ระบุสถานที่ติดตั้ง..." className="w-full bg-[#020617] border border-emerald-500/50 rounded-lg p-2 text-white font-bold text-[14px] outline-none mt-1 resize-none shadow-inner" value={addFormData.location} onChange={e => setAddFormData({...addFormData, location: e.target.value})} />
              </div>

              <div>
                <label className="text-emerald-400 text-[11px] font-bold flex items-center gap-1"><User size={12}/> ผู้รับผิดชอบ / ผู้ครอบครอง</label>
                <button type="button" onClick={() => { setPickerTarget('add'); setShowUserPicker(true); setUserSearch(''); }} className="w-full bg-[#020617] border border-emerald-500/50 rounded-lg p-2 text-white font-bold text-[14px] outline-none mt-1 shadow-inner text-left flex justify-between items-center transition-all hover:border-emerald-400">
                  {addFormData.responsible_person ? <span>{addFormData.responsible_person}</span> : <span className="text-slate-500 font-normal">เลือกผู้รับผิดชอบ...</span>}
                  <ChevronRight size={16} className="text-emerald-500/80" />
                </button>
              </div>

              <div className="pt-2 border-t border-emerald-500/30 mt-2">
                <label className="text-emerald-400 text-[11px] font-bold mb-2 block">ไฟล์แนบ / รูปภาพ</label>
                {evidenceFiles.length > 0 && (
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-3 p-3 bg-[#020617] rounded-xl border border-emerald-500/30 shadow-inner">
                      {renderThumbnails(evidenceFiles)}
                    </div>
                  </div>
                )}
                {isUploading && (
                  <div className="w-full bg-emerald-900/10 border-[2px] border-dashed border-emerald-500/50 rounded-xl p-4 flex flex-col items-center justify-center text-emerald-400 mb-3">
                    <Loader2 className="w-6 h-6 animate-spin mb-2" />
                    <span className="font-bold text-[12px]">กำลังเตรียมไฟล์...</span>
                  </div>
                )}
                {!isUploading && (
                  <button onClick={() => setShowMediaPicker(true)} className="w-full bg-emerald-900/10 border-[2px] border-dashed border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)] rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all active:scale-95">
                    <div className="flex gap-3 text-emerald-400/80 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)] mb-1">
                      <Camera size={24} /> <Video size={24} /> <FileText size={24} />
                    </div>
                    <span className="text-emerald-300/80 font-bold text-[13px]">คลิกเพื่อถ่ายภาพ / แนบไฟล์</span>
                  </button>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-slate-800 flex gap-3 bg-slate-900">
              <button onClick={() => { setShowAddModal(false); setEvidenceFiles([]); }} className="flex-[1] py-3.5 rounded-xl font-black text-slate-300 bg-slate-800 border border-slate-600 hover:bg-slate-700 transition-all active:scale-95 text-[15px]">
                ยกเลิก
              </button>
              <button onClick={handleSaveNewAsset} disabled={isUploading} className={`flex-[1.5] py-3.5 rounded-xl font-black text-white transition-all active:scale-95 text-[15px] flex items-center justify-center gap-2 ${isUploading ? 'bg-slate-600 cursor-not-allowed opacity-50' : 'bg-emerald-600 hover:bg-emerald-500 border border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]'}`}>
                <Save size={18} /> บันทึกเข้าระบบ
              </button>
            </div>
          </div>
        </div>
      , document.body)}

      {/* Modal หน้าต่างข้อมูลครุภัณฑ์ (Edit/View) */}
      {selectedAsset && !showAddModal && createPortal(
        <div className="fixed inset-0 z-[999999] bg-[#020617]/95 backdrop-blur-2xl flex items-center justify-center p-4 animate-in fade-in zoom-in-95">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none"></div>
          
          <div className="bg-[#0f172a] border-[3px] border-indigo-500 rounded-[2rem] w-full max-w-lg shadow-[0_0_60px_rgba(99,102,241,0.5)] relative flex flex-col overflow-hidden max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden">
            <div className="absolute top-5 right-5 flex gap-2 z-20">
              {!isEditing && (
                <button onClick={handleEditClick} className="text-slate-400 hover:text-indigo-400 bg-slate-800 p-2 rounded-full border border-slate-600 shadow-md transition-colors" title="แก้ไขข้อมูล"><Edit3 size={18}/></button>
              )}
              <button onClick={() => { setSelectedAsset(null); setIsEditing(false); setEvidenceFiles([]); }} className="text-slate-400 hover:text-rose-400 bg-slate-800 p-2 rounded-full border border-slate-600 shadow-md transition-colors" title="ปิดหน้าต่าง"><X size={18}/></button>
            </div>
            
            <div className="bg-slate-900 p-6 border-b border-slate-800 relative pt-12">
              <div className="flex items-center gap-2 mb-3">
                {getCategoryIcon(selectedAsset.category)}
                <span className={`font-black tracking-widest uppercase text-[12px] ${catStyles[selectedAsset.category]?.textClass || 'text-slate-400'}`}>
                  {selectedAsset.category || 'N/A'}
                </span>
                
                {selectedAsset.asset_class && (
                  <span className="ml-2 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-[10px] text-slate-400">{selectedAsset.asset_class}</span>
                )}
              </div>

              {!isEditing ? (
                <>
                  <h2 className="text-[20px] md:text-[22px] font-black text-white leading-tight mb-2 pr-8">{selectedAsset.name}</h2>
                  <div className="font-mono text-[14px] text-slate-400">SN: {selectedAsset.id}</div>
                  {selectedAsset.system_group && <div className="mt-2 text-cyan-400 text-[12px] font-bold">System: {selectedAsset.system_group}</div>}
                </>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="text-indigo-400 text-[11px] font-bold">ชื่อครุภัณฑ์</label>
                    <textarea rows="2" className="w-full bg-[#020617] border border-indigo-500/50 rounded-lg p-2 text-white font-bold text-[16px] outline-none mt-1 resize-none" value={editFormData.name || ''} onChange={e => setEditFormData({...editFormData, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-indigo-400 text-[11px] font-bold">เลขครุภัณฑ์ (SN)</label>
                    <input type="text" className="w-full bg-[#020617] border border-indigo-500/50 rounded-lg p-2 text-slate-400 font-mono text-[14px] outline-none mt-1" value={editFormData.id || ''} onChange={e => setEditFormData({...editFormData, id: e.target.value})} />
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 space-y-4 bg-slate-900/50">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                  <div className="text-slate-500 text-[11px] font-bold mb-1">แบรนด์/ยี่ห้อ</div>
                  {!isEditing ? <div className="text-white font-bold truncate">{selectedAsset.brand || '-'}</div> : <input type="text" className="w-full bg-[#020617] border border-indigo-500/50 rounded-lg px-2 py-1 text-white font-bold text-[14px] outline-none" value={editFormData.brand || ''} onChange={e => setEditFormData({...editFormData, brand: e.target.value})} />}
                </div>
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                  <div className="text-slate-500 text-[11px] font-bold mb-1">มูลค่า/ราคา (บาท)</div>
                  {!isEditing ? <div className="text-emerald-400 font-mono font-black truncate">{selectedAsset.priceStr || '0'}</div> : <input type="text" className="w-full bg-[#020617] border border-indigo-500/50 rounded-lg px-2 py-1 text-emerald-400 font-mono font-bold text-[14px] outline-none" value={editFormData.priceStr || ''} onChange={e => setEditFormData({...editFormData, priceStr: e.target.value})} />}
                </div>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex items-start gap-3">
                <MapPin className="text-orange-400 mt-0.5 shrink-0" size={18}/>
                <div className="w-full">
                  <div className="text-slate-500 text-[11px] font-bold mb-1">สถานที่ตั้งปัจจุบัน</div>
                  {!isEditing ? <div className="text-white font-bold text-[14px]">{selectedAsset.location || '-'}</div> : <textarea rows="2" className="w-full bg-[#020617] border border-indigo-500/50 rounded-lg p-2 text-white font-bold text-[14px] outline-none resize-none" value={editFormData.location || ''} onChange={e => setEditFormData({...editFormData, location: e.target.value})} />}
                </div>
              </div>
              
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex items-start gap-3">
                <User className="text-blue-400 mt-0.5 shrink-0" size={18}/>
                <div className="w-full">
                  <div className="text-slate-500 text-[11px] font-bold mb-1">ผู้รับผิดชอบ / ผู้ครอบครอง</div>
                  {!isEditing ? (
                    <div className="text-white font-bold text-[14px]">{selectedAsset.responsible_person || '-'}</div>
                  ) : (
                    <button type="button" onClick={() => { setPickerTarget('edit'); setShowUserPicker(true); setUserSearch(''); }} className="w-full bg-[#020617] border border-indigo-500/50 rounded-lg px-3 py-2.5 text-white font-bold text-[14px] outline-none text-left flex justify-between items-center transition-all hover:border-indigo-400">
                      {editFormData.responsible_person ? <span>{editFormData.responsible_person}</span> : <span className="text-slate-500 font-normal">เลือกผู้รับผิดชอบ...</span>}
                      <ChevronRight size={16} className="text-indigo-500/80" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-800 flex flex-col gap-3 bg-slate-900">
              
              {selectedAsset.attachedFiles && selectedAsset.attachedFiles.length > 0 ? (
                 <div className="mb-2">
                  <div className="text-slate-400 text-[11px] font-bold mb-2">ไฟล์แนบ / รูปภาพ</div>
                  <div className="flex flex-wrap gap-3 p-3 bg-slate-950/50 rounded-2xl border border-slate-700/50 shadow-inner">
                    {renderThumbnails(selectedAsset.attachedFiles, true)}
                  </div>
                 </div>
              ) : (
                !isEditing && (
                  <div className="mb-2">
                    <div className="text-slate-400 text-[11px] font-bold mb-2">ไฟล์แนบ / รูปภาพ</div>
                    <div className="text-slate-500 text-[13px] italic bg-slate-950/50 p-3 rounded-xl border border-slate-700/50 text-center">
                      - ไม่มีไฟล์แนบ -
                    </div>
                  </div>
                )
              )}

              {isEditing && evidenceFiles.length > 0 && (
                <div className="mb-2">
                  <div className="text-emerald-400 text-[11px] font-bold mb-2">ไฟล์ใหม่ที่เตรียมอัปโหลด</div>
                  <div className="flex flex-wrap gap-3 p-3 bg-[#020617] rounded-2xl border border-emerald-500/30 shadow-inner">
                    {renderThumbnails(evidenceFiles, false)}
                  </div>
                </div>
              )}

              {isUploading && (
                <div className="w-full bg-emerald-900/10 border-[2px] border-dashed border-emerald-500/50 rounded-xl p-6 flex flex-col items-center justify-center text-emerald-400 mb-2">
                  <Loader2 className="w-8 h-8 animate-spin mb-2" />
                  <span className="font-bold text-[14px]">กำลังเตรียมไฟล์...</span>
                </div>
              )}

              {!isUploading && isEditing && !showAuditModal && (
                <button onClick={() => setShowMediaPicker(true)} className={`w-full bg-emerald-900/10 border-[2px] border-dashed border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)] rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all active:scale-95 hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]`}>
                  <div className="flex gap-3 text-emerald-400/80 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)] mb-1">
                    <Camera size={26} /> <Video size={26} /> <FileText size={26} />
                  </div>
                  <span className="text-emerald-300/80 font-bold text-[14px]">คลิกเพื่อเพิ่มรูปภาพ / ไฟล์อ้างอิง</span>
                </button>
              )}

              {showAuditModal && evidenceFiles.length === 0 && (
                <div className="bg-emerald-900/20 border border-emerald-500/50 rounded-xl p-4 flex flex-col items-center justify-center text-center animate-in zoom-in">
                  <CheckCircle2 size={40} className="text-emerald-400 mb-2 drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]"/>
                  <span className="text-emerald-300 font-bold">บันทึกข้อมูลและภาพถ่ายสำเร็จ!</span>
                  <span className="text-slate-400 text-[11px] mt-1">อัปเดตข้อมูลเข้าระบบเรียบร้อยแล้ว</span>
                </div>
              )}

              {isEditing ? (
                <div className="flex w-full gap-3 mt-2">
                  <button onClick={() => { setIsEditing(false); setEvidenceFiles([]); setShowAuditModal(false); setEditFormData({}); }} className="flex-[1] py-3.5 rounded-xl font-black text-slate-300 bg-slate-800 border border-slate-600 hover:bg-slate-700 transition-all active:scale-95 text-[15px]">
                    ยกเลิก
                  </button>
                  <button onClick={() => { handleSaveEdit(); setEvidenceFiles([]); setShowAuditModal(true); setTimeout(() => setShowAuditModal(false), 2500); }} disabled={isUploading} className={`flex-[1.5] py-3.5 rounded-xl font-black text-white transition-all active:scale-95 text-[15px] flex items-center justify-center gap-2 ${isUploading ? 'bg-slate-600 cursor-not-allowed opacity-50' : 'bg-emerald-600 hover:bg-emerald-500 border border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]'}`}>
                    <Save size={18} /> ยืนยันการเปลี่ยนแปลง
                  </button>
                </div>
              ) : (
                <div className="flex w-full gap-3 mt-2">
                  <button onClick={() => { setSelectedAsset(null); setIsEditing(false); setEvidenceFiles([]); }} className="flex-[1] py-3.5 rounded-xl font-black text-slate-300 bg-slate-800 border border-slate-600 hover:bg-slate-700 transition-all active:scale-95 text-[15px]">
                    ปิดหน้าต่าง
                  </button>
                  <button onClick={handleEditClick} className="flex-[1.5] py-3.5 rounded-xl font-black text-indigo-300 bg-indigo-600/20 border border-indigo-500/50 hover:bg-indigo-600/40 hover:text-white transition-all active:scale-95 text-[15px] flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(99,102,241,0.15)]">
                    <Edit3 size={18} /> แก้ไขข้อมูลครุภัณฑ์
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      , document.body)}

      {/* Modal: เลือกรูปแบบ Media */}
      {showMediaPicker && createPortal(
        <div className="fixed inset-0 z-[10000000] w-screen h-[100dvh] bg-[#020617]/95 backdrop-blur-3xl flex items-center justify-center p-4 animate-in fade-in zoom-in">
          <div className="bg-[#0f172a] border-[2px] border-orange-500 rounded-[2.5rem] p-6 md:p-8 w-full max-w-sm shadow-[0_0_60px_rgba(249,115,22,0.6),inset_0_0_30px_rgba(249,115,22,0.2)] relative flex flex-col items-center">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-32 bg-orange-500/30 blur-[60px] pointer-events-none rounded-full"></div>
             
             <div className="flex items-center gap-3 text-orange-400 mb-8 relative z-10 drop-shadow-[0_0_10px_rgba(249,115,22,0.8)]">
                <Monitor className="w-8 h-8" />
                <h3 className="text-[20px] md:text-[22px] font-black tracking-wide">เลือกรูปภาพ/วิดีโอ</h3>
             </div>

             <div className="w-full space-y-4 relative z-10">
                <div className="flex md:hidden flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <button type="button" onClick={() => { document.getElementById('global-file-input').click(); setShowMediaPicker(false); }} className="bg-gradient-to-b from-orange-500 to-orange-600 hover:brightness-110 text-white rounded-2xl p-4 flex flex-col items-center justify-center gap-2 border-[2px] border-orange-300 shadow-[0_0_20px_rgba(249,115,22,0.5)] active:scale-95 transition-all">
                      <Camera className="w-8 h-8" />
                      <span className="font-black text-[14px]">ถ่ายรูป</span>
                    </button>
                    <button type="button" onClick={() => { document.getElementById('global-file-input').click(); setShowMediaPicker(false); }} className="bg-gradient-to-b from-purple-500 to-purple-600 hover:brightness-110 text-white rounded-2xl p-4 flex flex-col items-center justify-center gap-2 border-[2px] border-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.5)] active:scale-95 transition-all">
                      <Video className="w-8 h-8" />
                      <span className="font-black text-[14px]">ถ่ายวิดีโอ</span>
                    </button>
                  </div>
                </div>

                <button type="button" onClick={() => { document.getElementById('global-file-input').click(); setShowMediaPicker(false); }} className="w-full bg-gradient-to-b from-emerald-500 to-teal-600 hover:brightness-110 text-white rounded-2xl p-4 flex items-center justify-center gap-3 border-[2px] border-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.5)] active:scale-95 transition-all font-black text-[15px]">
                  <Monitor className="w-6 h-6" /> เลือกคลังภาพ/วิดีโอ/ไฟล์
                </button>

                <div className="hidden md:flex flex-col gap-4">
                   <button type="button" onClick={handleClipboardPaste} className="w-full bg-[#1e293b] hover:bg-slate-800 text-purple-400 rounded-2xl p-4 flex flex-col items-center justify-center gap-1.5 border-[2px] border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)] active:scale-95 transition-all">
                     <div className="flex items-center gap-2">
                        <ClipboardPaste className="w-5 h-5" /> <span className="font-black text-[15px]">แคปหน้าจอเสร็จแล้วกดปุ่มนี้</span>
                     </div>
                     <span className="text-[11px] text-slate-400 font-bold">กด <span className="text-orange-400">Win + Shift + S</span> หรือ <span className="text-orange-400">PRT SC</span></span>
                   </button>
                </div>
             </div>

             <button type="button" onClick={() => setShowMediaPicker(false)} className="mt-8 w-full py-4 bg-slate-900 text-slate-300 font-black text-[16px] rounded-2xl border-[2px] border-slate-600 hover:border-rose-500 hover:text-rose-400 hover:shadow-[0_0_20px_rgba(225,29,72,0.3)] transition-all active:scale-95 relative z-10">
               ยกเลิก
             </button>
          </div>
        </div>
      , document.body)}

      {/* Modal: เลือกรายชื่อทีมงาน (User Picker) */}
      {showUserPicker && createPortal(
        <div className="fixed inset-0 z-[10000000] w-screen h-[100dvh] bg-[#020617]/95 backdrop-blur-2xl flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#0f172a] border-[2px] border-orange-500 rounded-[2rem] p-6 w-full max-w-sm shadow-[0_0_60px_rgba(249,115,22,0.5)] flex flex-col max-h-[85vh] relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-32 bg-orange-500/20 blur-[60px] pointer-events-none rounded-full"></div>
            
            <h3 className="text-[18px] md:text-[20px] font-black text-orange-400 mb-4 text-center drop-shadow-[0_0_8px_rgba(249,115,22,0.8)] relative z-10">เลือกผู้รับผิดชอบ</h3>
            
            <div className="mb-4 relative z-10">
              <input type="text" placeholder="พิมพ์ค้นหาชื่อ..." autoFocus className="w-full bg-[#1e293b] border border-slate-600 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500 transition-colors shadow-inner" value={userSearch} onChange={(e) => setUserSearch(e.target.value)} />
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-orange-500 [&::-webkit-scrollbar-thumb]:rounded-full relative z-10">
              {techList.filter(name => name.toLowerCase().includes(userSearch.toLowerCase())).map((name, idx) => (
                <button type="button" key={idx} onClick={() => {
                  if (pickerTarget === 'add') setAddFormData({...addFormData, responsible_person: name});
                  else if (pickerTarget === 'edit') setEditFormData({...editFormData, responsible_person: name});
                  setShowUserPicker(false);
                }} className="w-full text-left px-4 py-3.5 bg-[#1e293b] border border-slate-700 hover:border-orange-500 hover:bg-orange-500/20 text-slate-200 hover:text-orange-400 cursor-pointer rounded-xl text-[15px] font-bold transition-all active:scale-95 shadow-sm">
                  {name}
                </button>
              ))}
              {techList.filter(name => name.toLowerCase().includes(userSearch.toLowerCase())).length === 0 && (
                <div className="p-4 text-center text-slate-500 text-sm font-bold">ไม่พบรายชื่อ</div>
              )}
            </div>
            
            <button type="button" onClick={() => setShowUserPicker(false)} className="mt-5 w-full py-4 bg-[#1e293b] text-slate-300 font-black text-[16px] rounded-2xl border border-slate-600 hover:bg-slate-800 hover:text-white transition-colors active:scale-95 relative z-10">ยกเลิก</button>
          </div>
        </div>
      , document.body)}

      <input type="file" id="global-file-input" multiple className="hidden" onChange={handleFileUpload} />

      {/* Lightbox มัลติมีเดียเต็มหน้าจอภายใน App */}
      {lightboxMedia && createPortal(
        <div className="fixed inset-0 z-[99999999] w-screen h-[100dvh] bg-[#020617]/95 backdrop-blur-3xl flex items-center justify-center p-4 animate-in fade-in zoom-in" onClick={() => setLightboxMedia(null)}>
          <button className="absolute top-5 right-5 text-slate-400 hover:text-rose-400 bg-slate-800 p-2 rounded-full border border-slate-600 z-50 transition-colors" onClick={() => setLightboxMedia(null)}>
            <X size={24} />
          </button>
          <div className="relative max-w-5xl max-h-[90vh] rounded-[2rem] overflow-hidden border-[2px] border-emerald-500/50 shadow-[0_0_50px_rgba(16,185,129,0.3)]" onClick={e => e.stopPropagation()}>
            {lightboxMedia.type.startsWith('image/') ? (
              <img src={lightboxMedia.url} alt="Full view" className="max-w-full max-h-[90vh] object-contain" />
            ) : (
              <video src={lightboxMedia.url} controls autoPlay className="max-w-full max-h-[90vh] object-contain" />
            )}
          </div>
        </div>
      , document.body)}

    </div>
  );
}