import React, { useState, useMemo } from 'react';
import { Search, AlertCircle, Wrench, Clock, CheckCircle, User, Phone } from 'lucide-react';

export default function TicketView({ mode, tickets, currentUserRole, currentUserName, onTicketClick }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // 🌟 ฟันธง: Logic กรองงานฉลาดๆ (ถ้า mode เป็น tracking จะเน้นโชว์สถานะ ถ้า management จะเน้นโชว์ปุ่มซ่อม)
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      // 1. ด่านสิทธิ์การเข้าถึง
      if (currentUserRole !== 'Commander' && currentUserRole !== 'reporter') {
        const isMyJob = t.techName === currentUserName || t.sscTechName === currentUserName;
        const isUnassigned = !t.techName || t.techName === 'รอเจ้าหน้าที่รับงาน';
        if (!isMyJob && !isUnassigned) return false;
      }

      // 2. ด่านค้นหา
      const searchStr = String(searchTerm || '').toLowerCase();
      if (searchStr && !String(t.equipment).toLowerCase().includes(searchStr) && !String(t.id).toLowerCase().includes(searchStr)) return false;

      // 3. ด่านสถานะ
      if (filterStatus !== 'all' && t.status !== filterStatus) return false;

      return true;
    });
  }, [tickets, searchTerm, filterStatus, currentUserRole, currentUserName]);

  return (
    <div className="space-y-6">
      {/* 🌟 ฟันธง: ส่วน Filter (ใช้อันเดียวกันทั้ง 2 โหมด) */}
      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-700">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 text-slate-500" />
          <input 
            className="w-full bg-slate-800 text-white p-2.5 pl-10 rounded-lg outline-none"
            placeholder="ค้นหารหัสงาน หรือ อุปกรณ์..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {['all', 'pending', 'in_progress', 'completed'].map(status => (
            <button key={status} onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-bold whitespace-nowrap ${filterStatus === status ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-300'}`}>
              {status.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* 🌟 ฟันธง: ส่วนแสดงรายการตั๋ว */}
      <div className="space-y-4">
        {filteredTickets.map(t => (
          <div key={t.id} onClick={() => onTicketClick(t)} className="bg-white p-6 rounded-2xl border-l-[12px] border-orange-500 shadow-md cursor-pointer hover:shadow-lg transition-all">
            <div className="flex justify-between items-center mb-4">
              <span className="font-mono font-black text-emerald-700 bg-emerald-100 px-3 py-1 rounded-lg">{t.id}</span>
              <span className="text-sm font-bold text-slate-400">{new Date(t.date).toLocaleDateString('th-TH')}</span>
            </div>
            <h3 className="font-black text-xl text-slate-800">{t.equipment}</h3>
            <p className="text-orange-600 font-bold mt-2 flex items-center gap-2">
              <AlertCircle size={16} /> {t.description}
            </p>
            
            {/* ถ้าเป็นโหมด management ให้โชว์ปุ่ม Action เพิ่มเติม */}
            {mode === 'management' && (
              <div className="mt-4 pt-4 border-t flex gap-2">
                <button className="flex-1 bg-emerald-600 text-white font-bold py-2 rounded-lg">เริ่มงาน</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}