export type attendanceStatus = 'Present' | 'Absent' | 'WFH' | 'Leave';

export interface AttendanceRecord {
  date: string; // 'YYYY-MM-DD'
  status: attendanceStatus;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  department: 'Engineering' | 'QA' | 'Support';
  attendance: AttendanceRecord[];
}