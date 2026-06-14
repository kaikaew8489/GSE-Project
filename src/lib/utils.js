// ==========================================
// 🌟 กล่องเครื่องมือ (Utility Functions) - สมบูรณ์ 100%
// ==========================================

export const formatDateTimeString = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear() + 543} | ${d.toLocaleTimeString('th-TH', { hour12: false })} น.`;
  };
  
  export const getNextReqId = (tickets) => {
    const now = new Date();
    const yy = String(now.getFullYear()).slice(-2);
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const prefix = `GSE-${yy}${mm}-`; 
    if (!tickets || tickets.length === 0) return `${prefix}0001`;
    const currentMonthTickets = tickets.filter(t => String(t.id).startsWith(prefix));
    if (currentMonthTickets.length === 0) return `${prefix}0001`;
    const maxNum = currentMonthTickets.reduce((max, t) => {
      const numStr = String(t.id).replace(prefix, '');
      const num = parseInt(numStr, 10);
      return !isNaN(num) && num > max ? num : max;
    }, 0);
    return `${prefix}${String(maxNum + 1).padStart(4, '0')}`;
  };
  
  export const formatDisplayPhone = (phone) => {
    if (!phone || phone === '-' || phone === 'N/A') return phone;
    const cleaned = String(phone).replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `${cleaned.substring(0, 2)}-${cleaned.substring(2, 6)}-${cleaned.substring(6)}`;
    }
    return phone;
  };
  
  export const getMinutesDiff = (start, end) => {
    if (!start || !end) return 0;
    const diffMs = new Date(end).getTime() - new Date(start).getTime();
    return Math.max(0, Math.floor(diffMs / 60000));
  };
  
  export const formatMinutesToText = (totalMins) => {
    if (totalMins < 60) return `${totalMins} นาที`;
    const d = Math.floor(totalMins / 1440);
    const h = Math.floor((totalMins % 1440) / 60);
    const m = totalMins % 60;
    if (d > 0) return `${d} วัน ${h} ชั่วโมง ${m} นาที`;
    return `${h} ชั่วโมง ${m} นาที`;
  };
  
  export const calculateDuration = (start, end, holdMs = 0) => {
    if (!start || !end) return "รอดำเนินการ...";
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
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