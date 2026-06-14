import React from 'react';
import { Camera, X, PlusCircle } from 'lucide-react';

export default function EvidenceUploader({ attachments, setAttachments, label = "แนบหลักฐาน" }) {
  return (
    <div className="w-full mt-2">
      <label className="text-[13px] font-black text-slate-300 mb-2 block flex items-center gap-2">
        <Camera size={16} /> {label}
      </label>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {attachments.map((file, idx) => (
          <div key={idx} className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 border-cyan-500 shadow-lg">
            {file.includes('video') ? <video src={file} className="w-full h-full object-cover" /> : <img src={file} className="w-full h-full object-cover" />}
            <button type="button" onClick={() => setAttachments(prev => prev.filter((_, i) => i !== idx))} className="absolute top-1 right-1 bg-rose-500 text-white rounded-full p-1"><X size={12} /></button>
          </div>
        ))}
        {attachments.length < 3 && (
          <label className="w-20 h-20 shrink-0 rounded-xl border-2 border-dashed border-cyan-500 flex flex-col items-center justify-center cursor-pointer hover:bg-cyan-900/40 text-cyan-400">
            <PlusCircle size={24} />
            <span className="text-[10px] font-bold mt-1 text-center">เพิ่มไฟล์</span>
            <input type="file" accept="image/*, video/*" capture="environment" className="hidden" onChange={async (e) => {
              const file = e.target.files[0];
              if(!file) return;
              if(file.size > 10 * 1024 * 1024) return alert('⚠️ ไฟล์ใหญ่เกิน 10MB');
              const reader = new FileReader();
              reader.readAsDataURL(file);
              reader.onload = (ev) => setAttachments(prev => [...prev, ev.target.result]);
            }} />
          </label>
        )}
      </div>
    </div>
  );
}