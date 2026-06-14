// ==========================================
// 🌟 คลังข้อมูลระบบ (System Data) - สมบูรณ์ 100%
// ==========================================

export const employeeList = [
    // ฝ่ายวิศวกรรมระบบปฏฺิบัติการดาวเทียม (ฝวด.)
    { name: 'นายนวัตกรณ์ ไก่แก้ว', position: 'หัวหน้าฝ่าย', department: 'ฝวด.' },
    { name: 'นายทศพล ชินนิวัฒน์', position: 'วิศวกรชำนาญการ', department: 'ฝวด.' },
    { name: 'นายประมินทร์ พิชิตการค้า', position: 'วิศวกร', department: 'ฝวด.' },
    { name: 'นายนรัตว์ ศรีสวัสดิ์พงษ์', position: 'วิศวกร', department: 'ฝวด.' },
    { name: 'นายธนกาญจน์ ไตรปิฎก', position: 'นักเทคโนโลยีอวกาศ', department: 'ฝวด.' },
    { name: 'นายชุติพงษ์ ลาวงศ์เกิด', position: 'นักเทคโนโลยีอวกาศ', department: 'ฝวด.' },
    { name: 'น.ส.จินวะรา สุรัตนกุล', position: 'วิศวกร', department: 'ฝวด.' },
    { name: 'น.ส.พิชชาภรณ์ อัมพรายน์', position: 'วิศวกร', department: 'ฝวด.' },
    { name: 'น.ส.ฐิตาภรณ์ ทองคำภา', position: 'เจ้าหน้าที่พัฒนาธุรกิจ', department: 'ฝวด.' },
  
    // ฝ่ายปฏิบัติการควบคุมดาวเทียม (ฝปค.)
    { name: 'นายเสกสรร จัตุรัส', position: 'หัวหน้าฝ่าย', department: 'ฝปค.' },
    { name: 'นายอัฐราวุฒิ เดชผล', position: 'วิศวกรชำนาญการ', department: 'ฝปค.' },
    { name: 'น.ส.จารุณี ขุนจันทร์', position: 'วิศวกรชำนาญการ', department: 'ฝปค.' },
    { name: 'น.ส.พันทิพย์ภา บุญสมพงษ์', position: 'วิศวกร', department: 'ฝปค.' },
    { name: 'นายอาทิตย์ ศิริขันธ์', position: 'นักเทคโนโลยีอวกาศ', department: 'ฝปค.' },
    { name: 'นายประกาศิต อุดมธนะธีระ', position: 'วิศวกร', department: 'สปท.' },
    { name: 'นายโกวิทย์ พุ่มกิ่ง', position: 'วิศวกร', department: 'สปท.' },
    { name: 'น.ส.รพิรัตน์ ฤทธิ์รณศักดิ์', position: 'วิศวกร', department: 'ฝปค.' },
  
    // ฝา่ยปฏิบัติการข้อมูลดาวเทียม (ฝปด.)
    { name: 'ว่าที่ ร.ต. วรธันย์ วิชาคุณ', position: 'หัวหน้าฝ่าย', department: 'ฝปด.' },
    { name: 'นายประสิทธิ์ มากสิน', position: 'นักเทคโนโลยีอวกาศชำนาญการ', department: 'ฝปด.' },
    { name: 'นายวิชญ์ภาส ดรบัณฑิต', position: 'นักเทคโนโลยีอวกาศ', department: 'ฝปด.' },
    { name: 'น.ส.เข็มทราย ปีกสันเทียะ', position: 'นักเทคโนโลยีอวกาศ', department: 'ฝปด.' },
    { name: 'น.ส.กนกวรรณ กัณหะกิติ', position: 'นักเทคโนโลยีอวกาศ', department: 'ฝปด.' },
    { name: 'น.ส.ศิรินทรา อินทร์ถนอม', position: 'นักเทคโนโลยีอวกาศ', department: 'ฝปด.' },
    { name: 'นายประโยชน์ ปวงจักร์ทา', position: 'นักเทคโนโลยีอวกาศชำนาญการ', department: 'ฝปด.' },
    { name: 'น.ส.ภาวรินทร์ คูหา', position: 'นักเทคโนโลยีอวกาศ', department: 'ฝปด.' },
    { name: 'นายประวุฒิ ดิษาภิรมย์', position: 'วิศวกร', department: 'ฝปด.' },
   
    // ฝ่ายบริการทดสอบและประกอบดาวเทียม
    { name: 'น.ส.บุษยมาศ เพชรทอง', position: 'หัวหน้าฝ่าย', department: 'ฝบท.' },
    { name: 'นายจิโรจ ทองตา', position: 'วิศวกร', department: 'ฝบท.' },
    { name: 'นายศรัณย์ นันทะชมภู', position: 'วิศวกร', department: 'ฝบท.' },
    { name: 'นายปิยภัทร เขียวเจริญ', position: 'วิศวกร', department: 'ฝบท.' },
    { name: 'น.ส.อโณทัย นิ่มน้อย', position: 'นักพัฒนานวัตกรรม', department: 'สปท.' }
  ];
  
  export const techMapping = {
    "ภารกิจด้านจานสายอากาศ": { name: "นายทศพล ชินนิวัฒน์", phone: "08-1513-7854" },
    "ภารกิจด้านคอมพิวเตอร์แม่ข่าย-THEOS-2": { name: "นายธนกาญจน์ ไตรปิฎก", phone: "06-2463-5544" },
    "ภารกิจด้านคอมพิวเตอร์แม่ข่าย-THEOS": { name: 'นายชุติพงษ์ ลาวงศ์เกิด', phone: '09-8938-9839' },
    "ภารกิจด้านโครงสร้างพื้นฐานไฟฟ้า": { name: "นายประมินทร์ พิชิตการค้า", phone: "08-1135-1599" },
    "ภารกิจด้านการให้บริการโครงการ SSC": { name: "นายนรัตว์ ศรีสวัสดิ์พงษ์", phone: "08-6361-4399" }
  };
  
  export const equipmentCategories = {
    'ภารกิจด้านจานสายอากาศ': [
      'Antenna-KRATOS', 'Antenna-VIASAT', 'Antenna-Comtech', 'Antenna-Orbital', 'Antenna-7.3m.', 'Satellites Receiving System'
    ],
    'ภารกิจด้านคอมพิวเตอร์แม่ข่าย-THEOS': [
      'THEOS-DPF', 'THEOS-STORNEXT', 'THEOS-CGS', 'THEOS-FDS', 'THEOS-MPC', 'RS2-AMS/PGS/CUDOS', 'RS2-DAS/NSART/FTD', 'JPSS/MODIS', 'Cosmo-SkyMED'
    ],
    'ภารกิจด้านคอมพิวเตอร์แม่ข่าย-THEOS-2': [
      'THEOS2-IGS', 'THEOS2-MGS', 'THEOS2-CGS', 'THEOS2-FDS', 'THEOS2-GIPS'
    ],
    'ภารกิจด้านโครงสร้างพื้นฐานไฟฟ้า': [
      'UPS-120kVA-VIASAT', 'UPS-120kVA-Building-1', 'UPS-120kVA-Building-2', 'UPS-250kVA-KRATOS', 'Precision-AIR/HVAC-1', 'Precision-AIR/HVAC-2', 'Generator-650kVA', 'Generator-350kVA', 'FM-200-Building-1', 'FM-200-Building-2', 'Grounding-Lightning'
    ],
    "ภารกิจด้านการให้บริการโครงการ SSC": [
      "Antenna-7.3m", "Antenan-QZSS", "S3EE-SKP Station", "S3EE-CMI Station", "S3EE-UBN Station", "S3EE-UDN Station"
    ]
  };
  
  export const buildingList = [
    'อาคาร สถานีดาวเทียม', 'อาคาร Centrarium', 'อาคาร AIT', 'อาคาร SI', 'ฐานจาน-VIASAT', 'ฐานจาน-KRATOS', 'ฐานจาน-Orbital', 'ฐานจาน-CGC', 'Shellter-7.3m'
  ];
  
  export const technicianList = [
    { name: 'นายนวัตกรณ์ ไก่แก้ว', phone: '08-3529-3836', photo: '/korn.webp' },
    { name: 'นายทศพล ชินนิวัฒน์', phone: '08-1513-7854', photo: '/tos.webp' },
    { name: 'นายนรัตว์ ศรีสวัสดิ์พงษ์', phone: '08-6361-4399', photo: '/narat.webp' },
    { name: 'นายประมินทร์ พิชิตการค้า', phone: '08-1135-1599', photo: '/pramin.webp' },
    { name: 'นายธนกาญจน์ ไตรปิฎก', phone: '06-2463-5544', photo: '/karn.webp' },
    { name: 'นายชุติพงษ์ ลาวงศ์เกิด', phone: '09-8938-9839', photo: '/neng.webp' },
    { name: 'น.ส.จินวะรา สุรัตนกุล', phone: '08-2480-2280', photo: '/jun.webp' },
    { name: 'น.ส.พิชชาภรณ์ อัมพรายน์', phone: '08-6351-3420', photo: '/่jun.webp' },
    { name: 'น.ส.ฐิตาภรณ์ ทองคำภา', phone: '09-4232-6437', photo: '/่jun.webp' },
    { name: 'นายวิชญ์ภาส ดรบัณฑิต', phone: '09-1415-5194', photo: '/top.webp' }
  ];
  
  export const fixedHolidays = {
    "01-01": "วันขึ้นปีใหม่", "04-06": "วันจักรี", "04-13": "วันสงกรานต์", "04-14": "วันสงกรานต์",
    "04-15": "วันสงกรานต์", "05-04": "วันฉัตรมงคล", "06-03": "วันเฉลิมฯ พระบรมราชินี",
    "07-28": "วันเฉลิมฯ ร.10", "08-12": "วันแม่แห่งชาติ", "10-13": "วันนวมินทรมหาราช",
    "10-23": "วันปิยมหาราช", "12-05": "วันพ่อแห่งชาติ", "12-10": "วันรัฐธรรมนูญ", "12-31": "วันสิ้นปี"
  };
  
  export const dynamicHolidays = {
    "2026": { 
      "01-02": "วันหยุดพิเศษ", "03-03": "วันมาฆบูชา", "05-13": "วันพืชมงคล",
      "06-01": "ชดเชยวันวิสาขบูชา", "07-29": "วันอาสาฬหบูชา", "07-30": "วันเข้าพรรษา", "12-07": "ชดเชยวันพ่อ"
    }
  };