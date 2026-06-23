import React, { useState, useMemo } from 'react';
import { 
  Package, Search, Filter, Camera, Wrench, ShieldCheck, AlertTriangle, 
  MapPin, Hash, Calendar, DollarSign, Box, Cpu, Sofa, MonitorSmartphone,
  ChevronRight, X, CheckCircle2, Edit3, Save, Video, FileText, Monitor, ClipboardPaste, PlayCircle, Loader2
} from 'lucide-react';
import { createPortal } from 'react-dom';

export default function InventoryView({ sysTime, currentUserRole, currentUserName, setActiveTab }) {
  // 🌟 Database จำลอง
  const [assets, setAssets] = useState([
    { id: 'G1-F01-101-022-00-4602', name: 'โต๊ะ เก้าอี้ติดตั้งเครื่องคอมและอุปกรณ์', year: 2546, priceStr: '2,746.7 บาท', brand: 'Unknown', location: 'อาคาร 1 ชั้น 1/สปท./ฝพบ', category: 'Furniture', status: 'active' },
    { id: 'G1-F01-101-022-00-5101', name: 'โต๊ะทำงาน 165*80*75 สี G22/G18', year: 2551, priceStr: '5,911.75 บาท', brand: 'บริษัท เพอร์เฟ็คท์ ออฟฟิศ เฟอร์ นิเจอร์', location: 'อาคารระหว่างทางเดินอาคาร เฟส-1,2/ชั้น 2/ห้อง ฝวด.', category: 'Furniture', status: 'active' },
    { id: 'G1-F07-707-001-00-4811', name: 'เครื่องแปลงสัญญาณสือสารใยแก้ว', year: 2548, priceStr: '49,220 บาท', brand: 'Unknown', location: 'ศดพ.', category: 'IT', status: 'active' },
    { id: 'G1-F04-401-001-00-5003', name: 'Power meter ไออาร์ซี', year: 2550, priceStr: '423,720 บาท', brand: 'Unknown', location: 'ห้อง 210200', category: 'Engineering', status: 'active' },
    { id: 'G2-F07-12-002/55', name: 'เครื่องกำเนิดสัญญาณไฟฟ้า', year: 2555, priceStr: '0 บาท', brand: 'Hewlett packard', location: 'ห้อง ฝวด.ใหม่ เฟส1', category: 'Engineering', status: 'maintenance' },
    { id: 'G2-F07-12-003/55', name: 'MXA Signal Analyzer 10 Hz', year: 2555, priceStr: '0 บาท', brand: 'Agilent', location: 'อาคารระหว่างทางเดินอาคาร เฟส-1,2/ห้อง ฝวด.', category: 'Engineering', status: 'active' },
    { id: 'G1-F07-713-011-00-5406', name: 'VME, Single Board PBC', year: 2554, priceStr: '0 บาท', brand: 'Unknown', location: 'ห้อง Server', category: 'IT', status: 'active' },
    { id: 'G2-F21-01-005/69', name: 'โปรแกรม Adobe Acrobat Pro', year: 2569, priceStr: '16,500 บาท', brand: 'Adobe', location: 'อาคารระหว่างทางเดินอาคาร เฟส-1,2/ห้อง ฝวด.', category: 'Software', status: 'active' },
    { id: 'G2-N01-02-003/69', name: 'เก้าอี้สำนักงาน สีดำ', year: 2569, priceStr: '5,042.48 บาท', brand: 'บริษัท โอเอส เจนเนอเรชั่น', location: 'อาคารระหว่างทางเดินอาคาร เฟส-1,2/ห้อง ฝวด.', category: 'Furniture', status: 'active' },
    { id: 'G2-N21-01-001/69', name: 'โปรแกรม Canva Pro', year: 2569, priceStr: '3,000 บาท', brand: 'Canva', location: 'อาคารระหว่างทางเดินอาคาร เฟส-1,2/ห้อง ฝวด.', category: 'Software', status: 'active' },
    { id: 'G4-F01-02-317/58', name: 'เก้าอี้ประชุม', year: 2558, priceStr: '5,590 บาท', brand: 'ศรีไทยคลาสสิคโฮม', location: 'อาคารศูนย์ภูมิสารสนเทศสิริธร', category: 'Furniture', status: 'active' },
    { id: 'G2-F21-01-007/69', name: 'โปรแกรม Gemini Pro (AI)', year: 2569, priceStr: '12,000 บาท', brand: 'Google', location: 'อาคารระหว่างทางเดินอาคาร เฟส-1,2/ชั้น 2/ห้อง ฝวด.', category: 'Software', status: 'active' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});

  // 🌟 ฟันธง: เพิ่ม State สำหรับระบบอัปโหลดและเปิดรูป (Lightbox) 🌟
  const [evidenceFiles, setEvidenceFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [lightboxMedia, setLightboxMedia] = useState(null);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setIsUploading(true);
    
    setTimeout(() => {
      const newFiles = files.map(file => ({
        name: file.name,
        url: URL.createObjectURL(file), // สร้าง URL ชั่วคราวให้ดูรูปได้ทันที
        type: file.type || 'unknown',
        rawFile: file
      }));
      setEvidenceFiles(prev => [...prev, ...newFiles]);
      setIsUploading(false);
    }, 500); // ดีเลย์จำลองการโหลด
    
    const globalInput = document.getElementById('global-file-input');
    if (globalInput) globalInput.value = '';
  };

  const handleMediaClick = (file) => {
    if (file.type && (file.type.startsWith('image/') || file.type.startsWith('video/'))) {
      setLightboxMedia({ url: file.url, type: file.type }); // เปิดใน App
    } else {
      window.open(file.url, '_blank'); // ถ้าเป็นไฟล์อื่นให้โหลดลงเครื่อง
    }
  };

  const removeFile = (index) => {
    setEvidenceFiles(prev => prev.filter((_, i) => i !== index));
  };

  const renderThumbnails = (filesArray) => {
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
          <button type="button" onClick={(e) => { e.stopPropagation(); removeFile(idx); }} className="absolute top-1 right-1 bg-rose-500 hover:bg-rose-600 rounded-full text-white p-0.5 shadow-md z-10 active:scale-90">
            <X size={14} strokeWidth={3}/>
          </button>
        </div>
      );
    });
  };

  const processedData = useMemo(() => {
    return assets.map(item => {
      const cleanPrice = parseFloat(item.priceStr.replace(/,/g, '').replace(' บาท', '')) || 0;
      return { ...item, numericPrice: cleanPrice };
    });
  }, [assets]);

  const filteredAssets = useMemo(() => {
    return processedData.filter(item => {
      const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [processedData, searchTerm, selectedCategory]);

  const totalValue = processedData.reduce((sum, item) => sum + item.numericPrice, 0);
  const maintenanceCount = processedData.filter(i => i.status === 'maintenance').length;

  const getCategoryIcon = (cat) => {
    switch(cat) {
      case 'IT': return <MonitorSmartphone size={16} className="text-cyan-400" />;
      case 'Software': return <Cpu size={16} className="text-purple-400" />;
      case 'Furniture': return <Sofa size={16} className="text-orange-400" />;
      case 'Engineering': return <Wrench size={16} className="text-emerald-400" />;
      default: return <Box size={16} className="text-slate-400" />;
    }
  };

  const handleEditClick = () => {
    setEditFormData({ ...selectedAsset });
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    setAssets(prev => prev.map(a => a.id === editFormData.id ? { ...editFormData } : a));
    setSelectedAsset(editFormData);
    setIsEditing(false);
    alert("✅ บันทึกการแก้ไขข้อมูลสำเร็จ! (บันทึกลง Local State ชั่วคราว)");
  };

  // 🌟 ฟันธง: ฟังก์ชันดึงภาพจากการแคปหน้าจอ (ทำงานจริงผ่าน handleFileUpload) 🌟
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
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500 pb-20 relative z-10 pt-4 md:pt-6">
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-slate-900/80 backdrop-blur-xl border-[2px] border-indigo-500/50 rounded-3xl p-6 shadow-[0_0_30px_rgba(99,102,241,0.2)] relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 text-indigo-500/10 group-hover:text-indigo-500/20 transition-colors"><Package size={120} /></div>
          <h3 className="text-slate-400 font-bold text-[14px] tracking-widest uppercase mb-1">Total Assets</h3>
          <div className="text-[36px] font-black text-white flex items-end gap-2 drop-shadow-md">
            {processedData.length} <span className="text-[16px] text-indigo-400 mb-2">รายการ</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">*(ระบบจำลอง: แสดงข้อมูลเบื้องต้น)</div>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-xl border-[2px] border-emerald-500/50 rounded-3xl p-6 shadow-[0_0_30px_rgba(16,185,129,0.2)] relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 text-emerald-500/10 group-hover:text-emerald-500/20 transition-colors"><DollarSign size={120} /></div>
          <h3 className="text-slate-400 font-bold text-[14px] tracking-widest uppercase mb-1">Total Value</h3>
          <div className="text-[32px] font-black text-emerald-400 flex items-end gap-2 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)] truncate">
            {totalValue.toLocaleString()} <span className="text-[16px] text-slate-300 mb-1.5">THB</span>
          </div>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-xl border-[2px] border-rose-500/50 rounded-3xl p-6 shadow-[0_0_30px_rgba(225,29,72,0.2)] relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 text-rose-500/10 group-hover:text-rose-500/20 transition-colors"><Wrench size={120} /></div>
          <h3 className="text-slate-400 font-bold text-[14px] tracking-widest uppercase mb-1">Maintenance</h3>
          <div className="text-[36px] font-black text-rose-400 flex items-end gap-2 drop-shadow-[0_0_10px_rgba(225,29,72,0.5)]">
            {maintenanceCount} <span className="text-[16px] text-slate-300 mb-2">ส่งซ่อม</span>
          </div>
        </div>
      </div>

      <div className="bg-[#0f172a]/90 backdrop-blur-xl border-[2px] border-slate-700 rounded-2xl p-4 flex flex-col xl:flex-row gap-4 items-center shadow-lg w-full">
        <div className="relative w-full xl:w-[30%] shrink-0">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400" size={20} />
          <input 
            type="text" 
            placeholder="ค้นหา เลขครุภัณฑ์, ชื่อ, หรือสถานที่..." 
            className="w-full bg-slate-900 border-[2px] border-slate-600 rounded-xl py-3 pl-12 pr-4 text-white font-bold text-[14px] focus:border-indigo-500 focus:shadow-[0_0_20px_rgba(99,102,241,0.3)] outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* 🌟 ฟันธง: ใส่ grid/flex ให้ปุ่มขยายเต็มหน้าจอ และไม่ลอยแหว่งขวา 🌟 */}
        <div className="flex w-full xl:flex-1 overflow-x-auto gap-2 pb-2 xl:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {['All', 'IT', 'Software', 'Furniture', 'Engineering'].map(cat => (
            <button 
              key={cat} onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 flex-1 px-4 py-2.5 rounded-xl font-bold text-[13px] md:text-[14px] border-[2px] transition-all active:scale-95 flex items-center justify-center gap-2 ${selectedCategory === cat ? 'bg-indigo-600 text-white border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-indigo-500'}`}
            >
              {getCategoryIcon(cat)} <span className="whitespace-nowrap">{cat === 'All' ? 'ทั้งหมด' : cat}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredAssets.map(asset => (
          <div key={asset.id} onClick={() => {setSelectedAsset(asset); setIsEditing(false); setShowAuditModal(false);}} className="bg-slate-900/80 backdrop-blur-md border-[2px] border-slate-700 hover:border-indigo-500 rounded-[1.5rem] p-5 cursor-pointer group transition-all shadow-lg hover:shadow-[0_0_25px_rgba(99,102,241,0.3)] hover:-translate-y-1">
            <div className="flex justify-between items-start mb-3">
              <span className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/50 px-2.5 py-1 rounded-lg font-mono font-black text-[12px] shadow-sm flex items-center gap-1.5"><Hash size={12}/> {asset.id}</span>
              <span className={`px-2.5 py-1 rounded-lg font-black text-[10px] uppercase tracking-wider border ${asset.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' : 'bg-rose-500/20 text-rose-400 border-rose-500/50 animate-pulse'}`}>
                {asset.status === 'active' ? '🟢 ปกติ' : '🔴 ส่งซ่อม'}
              </span>
            </div>
            <h4 className="text-white font-black text-[16px] md:text-[18px] leading-tight mb-2 line-clamp-2 group-hover:text-indigo-300 transition-colors">{asset.name}</h4>
            
            <div className="space-y-2 mt-4 pt-4 border-t border-slate-700/50">
              <div className="flex items-center gap-2 text-slate-400 text-[12px] font-bold"><MapPin size={14} className="text-orange-400 shrink-0"/> <span className="truncate">{asset.location}</span></div>
              <div className="flex items-center justify-between text-[12px] font-bold">
                <div className="flex items-center gap-2 text-slate-400"><Calendar size={14} className="text-cyan-400"/> ปี {asset.year}</div>
                <div className="text-emerald-400 font-mono tracking-wide">{asset.numericPrice > 0 ? `${asset.numericPrice.toLocaleString()} ฿` : 'N/A'}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedAsset && (
        <div className="fixed inset-0 z-[999999] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in zoom-in-95">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none"></div>
          
          <div className="bg-[#0f172a] border-[3px] border-indigo-500 rounded-[2rem] w-full max-w-lg shadow-[0_0_50px_rgba(99,102,241,0.4)] relative flex flex-col overflow-hidden max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden">
            <div className="absolute top-5 right-5 flex gap-2 z-20">
              {!isEditing && (
                <button onClick={handleEditClick} className="text-slate-400 hover:text-indigo-400 bg-slate-800 p-2 rounded-full border border-slate-600 shadow-md transition-colors" title="แก้ไขข้อมูล"><Edit3 size={18}/></button>
              )}
              <button onClick={() => { setSelectedAsset(null); setIsEditing(false); }} className="text-slate-400 hover:text-rose-400 bg-slate-800 p-2 rounded-full border border-slate-600 shadow-md transition-colors" title="ปิดหน้าต่าง"><X size={18}/></button>
            </div>
            
            <div className="bg-slate-900 p-6 border-b border-slate-800 relative pt-12">
              <div className="flex items-center gap-2 mb-3">
                {getCategoryIcon(selectedAsset.category)}
                <span className="text-indigo-400 font-black tracking-widest uppercase text-[12px]">{selectedAsset.category}</span>
              </div>

              {!isEditing ? (
                <>
                  <h2 className="text-[20px] md:text-[22px] font-black text-white leading-tight mb-2 pr-8">{selectedAsset.name}</h2>
                  <div className="font-mono text-[14px] text-slate-400">SN: {selectedAsset.id}</div>
                </>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="text-indigo-400 text-[11px] font-bold">ชื่อครุภัณฑ์</label>
                    <textarea rows="2" className="w-full bg-[#020617] border border-indigo-500/50 rounded-lg p-2 text-white font-bold text-[16px] outline-none mt-1 resize-none" value={editFormData.name} onChange={e => setEditFormData({...editFormData, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-indigo-400 text-[11px] font-bold">เลขครุภัณฑ์ (SN)</label>
                    <input type="text" className="w-full bg-[#020617] border border-indigo-500/50 rounded-lg p-2 text-slate-400 font-mono text-[14px] outline-none mt-1" value={editFormData.id} onChange={e => setEditFormData({...editFormData, id: e.target.value})} />
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 space-y-4 bg-slate-900/50">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                  <div className="text-slate-500 text-[11px] font-bold mb-1">แบรนด์/ยี่ห้อ</div>
                  {!isEditing ? <div className="text-white font-bold truncate">{selectedAsset.brand}</div> : <input type="text" className="w-full bg-[#020617] border border-indigo-500/50 rounded-lg px-2 py-1 text-white font-bold text-[14px] outline-none" value={editFormData.brand} onChange={e => setEditFormData({...editFormData, brand: e.target.value})} />}
                </div>
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                  <div className="text-slate-500 text-[11px] font-bold mb-1">มูลค่า/ราคา (บาท)</div>
                  {!isEditing ? <div className="text-emerald-400 font-mono font-black truncate">{selectedAsset.priceStr}</div> : <input type="text" className="w-full bg-[#020617] border border-indigo-500/50 rounded-lg px-2 py-1 text-emerald-400 font-mono font-bold text-[14px] outline-none" value={editFormData.priceStr} onChange={e => setEditFormData({...editFormData, priceStr: e.target.value})} />}
                </div>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex items-start gap-3">
                <MapPin className="text-orange-400 mt-0.5 shrink-0" size={18}/>
                <div className="w-full">
                  <div className="text-slate-500 text-[11px] font-bold mb-1">สถานที่ตั้งปัจจุบัน</div>
                  {!isEditing ? <div className="text-white font-bold text-[14px]">{selectedAsset.location}</div> : <textarea rows="2" className="w-full bg-[#020617] border border-indigo-500/50 rounded-lg p-2 text-white font-bold text-[14px] outline-none resize-none" value={editFormData.location} onChange={e => setEditFormData({...editFormData, location: e.target.value})} />}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-800 flex flex-col gap-3 bg-slate-900">
              
              {/* 🌟 ฟันธง: โชว์รูปภาพที่เลือกมาแล้ว 🌟 */}
              {evidenceFiles.length > 0 && (
                <div className="mb-2">
                  <div className="flex flex-wrap gap-3 p-3 bg-slate-950/50 rounded-2xl border border-slate-700/50 shadow-inner">
                    {renderThumbnails(evidenceFiles)}
                  </div>
                </div>
              )}

              {isUploading && (
                <div className="w-full bg-emerald-900/10 border-[2px] border-dashed border-emerald-500/50 rounded-xl p-6 flex flex-col items-center justify-center text-emerald-400">
                  <Loader2 className="w-8 h-8 animate-spin mb-2" />
                  <span className="font-bold text-[14px]">กำลังเตรียมไฟล์...</span>
                </div>
              )}

              {!isUploading && !isEditing && evidenceFiles.length === 0 && !showAuditModal && (
                <button onClick={() => setShowMediaPicker(true)} className="w-full bg-emerald-900/10 border-[2px] border-dashed border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)] rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all active:scale-95">
                  <div className="flex gap-3 text-emerald-400/80 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)] mb-1">
                    <Camera size={26} /> <Video size={26} /> <FileText size={26} />
                  </div>
                  <span className="text-emerald-300/80 font-bold text-[14px]">คลิกเพื่อถ่ายภาพ / แนบไฟล์อ้างอิง</span>
                </button>
              )}

              {showAuditModal && evidenceFiles.length === 0 && (
                <div className="bg-emerald-900/20 border border-emerald-500/50 rounded-xl p-4 flex flex-col items-center justify-center text-center animate-in zoom-in">
                  <CheckCircle2 size={40} className="text-emerald-400 mb-2 drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]"/>
                  <span className="text-emerald-300 font-bold">บันทึกข้อมูลและภาพถ่ายสำเร็จ!</span>
                  <span className="text-slate-400 text-[11px] mt-1">อัปเดตข้อมูลเข้าระบบเรียบร้อยแล้ว</span>
                </div>
              )}

              {/* 🌟 ฟันธง: โชว์ปุ่ม ยืนยัน/ยกเลิก เมื่อมีการแก้ไข หรือ มีการแนบรูป 🌟 */}
              {(isEditing || evidenceFiles.length > 0) && (
                <div className="flex w-full gap-3 mt-2">
                  <button onClick={() => { setIsEditing(false); setEvidenceFiles([]); setShowAuditModal(false); }} className="flex-[1] py-3.5 rounded-xl font-black text-slate-300 bg-slate-800 border border-slate-600 hover:bg-slate-700 transition-all active:scale-95 text-[15px]">
                    ยกเลิก
                  </button>
                  <button onClick={() => { handleSaveEdit(); setEvidenceFiles([]); setShowAuditModal(true); setTimeout(() => setShowAuditModal(false), 2500); }} className="flex-[1.5] py-3.5 rounded-xl font-black text-white bg-emerald-600 hover:bg-emerald-500 border border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all active:scale-95 text-[15px] flex items-center justify-center gap-2">
                    <Save size={18} /> ยืนยันข้อมูล
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* 🌟 Modal: เลือกรูปแบบ Media 🌟 */}
      {showMediaPicker && createPortal(
        <div className="fixed inset-0 z-[10000000] w-screen h-[100dvh] bg-[#020617]/95 backdrop-blur-3xl flex items-center justify-center p-4 animate-in fade-in zoom-in">
          <div className="bg-[#0f172a] border-[2px] border-orange-500 rounded-[2.5rem] p-6 md:p-8 w-full max-w-sm shadow-[0_0_60px_rgba(249,115,22,0.6),inset_0_0_30px_rgba(249,115,22,0.2)] relative flex flex-col items-center">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-32 bg-orange-500/30 blur-[60px] pointer-events-none rounded-full"></div>
             
             <div className="flex items-center gap-3 text-orange-400 mb-8 relative z-10 drop-shadow-[0_0_10px_rgba(249,115,22,0.8)]">
                <Monitor className="w-8 h-8" />
                <h3 className="text-[20px] md:text-[22px] font-black tracking-wide">เลือกรูปภาพ/วิดีโอ</h3>
             </div>

             <div className="w-full space-y-4 relative z-10">

{/* 📱 โหมด Mobile (md:hidden) */}
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

                {/* 💻📱 โหมด PC & Mobile: ปุ่มเลือกจากคลังไฟล์ */}
                <button type="button" onClick={() => { document.getElementById('global-file-input').click(); setShowMediaPicker(false); }} className="w-full bg-gradient-to-b from-emerald-500 to-teal-600 hover:brightness-110 text-white rounded-2xl p-4 flex items-center justify-center gap-3 border-[2px] border-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.5)] active:scale-95 transition-all font-black text-[15px]">
                  <Monitor className="w-6 h-6" /> เลือกคลังภาพ/วิดีโอ/ไฟล์
                </button>

                {/* 💻 โหมด PC (hidden md:flex) แคปหน้าจอ */}
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
{/* 🌟 ฟันธง: ตัว Input ซ่อน เพื่อเปิดหน้าต่างเลือกไฟล์ 🌟 */}
<input type="file" id="global-file-input" multiple className="hidden" onChange={handleFileUpload} />

{/* 🌟 ฟันธง: Lightbox Modal สำหรับเปิดดูรูปเต็มจอใน App 🌟 */}
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