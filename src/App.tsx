import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Home,
  PlusCircle,
  CheckCircle,
  AlertCircle,
  Wrench,
  MapPin,
  User,
  Camera,
  X,
  Monitor,
  Activity,
  Phone,
  CheckSquare,
  ThumbsUp,
  Search,
  PieChart,
  LayoutDashboard,
  ClipboardCheck,
  Mail,
  AlertTriangle,
  FileText,
  PauseCircle,
  Send,
  Loader2,
  ChevronRight,
  Zap,
  ChevronDown,
  XCircle,
  RotateCcw,
  Hash,
  DoorOpen,
  Building,
  Clock,
  TrendingUp,
  Calendar,
  PhoneCall,
  Flame,
  Settings,
} from 'lucide-react';

// ==========================================
// 🔥 1. เชื่อมต่อ Firebase
// ==========================================
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  query,   // <--- เพิ่มตัวนี้
  orderBy, // <--- เพิ่มตัวนี้
  limit    // <--- เพิ่มตัวนี้
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAwhkNwz3GB83Sr1hlCrm6t4N7CTbrBTlw',
  authDomain: 'gistda-gse-maintenance-3f83a.firebaseapp.com',
  projectId: 'gistda-gse-maintenance-3f83a',
  storageBucket: 'gistda-gse-maintenance-3f83a.firebasestorage.app',
  messagingSenderId: '234467850316',
  appId: '1:234467850316:web:9509ab93ccb150477e9ce9',
  measurementId: 'G-8RN127D4KD',
};

const appInstance =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(appInstance);
const db = getFirestore(appInstance);

// ==========================================
// 🌟 2. ข้อมูลระบบ (System Data)
// ==========================================
const employeeList = [
  { name: 'นายนวัตกรณ์ ไก่แก้ว', position: 'หัวหน้าฝ่าย', department: 'ฝวด.' },
  {
    name: 'นายชุติพงษ์ ลาวงศ์เกิด',
    position: 'นักเทคโนโลยีอวกาศ',
    department: 'ฝวด.',
  },
  {
    name: 'นายธนกาญจน์ ไตรปิฎก',
    position: 'นักเทคโนโลยีอวกาศ',
    department: 'ฝวด.',
  },
  { name: 'นายนรัตว์ ศรีสวัสดิ์พงษ์', position: 'วิศวกร', department: 'ฝวด.' },
  { name: 'น.ส.จินวะรา สุรัตนกุล', position: 'วิศวกร', department: 'ฝวด.' },
  { name: 'นายประมินทร์ พิชิตการค้า', position: 'วิศวกร', department: 'ฝวด.' },
  {
    name: 'นายทศพล ชินนิวัฒน์',
    position: 'วิศวกรชำนาญการ',
    department: 'ฝวด.',
  },
  {
    name: 'นายวิชญ์ภาส ดรบัณฑิต',
    position: 'นักเทคโนโลยีอวกาศ',
    department: 'ฝปด.',
  },
  { name: 'นายบุญชุบ บุ้งทอง', position: 'ผู้อำนวยการ', department: 'สปท.' },
  {
    name: 'ว่าที่ ร.ต. วรธันย์ วิชาคุณ',
    position: 'หัวหน้าฝ่าย',
    department: 'ฝปด.',
  },
  { name: 'นายเสกสรร จัตุรัส', position: 'หัวหน้าฝ่าย', department: 'ฝปค.' },
  {
    name: 'นายอัฐราวุฒิ เดชผล',
    position: 'วิศวกรชำนาญการ',
    department: 'ฝปค.',
  },
  {
    name: 'น.ส.จารุณี ขุนจันทร์',
    position: 'วิศวกรชำนาญการ',
    department: 'ฝปค.',
  },
  { name: 'น.ส.พันทิพย์ภา บุญสมพงษ์', position: 'วิศวกร', department: 'ฝปค.' },
  {
    name: 'นายอาทิตย์ ศิริขันธ์',
    position: 'นักเทคโนโลยีอวกาศ',
    department: 'ฝปค.',
  },
  { name: 'น.ส.บุษยมาศ เพชรทอง', position: 'หัวหน้าฝ่าย', department: 'ฝบท.' },
  { name: 'นายจิโรจ ทองตา', position: 'วิศวกร', department: 'ฝบท.' },
  { name: 'นายศรัณย์ นันทะชมภู', position: 'วิศวกร', department: 'ฝบท.' },
  { name: 'นายปิยภัทร เขียวเจริญ', position: 'วิศวกร', department: 'ฝบท.' },
  {
    name: 'นายประสิทธิ์ มากสิน',
    position: 'นักเทคโนโลยีอวกาศชำนาญการ',
    department: 'ฝปด.',
  },
  {
    name: 'น.ส.เข็มทราย ปีกสันเทียะ',
    position: 'นักเทคโนโลยีอวกาศ',
    department: 'ฝปด.',
  },
  {
    name: 'น.ส.กนกวรรณ กัณหะกิติ',
    position: 'นักเทคโนโลยีอวกาศ',
    department: 'ฝปด.',
  },
  {
    name: 'น.ส.ศิรินทรา อินทร์ถนอม',
    position: 'นักเทคโนโลยีอวกาศ',
    department: 'ฝปด.',
  },
  {
    name: 'นายประโยชน์ ปวงจักร์ทา',
    position: 'นักเทคโนโลยีอวกาศชำนาญการ',
    department: 'ฝปด.',
  },
  {
    name: 'น.ส.ภาวรินทร์ คูหา',
    position: 'นักเทคโนโลยีอวกาศ',
    department: 'ฝปด.',
  },
  { name: 'นายประกาศิต อุดมธนะธีระ', position: 'วิศวกร', department: 'สปท.' },
  { name: 'นายโกวิทย์ พุ่มกิ่ง', position: 'วิศวกร', department: 'สปท.' },
  {
    name: 'น.ส.รพิรัตน์ ฤทธิ์รณศักดิ์',
    position: 'วิศวกร',
    department: 'ฝปค.',
  },
  {
    name: 'น.ส.อโณทัย นิ่มน้อย',
    position: 'นักพัฒนานวัตกรรม',
    department: 'สปท.',
  },
  {
    name: 'น.ส.ฐิตาภรณ์ ทองคำภา',
    position: 'เจ้าหน้าที่พัฒนาธุรกิจ',
    department: 'ฝวด.',
  },
  { name: 'นายประวุฒิ ดิษาภิรมย์', position: 'วิศวกร', department: 'ฝปด.' },
];

// 🌟 ฟันธงจัดกลุ่มใหม่ ตาม KPI 3 ภารกิจหลักของ ฝวด.
const equipmentCategories = {
  'ภารกิจด้านจานสายอากาศ': [
    'Antenna-KRATOS',
    'Antenna-VIASAT',
    'Antenna-Comtech',
    'Antenna-Orbital',
    'Antenna-7.3m.',
    'Satellites Receiving System'
  ],
  'ภารกิจด้านคอมพิวเตอร์แม่ข่ายและไอที': [
    'THEOS-DPF',
    'THEOS-STORNEXT',
    'THEOS-CGS',
    'THEOS-FDS',
    'THEOS-MPC',
    'THEOS2-IGS',
    'THEOS2-MGS',
    'THEOS2-CGS',
    'THEOS2-FDS',
    'THEOS2-GIPS',
    'RS2-AMS/PGS/CUDOS',
    'RS2-DAS/NSART/FTD',
    'JPSS/MODIS',
    'Cosmo-SkyMED'
  ],
  'ภารกิจด้านโครงสร้างพื้นฐานไฟฟ้า': [
    'UPS-120kVA-VIASAT',
    'UPS-120kVA-Building-1',
    'UPS-120kVA-Building-2',
    'UPS-250kVA-KRATOS',
    'Precision-AIR/HVAC-1',
    'Precision-AIR/HVAC-2',
    'Generator-650kVA',
    'Generator-350kVA',
    'FM-200-Building-1',
    'FM-200-Building-2',
    'Grounding-Lightning'
  ]
};

const buildingList = [
  'อาคารสถานีดาวเทียม',
  'อาคาร Centrarium',
  'อาคาร AIT',
  'ฐานจาน VIASAT',
  'ฐานจาน KRATOS',
  'ฐานจาน Orbital',
  'ฐานจาน CGC',
  'อาคาร SI',
  'อาคาร สภ.',
];

const technicianList = [
  { name: 'นายนวัตกรณ์ ไก่แก้ว', phone: '08-3529-3836' },
  { name: 'นายทศพล ชินนิวัฒน์', phone: '08-1513-7854' },
  { name: 'นายนรัตว์ ศรีสวัสดิ์พงษ์', phone: '08-6361-4399' },
  { name: 'นายประมินทร์ พิชิตการค้า', phone: '08-1135-1599' },
  { name: 'นายธนกาญจน์ ไตรปิฎก', phone: '06-2463-5544' },
  { name: 'นายชุติพงษ์ ลาวงศ์เกิด', phone: '09-8938-9839' },
  { name: 'นายวิชญ์ภาส ดรบัณฑิต', phone: '-' },
  { name: 'น.ส.จินวะรา สุรัตนกุล', phone: '08-2480-2280' },
];

// ==========================================
// 🌟 3. Utility Functions
// ==========================================
const ThaiDateFormatter = (date) => {
  const months = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.',
  ];
  const d = new Date(date);
  return (
    // 🌟 อัปเกรด: ลด gap-4 เหลือ gap-3 และเพิ่ม px-2 เพื่อบีบให้มันขยับเข้าหากันตรงกลาง
    <div className="flex items-center justify-center gap-3 sm:gap-5 text-[15px] sm:text-[17px] whitespace-nowrap font-sans py-1 px-2">
      {/* 📅 ส่วนวันที่ (สีเขียวมรกต) */}
      <div className="flex items-center gap-2 text-emerald-300 shrink-0">
        <Calendar size={22} className="text-emerald-400" />
        <span className="font-black tracking-widest drop-shadow-sm">
          {d.getDate()} {months[d.getMonth()]} {d.getFullYear() + 543}
        </span>
      </div>

      {/* ⏐ เส้นแบ่งคั่นกลาง */}
      <div className="w-[2px] h-6 bg-slate-500/50 rounded-full shrink-0"></div>

      {/* ⏰ ส่วนเวลา (สีส้ม) */}
      <div className="flex items-center gap-2 text-orange-300 shrink-0">
        <Clock size={22} className="text-orange-500 animate-pulse" />
        <span className="font-mono font-black tracking-[0.1em] drop-shadow-[0_0_5px_rgba(249,115,22,0.6)]">
          {d.toLocaleTimeString('th-TH', { hour12: false })} น.
        </span>
      </div>
    </div>
  );
};

const formatDateTimeString = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const months = [
    'ม.ค.',
    'ก.พ.',
    'มี.ค.',
    'เม.ย.',
    'พ.ค.',
    'มิ.ย.',
    'ก.ค.',
    'ส.ค.',
    'ก.ย.',
    'ต.ค.',
    'พ.ย.',
    'ธ.ค.',
  ];
  return `${d.getDate()} ${months[d.getMonth()]} ${
    d.getFullYear() + 543
  } | ${d.toLocaleTimeString('th-TH', { hour12: false })} น.`;
};

const getNextReqId = (tickets) => {
  if (!tickets || tickets.length === 0) return 'GSE-0001';
  const maxNum = tickets.reduce((max, t) => {
    const num = parseInt(String(t.id).replace(/[^0-9]/g, '') || '0');
    return !isNaN(num) && num > max ? num : max;
  }, 0);
  return `GSE-${String(maxNum + 1).padStart(4, '0')}`;
};

const formatDisplayPhone = (phone) => {
  if (!phone || phone === '-' || phone === 'N/A') return phone;
  const cleaned = String(phone).replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `${cleaned.substring(0, 2)}-${cleaned.substring(
      2,
      6
    )}-${cleaned.substring(6)}`;
  }
  return phone;
};

// เพิ่มฟังก์ชันคำนวณส่วนต่างเวลาเป็นนาที สำหรับงานวิกฤต
const getMinutesDiff = (start, end) => {
  if (!start || !end) return 0;
  const diffMs = new Date(end).getTime() - new Date(start).getTime();
  return Math.max(0, Math.floor(diffMs / 60000));
};
const formatMinutesToText = (totalMins) => {
  if (totalMins < 60) return `${totalMins} นาที`;
  const d = Math.floor(totalMins / 1440);
  const h = Math.floor((totalMins % 1440) / 60);
  const m = totalMins % 60;
  if (d > 0) return `${d} วัน ${h} ชั่วโมง ${m} นาที`;
  return `${h} ชั่วโมง ${m} นาที`;
};
// ==========================================
// 🌟 4. UI Components
// ==========================================
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-10 bg-white text-emerald-700 min-h-screen flex flex-col justify-center items-center font-sans text-center border-t-[10px] border-rose-500 shadow-inner">
          <AlertCircle size={80} className="mb-6 animate-pulse text-rose-500" />
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">
            ระบบพบข้อผิดพลาด
          </h2>
          <p className="mt-2 text-slate-400 text-sm max-w-xs">
            {this.state.error?.message || 'กรุณารีเฟรชเพื่อลองใหม่อีกครั้ง'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-8 px-10 py-4 bg-orange-500 text-white font-black rounded-2xl shadow-xl active:scale-95 transition-all"
          >
            REBOOT SYSTEM
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function SearchableDropdown({
  options,
  value,
  onChange,
  placeholder,
  label,
  icon,
  error,
  id,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target))
        setIsOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    return options.filter((opt) =>
      String(opt).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  return (
    <div className="space-y-1.5 relative text-left" id={id} ref={containerRef}>
      <label className="text-xs font-bold text-slate-200 tracking-wide flex items-center gap-1.5 ml-1">
        {icon} {label}
      </label>
      <div
        className={`w-full bg-white border-2 border-solid ${
          error
            ? 'border-rose-500 ring-1 ring-rose-500/50'
            : 'border-orange-500 hover:border-orange-600 focus-within:border-orange-600 focus-within:ring-2 focus-within:ring-orange-500/30'
        } rounded-2xl px-5 py-4 flex items-center justify-between cursor-pointer shadow-sm transition-all`}
        onClick={() => {
          setIsOpen(!isOpen);
          setSearchTerm('');
        }}
      >
        <div className="flex-1 min-w-0">
          {isOpen ? (
            <input
              autoFocus
              className="w-full bg-transparent outline-none text-sm font-bold text-slate-800"
              placeholder="พิมพ์ค้นหา..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span
              className={`text-sm font-bold truncate ${
                value ? 'text-slate-800' : 'text-slate-400'
              }`}
            >
              {value || placeholder}
            </span>
          )}
        </div>
        <ChevronDown
          size={18}
          className={`text-slate-400 transition-transform ${
            isOpen ? 'rotate-180 text-orange-500' : ''
          }`}
        />
      </div>
      {isOpen && (
        <div className="absolute z-[100] top-[100%] left-0 w-full bg-white border border-2 border-orange-400/70 mt-2 rounded-2xl shadow-2xl max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt, i) => (
              <div
                key={i}
                className="px-5 py-3.5 hover:bg-orange-50 hover:text-orange-600 text-sm font-bold text-slate-700 cursor-pointer border-b border-slate-50 last:border-0 transition-colors"
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
              >
                {opt}
              </div>
            ))
          ) : (
            <div className="px-5 py-4 text-xs text-slate-400 font-bold italic text-center uppercase tracking-widest">
              ไม่พบข้อมูล
            </div>
          )}
        </div>
      )}
      {error && (
        <div className="text-rose-500 text-[11px] font-bold mt-1.5 ml-1 animate-in fade-in">
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}
// 🌟 ฟันธง: ฟังก์ชันคำนวณความต่างของเวลา ออกมาเป็น วัน/ชม./นาที
const calculateDuration = (start, end, holdMs = 0) => {
  if (!start || !end) return "รอดำเนินการ...";
  
  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();
  
  // ลบเวลารออะไหล่ (Hold Time) ออกจากเวลาทั้งหมด
  let durationMs = endTime - startTime - (holdMs || 0);
  if (durationMs < 0) durationMs = 0;

  const days = Math.floor(durationMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((durationMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

  let result = [];
  if (days > 0) result.push(`${days} วัน`);
  if (hours > 0) result.push(`${hours} ชม.`);
  if (minutes > 0) result.push(`${minutes} นาที`);
  
  return result.length > 0 ? result.join(' ') : "น้อยกว่า 1 นาที";
};

// ==========================================
// 🌟 5. Main App Logic
// ==========================================
function MainApp({ onGoHome, initialRole }) {
  // 🌟 ฟันธง: ลบระบบจำหน้าเก่าทิ้ง! ให้ตั้งต้นใหม่ตาม Role ที่เลือกเสมอ
  const [activeTab, setActiveTab] = useState(
    initialRole === 'technician' ? 'dashboard' : 'report'
  );
  // (ลบ useEffect ที่เซฟลง localStorage ออกไปแล้ว)

  // 🌟🌟🌟 จุดที่ 1: เติมบรรทัดนี้ลงไป! (สำคัญมาก ถ้าไม่มีระบบจะพัง) 🌟🌟🌟
  // ของเดิมอาจจะเป็น: const [dashTimeframe, setDashTimeframe] = useState('month');
  // ✅ แก้เป็นแบบนี้ครับ:
  const [dashTimeframe, setDashTimeframe] = useState('today');
  const [customMonth, setCustomMonth] = useState(''); // 🌟 เติมบรรทัดนี้เพื่อเก็บค่าปฏิทิน

  const [hoveredTab, setHoveredTab] = useState(null);
  // ... โค้ดเดิมของท่าน ...
  const [sysTime, setSysTime] = useState(new Date());
  // ... โค้ดเดิมของท่าน ...
  // 🌟 ฟันธง: ล็อกโหมดตามที่กดมาจากหน้า Landing Page
  const [currentUserRole, setCurrentUserRole] = useState(
    initialRole || 'reporter'
  );

  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [authErrorMsg, setAuthErrorMsg] = useState('');

  // --- Auth Setup ---
  useEffect(() => {
    const initAuth = async () => {
      try {
        await signInAnonymously(auth);
      } catch (error) {
        console.warn('Auth error, using bypass user...', error);
        setUser({ uid: 'public-bypass-user' });
      }
    };
    initAuth();

    const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
      if (u) setUser(u);
      else setUser({ uid: 'public-bypass-user' });
    });

    return () => unsubscribeAuth();
  }, []);

  // --- Data Fetching ---
  useEffect(() => {
    if (!user) return;
    
    // 🌟 ฟันธง: สร้างคำสั่ง Query เพื่อเรียงตามวันที่ล่าสุด (desc) และจำกัดแค่ 500 รายการ
    const ticketsRef = query(
      collection(db, 'tickets'),
      orderBy('date', 'desc'),
      limit(500) // 🌟 เปลี่ยนเป็น 500 เพื่อเก็บประวัติให้ดูย้อนหลังผ่านปฏิทินได้สบายๆ
    );

    const unsubscribeData = onSnapshot(
      ticketsRef,
// ...
      (snapshot) => {
        try {
          const ticketsData = [];
          snapshot.forEach((doc) => {
            ticketsData.push({ dbId: doc.id, ...doc.data() });
          });
          ticketsData.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          setTickets(ticketsData);
          setIsDataLoading(false);
          setAuthErrorMsg('');
        } catch (e) {
          console.error('Data Parse Error:', e);
          setIsDataLoading(false);
        }
      },
      (error) => {
        console.error('Firebase Read Error:', error);
        setAuthErrorMsg('⚠️ โปรดตรวจสอบการตั้งค่า Firebase Rules');
        setIsDataLoading(false);
      }
    );
    return () => unsubscribeData();
  }, [user]);

  // ตัวนับเวลาหลัก
  useEffect(() => {
    const timer = setInterval(() => setSysTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // --- Form States ---
  const [formData, setFormData] = useState({
    reporter: '',
    reporterContact: '',
    position: '',
    department: '',
    bureau: 'สำนักปฏิบัติการดาวเทียม',
    equipment: '',
    description: '',
    assetNumber: '',
    building: '',
    room: '',
    images: [],
    isSsc: false,
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [emailNotify, setEmailNotify] = useState(null);

  const [actionModal, setActionModal] = useState({
    isOpen: false,
    ticketId: null,
    type: null,
  });
  const [actionText, setActionText] = useState('');
  const [selectedTech, setSelectedTech] = useState('');
  const [lightboxImg, setLightboxImg] = useState(null);
  const [confirmSubmitModal, setConfirmSubmitModal] = useState(false);

  // --- KPI Timer Logic ---
  const getLiveStopwatch = (
    start,
    end,
    currentSysTime,
    totalPauseMs = 0,
    isCurrentlyOnHold = false,
    lastHoldAt = null
  ) => {
    if (!start) return '00:00:00';
    const startTime = new Date(start).getTime();
    let endTime = end ? new Date(end).getTime() : currentSysTime.getTime();

    if (isCurrentlyOnHold && lastHoldAt && !end) {
      endTime = new Date(lastHoldAt).getTime();
    }

    let diffMs = endTime - startTime - totalPauseMs;
    if (diffMs <= 0) return '00:00:00';

    // 🌟 ฟันธง: แยกจำนวนวันออกมา ถ้าเกิน 24 ชม. ให้โชว์คำว่า "วัน" นำหน้า
    const totalHrs = Math.floor(diffMs / 3600000);
    const days = Math.floor(totalHrs / 24);
    const hrs = totalHrs % 24;
    const mins = Math.floor((diffMs % 3600000) / 60000);
    const secs = Math.floor((diffMs % 60000) / 1000);
    
    const timeStr = `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    return days > 0 ? `${days} วัน ${timeStr}` : timeStr;
  };

  const handleReporterChange = (name) => {
    const emp = employeeList.find((x) => x.name === name);
    const tech = technicianList.find((x) => x.name === name);

    let autofillPhone = formData.reporterContact;
    if (tech && tech.phone && tech.phone !== '-') {
      autofillPhone = tech.phone;
    }

    setFormData((prev) => ({
      ...prev,
      reporter: name,
      position: emp?.position || '',
      department: emp?.department || '',
      bureau: 'สำนักปฏิบัติการดาวเทียม',
      reporterContact: autofillPhone,
    }));
    if (formErrors.reporter)
      setFormErrors((prev) => ({ ...prev, reporter: null }));
  };

  const handlePhoneChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 10) val = val.substring(0, 10);

    let formatted = val;
    if (val.length > 6) {
      formatted = `${val.substring(0, 2)}-${val.substring(
        2,
        6
      )}-${val.substring(6)}`;
    } else if (val.length > 2) {
      formatted = `${val.substring(0, 2)}-${val.substring(2)}`;
    }

    setFormData((prev) => ({ ...prev, reporterContact: formatted }));
    if (formErrors.reporterContact)
      setFormErrors((prev) => ({ ...prev, reporterContact: null }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    const remainingSlots = 6 - formData.images.length;
    const filesToProcess = files.slice(0, remainingSlots);

    const promises = filesToProcess.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
          // --- ระบบย่อขนาดรูปภาพ (Image Compression) ---
          const img = new Image();
          img.src = event.target.result;
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 800; // กำหนดความกว้างสูงสุด
            const scaleSize = MAX_WIDTH / img.width;
            canvas.width = MAX_WIDTH;
            canvas.height = img.height * scaleSize;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // บีบอัดเป็น JPEG คุณภาพ 60% (ลดขนาดไฟล์ได้มหาศาล)
            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
            resolve(compressedBase64);
          };
        };
      });
    });

    Promise.all(promises).then((imgs) => {
      setFormData((prev) => ({ ...prev, images: [...prev.images, ...imgs] }));
      if (formErrors.images)
        setFormErrors((prev) => ({ ...prev, images: null }));
    });
    e.target.value = null;
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.reporter) errors.reporter = 'กรุณาระบุชื่อ-นามสกุลผู้แจ้ง';
    
    // 🌟 1. เกราะป้องกันเบอร์โทร (แก้บั๊กบรรทัด 410 เดิม)
    const phone = formData.reporterContact ? String(formData.reporterContact).replace(/\D/g, '') : '';
    if (phone.length !== 10) errors.reporterContact = 'กรุณาระบุเบอร์โทรศัพท์ 10 หลัก';
    
    if (!formData.equipmentCategory) errors.equipmentCategory = 'กรุณาระบุกลุ่มงาน/ภารกิจ';
    if (!formData.equipment) errors.equipment = 'กรุณาระบุอุปกรณ์/ระบบ';
    if (!formData.building) errors.building = 'กรุณาระบุอาคาร/ตึก';
    if (!formData.room) errors.room = 'กรุณาระบุสถานที่/ห้อง';
    if (!formData.description) errors.description = 'กรุณาระบุอาการเสีย';
    
    // 🌟 2. เกราะป้องกันรูปภาพ
    if (!formData.images || formData.images.length === 0) {
      errors.images = 'กรุณาแนบภาพอย่างน้อย 1 รูป';
    }
    
    return errors;
  };

  const handleResetForm = () => {
    setFormData({
      reporter: '',
      reporterContact: '',
      position: '',
      department: '',
      bureau: 'สำนักปฏิบัติการดาวเทียม',
      equipment: '',
      description: '',
      assetNumber: '',
      building: '',
      room: '',
      equipmentCategory: '',
      images: [],
      isSsc: false,
    });
    setFormErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validateForm();
    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      const firstField = Object.keys(errs)[0];
      const el = document.getElementById(`field-${firstField}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setConfirmSubmitModal(true);
  };

  const executeSubmit = async () => {
    setConfirmSubmitModal(false);
    if (!user) return;
    setIsSubmitting(true);
    const newId = getNextReqId(tickets);

    const newTicket = {
      id: newId,
      ...formData,
      status: 'pending',
      isOutOfHours: formData.isSsc,
      date: new Date().toISOString(),
    };

    try {
      await addDoc(collection(db, 'tickets'), newTicket);
      setShowSuccess(true);

    // 🌟 โค้ดยิงแจ้งเตือนเข้า LINE ผ่าน GAS
    const gasUrl = "https://script.google.com/macros/s/AKfycbxBoB_e637WkWMeSuX9NP3BSKcSiE8J3dSXmlzNV9aeiq6DRUvn81bSp6w-B0nzCVA5/exec"; // <--- อย่าลืมเอา URL ยาวๆ มาวางในเครื่องหมายคำพูดนะครับ
      
    try {
      fetch(gasUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId: newId,
          equipment: formData.equipment,
          description: formData.description,
          reporter: formData.reporter,
          phone: formData.reporterContact
        })
      });
    } catch (err) {
      console.error("Line Notify Error:", err);
    }

    // 🌟 ฟันธง: โค้ดหน่วงเวลา 5 วินาที (5000ms) แล้วเด้งกลับหน้าติดตามงาน
    setTimeout(() => {
      setShowSuccess(false);      // 1. ปิดหน้าต่าง Success
      setFilterStatus('all');     // 2. รีเซ็ตตัวกรองเป็น 'ทั้งหมด'
      setActiveTab('tracking');   // 3. สั่งเด้งไปหน้า 'ติดตามสถานะ'
    }, 5000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateTicketStatus = async (ticketId, updates) => {
    if (!user) return;
    const target = tickets.find((t) => t.id === ticketId);
    if (!target || !target.dbId) return;
    try {
      await updateDoc(doc(db, 'tickets', target.dbId), updates);
    } catch (e) {
      console.error(e);
    }
  };

  const executeActionModal = async () => {
    const { ticketId, type } = actionModal;
    let updates = {};
    if (type === 'accept') {
      if (!selectedTech) return;
      const tech = technicianList.find((t) => t.name === selectedTech);
      updates = {
        status: 'in_progress',
        acceptedAt: new Date().toISOString(),
        startedAt: new Date().toISOString(),
        techName: tech.name,
        techPhone: tech.phone || 'N/A',
      };
    } else if (type === 'hold')
      updates = {
        status: 'on_hold',
        holdReason: actionText,
        lastHoldAt: new Date().toISOString(),
      };
    else if (type === 'finish')
      updates = {
        status: 'completed',
        cause: actionText,
        completedAt: new Date().toISOString(),
      };
    else if (type === 'ssc') updates = { sscNote: actionText };
    else if (type === 'cancel')
      updates = {
        status: 'cancelled',
        cancelReason: actionText,
        cancelledAt: new Date().toISOString(),
      };

    await updateTicketStatus(ticketId, updates);
    setActionModal({ isOpen: false, ticketId: null, type: null });
    setActionText('');
    setSelectedTech('');
  };

  // 🌟 ฟันธง: ตัวคำนวณสถิติที่รองรับปฏิทินย้อนหลังแบบ 100%
  const stats = useMemo(() => {
    try {
      const now = new Date();
      
      const filteredByTime = tickets.filter(t => {
        if (!t.date) return false;
        const tDate = new Date(t.date);

        // 📅 กรณีหัวหน้ากดเลือกปฏิทินเดือนย้อนหลัง
        if (dashTimeframe === 'custom' && customMonth) {
          const [year, month] = customMonth.split('-');
          return tDate.getFullYear() === parseInt(year) && (tDate.getMonth() + 1) === parseInt(month);
        }

        if (dashTimeframe === 'all') return true;
        if (dashTimeframe === 'today') return tDate.toDateString() === now.toDateString();
        if (dashTimeframe === 'week') {
          const firstDayOfWeek = new Date(now);
          const currentDay = now.getDay();
          const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay; // บังคับเริ่มวันจันทร์
          firstDayOfWeek.setDate(now.getDate() + diffToMonday);
          firstDayOfWeek.setHours(0, 0, 0, 0);
          return tDate >= firstDayOfWeek;
        }
        if (dashTimeframe === 'month') {
          return tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear();
        }
        return true;
      });

      return {
        total: filteredByTime.length,
        pending: filteredByTime.filter((t) => t.status === 'pending').length,
        fixing: filteredByTime.filter((t) => ['acknowledged', 'in_progress', 'on_hold'].includes(t.status)).length,
        done: filteredByTime.filter((t) => ['completed', 'verified'].includes(t.status)).length,
        cancelled: filteredByTime.filter((t) => t.status === 'cancelled').length,
      };
    } catch (err) {
      console.error("Stats Error:", err);
      return { total: 0, pending: 0, fixing: 0, done: 0, cancelled: 0 };
    }
  }, [tickets, dashTimeframe, customMonth]); // 🌟 อัปเดตทันทีที่เลือกปฏิทิน

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const searchStr = searchTerm.toLowerCase();
      const match =
        !searchTerm ||
        String(t.equipment).toLowerCase().includes(searchStr) ||
        String(t.id).toLowerCase().includes(searchStr) ||
        String(t.reporter).toLowerCase().includes(searchStr) ||
        (t.techName && String(t.techName).toLowerCase().includes(searchStr));
      if (!match) return false;
      if (filterStatus === 'all') return true;
      if (filterStatus === 'fixing')
        return ['acknowledged', 'in_progress', 'on_hold'].includes(t.status);
      if (filterStatus === 'completed')
        return ['completed', 'verified'].includes(t.status);
      return t.status === filterStatus;
    });
  }, [tickets, searchTerm, filterStatus]);

  // ==========================================
  // 🎨 Views Rendering
  // ==========================================

  // 🌟🌟🌟 จุดที่ 3: วางทับ renderDashboard จนถึงก่อนบรรทัด grid grid-cols-2 🌟🌟🌟
  const renderDashboard = () => {
    const completionRate =
      stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

    const longestPendingTicket = tickets
      .filter((t) => t.status === 'pending')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

    const longestFixingTicket = tickets
      .filter((t) => t.status === 'in_progress' || t.status === 'on_hold')
      .sort((a, b) => {
        const timeA = new Date(a.startedAt || a.date).getTime();
        const timeB = new Date(b.startedAt || b.date).getTime();
        return timeA - timeB;
      })[0];

    // 🌟 ฟังก์ชันอัจฉริยะแปลงป้ายวันที่ (รองรับปฏิทินย้อนหลัง)
    const getTimeframeLabel = () => {
      const now = new Date(sysTime);
      const monthsFull = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
      const monthsShort = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

      if (dashTimeframe === 'custom' && customMonth) {
        const [year, month] = customMonth.split('-');
        return `ผลงานเดือน ${monthsFull[parseInt(month) - 1]} ${parseInt(year) + 543}`;
      }
      if (dashTimeframe === 'today') return `วันที่ ${now.getDate()} ${monthsFull[now.getMonth()]} ${now.getFullYear() + 543}`;
      if (dashTimeframe === 'week') {
        const day = now.getDay();
        const diffToMonday = day === 0 ? -6 : 1 - day;
        const first = new Date(now);
        first.setDate(now.getDate() + diffToMonday); // จันทร์
        const last = new Date(first);
        last.setDate(first.getDate() + 6); // อาทิตย์
        return `${first.getDate()} ${monthsShort[first.getMonth()]} - ${last.getDate()} ${monthsShort[last.getMonth()]} ${last.getFullYear() + 543}`;
      }
      if (dashTimeframe === 'month') return `เดือน ${monthsFull[now.getMonth()]} ${now.getFullYear() + 543}`;
      return 'ตั้งแต่เริ่มระบบ (All Time)';
    };

    return (
      <div className="px-5 pb-5 pt-2 space-y-5 animate-in fade-in duration-500 pb-32">
        
        {/* 📅 1. แถบวันที่แบบยาว */}
        <div className="bg-slate-800/60 backdrop-blur-xl border-2 border-solid border-orange-500/80 rounded-[1rem] py-4 text-center shadow-[0_0_20px_rgba(249,115,22,0.4)] font-sans tracking-widest text-white font-bold">
          {ThaiDateFormatter(sysTime)}
        </div>

       {/* 🔘 2. สวิตช์เลือกกรอบเวลา (อัปเกรดเป็นแบบปัดเลื่อนซ้ายขวาได้ ไม่ตกบรรทัด) */}
       <div className="flex gap-2 bg-slate-600/80 p-2 rounded-2xl border-2 border-solid border-white-500/80 shadow-inner mt-4 overflow-x-auto scrollbar-hide snap-x">
          {[
            { id: 'today', label: 'วันนี้' },
            { id: 'week', label: 'สัปดาห์นี้' },
            { id: 'month', label: 'เดือนนี้' },
          ].map((tf) => (
            <button
              key={tf.id}
              onClick={() => setDashTimeframe(tf.id)}
              // 🌟 เพิ่ม min-w-[75px] และ shrink-0 เพื่อไม่ให้ปุ่มโดนบีบจนข้อความเบียดกัน-เปลี่ยนสีปุ่มและกรอบ วันนี้ สัปดาห์นี้ เดือนนี้
              className={`flex-1 min-w-[75px] shrink-0 text-[13px] font-black py-2.5 rounded-xl transition-all duration-300 snap-center ${
                dashTimeframe === tf.id
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-2 border-solid border-white-300 shadow-[0_0_15px_rgba(249,115,22,0.8)] scale-105 z-10' 
                  : 'text-slate-100 bg-emerald-600/60 border-2 border-solid border-white-500/50 hover:bg-rose-600 hover:text-white hover:shadow-[0_0_15px_rgba(255,255,255,0.4)] hover:-translate-y-1' 
              }`}
            >
              {tf.label}
            </button>
          ))}
          
          {/* 🌟 ไอคอนปฏิทิน ระบุเดือน */}
          <div className="relative flex-1 min-w-[95px] shrink-0 flex justify-center snap-center">
             <input 
               type="month"
               className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
               value={customMonth}
               onChange={(e) => {
                 if(e.target.value) {
                   setCustomMonth(e.target.value);
                   setDashTimeframe('custom');
                 }
               }}
             />
             <button className={`w-full relative z-10 text-[13px] font-black py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 ${
               dashTimeframe === 'custom' 
                 ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-2 border-solid border-orange-300 shadow-[0_0_15px_rgba(249,115,22,0.8)] scale-105' 
                 : 'text-slate-100 bg-slate-600/60 border-2 border-solid border-white-500/50 hover:bg-rose-600 hover:text-white hover:shadow-[0_0_15px_rgba(255,255,255,0.4)] hover:-translate-y-1' 
             }`}>
               <Calendar size={16} className={dashTimeframe === 'custom' ? 'text-white' : 'text-emerald-300'} /> 
               {/* 🌟 บังคับข้อความไม่ให้ขึ้นบรรทัดใหม่ */}
               <span className="whitespace-nowrap">ระบุเดือน</span>
             </button>
          </div>
        </div>

        {/* 📊 3. กล่องแสดงตัวเลขรวม (ขยายตัวหนังสือ + ปรับกรอบ) */}
        <div className="bg-slate-800/60 backdrop-blur-xl border-2 border-solid border-orange-500/80 shadow-[0_0_25px_rgba(249,115,22,0.2)] rounded-[1.5rem] p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/50 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

          <div className="relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-300 text-[16px] font-black uppercase tracking-widest mb-2 drop-shadow-sm">
                  จำนวนงานทั้งหมด
                </p>
                
                {/* 🌟 ป้ายบอกช่วงเวลา (อัปเกรดให้ใหญ่และเรืองแสง) */}
                <div className="bg-orange-500/20 border-2 border-orange-400/50 text-orange-300 text-[13px] font-black px-3 py-1 rounded-lg inline-block mb-4 shadow-[0_0_15px_rgba(249,115,22,0.3)] backdrop-blur-md">
                  {getTimeframeLabel()}
                </div>
                
                {/* 🌟 ตัวเลข (ขยายเป็น text-7xl ให้เบิ้มๆ) */}
                <div className="flex items-baseline gap-2">
                  <span className="text-7xl font-black font-mono tracking-tighter leading-none text-orange-500 drop-shadow-[0_4px_4px_rgba(0,0,0,0.4)]">
                    {String(stats.total).padStart(2, '0')}
                  </span>
                  <span className="text-slate-300 text-[16px] font-bold tracking-widest ml-1">
                    รายการ
                  </span>
                </div>
              </div>

              {/* 🌟 วงกลม % อัตราปิดงาน (ขยายกรอบให้สมดุล) */}
              <div className="bg-white/90 backdrop-blur-md border-[3px] border-solid border-emerald-400/50 px-4 py-3 rounded-2xl flex flex-col items-center shadow-lg mt-1">
                <span className="text-[14px] font-black uppercase tracking-widest text-emerald-800 mb-1">
                  อัตราปิดงาน
                </span>
                <div className="flex items-center gap-1.5 text-orange-600">
                  <PieChart size={24} className="animate-pulse" />
                  <span className="text-[34px] font-black drop-shadow-sm">
                    {completionRate}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
  
          {/* <div className="grid grid-cols-2 gap-4"> ... โค้ดส่วนล่าง (ปุ่มแดงส้มเขียวเทา) ปล่อยไว้เหมือนเดิมครับ ... */}

        <div className="grid grid-cols-2 gap-4">
          <div
            onClick={() => {
              setActiveTab('tracking');
              setFilterStatus('pending');
              setSearchTerm('');
            }}
            className="bg-slate-800/40 backdrop-blur-xl p-5 rounded-[1.5rem] border-[2px] border-solid border-rose-500 hover:bg-slate-700/50 flex flex-col items-center shadow-lg active:scale-95 transition-all cursor-pointer relative overflow-hidden hover:shadow-[0_0_25px_rgba(244,63,94,0.5)] hover:-translate-y-1 hover:border-rose-400"
          >
            <div className="absolute top-0 w-full h-1 bg-rose-500"></div>
            <div className="bg-rose-50 p-3 rounded-2xl mb-3">
              <AlertCircle size={24} className="text-rose-500 animate-pulse" />
            </div>
            <div className="text-4xl font-black text-rose-400 font-mono tracking-tighter leading-none">
              {stats.pending}
            </div>
            <div className="text-[13px] font-bold text-rose-500 uppercase mt-2 tracking-widest">
              รอดำเนินการ
            </div>
          </div>
          <div
            onClick={() => {
              setActiveTab('tracking');
              setFilterStatus('fixing');
              setSearchTerm('');
            }}
            className="bg-slate-800/40 backdrop-blur-xl p-5 rounded-[1.5rem] border-[2px] border-solid border-orange-500 hover:bg-slate-700/50 flex flex-col items-center shadow-lg active:scale-95 transition-all cursor-pointer relative overflow-hidden hover:shadow-[0_0_25px_rgba(249,115,22,0.5)] hover:-translate-y-1 hover:border-orange-400"
          >
            <div className="absolute top-0 w-full h-1 bg-orange-400"></div>
            <div className="bg-orange-50 p-3 rounded-2xl mb-3">
              <Wrench size={24} className="text-orange-500" />
            </div>
            <div className="text-4xl font-black text-orange-500 font-mono tracking-tighter leading-none">
              {stats.fixing}
            </div>
            <div className="text-[13px] font-bold text-orange-500 uppercase mt-2 tracking-widest">
              กำลังซ่อม
            </div>
          </div>

          <div
            onClick={() => {
              setActiveTab('tracking');
              setFilterStatus('completed');
              setSearchTerm('');
            }}
            className="bg-slate-800/40 backdrop-blur-xl p-5 rounded-[1.5rem] border-[2px] border-solid border-emerald-500 hover:bg-slate-700/50 flex flex-col items-center shadow-lg active:scale-95 transition-all cursor-pointer relative overflow-hidden hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] hover:-translate-y-1 hover:border-emerald-400"
          >
            <div className="absolute top-0 w-full h-1 bg-emerald-500"></div>
            <div className="bg-emerald-50 p-3 rounded-2xl mb-3">
              <CheckCircle size={24} className="text-emerald-500"/>
            </div>
            <div className="text-4xl font-black text-emerald-400 font-mono tracking-tighter leading-none">
              {stats.done}
            </div>
            <div className="text-[13px] font-bold text-emerald-500 uppercase mt-2 tracking-widest">
              เสร็จสิ้น
            </div>
          </div>

          <div
            onClick={() => {
              setActiveTab('tracking');
              setFilterStatus('cancelled');
              setSearchTerm('');
            }}
            className="bg-slate-800/40 backdrop-blur-xl p-5 rounded-[1.5rem] border-[2px] border-solid border-slate-500 hover:bg-slate-700/50 flex flex-col items-center shadow-lg active:scale-95 transition-all cursor-pointer relative overflow-hidden hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:-translate-y-1 hover:border-slate-400"
          >
            <div className="absolute top-0 w-full h-1 bg-slate-400"></div>
            <div className="bg-slate-50 p-3 rounded-2xl mb-3">
              <XCircle size={24} className="text-slate-500" />
            </div>
            <div className="text-4xl font-black text-state-300 font-mono tracking-tighter leading-none">
              {stats.cancelled}
            </div>
            <div className="text-[13px] font-bold text-slate-300 uppercase mt-2 tracking-widest">
              ยกเลิก
            </div>
          </div>
        </div>

        {/* ================= เริ่มกล่อง: งานที่รอเกินกำหนด ================= */}
        {(longestPendingTicket || longestFixingTicket) && (
          <div className="bg-slate-800/60 backdrop-blur-xl p-5 rounded-[1rem] border-2 border-solid border-orange-500/80 shadow-[0_0_20px_rgba(249,115,22,0.15)] mt-6 overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl"></div>
            <h3 className="text-[15px] font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2 relative z-10">
              <Flame size={20} className="text-white-500 animate-pulse" />{' '}
              งานที่รอเกินระยะเวลากำหนด
            </h3>
            <div className="grid grid-cols-1 gap-3 relative z-10">
              
              {longestPendingTicket && (
                <div
                  onClick={() => {
                    setActiveTab('tracking');
                    setSearchTerm(longestPendingTicket.id);
                    setFilterStatus('all');
                  }}
                  className="bg-white p-4 rounded-2xl border-2 border-solid border-orange-800 shadow-[0_4px_10px_rgba(225,29,72,0.1)] cursor-pointer hover:border-rose-500 hover:bg-rose-100 hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all active:scale-[0.98]"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-black text-rose-600 border-2 border-solid bg-rose-100 px-2 py-0.5 rounded-md border border-rose-200 shadow-sm">
                        รอนานที่สุด
                      </span>
                      <span className="text-[12px] font-mono font-bold text-slate-500">
                        {longestPendingTicket.id}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
                    {formatMinutesToText(getMinutesDiff(longestPendingTicket.date, sysTime))}
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-rose-800 truncate mb-1">
                    {longestPendingTicket.equipment}
                  </h4>
                  {/* 🌟 ป้ายกำกับ ผู้แจ้งปัญหา */}
                  <div className="flex flex-col gap-0.5 mt-2">
                    <span className="text-[10px] font-bold text-slate-400 tracking-widest">ผู้แจ้งปัญหา:</span>
                    <p className="text-[12px] font-bold text-orange-600 flex items-center gap-1.5">
                      <User size={14} className="text-orange-500" />
                      {longestPendingTicket.reporter}
                    </p>
                  </div>
                </div>
              )}
              
              {longestFixingTicket && (
                <div
                  onClick={() => {
                    setActiveTab('tracking');
                    setSearchTerm(longestFixingTicket.id);
                    setFilterStatus('all');
                  }}
                  className="bg-white p-4 rounded-2xl border-2 border-solid border-orange-400 shadow-[0_4px_10px_rgba(249,115,22,0.1)] cursor-pointer hover:border-orange-500 hover:bg-orange-50 hover:shadow-md transition-all active:scale-[0.98]"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-black text-orange-600 bg-orange-100 px-2 py-0.5 rounded-md border border-orange-200 shadow-sm">
                        ซ่อมมาราธอน
                      </span>
                      <span className="text-[12px] font-mono font-bold text-slate-500">
                        {longestFixingTicket.id}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-black text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-100">
                    {formatMinutesToText(getMinutesDiff(longestFixingTicket.startedAt || longestFixingTicket.date, sysTime))}
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-rose-800 truncate mb-1">
                    {longestFixingTicket.equipment}
                  </h4>
                  {/* 🌟 ป้ายกำกับ ผู้รับผิดชอบ (ช่าง) */}
                  <div className="flex flex-col gap-0.5 mt-2">
                    <span className="text-[10px] font-bold text-slate-400 tracking-widest">ผู้รับผิดชอบ:</span>
                    <p className="text-[12px] font-bold text-emerald-600 flex items-center gap-1.5">
                      <Wrench size={14} className="text-emerald-500" />
                      {longestFixingTicket.techName || 'กำลังดำเนินการ'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {/* ================= จบกล่อง: งานที่รอเกินกำหนด ================= */}

        <div className="bg-slate-800/60 backdrop-blur-xl p-5 rounded-[1rem] border-2 border-solid border-orange-500/80 shadow-[0_0_20px_rgba(249,115,22,0.15)] mt-6 hover:shadow-[0_0_20px_rgba(249,115,22,0.3)]">
          <h3 className="text-[15px] font-black text-white uppercase  tracking-widest mb-4 flex items-center gap-2">
            <FileText
              size={20}
              className="text-[15px] font-bold text-white-800"
            />{' '}
            รายการล่าสุด
          </h3>
          <div className="space-y-3">
            {tickets.slice(0, 3).map((t) => (
              <div
                key={t.id}
                onClick={() => {
                  setActiveTab('tracking');
                  setSearchTerm(t.id);
                  setFilterStatus('all');
                }}
                className={`flex flex-col p-4 bg-slate-50 rounded-2xl border-2 cursor-pointer active:scale-[0.98] transition-all shadow-sm ${
                  t.status === 'pending'
                    ? 'border-rose-400 hover:bg-rose-100 hover:border-rose-500'
                    : t.status === 'in_progress' || t.status === 'on_hold'
                    ? 'border-orange-400 hover:bg-orange-100 hover:border-orange-500'
                    : 'border-emerald-400 hover:bg-emerald-100 hover:border-emerald-500'
                } relative`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-mono font-bold text-slate-600 bg-white px-2 py-0.5 rounded-md border border-2 border-solid border-orange-400/70 tracking-widest shadow-sm">
                      {t.id}
                    </span>
                    {t.isOutOfHours && (
                      <span className="text-[13px] font-black text-rose-600 bg-rose-100 border border-solid border-rose-200 px-1.5 py-0.5 rounded-md animate-pulse">
                        SSC
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-[13px] font-black uppercase px-2 py-0.5 rounded-md ${
                      t.status === 'pending'
                        ? 'bg-rose-100 text-rose-600'
                        : t.status === 'in_progress' || t.status === 'on_hold'
                        ? 'bg-orange-100 text-orange-600'
                        : t.status === 'verified'
                        ? 'bg-emerald-500 text-white shadow-sm' 
                        : 'bg-emerald-100 text-emerald-600'
                    }`}
                  >
                    {t.status === 'pending'
                      ? 'รอดำเนินการ'
                      : t.status === 'verified'
                      ? 'เสร็จสิ้นสมบูรณ์'
                      : t.status === 'completed'
                      ? 'รอผู้แจ้งยืนยัน'
                      : 'กำลังซ่อม'}
                  </span>
                </div>

                <div className="flex justify-between items-center pr-1">
                  <div className="min-w-0 flex-1">
                    <h4 className="text-[13px] font-bold text-blue-800 truncate mb-4">
                      {t.equipment}
                    </h4>
                    <p className="text-[13px] text-orange-500 truncate flex items-center gap-1.5">
                      <AlertCircle
                        size={15}
                        className="text-orange-500 shrink-0"
                      />{' '}
                      {t.description}
                    </p>
                  </div>
                  <ChevronRight
                    size={18}
                    className="text-slate-300 shrink-0 ml-2"
                  />
                </div>

                {/* 🌟 อัปเกรด: โซนระบุชื่อผู้แจ้งและช่างแบบชัดเจน (แยกบรรทัดตามมาตรฐาน) */}
                <div className="mt-3 pt-3 border-t border-2 border-orange-400/70 flex justify-between items-end">
                  <div className="flex flex-col gap-2.5">
                    
                    {/* 👤 ข้อมูลผู้แจ้ง (มีเสมอ) */}
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-bold text-slate-400 tracking-widest">ผู้แจ้งปัญหา:</span>
                      <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1.5">
                        <User size={13} className="text-emerald-500 shrink-0" />
                        <span className="truncate max-w-[140px]">{t.reporter}</span>
                      </span>
                    </div>
                    
                    {/* 🔧 ข้อมูลช่าง (โชว์เฉพาะเมื่องานถูกรับไปแล้ว) */}
                    {t.techName && (
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-bold text-slate-400 tracking-widest">ผู้รับผิดชอบ:</span>
                        <span className="text-[11px] font-bold text-orange-600 flex items-center gap-1.5">
                          <Wrench size={13} className="text-orange-500 shrink-0" />
                          <span className="truncate max-w-[140px]">{t.techName}</span>
                        </span>
                      </div>
                    )}

                  </div>
                  
                  {/* เวลาที่แจ้ง */}
                  <span className="text-[11px] font-bold font-mono text-blue-500 flex items-center gap-1 shrink-0 mb-0.5">
                    <Clock size={12} className="text-blue-500" /> 
                    {new Date(t.date).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.
                  </span>
                </div>
              </div>
            ))}
            {tickets.length === 0 && (
              <p className="text-center text-xs font-bold text-slate-500 py-4">
                ไม่มีรายการซ่อมบำรุง
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderReport = () => (
    <div className="p-5 pb-32 animate-in slide-in-from-right-4 duration-500 space-y-6 relative">
      
      {/* 🌟 ฟันธง: เติมสวิตช์ตรงนี้! */}
      {showSuccess ? (

        <div className="flex flex-col items-center justify-center py-24 text-center animate-in zoom-in duration-500">
          
          {/* 🌟 1. โซนไอคอน: เพิ่มวงแหวนเรืองแสงและเส้นประหมุนล้อมรอบ */}
          <div className="relative mb-10 mt-8">
            <div className="absolute inset-0 border-4 border-emerald-400 rounded-full animate-ping opacity-40"></div>
            <div className="absolute -inset-4 border-2 border-dashed border-white-600/90 rounded-full animate-[spin_10s_linear_infinite]"></div>
            
            <div className="relative w-32 h-32 bg-gradient-to-tr from-emerald-400 to-orange-600 text-white rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.7)] border-2 border-solid border-emerald-200/80">
              <CheckCircle size={80} />
            </div>
          </div>

          {/* 🌟 2. โซนข้อความ: ทำพื้นหลังใสๆ พร้อมขอบสีเขียวให้ดูอวกาศไฮเทค */}
          <div className="bg-emerald-500/30 backdrop-blur-xl border-[2px] border-solid border-white-300/80 p-8 rounded-[1rem] shadow-[0_0_30px_rgba(16,185,129,0.2)] max-w-sm w-full mx-auto">
            <h2 className="text-4xl font-black text-emerald-400 drop-shadow-lg mb-3 tracking-wide">
              ส่งข้อมูลสำเร็จ!
            </h2>
            <p className="text-[16px] font-bold text-slate-100 leading-relaxed">
              ระบบบันทึกข้อมูล และส่งแจ้งเตือนให้ <br/>
              <span className="border-2 border-solid border-white-200/80 text-orange-500 font-black bg-white-500/60 px-2 py-1 rounded-lg mt-1 inline-block">เจ้าหน้าที่ ฝวด.</span> รับทราบแล้ว!!
            </p>
            </div>

            </div>
          ) : (

            <form onSubmit={handleSubmit} className="space-y-6 md:max-w-2xl md:mx-auto">
          <div className="bg-slate-800/60 backdrop-blur-xl  border-2 border-solid border-white-600/50 rounded-[1rem] py-4 text-center shadow-[0_0_30px_rgba(0,0,0,0.3)] font-sans tracking-widest text-white font-bold">
            {ThaiDateFormatter(sysTime)}
          </div>

          {/* ================= กรอบที่ 1: ข้อมูลผู้แจ้งซ่อม ================= */}
          <div className="relative bg-slate-800/60 backdrop-blur-xl border-2 border-solid border-orange-400 rounded-[1rem] p-6 pt-10 shadow-[0_0_40px_rgba(0,0,0,0.4)] text-left">
            <div className="absolute -top-4 left-6 bg-emerald-50 text-emerald-600 px-4 py-2.5 rounded-xl font-black text-xs shadow-sm border-2 border-solid border-green-500 flex items-center gap-2 tracking-widest uppercase">
              <User size={20} className="text-orange-500"/> ข้อมูลผู้แจ้งซ่อม
            </div>

            <div className="space-y-4">
              <SearchableDropdown
                id="field-reporter"
                label={
                  <>
                    ชื่อ-นามสกุล <span className="text-rose-500">*</span>
                  </>
                }
                icon={<User size={14} className="text-emerald-300"/>}
                placeholder="เลือกชื่อหรือพิมพ์ค้นหา"
                options={employeeList.map((e) => String(e.name))}
                value={formData.reporter}
                onChange={handleReporterChange}
                error={formErrors.reporter}
              />

              <div className="space-y-1.5">
                <label className="text-[13px] font-black text-slate-200 uppercase tracking-widest ml-1">
                  ตำแหน่ง
                </label>
                <input
                  value={formData.position}
                  readOnly
                  className="w-full bg-slate-50 border-2 border-solid border-orange-500 rounded-2xl px-5 py-4 text-sm font-bold text-slate-500 outline-none cursor-not-allowed shadow-inner"
                  placeholder="-"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[13px] font-black text-slate-200 uppercase tracking-widest ml-1">
                  ฝ่าย
                </label>
                <input
                  value={formData.department}
                  readOnly
                  className="w-full bg-slate-50 border-2 border-solid border-orange-500 rounded-2xl px-5 py-4 text-sm font-bold text-slate-500 outline-none cursor-not-allowed shadow-inner"
                  placeholder="-"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[13px] font-black text-slate-200 uppercase tracking-widest ml-1">
                  สำนัก
                </label>
                <input
                  value={formData.bureau}
                  readOnly
                  className="w-full bg-slate-50 border-2 border-solid border-orange-500 rounded-2xl px-5 py-4 text-sm font-bold text-slate-500 outline-none cursor-not-allowed shadow-inner"
                  placeholder="สำนักปฏิบัติการดาวเทียม"
                />
              </div>

              <div className="space-y-1.5" id="field-reporterContact">
                <label className="text-[13px] font-black text-slate-200 uppercase tracking-[0.2em] ml-1 flex items-center gap-1.5">
                  <Phone size={12} className="text-emerald-500" /> เบอร์โทรศัพท์{' '}
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  name="reporterContact"
                  value={formData.reporterContact}
                  onChange={handlePhoneChange}
                  maxLength={12}
                  className={`w-full bg-white border-2 border-solid border-orange-500 ${
                    formErrors.reporterContact
                      ? 'border-rose-500 focus:border-rose-500 ring-1 ring-rose-500/30'
                      : 'border-2 border-orange-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30'
                  } rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 outline-none font-mono tracking-widest shadow-sm transition-all`}
                  placeholder="0X-XXXX-XXXX"
                />
                {formErrors.reporterContact && (
                  <div className="text-rose-500 text-[11px] font-bold mt-1 px-1">
                    ⚠️ {formErrors.reporterContact}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ================= กรอบที่ 2: รายละเอียดการแจ้งซ่อม ================= */}
          <div className="relative bg-slate-800/60 backdrop-blur-xl border-2 border-solid border-white-500/80 rounded-[1rem] p-6 pt-10 shadow-[0_0_40px_rgba(0,0,0,0.4)] text-left">
            <div className="absolute -top-4 left-6 bg-emerald-50 text-emerald-600 px-4 py-2.5 rounded-xl font-black text-xs shadow-sm border-2 border-solid border-green-500 flex items-center gap-2 tracking-widest uppercase">
              <Wrench size={20} className="text-orange-500" />{' '}
              รายละเอียดการแจ้งซ่อม
            </div>

            <div className="space-y-5">
              {/* 🌟 1. Dropdown ชั้นที่ 1: เลือกกลุ่มภารกิจงาน */}
              <SearchableDropdown
                id="field-equipmentCategory"
                label={
                  <>
                    กลุ่มงาน / ภารกิจรับผิดชอบ <span className="text-rose-500">*</span>
                  </>
                }
                icon={<Activity size={12} className="text-emerald-500" />}
                placeholder="เลือกกลุ่มภารกิจของ ฝวด."
                options={Object.keys(equipmentCategories)} // ดึงชื่อหัวข้อมาเป็นตัวเลือก
                value={formData.equipmentCategory}
                onChange={(val) => {
                  setFormData({ 
                    ...formData, 
                    equipmentCategory: val, 
                    equipment: '' // 🌟 สำคัญ: ถ้าเปลี่ยนกลุ่ม ต้องล้างค่าอุปกรณ์เดิมทิ้ง
                  });
                  if (formErrors.equipmentCategory) setFormErrors({ ...formErrors, equipmentCategory: null });
                }}
                error={formErrors.equipmentCategory}
              />

              {/* 🌟 2. Dropdown ชั้นที่ 2: เลือกอุปกรณ์ (โชว์เฉพาะของกลุ่มที่เลือก) */}
              <SearchableDropdown
                id="field-equipment"
                label={
                  <>
                    รายการอุปกรณ์ / ระบบ <span className="text-rose-500">*</span>
                  </>
                }
                icon={<Monitor size={12} className="text-emerald-500" />}
                placeholder={formData.equipmentCategory ? "เลือกอุปกรณ์หรือพิมพ์ค้นหา" : "กรุณาเลือกกลุ่มงานก่อน"}
                options={formData.equipmentCategory ? equipmentCategories[formData.equipmentCategory] : []} // 🌟 ฟิลเตอร์ข้อมูลตามกลุ่ม
                value={formData.equipment}
                onChange={(val) => {
                  setFormData({ ...formData, equipment: val });
                  if (formErrors.equipment) setFormErrors({ ...formErrors, equipment: null });
                }}
                error={formErrors.equipment}
              />

              <div className="space-y-1.5" id="field-description">
                <label className="text-[13px] font-black text-slate-200 uppercase tracking-[0.2em] ml-1 flex items-center gap-1.5">
                  <AlertCircle size={12} className="text-emerald-500" />{' '}
                  อาการเสีย / รายละเอียดปัญหา{' '}
                  <span className="text-rose-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className={`w-full bg-white border ${
                    formErrors.description
                      ? 'border-rose-500 focus:border-rose-500 ring-1 ring-rose-500/30'
                      : 'border-2 border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30'
                  } rounded-2xl px-5 py-4 outline-none text-sm font-bold text-slate-800 shadow-sm resize-none transition-all`}
                  placeholder="อธิบายรายละเอียดอาการเสีย..."
                />
                {formErrors.description && (
                  <div className="text-rose-500 text-[11px] font-bold mt-1.5 ml-1 animate-in fade-in">
                    ⚠️ {formErrors.description}
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-[13px] font-black text-slate-200 uppercase tracking-[0.2em] ml-1 flex items-center gap-1.5">
                  <Hash size={12} className="text-emerald-500" />{' '}
                  หมายเลขครุภัณฑ์ (หากมี)
                </label>
                <input
                  name="assetNumber"
                  value={formData.assetNumber}
                  onChange={handleInputChange}
                  className="w-full bg-white border-2 border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 outline-none font-mono tracking-widest shadow-sm transition-all"
                  placeholder="ระบุหมายเลข..."
                />
              </div>

              <SearchableDropdown
                id="field-building"
                label={
                  <>
                    อาคาร / ตึก <span className="text-rose-500">*</span>
                  </>
                }
                icon={<Building size={12} className="text-emerald-500" />}
                placeholder="เลือกอาคารหรือพิมพ์ค้นหา"
                options={buildingList}
                value={formData.building}
                onChange={(val) => {
                  setFormData({ ...formData, building: val });
                  if (formErrors.building)
                    setFormErrors({ ...formErrors, building: null });
                }}
                error={formErrors.building}
              />

              <div className="space-y-1.5" id="field-room">
                <label className="text-[13px] font-black text-slate-200 uppercase tracking-[0.2em] ml-1 flex items-center gap-1.5">
                  <DoorOpen size={12} className="text-emerald-500" /> สถานที่ /
                  ห้อง <span className="text-rose-500">*</span>
                </label>
                <input
                  name="room"
                  value={formData.room}
                  onChange={handleInputChange}
                  className={`w-full bg-white border ${
                    formErrors.room
                      ? 'border-rose-500 focus:border-rose-500 ring-1 ring-rose-500/30'
                      : 'border-2 border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30'
                  } rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 outline-none shadow-sm transition-all`}
                  placeholder="ระบุสถานที่หรือห้อง"
                />
                {formErrors.room && (
                  <div className="text-rose-500 text-[11px] font-bold mt-1.5 ml-1 animate-in fade-in">
                    ⚠️ {formErrors.room}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <label className="text-[12px] font-black text-yellow-300 uppercase tracking-widest flex items-center gap-1.5">
                    <AlertTriangle
                      size={14}
                      className={formData.isSsc ? 'animate-pulse' : ''}
                    />{' '}
                    แจ้งด่วนนอกเวลาทำการ (เวร SSC)
                  </label>
                  <p className="text-[11px] font-bold text-slate-300 mt-0.5 ml-5">
                    เลือกเพื่อส่งแจ้งเตือนไปยังวิศวกรเวร SSC
                  </p>
                </div>
                <div
                  onClick={() =>
                    setFormData({ ...formData, isSsc: !formData.isSsc })
                  }
                  className={`w-12 h-6 rounded-full flex items-center px-1 cursor-pointer transition-all shadow-inner ${
                    formData.isSsc
                      ? 'bg-rose-500 justify-end'
                      : 'bg-slate-200 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                </div>
              </div>

              {/* ================= จุดที่ให้วางทับ เริ่มตั้งแต่บรรทัดนี้ ================= */}
            <div
              className="space-y-4 pt-5 border-t border-slate-600/50"
              id="field-images"
            >
              {/* 🌟 1. ส่วนหัวข้อและตัวนับ 0/6 รูป */}
              <div className="flex justify-between items-center ml-1 mb-2">
                <label className="text-[13px] font-black text-slate-200 uppercase tracking-[0.2em] flex items-center gap-1.5">
                  <Camera size={14} className="text-emerald-500" />{' '}
                  แนบรูปภาพประกอบ <span className="text-rose-500">*</span>
                </label>
                <div className="bg-orange-500/20 border border-orange-400/50 text-orange-300 text-[12px] font-black px-3 py-1 rounded-lg shadow-[0_0_10px_rgba(249,115,22,0.4)] backdrop-blur-sm">
                  {formData.images.length} / 6 รูป
                </div>
              </div>

              {/* 🌟 2. โซนแสดงรูปและกรอบเส้นปะ */}
              <div className={formData.images.length === 0 ? "flex w-full" : "grid grid-cols-3 gap-3"}>
                
                {/* 🖼️ รูปที่ถูกเลือกแล้วจะมาเรียงตรงนี้ */}
                {formData.images.map((img, i) => (
                  <div
                    key={i}
                    className="relative aspect-square rounded-2xl overflow-hidden border-2 border-orange-400/70 shadow-sm"
                  >
                    <img src={img} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          images: formData.images.filter((_, idx) => idx !== i),
                        })
                      }
                      className="absolute top-1 right-1 bg-rose-500 text-white p-1.5 rounded-full shadow-lg transition-transform active:scale-75 hover:bg-rose-600"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}

                {/* 🎯 3. กรอบเส้นปะ (ลูกเล่นอัจฉริยะ) */}
                {/* ถ้ายังไม่มีรูป: จะกางเป็นกล่องใหญ่ กว้างเต็มจออยู่ตรงกลาง */}
                {/* ถ้ามีรูปแล้ว: จะหดตัวเป็นกล่องสี่เหลี่ยมจัตุรัสเล็กๆ ไปต่อท้ายรูป และเปลี่ยนสีกรอบเส้นประ ตัวอักษร*/}
                {formData.images.length < 6 && (
                  <label 
                    className={`border-2 border-dashed border-slate-100/80 bg-slate-800/40 hover:bg-slate-500/50 hover:border-orange-500 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95 group hover:border-orange-500 hover:bg-orange-500/10 hover:shadow-[0_0_20px_rgba(249,115,22,0.3)]
                    ${formData.images.length === 0 ? 'w-full h-36' : 'aspect-square'}`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Camera size={formData.images.length === 0 ? 50 : 38} className="text-emerald-400 mb-2 group-hover:text-orange-400 transition-colors" />
                    <span className={`font-bold tracking-widest transition-colors ${formData.images.length === 0 ? 'text-[15px] text-slate-300 group-hover:text-orange-300' : 'text-[11px] text-emerald-500 group-hover:text-orange-400'}`}>
                      {formData.images.length === 0 ? 'คลิกเพื่อเพิ่มรูปภาพ' : 'เพิ่มรูป'}
                    </span>
                  </label>
                )}
              </div>
            </div>
            {/* ================= จบจุดที่ให้วางทับตรงนี้ ================= */}


            {/* ================= เปลี่ยนสีปุ่มและเรืองแสง ของปุ่มสีส้มยื่นยันแจ้งซ่อม และปุ่มล้างข้อมูลฟอร์ม================= */}
            </div>
          </div>
          <div className="pt-6 px-2 flex flex-col items-center text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="group w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-yellow-400 hover:shadow-[0_0_25px_rgba(249,115,22,0.8)] hover:-translate-y-1 text-white font-black text-xl py-4 rounded-[1rem] shadow-xl shadow-orange-500/30 active:scale-95 transition-all duration-300 flex justify-center items-center gap-3 disabled:grayscale disabled:opacity-50 border-2 border-solid border-white-500/50 over:from-orange-400 hover:to-yellow-400 hover:shadow-[0_0_25px_rgba(249,115,22,0.8)] hover:-translate-y-1"
            >
              <Send size={24} />{' '}
              <span className="tracking-wide">ยืนยันแจ้งซ่อม</span>
            </button>
            <button
              type="button"
              onClick={handleResetForm}
              className="mt-4 w-full bg-emerald-600 text-white-300 hover:bg-rose-600 hover:text-white hover:shadow-[0_0_20px_rgba(244,63,94,0.6)] font-bold text-[15px] py-3.5 rounded-2xl flex items-center justify-center gap-2 border-2 border-solid border-white-500/50 active:scale-95 shadow-sm hover:bg-rose-500 hover:text-white hover:shadow-[0_0_15px_rgba(244,63,94,0.6)] hover:-translate-y-1"
            >
              <RotateCcw size={16} /> ล้างข้อมูลฟอร์ม
            </button>
          </div>
        </form>
      )}
      {/* ================= จบการแก้สีปุ่มยืนยันแจ้งซ่อมกับปุ่มล้างข้อมูลฟอร์มตรงนี้ ================= */}


      {confirmSubmitModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-6 animate-in fade-in">
          <div className="bg-white border border-slate-100 rounded-[3rem] w-full max-w-xs overflow-hidden shadow-2xl p-8 text-center space-y-5">
            <div className="w-20 h-20 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto border border-orange-100 shadow-inner relative">
              <div className="absolute inset-0 border-4 border-orange-500 rounded-full border-t-transparent animate-spin opacity-20"></div>
              <CheckSquare size={36} className="animate-pulse" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">
              ยืนยันข้อมูล?
            </h3>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              โปรดตรวจสอบรายละเอียดให้ถูกต้อง
              <br />
              ก่อนส่งข้อมูลเข้าระบบ
            </p>
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setConfirmSubmitModal(false)}
                className="flex-1 py-3.5 rounded-2xl font-bold text-slate-500 bg-slate-100 active:scale-95 transition-all"
              >
                ยกเลิก
              </button>
              <button
                onClick={executeSubmit}
                className="flex-[1.5] py-3.5 rounded-2xl font-black text-white bg-orange-500 shadow-lg shadow-orange-500/40 active:scale-95 transition-all"
              >
                ยืนยันส่งข้อมูล
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderTracking = () => (
    <div className="p-4 space-y-6 pb-32 animate-in slide-in-from-left-4 duration-500 text-left">
      {/* 🌟 1. สวิตช์กรองสถานะงาน (แยกร่างกล่อง แก้ปัญหา Scrollbar ทับเส้นขอบ) */}
      <div className="bg-slate-800/60 rounded-2xl border-2 border-solid border-orange-500/80 shadow-inner mb-4">

        <div className="flex gap-2.5 overflow-x-auto pt-3 pb-4 px-3 snap-x">
          {[
            { id: 'all', label: 'ทั้งหมด' },
            { id: 'pending', label: 'รอดำเนินการ' },
            { id: 'fixing', label: 'กำลังซ่อม' },
            { id: 'completed', label: 'เสร็จสิ้น' },
            { id: 'cancelled', label: 'ยกเลิก' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => {
                setFilterStatus(f.id);
                setSearchTerm('');
              }}
              className={`flex-1 min-w-[95px] shrink-0 text-[13px] font-black py-2.5 rounded-xl transition-all duration-300 snap-center ${
                filterStatus === f.id

                //🌟 เปลี่ยนสีปุ่มกดและเรืองแสงทั้งหมด รอดำเนินการ กำลังซ่อม หน้าติดตามสถานะ/จัดการงาน

                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-2 border-orange-300 shadow-[0_0_15px_rgba(249,115,22,0.8)] scale-105 z-10' // ปุ่มที่กด (สีส้ม)
                  : 'bg-rose-500/60 text-white border-2 border-white/80 hover:border-white hover:bg-emerald-800 shadow-sm hover:shadow-[0_0_15px_rgba(255,255,255,0.4)] hover:-translate-y-1' // ปุ่มปกติ (ขอบขาว)
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

      </div>

      <div className="relative sticky top-0 z-20 py-2">
        <Search
          size={18}
          className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-50 border-2 border-orange-500 focus:border-orange-600 focus:ring-2 focus:ring-orange-800/30 shadow-inner transition-all font-bold text-slate-800 pl-14 pr-5 py-3.5 rounded-2xl outline-none"
          placeholder="ค้นหา รหัส หรือ อุปกรณ์..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-sans">
        {isDataLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 opacity-80">
            <Loader2 size={40} className="animate-spin mb-4" />
            <p className="font-bold text-xs uppercase tracking-widest">
              Loading...
            </p>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="text-center py-16 text-slate-400 flex flex-col items-center">
            <CheckCircle size={50} className="mx-auto mb-4 opacity-20" />
            <p className="font-bold text-lg">ไม่มีรายการ</p>
            <p className="text-xs mt-1">ในสถานะที่คุณเลือก</p>
          </div>
        ) : (
          filteredTickets.map((t) => {
            const isPending = t.status === 'pending';
            const isFixing = [
              'acknowledged',
              'in_progress',
              'on_hold',
            ].includes(t.status);
            const isDone = t.status === 'completed' || t.status === 'verified';
            const isCancelled = t.status === 'cancelled';

            const fixingMin = getMinutesDiff(t.startedAt || t.date, sysTime);
            const waitingMin = getMinutesDiff(t.date, sysTime);

            const styleColor = isPending
              ? 'border-rose-500 text-rose-600 bg-rose-50'
              : isDone
              ? 'border-emerald-500 text-emerald-600 bg-emerald-50'
              : isCancelled
              ? 'border-slate-400 text-slate-500 bg-slate-50'
              : t.status === 'on_hold'
              ? 'border-purple-500 text-purple-600 bg-purple-50'
              : 'border-orange-500 text-orange-600 bg-orange-50';
              const statusLabel = isPending
              ? 'รอดำเนินการ'
              : t.status === 'acknowledged'
              ? 'รับทราบแล้ว'
              : t.status === 'in_progress'
              ? 'กำลังซ่อม'
              : t.status === 'on_hold'
              ? 'แจ้งขัดข้อง'
              : isCancelled
              ? 'ยกเลิกแล้ว'
              : t.status === 'verified'
              ? '✅ เสร็จสิ้นสมบูรณ์'
              : '⏳ รอผู้แจ้งยืนยัน';

            return (
              <div
                key={t.dbId || t.id}
                className={`bg-white rounded-[1rem] border-l-[6px] ${
                  styleColor.split(' ')[0]
                } overflow-hidden shadow-sm border-t border-r border-b border-2 border-orange-400/70 transition-all ${
                  isCancelled ? 'opacity-70' : ''
                }`}
              >
                <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <span className="text-[13px] font-mono text-emerald-600 bg-emerald-100 px-3 py-1 rounded-lg font-black tracking-widest border border-emerald-200">
                        {String(t.id)}
                      </span>
                      {t.isOutOfHours && (
                        <span className="ml-2 text-[10px] font-black text-rose-600 bg-rose-100 border border-rose-200 px-2 py-0.5 rounded-md animate-pulse">
                          SSC (นอกเวลา)
                        </span>
                      )}
                    </div>
                    <div
                      className={`px-3 py-1 rounded-lg text-[15px] font-bold border border-2 border-solid border-orgeen-400 shadow-sm flex items-center gap-1.5 ${styleColor}`}
                    >
                      {isPending && (
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></div>
                      )}
                      {statusLabel}
                    </div>
                  </div>
                  <h3
                    className={`text-lg font-black mb-1.5 leading-tight ${
                      isCancelled
                        ? 'text-slate-400 line-through'
                        : 'text-slate-800'
                    }`}
                  >
                    {String(t.equipment)}
                  </h3>
                  {/* 🌟 แยกอาคารกับห้องออกเป็น 2 บรรทัด (แก้ปัญหาล้นจอมือถือ) */}
      <div className="flex flex-col gap-1 mt-1.5 mb-3 bg-indigo-50/50 p-2 rounded-lg border border-indigo-100">
        
        {/* บรรทัดที่ 1: ชื่ออาคาร เปลี่ยนสีตัวอักษร*/}
        <div className="flex items-start gap-1.5 text-orange-600/90">
          <Building size={18} className="shrink-0 mt-0.5" />
          <span className="text-[18px] font-bold leading-snug">
            {t.building || 'ไม่ระบุอาคาร'}
          </span>
        </div>
        
        {/* บรรทัดที่ 2: ชื่อห้อง (เยื้องขวาเข้ามานิดนึงให้ดูสวย) */}
        <div className="flex items-start gap-1.5 text-indigo-500/90">
          <MapPin size={18} className="shrink-0 mt-0.5" />
          <span className="text-[15px] font-bold  leading-snug">
            ห้อง: {t.room || 'ไม่ระบุห้อง'}
          </span>
        </div>
        
      </div>
                  {!isCancelled && (
                      <div className="mt-5 pl-4 border-2 border-orange-400/70 space-y-4 py-2 relative">
                        
                        {/* 🌟 1. เวลารอคอย (Active เฉพาะตอน isPending) */}
                        <div className="relative">
                          <div
                            className={`absolute -left-[21px] w-2.5 h-2.5 rounded-full ${
                              isPending
                                ? 'bg-rose-500 ring-4 ring-rose-100 animate-pulse'
                                : 'bg-slate-300'
                            }`}
                          ></div>
                          <div className="flex justify-between items-center pl-2">
                            <span className={`text-[13px] font-black ${isPending ? 'text-rose-500' : 'text-slate-400'}`}>
                              เวลารอคอย
                            </span>
                            <span
                              className={`text-[13px] font-bold font-mono tracking-tighter ${
                                isPending ? 'text-rose-600' : 'text-slate-400'
                              }`}
                            >
                              {getLiveStopwatch(t.date, t.acceptedAt, sysTime)}
                            </span>
                          </div>
                        </div>

                        {/* 🌟 2. เวลาปฏิบัติงาน (Active เฉพาะตอน isFixing) */}
                        <div className="relative">
                          <div
                            className={`absolute -left-[21px] w-2.5 h-2.5 rounded-full ${
                              isFixing
                                ? 'bg-orange-500 ring-4 ring-orange-100 animate-pulse'
                                : 'bg-slate-300'
                            }`}
                          ></div>
                          <div className="flex justify-between items-center pl-2">
                            <span className={`text-[13px] font-black ${isFixing ? 'text-orange-500' : 'text-slate-400'}`}>
                              เวลาปฏิบัติงาน
                            </span>
                            <span
                              className={`text-[13px] font-bold font-mono tracking-tighter ${
                                isFixing && t.status !== 'on_hold'
                                  ? 'text-orange-600'
                                  : 'text-slate-400'
                              }`}
                            >
                              {t.startedAt
                                ? getLiveStopwatch(
                                    t.startedAt,
                                    t.completedAt,
                                    sysTime,
                                    t.totalPauseMs || 0,
                                    t.status === 'on_hold',
                                    t.lastHoldAt
                                  )
                                : '00:00:00'}
                            </span>
                          </div>
                        </div>


                        {/* 🌟 3. เวลารวม (Active เฉพาะตอน isDone) */}
                        <div className="relative">
                          <div
                            className={`absolute -left-[21px] w-2.5 h-2.5 rounded-full ${
                              isDone
                                ? 'bg-emerald-500 ring-4 ring-emerald-100'
                                : 'bg-slate-300'
                            }`}
                          ></div>
                          <div className="flex justify-between items-center pl-2">
                            <span className={`text-[13px] font-black ${isDone ? 'text-emerald-500' : 'text-slate-400'}`}>
                              เวลารวม
                            </span>
                            <span
                              className={`text-[13px] font-bold font-mono tracking-tighter ${
                                isDone ? 'text-emerald-600' : 'text-slate-400'
                              }`}
                            >
                              {getLiveStopwatch(
                                t.date,
                                t.completedAt,
                                sysTime,
                                t.totalPauseMs || 0,
                                t.status === 'on_hold',
                                t.lastHoldAt
                              )}
                            </span>
                          </div>
                        </div>

                      </div>
                    )}
                </div>
{/* ================= กล่องสรุปเวลาปฏิบัติงาน (SLA Summary) แบบอัจฉริยะ เปลี่ยนสีตัวอักษรภายในกรอบ SLA ================= */}
{t.status === 'completed' || t.status === 'verified' ? (
              <div className="bg-emerald-50 border-2 border-emerald-500/30 rounded-2xl p-4 mt-4 mb-4 shadow-sm">
                
                {/* 🌟 ฟันธง: ส่วนประมวลผล SLA อัตโนมัติ (ซ่อนไว้ประมวลผล ไม่โชว์บนหน้าจอ) */}
                {(() => {
                   const startMs = new Date(t.date).getTime();
                   const endMs = new Date(t.completedAt).getTime();
                   let netDurationMs = endMs - startMs - (t.holdDuration || 0);
                   
                   // 💡 ตั้งค่าสมมติเกณฑ์ SLA ตรงนี้ครับ (ปัจจุบันตั้งไว้ที่ 4 ชั่วโมง)
                   const slaLimitHours = 4; 
                   const slaLimitMs = slaLimitHours * 60 * 60 * 1000; 
                   
                   const isSLAPassed = netDurationMs <= slaLimitMs; // ประเมินผลว่าผ่านหรือไม่

                   return (
                     <>
                        {/* 🎯 ป้ายประเมินอัตโนมัติ (อัปเกรดความคมชัด + ไอคอนเรืองแสง) เปลี่ยนสีและตัวอักษรและปุ่ม */}
                        {/* ส่วนหัว และ ป้ายผ่าน/ไม่ผ่าน */}
                        <div className="flex items-start justify-between mb-3 border-b border-emerald-500/20 pb-4">
                          <div className="flex items-center gap-2 mt-1">
                            <Clock size={18} className="text-emerald-600" />
                            <span className="text-[14px] font-black text-orange-500 uppercase tracking-widest">สรุป SLA</span>
                          </div>
                          
                          {/* 🎯 ป้ายประเมินอัตโนมัติ (ฟันธง: ดันป้ายขึ้นด้วย -mt-1 และลดความอ้วนลงนิดนึง) */}
                          <div className={`px-2.5 py-1 rounded-full text-[11px] font-black tracking-widest flex items-center gap-1.5 border-2 shadow-lg -mt-1 ${
                            isSLAPassed 
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-emerald-300 shadow-emerald-500/40' 
                              : 'bg-gradient-to-r from-rose-500 to-red-500 text-white border-rose-300 shadow-rose-500/40'
                          }`}>
                            {isSLAPassed ? (
                              <>
                                <CheckCircle size={14} className="text-white drop-shadow-md" strokeWidth={3} />
                                <span className="drop-shadow-sm mt-0.5">ผ่านเกณฑ์</span>
                              </>
                            ) : (
                              <>
                                <XCircle size={14} className="text-white animate-pulse drop-shadow-md" strokeWidth={3} />
                                <span className="drop-shadow-sm mt-0.5">เกินเวลา SLA</span>
                              </>
                            )}
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-[13px]">
                          <div className="flex justify-between items-center">
                            <span className="text-rose-800/90 font-semibold">เริ่มแจ้งซ่อมเมื่อ:</span>
                            <span className="text-rose-800/90 font-black">{new Date(t.date).toLocaleString('th-TH')}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-emerald-800/90 font-semibold">ซ่อมเสร็จสิ้นเมื่อ:</span>
                            <span className="text-emerald-800/90 font-black">
                               {t.completedAt ? new Date(t.completedAt).toLocaleString('th-TH') : '-'}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-baseline pt-2 mt-2 border-t border-emerald-500/20">
                            <span className="text-emerald-900 font-black">ระยะเวลาที่ใช้จริง:</span>
                            {/* สีตัวเลขเปลี่ยนตามผลประเมิน (ผ่าน=เขียว, ไม่ผ่าน=แดง) */}
                            <span className={`text-[18px] font-black drop-shadow-sm ${isSLAPassed ? 'text-emerald-600' : 'text-rose-600'}`}>
                              {calculateDuration(t.date, t.completedAt, t.holdDuration || 0)}
                            </span>
                          </div>
                          
                          {/* หมายเหตุโชว์เกณฑ์ที่ใช้ประเมิน */}
                          <div className="text-right text-[12px] text-rose-800 font-bold">
                            * ประเมินจากเกณฑ์ชั่วคราว: ภายใน {slaLimitHours} ชั่วโมง
                          </div>
                          
                          {t.holdDuration > 0 && (
                            <div className="mt-2 bg-rose-50 border border-rose-200 p-2 rounded-lg flex justify-between items-center">
                               <span className="text-rose-600 text-[11px] font-bold">⚠️ หักเวลารออะไหล่:</span>
                               <span className="text-rose-700 text-[12px] font-mono font-bold">{Math.floor(t.holdDuration / (1000 * 60 * 60))} ชม.</span>
                            </div>
                          )}
                        </div>
                     </>
                   );
                })()}
              </div>
            ) : null}
            {/* ================= จบกล่องสรุป SLA ================= */}

               {/* ================= ลากคลุมดำวางทับตั้งแต่บรรทัดนี้ ================= */}
               <div className="p-5 space-y-4">
                      <div className="bg-slate-50 p-4 rounded-2xl border-2 border-solid border-slate-400 shadow-inner relative">
                        
                        {t.status === 'cancelled' && t.cancelReason && (
                          <div className="bg-rose-50 text-rose-700 p-3 rounded-xl text-xs font-bold mb-3 flex gap-2 border border-rose-200 shadow-sm">
                            <XCircle size={16} className="shrink-0 mt-0.5" />
                            <div>
                              <span className="block mb-0.5 text-rose-800">
                                เหตุผลที่ยกเลิก:
                              </span>
                              {String(t.cancelReason)}
                            </div>
                          </div>
                        )}
                        
                        {t.holdReason && (
                          <div className="bg-purple-50 text-purple-700 p-3 rounded-xl text-xs font-bold mb-3 flex gap-2 border border-purple-200 shadow-sm">
                            <PauseCircle size={16} className="shrink-0 mt-0.5" />
                            <div>
                              <span className="block mb-0.5 text-purple-800">
                                แจ้งเหตุขัดข้อง:
                              </span>
                              {String(t.holdReason)}
                            </div>
                          </div>
                        )}
                        
                        {t.cause && (
                          <div className="bg-emerald-50 text-emerald-700 p-3 rounded-xl text-xs font-bold mb-3 flex gap-2 border-2 border-solid border-emerald-400 shadow-sm">
                            <CheckSquare size={16} className="shrink-0 mt-0.5" />
                            <div>
                              <span className="block mb-0.5 text-emerald-800">
                                สรุปผลและข้อแนะนำ:
                              </span>
                              {String(t.cause)}
                            </div>
                          </div>
                        )}

                        {t.sscNote && (
                          <div className="bg-rose-50 text-rose-700 p-3 rounded-xl text-xs font-bold mb-3 flex gap-2 border border-rose-200 shadow-sm">
                            <Wrench size={16} className="shrink-0 mt-0.5" />
                            <div>
                              <span className="block mb-0.5 text-rose-800 uppercase tracking-widest text-[10px]">
                                บันทึกการแก้ไขเบื้องต้น (เวร SSC):
                              </span>
                              {String(t.sscNote)}
                            </div>
                          </div>
                        )}

                        {t.images && t.images.length > 0 && (
                          <div className="flex gap-2 overflow-x-auto mb-3 pb-2 scrollbar-hide">
                            {t.images.map((img, i) => (
                              <img
                                key={i}
                                src={img}
                                onClick={() => setLightboxImg(img)}
                                className="w-16 h-16 object-cover rounded-xl border border-2 border-orange-400/70 shrink-0 cursor-pointer shadow-sm"
                              />
                            ))}
                          </div>
                        )}
                        
                        {/* 🌟 ฟันธง: เพิ่มหัวข้อให้รู้ว่านี่คืออาการเสีย */}
                        <div className="mt-4 mb-1">
                          <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                            <AlertCircle size={12} className="text-rose-400" /> อาการเสียที่แจ้ง:
                          </span>
                          <p className={`text-[16px] font-black mt-1.5 leading-relaxed pl-1 ${
                            isCancelled ? 'text-slate-400 line-through' : 'text-rose-600 drop-shadow-sm'
                          }`}>
                            "{String(t.description)}"
                          </p>
                        </div>
                        
                        {t.assetNumber && (
                          <p className="text-[12px] text-slate-500 font-mono mt-3">
                            <span className="font-bold text-slate-400">
                              Asset No:
                            </span>{' '}
                            {t.assetNumber}
                          </p>
                        )}

                        {/* ================= โซนชื่อผู้แจ้ง และ ผู้รับผิดชอบ (อัปเกรดรีดพื้นที่ขั้นสุด) ================= */}
                        <div className="pt-3 border-t border-2 border-orange-400/70 flex flex-col gap-2 mt-3 text-xs text-slate-600">
                          
                          {/* 🌟 1. ดึงขอบซ้ายขวาให้ชิดขึ้นด้วย -mx-1 และลดช่องว่างตรงกลางเหลือ gap-1 */}
                          <div className="flex justify-between items-start gap-1 -mx-1 sm:mx-0">
                            <div className="flex flex-col flex-1 min-w-0 pl-1">
                              <span className="text-[11px] font-bold text-green-600 mb-1">
                                ผู้แจ้งปัญหา
                              </span>
                              <span className="font-bold text-orange-800 flex items-start gap-1 leading-tight mb-1">
                                <User size={14} className={`shrink-0 mt-0.5 ${isCancelled ? 'text-slate-400' : 'text-emerald-500'}`} />
                                {/* 🌟 ใช้ tracking-tight ช่วยบีบช่องไฟตัวอักษรนิดนึง */}
                                <span className="whitespace-normal break-words leading-snug tracking-tight">
                                  {String(t.reporter)}
                                </span>
                              </span>
                              <span className="text-[12px] font-bold text-blue-600 mt-1 pl-1">
                                {formatDateTimeString(t.date)}
                              </span>
                            </div>
                            
                            {/* 🌟 บีบปุ่มโทรศัพท์ให้บางลง (px-1.5) และบีบตัวเลขให้ชิดกัน (tracking-tighter) */}
                            <a
                              href={`tel:${String(t.reporterContact).replace(/\D/g, '')}`}
                              className="font-mono shrink-0 whitespace-nowrap text-[11px] sm:text-[12px] font-bold bg-emerald-50 px-1.5 py-1.5 rounded-lg flex items-center gap-1 text-emerald-700 border border-emerald-200 mt-4 tracking-tighter"
                            >
                              <Phone size={12} className="text-emerald-500" />
                              {formatDisplayPhone(t.reporterContact)}
                            </a>
                          </div>

                          {t.techName && (
                            <div className="flex justify-between items-start gap-1 mt-2 pt-2 border-t border-slate-100 -mx-1 sm:mx-0">
                              <div className="flex flex-col flex-1 min-w-0 pl-1">
                                <span className="text-[11px] font-bold text-orange-600 mb-2">
                                  ผู้รับผิดชอบ
                                </span>
                                <span className="font-bold text-indigo-600 flex items-start gap-1 leading-tight">
                                  <User size={14} className="text-orange-500 shrink-0 mt-0.5" />
                                  <span className="whitespace-normal break-words tracking-tight">
                                    {String(t.techName)}
                                  </span>
                                </span>
                              </div>
                              {t.techPhone && t.techPhone !== '-' && t.techPhone !== 'N/A' ? (
                                <a
                                  href={`tel:${String(t.techPhone).replace(/\D/g, '')}`}
                                  className="font-mono shrink-0 whitespace-nowrap text-[11px] sm:text-[12px] font-bold bg-orange-50 px-1.5 py-1.5 rounded-lg flex items-center gap-1 text-orange-700 border border-orange-200 mt-4 tracking-tighter"
                                >
                                  <Phone size={12} className="text-orange-500" />
                                  {formatDisplayPhone(t.techPhone)}
                                </a>
                              ) : (
                                <span className="font-mono shrink-0 whitespace-nowrap text-[11px] text-slate-400 bg-white px-1.5 py-1 rounded border border-slate-200 mt-4">
                                  {String(t.techPhone || 'N/A')}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        {/* ================= จบโซนชื่อ ================= */}
                      </div>

                      {/* ================= โซนปุ่มกด (ช่าง) เปลี่ยนสีปุ่มรับงานซ่อม ================= */}

                      {currentUserRole === 'technician' && !isCancelled && (
                        <div className="flex flex-col gap-2.5">
                          {isPending && (
                            <button
                              onClick={() =>
                                setActionModal({
                                  isOpen: true,
                                  ticketId: t.id,
                                  type: 'accept',
                                })
                              }
                              className="w-full bg-gradient-to-r from-emerald-400 to-emerald-800 text-white border-2 border-solid border-orange-500 font-bold py-4 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:shadow-[0_0_25px_rgba(16,185,129,0.6)] active:scale-95 transition-all text-[22px] hover:shadow-[0_0_25px_rgba(16,185,129,0.8)] hover:brightness-110 hover:-translate-y-1"
                            >
                              รับงานซ่อม
                            </button>
                          )}

                          {(t.status === 'pending' || t.status === 'acknowledged') &&
                            t.isOutOfHours &&
                            !t.sscNote && (
                              <button
                                onClick={() =>
                                  setActionModal({
                                    isOpen: true,
                                    ticketId: t.id,
                                    type: 'ssc',
                                  })
                                }
                                className="w-full bg-gradient-to-r from-orange-400 to-orange-500 text-white border border-orange-300 font-bold py-3.5 rounded-xl shadow-[0_0_15px_rgba(249,115,22,0.4)] hover:shadow-[0_0_25px_rgba(249,115,22,0.6)] active:scale-95 transition-all text-sm"
                              >
                                บันทึกเวร SSC
                              </button>
                            )}

                          {t.status === 'acknowledged' && (
                            <button
                              onClick={() =>
                                updateTicketStatus(t.id, {
                                  status: 'in_progress',
                                  startedAt: new Date().toISOString(),
                                })
                                //เปลี่ยนสีปุ่มและตัวอักษรปุ่มเริ่มดำเนินการซ่อม
                              }
                              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border border-emerald-400 font-bold py-3.5 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:shadow-[0_0_25px_rgba(16,185,129,0.6)] active:scale-95 transition-all text-[15px] hover:shadow-[0_0_25px_rgba(16,185,129,0.8)] hover:brightness-110 hover:-translate-y-1"
                            >
                              เริ่มดำเนินการซ่อม
                            </button>
                          )}

                          {(t.status === 'in_progress' || t.status === 'on_hold') && (
                            <div className="flex gap-2.5">
                              <button
                                onClick={() => {
                                  if (t.status === 'on_hold') {
                                    const pauseDurationMs =
                                      new Date().getTime() -
                                      new Date(t.lastHoldAt).getTime();
                                    updateTicketStatus(t.id, {
                                      status: 'in_progress',
                                      totalPauseMs:
                                        (t.totalPauseMs || 0) + pauseDurationMs,
                                      lastHoldAt: null,
                                    });
                                  } else {
                                    setActionModal({
                                      isOpen: true,
                                      ticketId: t.id,
                                      type: 'hold',
                                    });
                                  }
                                }}

                                //เปลี่ยนสีปุ่ม ขนาดตัวอักษรแจ้งขัดข้อง
                                className="flex-1 bg-gradient-to-r from-orange-400 to-orange-500 text-white border border-orange-300 font-bold py-3.5 rounded-xl shadow-[0_0_15px_rgba(249,115,22,0.4)] hover:shadow-[0_0_25px_rgba(249,115,22,0.6)] active:scale-95 transition-all text-[15px] hover:shadow-[0_0_25px_rgba(249,115,22,0.8)] hover:brightness-110 hover:-translate-y-1"
                              >
                                {t.status === 'on_hold' ? 'ดำเนินการต่อ' : 'แจ้งขัดข้อง'}
                              </button>
                              <button
                                onClick={() =>
                                  setActionModal({
                                    isOpen: true,
                                    ticketId: t.id,
                                    type: 'finish',
                                  })
                                }
                                className="flex-[1.5] bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border border-emerald-400 font-bold py-3.5 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:shadow-[0_0_25px_rgba(16,185,129,0.6)] active:scale-95 transition-all text-[15px] hover:shadow-[0_0_25px_rgba(16,185,129,0.8)] hover:brightness-110 hover:-translate-y-1"
                              >
                                ปิดงานซ่อม
                                </button>
                            </div>
                          )}

                          {/* 🌟🌟 ฟันธง: แทรกปุ่มดึงงานกลับ (Undo) ตรงนี้ครับ 🌟🌟 */}
                          {t.status === 'completed' && (
                            <button
                              onClick={() => updateTicketStatus(t.id, { 
                                status: 'in_progress', 
                                completedAt: null, 
                                cause: null 
                              })}
                              className="w-full bg-orange-100 text-orange-800 border-2 border-orange-400 font-bold py-3.5 rounded-xl hover:bg-orange-100 hover:text-orange-800 active:scale-95 transition-all text-[15px] shadow-sm flex justify-center items-center gap-2 mt-3 hover:shadow-[0_0_15px_rgba(249,115,22,0.4)]"
                            >
                              <RotateCcw size={18} className="animate-spin-slow" /> ดึงงานกลับมาแก้ไขผลการซ่อม
                            </button>
                          )}

                        </div>
                      )}

                      {/* ================= โซนปุ่มกด (ผู้แจ้ง) ================= */}

                      {/* ================= โซนปุ่มกด (ผู้แจ้ง) ================= */}
                      {currentUserRole === 'reporter' && !isCancelled && (
                        <div className="flex flex-col gap-2.5">
                          {isPending && (
                            <div className="flex flex-col gap-2.5">
                              {waitingMin > 60 && (
                                <div className="bg-green-600/20 border-2 border-solid border-orange-800 text-rose-600 text-[12px] font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 mb-1">
                                  <AlertTriangle size={14} className="animate-pulse shrink-0" />
                                  รอดำเนินการเกิน 1 ชั่วโมง (SLA Breach)
                                </div>
                              )}
                              <div className="flex gap-2">
                                <button
                                  onClick={() =>
                                    setActionModal({
                                      isOpen: true,
                                      ticketId: t.id,
                                      type: 'cancel',
                                    })
                                  }
                                  className="flex-[1] bg-orange text-rose-500 border border-orange-500 font-bold py-3.5 rounded-xl flex justify-center items-center gap-1.5 active:scale-95 text-[18px] transition-colors shadow-sm hover:bg-rose-50"
                                >
                                  <XCircle size={20} /> ยกเลิก
                                </button>
                                <a
                                  href="tel:0835293836"
                                  className="flex-[1.5] bg-gradient-to-r from-rose-500/80 to-orange-600 text-white border border-blue-400 text-[18px] font-bold py-4 rounded-2xl flex justify-center items-center gap-1.5 shadow-[0_0_15px_rgba(225,29,72,0.4)] hover:shadow-[0_0_25px_rgba(225,29,72,0.6)] active:scale-95 transition-all text-xs"
                                >
                                  <PhoneCall size={18} className="animate-pulse" />
                                  สายด่วน หน.ฝวด.
                                </a>
                              </div>
                            </div>
                          )}

                          {t.status === 'in_progress' && fixingMin > 5 * 24 * 60 && (
                            <div className="flex flex-col gap-2 mt-1">
                              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[13px] font-bold px-4 py-2.5 rounded-xl flex items-center gap-2">
                                <AlertTriangle size={14} className="animate-pulse shrink-0" />
                                ดำเนินการซ่อมเกินกำหนด 5 วัน (SLA Breach)
                              </div>
                              <a
                                href="tel:0835293836"
                                className="flex-[1.5] bg-gradient-to-r from-rose-500/80 to-orange-600 text-white border border-blue-400 text-[20px] font-bold py-4 rounded-2xl flex justify-center items-center gap-1.5 shadow-[0_0_15px_rgba(225,29,72,0.4)] hover:shadow-[0_0_25px_rgba(225,29,72,0.6)] active:scale-95 transition-all text-xs"
                              >
                                <PhoneCall size={16} className="animate-pulse" />
                                สายด่วนตามงาน (ฝวด.)
                              </a>
                            </div>
                          )}

                          {t.status === 'completed' && (
                            <button
                              onClick={() => updateTicketStatus(t.id, { status: 'verified' })}
                              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border border-emerald-400 font-bold py-4 rounded-xl flex justify-center items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:shadow-[0_0_25px_rgba(16,185,129,0.6)] active:scale-95 transition-all"
                            >
                              <ThumbsUp size={18} /> ยืนยันผลการซ่อมบำรุง
                            </button>
                          )}
                          
                          {t.status === 'verified' && (
                            <div className="w-full bg-emerald-50 border border-emerald-200 py-3.5 rounded-xl flex justify-center items-center gap-2 text-emerald-600 font-bold text-xs shadow-inner">
                              <CheckCircle size={16} /> เสร็จสิ้นสมบูรณ์
                            </div>
                          )}
                        </div>
                      )}

                    </div>
                  </div>
                );
              })
            )}
          </div>
          {/* ================= สิ้นสุดการวางทับ ================= */}

      {/* 🛠️ Action Modals */}
      {actionModal.isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-5 animate-in fade-in text-center">
          <div className="bg-white border border-2 border-orange-400/70rounded-[2rem] w-full max-w-xs overflow-hidden shadow-2xl">
            <div
              className={`p-4 font-black text-center text-sm flex items-center justify-center gap-2 ${
                actionModal.type === 'hold'
                  ? 'bg-purple-600 text-white'
                  : actionModal.type === 'finish'
                  ? 'bg-emerald-600 text-white'
                  : actionModal.type === 'cancel'
                  ? 'bg-rose-500 text-white'
                  : actionModal.type === 'ssc'
                  ? 'bg-rose-500 text-white'
                  : 'bg-emerald-500 text-white'
              }`}
            >
              {actionModal.type === 'accept'
                ? 'วิศวกร / ผู้รับผิดชอบ'
                : actionModal.type === 'cancel'
                ? 'ยืนยันการยกเลิก'
                : actionModal.type === 'finish'
                ? 'บันทึกผลการซ่อมแซม'
                : actionModal.type === 'hold'
                ? 'ระบุเหตุขัดข้อง'
                : actionModal.type === 'ssc'
                ? 'บันทึกเวร SSC'
                : 'บันทึกข้อมูล'}
            </div>
            <div className="p-6 space-y-4">
              {actionModal.type === 'accept' ? (
                <select
                  value={selectedTech}
                  onChange={(e) => setSelectedTech(e.target.value)}
                  className="w-full bg-slate-50 text-slate-800 border-2 border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 shadow-inner font-bold appearance-none text-center rounded-xl p-3.5 outline-none cursor-pointer"
                >
                  <option value="" disabled>
                    -- เลือกวิศวกร หรือผู้รับผิดชอบ --
                  </option>
                  {technicianList.map((tech) => (
                    <option key={tech.name} value={tech.name}>
                      {tech.name}
                    </option>
                  ))}
                </select>
              ) : (
                <textarea
                  value={actionText}
                  onChange={(e) => setActionText(e.target.value)}
                  className="w-full bg-slate-50 text-slate-800 border-2 border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 rounded-xl p-4 shadow-inner outline-none resize-none font-medium"
                  placeholder="ระบุรายละเอียด..."
                  rows={4}
                />
              )}
              {/* 🟢 ปุ่มยืนยันเดียว สีส้มเรืองแสง */}
              <button
                onClick={executeActionModal}
                disabled={
                  actionModal.type === 'accept'
                    ? !selectedTech
                    : !actionText.trim()
                }
                className="w-full py-3.5 rounded-xl font-bold active:scale-95 text-white shadow-md shadow-orange-500/30 transition-all disabled:opacity-50 disabled:grayscale bg-orange-500 hover:bg-orange-600 tracking-widest uppercase"
              >
                {actionModal.type === 'finish'
                  ? 'ยืนยันบันทึกผล'
                  : 'ยืนยันการบันทึก'}
              </button>
              <button
                onClick={() =>
                  setActionModal({ isOpen: false, ticketId: null, type: null })
                }
                className="w-full py-3.5 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all mt-3 shadow-sm"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-slate-900 md:max-w-5xl max-w-md mx-auto relative overflow-hidden text-slate-100 font-sans shadow-2xl border-x border-slate-800 select-none">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20 mix-blend-screen"
        style={{ backgroundImage: "url('/bg-earth.webp')" }}
      ></div>

      {/* 🔮 แสงเรืองแสงอวกาศตามโหมด (ดึงให้สว่างและลอยขึ้นมาเป็น Lens Flare) */}
      <div
        className={`fixed -top-10 -left-10 w-80 h-80 rounded-full blur-3xl opacity-70 pointer-events-none z-0 mix-blend-screen transition-colors duration-1000 ${
          currentUserRole === 'technician' ? 'bg-emerald-500' : 'bg-orange-500'
        }`}
      ></div>
      <div
        className={`fixed top-1/2 -right-20 w-72 h-72 rounded-full blur-3xl opacity-50 pointer-events-none z-0 mix-blend-screen transition-colors duration-1000 ${
          currentUserRole === 'technician' ? 'bg-teal-500' : 'bg-amber-500'
        }`}
      ></div>
      {lightboxImg && (
        <div
          className="fixed inset-0 z-[200] bg-slate-900/90 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in"
          onClick={() => setLightboxImg(null)}
        >
          <button className="absolute top-6 right-6 text-white bg-white/10 p-2 rounded-full active:bg-white/20">
            <X size={24} />
          </button>
          <img
            src={lightboxImg}
            alt="Zoomed"
            className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl border-2 border-white/20"
          />
        </div>
      )}

      {emailNotify && (
        <div className="absolute top-24 left-4 right-4 z-[100] bg-emerald-50 text-emerald-700 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in slide-in-from-top-4 border border-emerald-200">
          <Mail size={18} className="text-emerald-500 shrink-0" />
          <span className="text-[10px] font-bold leading-tight">
            {emailNotify}
          </span>
        </div>
      )}

      {/* 🚀 Dynamic Header (อัปเกรด: แบนเนอร์พร้อมน้องมาสคอต 3D ด้านขวา) */}
      {/* 🚀 Dynamic Header (อัปเกรด: แบนเนอร์พร้อมน้องมาสคอต ยืดหดอัจฉริยะ) */}
      <div className={`bg-slate-900/50 backdrop-blur-xl pl-5 pr-4 py-3 flex items-center justify-between sticky top-4 z-50 border-2 border-solid border-orange-500 rounded-2xl mt-4 transition-all duration-500 shadow-[0_0_15px_rgba(249,115,22,0.4)] ${activeTab === 'report' ? 'mx-auto w-[calc(100%-2rem)] md:max-w-2xl' : 'mx-4'}`}>
        
        {/* 🌟 โซนซ้าย: ไอคอนทางการ และ ชื่อหน้า */}
        <div className="flex items-center gap-3.5 z-10">
          <div className="bg-white w-14 h-14 rounded-2xl shadow-md text-orange-500 border-2 border-solid border-orange-300 flex items-center justify-center shrink-0">
            {activeTab === 'dashboard' ? (
              <LayoutDashboard size={32} strokeWidth={2.5} />
            ) : activeTab === 'report' ? (
              <PlusCircle size={32} strokeWidth={2.5} />
            ) : currentUserRole === 'technician' ? (
              <Wrench size={32} strokeWidth={2.5} />
            ) : (
              <ClipboardCheck size={32} strokeWidth={2.5} />
            )}
          </div>
          
          {/* 🌟 2. ข้อความหัวข้อ (ลดขนาดลง และเปลี่ยนสีให้สว่างสบายตา) */}
          <div>
            {/* 💡 ฟันธงจุดที่แก้ไข:
               1. เปลี่ยน text-orange-600 -> เป็น text-white (สีขาวสว่าง) หรือ text-orange-400 (สีส้มทองอ่อนๆ)
               2. เปลี่ยน text-3xl -> เป็น text-2xl (เล็กลง 1 สเต็ปให้พอดีกรอบ)
            */}
            <h1 className="font-black text-white text-2xl tracking-widest leading-none drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)] py-1 whitespace-nowrap">
              {activeTab === 'dashboard'
                ? 'แผงควบคุม'
                : activeTab === 'report'
                ? 'แจ้งซ่อม'
                : currentUserRole === 'technician'
                ? 'จัดการงานซ่อม'
                : 'ติดตามสถานะ'}
            </h1>
          </div>
        </div>

        {/* 🌟 โซนขวา: น้องมาสคอต GISTDA แอบมอง (3D Peeking Effect) */}
        <div className="relative w-12 h-14 shrink-0 z-0 pointer-events-none">
           {/* 💡 ทริค: ถ้าอนาคตท่านมีรูปมาสคอตหลายท่าทาง 
             สามารถใส่เงื่อนไขแบบด้านล่างนี้ได้เลยครับ ตอนนี้ใช้รูป /mascot.webp ไปก่อน 
           */}
           <img 
             src={
               activeTab === 'dashboard' ? "/mascot.webp" :
               activeTab === 'report' ? "/mascot.webp" : // อนาคตเปลี่ยนเป็น /mascot-report.webp ได้
               "/mascot.webp"
             }
             alt="GSE Mascot" 

             // ดันรูปให้ทะลุกรอบออกมานิดนึง เกิดเป็นเอฟเฟกต์ 3 มิติ
             className="absolute bottom-[-10px] right-[-10px] w-[65px] max-w-none h-auto object-contain drop-shadow-[0_5px_5px_rgba(0,0,0,0.4)]"
           />
        </div>

      </div>

      <div className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden w-full scrollbar-hide pb-28">
        {activeTab === 'dashboard' &&
          currentUserRole === 'technician' &&
          renderDashboard()}
        {activeTab === 'report' && renderReport()}
        {activeTab === 'tracking' && renderTracking()}
      </div>

      {/* 🧭 Navigation Bar (ฟันธง: ขยายกรอบให้กว้างเท่า Header ด้านบนเฉพาะจอ PC) */}
      {/* 🧭 Navigation Bar (ฟันธง: ขยายและหดกรอบอัจฉริยะตามหน้าจอที่เปิดใช้งาน) */}
      <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-[416px] p-3 bg-slate-900/50 backdrop-blur-xl border-2 border-solid border-orange-500 rounded-xl z-[100] transition-all duration-500 shadow-[0_0_15px_rgba(249,115,22,0.4)] ${activeTab === 'report' ? 'md:max-w-2xl' : 'md:max-w-[992px]'}`}>
      <div className="max-w-md mx-auto flex justify-evenly items-center relative">
          {/* 🏠 ปุ่ม HOME */}
          <button
            onClick={onGoHome}
            className="flex flex-col items-center justify-center transition-all duration-300 w-24 group scale-100 hover:scale-110 hover:-translate-y-2"
          >
            <div className="p-3 rounded-full mb-1 transition-all duration-300 bg-transparent text-slate-300 group-hover:bg-gradient-to-b group-hover:from-orange-400 group-hover:to-orange-600 group-hover:text-white group-hover:shadow-[0_0_15px_rgba(249,115,22,0.8)]">
              <Home
                size={26}
                className="group-hover:stroke-[2.5px] transition-all"
              />
            </div>
            <span className="text-[13px] tracking-widest transition-colors font-bold text-slate-300 group-hover:text-white group-hover:drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]">
              หน้าแรก
            </span>
          </button>

          {/* ================= โหมดผู้แจ้ง (Reporter) ================= */}
          {currentUserRole === 'reporter' && (
            <>
              {/* 🟠 ปุ่มแจ้งซ่อม */}
              <button
                onClick={() => setActiveTab('report')}
                className={`flex flex-col items-center justify-center transition-all duration-300 w-24 group ${
                  activeTab === 'report'
                  ? 'scale-110'
                  : 'scale-100 hover:scale-110'
                }`}
              >
                <div
                  className={`p-3 rounded-full mb-1 transition-all duration-300 ${
                    activeTab === 'report'
                      ? 'bg-gradient-to-b from-orange-400 to-orange-600 text-white shadow-[0_0_20px_rgba(249,115,22,0.8)] border-[2px] border-solid border-white'
                      : 'bg-transparent text-slate-300 group-hover:bg-gradient-to-b group-hover:from-orange-400 group-hover:to-orange-600 group-hover:text-white group-hover:shadow-[0_0_15px_rgba(249,115,22,0.8)]'
                  }`}
                >
                  <PlusCircle
                    size={26}
                    className={
                      activeTab === 'report'
                        ? 'stroke-[2.5px]'
                        : 'group-hover:stroke-[2.5px]'
                    }
                  />
                </div>
                <span
                  className={`text-[13px] tracking-widest transition-colors ${
                    activeTab === 'report'
                      ? 'text-orange-400 font-black drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]'
                      : 'text-slate-300 font-bold group-hover:text-white group-hover:drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]'
                  }`}
                >
                  แจ้งซ่อม
                </span>
              </button>

              {/* 🟠 ปุ่มติดตามสถานะ */}
              <button
                onClick={() => {
                  setActiveTab('tracking');
                  setSearchTerm('');
                }}
                className={`flex flex-col items-center justify-center transition-all duration-300 w-24 group ${
                  activeTab === 'tracking'
                  ? 'scale-110'
                  : 'scale-100 hover:scale-110'
                }`}
              >
                <div
                  className={`p-3 rounded-full mb-1 transition-all duration-300 ${
                    activeTab === 'tracking'
                      ? 'bg-gradient-to-b from-orange-400 to-orange-600 text-white shadow-[0_0_20px_rgba(249,115,22,0.8)] border-[2px] border-solid border-white'
                      : 'bg-transparent text-slate-300 group-hover:bg-gradient-to-b group-hover:from-orange-400 group-hover:to-orange-600 group-hover:text-white group-hover:shadow-[0_0_15px_rgba(249,115,22,0.8)]'
                  }`}
                >
                  <ClipboardCheck
                    size={26}
                    className={
                      activeTab === 'tracking'
                        ? 'stroke-[2.5px]'
                        : 'group-hover:stroke-[2.5px]'
                    }
                  />
                </div>
                <span
                  className={`text-[13px] tracking-widest transition-colors ${
                    activeTab === 'tracking'
                      ? 'text-orange-400 font-black drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]'
                      : 'text-slate-300 font-bold group-hover:text-white group-hover:drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]'
                  }`}
                >
                  ติดตามสถานะ
                </span>
              </button>
            </>
          )}

          {/* ================= โหมดช่าง (Technician) ================= */}
          {currentUserRole === 'technician' && (
            <>
              {/* 🟠 ปุ่มแผงควบคุม */}
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex flex-col items-center justify-center transition-all duration-300 w-24 group ${
                  activeTab === 'dashboard'
                  ? 'scale-110'
                  : 'scale-100 hover:scale-110'
                }`}
              >
                <div
                  className={`p-3 rounded-full mb-1 transition-all duration-300 ${
                    activeTab === 'dashboard'
                      ? 'bg-gradient-to-b from-orange-400 to-orange-600 text-white shadow-[0_0_20px_rgba(249,115,22,0.8)] border-[2px] border-solid border-white'
                      : 'bg-transparent text-slate-300 group-hover:bg-gradient-to-b group-hover:from-orange-400 group-hover:to-orange-600 group-hover:text-white group-hover:shadow-[0_0_15px_rgba(249,115,22,0.8)]'
                  }`}
                >
                  <LayoutDashboard
                    size={26}
                    className={
                      activeTab === 'dashboard'
                        ? 'stroke-[2.5px]'
                        : 'group-hover:stroke-[2.5px]'
                    }
                  />
                </div>
                <span
                  className={`text-[13px] tracking-widest transition-colors ${
                    activeTab === 'dashboard'
                      ? 'text-orange-400 font-black drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]'
                      : 'text-slate-300 font-bold group-hover:text-white group-hover:drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]'
                  }`}
                >
                  แผงควบคุม
                </span>
              </button>

              {/* 🟠 ปุ่มจัดการงานซ่อม */}
              <button
                onClick={() => setActiveTab('tracking')}
                className={`flex flex-col items-center justify-center transition-all duration-300 w-24 group ${
                  activeTab === 'tracking'
                  ? 'scale-110'
                  : 'scale-100 hover:scale-110'
                }`}
              >
                <div
                  className={`p-3 rounded-full mb-1 transition-all duration-300 ${
                    activeTab === 'tracking'
                      ? 'bg-gradient-to-b from-orange-400 to-orange-600 text-white shadow-[0_0_20px_rgba(249,115,22,0.8)] border-[2px] border-solid border-white'
                      : 'bg-transparent text-slate-300 group-hover:bg-gradient-to-b group-hover:from-orange-400 group-hover:to-orange-600 group-hover:text-white group-hover:shadow-[0_0_15px_rgba(249,115,22,0.8)]'
                  }`}
                >
                  <Wrench
                    size={26}
                    className={
                      activeTab === 'tracking'
                        ? 'stroke-[2.5px]'
                        : 'group-hover:stroke-[2.5px]'
                    }
                  />
                </div>
                <span
                  className={`text-[13px] tracking-widest transition-colors ${
                    activeTab === 'tracking'
                      ? 'text-orange-400 font-black drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]'
                      : 'text-slate-300 font-bold group-hover:text-white group-hover:drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]'
                  }`}
                >
                  จัดการงาน
                </span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
// ==========================================
// 🌟 Landing Page - ฉบับบังคับสี Hex (เส้นส้มต้องมา!)
// ==========================================
function LandingPage({ onStart }) {
  const [showManual, setShowManual] = useState(false); // 🌟 เพิ่มบรรทัดนี้
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden bg-slate-900 font-sans">
      {/* 1. ภาพพื้นหลังลูกโลก - คมชัด 60% */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-30 pointer-events-none"
        style={{ backgroundImage: "url('/bg-earth.webp')" }}
      ></div>

      <div className="relative z-10 w-full max-w-md flex flex-col items-center animate-in slide-in-from-bottom-8 fade-in duration-1000">
        {/* 🟠 บังคับเส้นสีส้มล้อมกรอบใหญ่ */}
        {/* 🌟 ฟันธงจุดที่ 1: เปลี่ยนจาก p-8 เป็น py-8 px-4 (ลดขอบซ้ายขวาด้านในลง เพื่อเพิ่มพื้นที่ตรงกลาง) */}
        <div
          className="py-8 px-4 rounded-[1.5rem] shadow-[0_0_80px_rgba(0,0,0,0.6)] flex flex-col items-center text-center w-full relative backdrop-blur-[2px]"
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.35)',
            border: '4px solid #f97316',
          }}
        >
          {/* โลโก้ */}
          <div
            className="w-24 h-24 bg-white rounded-full p-2 -mt-5 mb-2 flex items-center justify-center shadow-xl border-4 border-solid border-orange-500"
            style={{ boxShadow: 'inset 0 0 0 4px #10b981' }}
          >
            <img
              src="/logo-gistda.webp"
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </div>

          {/* ชื่อระบบ */}
          <h1 className="text-3xl font-black text-white mb-1 drop-shadow-md">
            ระบบแจ้งซ่อม
          </h1>
          <h2 className="text-[15px] font-bold text-orange-400 uppercase mb-0.5">
            ฝ่ายวิศวกรรมระบบปฏิบัติการดาวเทียม
          </h2>
          <h3 className="text-xs font-bold text-slate-300 tracking-widest">
            สำนักปฏิบัติการดาวเทียม
          </h3>

          {/* 🌟 โซนน้องมาสคอต + กล่องคำพูด */}
          <div className="relative w-full mt-20 mb-6 flex items-start justify-end min-h-[180px]">
            
            {/* 👩‍🔧 น้องมาสคอต */}
            {/* 🌟 ฟันธงจุดที่ 2: ดันมาสคอตไปซ้ายสุดๆ จาก -25px เป็น -35px */}
            <div className="absolute left-[-35px] bottom-0 z-20 w-[100%] max-w-[180px] pointer-events-none drop-shadow-[0_15px_15px_rgba(0,0,0,0.8)]">
              <img
                src="/mascot.webp"
                alt="Mascot"
                className="w-full h-auto object-contain object-bottom hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* 💬 กล่องคำพูด (Speech Bubble สีขาว) */}
            {/* 🌟 ฟันธงจุดที่ 3: ขยายกล่องจาก w-[56%] เป็น w-[65%] เพื่อให้ข้อความไม่ตกบรรทัด */}
            <div className="relative z-10 w-[55%] -mt-16 -mr-1 bg-white rounded-3xl p-3.5 shadow-[0_0_30px_rgba(255,255,255,0.2)] text-left border-2 border-slate-100">
              {/* 🔺 ติ่งลูกศรชี้ */}
              <svg
                className="absolute -left-4 top-6 w-5 h-7 -z-10"
                viewBox="0 0 20 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 1 L2 14 L20 27"
                  fill="#ffffff"
                  stroke="#f1f5f9"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>

              {/* ข้อความในกล่องคำพูด */}
              {/* 🌟 ฟันธง: แก้ไขการขึ้นบรรทัดใหม่ ให้ดูเป็นธรรมชาติ */}
              <p className="text-[13px] font-bold text-slate-700 leading-relaxed relative z-20">
                ระบบมีปัญหาใช่มั้ยคะ?
                <br />
                <span className="text-red-500 font-black text-[13px] mt-1 inline-block drop-shadow-sm whitespace-nowrap">
                  กดแจ้งซ่อมได้เลย! 👇
                </span>
              </p>
            </div>
          </div>

          {/* 4. กลุ่มปุ่มกด */}
          <div className="w-full flex flex-col gap-4 -mt-5 relative z-30">
            {/* 🟠 ปุ่มที่ 1 */}
            <button
              onClick={() => onStart('reporter')}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-[19px] py-5 rounded-2xl flex items-center justify-center gap-3 border-2 border-white shadow-xl shadow-orange-500/30 active:scale-95 transition-all"
            >
              <Wrench size={28} className="drop-shadow-md" />{' '}
              แจ้งซ่อมระบบ/อุปกรณ์
            </button>

            {/* 🟢 ปุ่มวิศวกร/ทีมช่าง */}
            <button
              onClick={() => onStart('technician')}
              className="w-full bg-green-600/40 hover:bg-orange-500/60 text-yellow-300 font-black text-lg py-4 rounded-2xl border-2 border-white-500/50 flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all"
            >
              <Settings size={25} className="text-emerald-500" />{' '}
              สำหรับเจ้าหน้าที่ ฝวด.
            </button>

            {/* ⚪ ปุ่มคู่มือ */}
            <button
            onClick={() => setShowManual(true)} 
            className="w-full bg-rose-600/40 hover:bg-slate-500/60 text-white text-[18px] font-bold py-4 rounded-2xl border-2 border-white-500/40 flex items-center justify-center gap-3 shadow-sm"
            >
            <FileText size={20} /> คู่มือการใช้งานเบื้องต้น
            </button>
          </div>
        </div>

        {/* 5. Footer - แก้ไขเป็นพิมพ์เล็ก (ลบ uppercase ออกแล้ว) */}
        <div className="mt-8 text-center opacity-80">
          <p className="text-[10px] font-mono text-white tracking-widest font-bold normal-case">
            ©2026 Ground System Engineering Division: GSE
          </p>
          <p className="text-[9px] font-bold text-white mt-1 text-center normal-case">
            Satellite Operation Office: SOO
          </p>
          <p className="text-[9px] font-bold text-white mt-1 text-center normal-case">
            Geo-Informatics and Space Technology Development Agency: GISTDA
          </p>
        </div>
      </div>
      {/* 🌟 หน้าต่าง Popup คู่มือ */}
      {showManual && (
        <div className="fixed inset-0 z-[200] bg-slate-900/90 flex flex-col items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-slate-800 border-2 border-orange-500 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
            <div className="p-4 bg-slate-900 flex justify-between items-center border-b border-slate-700">
              <h3 className="text-white font-bold tracking-widest">คู่มือการใช้งาน</h3>
              <button onClick={() => setShowManual(false)} className="text-rose-500 hover:text-rose-400 bg-rose-500/10 p-1.5 rounded-full">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 overflow-y-auto space-y-4">
              {/* เปลี่ยนชื่อไฟล์รูปตรง src ให้ตรงกับของท่าน */}
              <img src="/manual-1.png" alt="คู่มือผู้แจ้ง" className="w-full rounded-xl shadow-md border border-slate-600" />
              <img src="/manual-2.png" alt="คู่มือช่าง" className="w-full rounded-xl shadow-md border border-slate-600" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 🚀 ส่วนควบคุมระบบ (App Component)
// ==========================================
export default function App() {
  // 🌟 ฟันธง: ลบความจำเบราว์เซอร์ออก กำหนดค่าเริ่มต้นเป็น false เสมอ 
  // เปิดแอปใหม่ปุ๊บ จะต้องเห็นหน้า Landing Page ทุกครั้ง 1,000,000%
  const [hasStarted, setHasStarted] = useState(false);
  const [role, setRole] = useState('reporter');

  const handleStart = (selectedRole) => {
    setRole(selectedRole);
    setHasStarted(true);
  };

  const handleGoHome = () => {
    setHasStarted(false);
  };

  return (
    <ErrorBoundary>
      {hasStarted ? (
        <MainApp onGoHome={handleGoHome} initialRole={role} />
      ) : (
        <LandingPage onStart={handleStart} />
      )}
    </ErrorBoundary>
  );
}