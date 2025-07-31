import { ChangeDetectionStrategy,Component, OnInit } from '@angular/core';
import { PersistantLsService } from '../Services/persistant-ls.service';
import { TeamMember, attendanceStatus } from '../Models/attendance-model';
import  Papa from 'papaparse';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit{

  teamMembers: TeamMember[] = [];
  filteredMembers: TeamMember[] = [];
  nameFilter = '';
  departmentFilter = '';
  attendanceFilter = '';
  today = new Date().toLocaleString('en-CA').split(',')[0];

  constructor(private ls: PersistantLsService, private router:Router) {}

  ngOnInit(): void {
    this.teamMembers = this.ls.getTeamMembers();
    this.applyFilters();
  }

  getTodayStatus(memberId: number): string {
    const member = this.teamMembers.find(m => m.id === memberId);
    if (!member) return 'N/A';

    const record = member.attendance.find(a => a.date === this.today);
    return record ? record.status : 'N/A';
  } 

  applyFilters(): void {
    this.filteredMembers = this.teamMembers.filter(member => {
      const nameMatch = member.name.toLowerCase().includes(this.nameFilter.toLowerCase());
      const deptMatch = this.departmentFilter
        ? member.department === this.departmentFilter
        : true;
      const todayStatus = member.attendance.find(a => a.date === this.today)?.status || '';
      const attendanceMatch = this.attendanceFilter
        ? todayStatus === this.attendanceFilter
        : true;

      return nameMatch && deptMatch && attendanceMatch;
    });
  }

  updateAttendance(id: number, status: attendanceStatus): void {
    const idx = this.teamMembers.findIndex(m => m.id === id);
    if (idx !== -1) {
      const attIdx = this.teamMembers[idx].attendance.findIndex(a => a.date === this.today);
      if (attIdx !== -1) {
        this.teamMembers[idx].attendance[attIdx].status = status;
      } else {
        this.teamMembers[idx].attendance.push({ date: this.today, status });
      }
    }
    this.applyFilters();
  }

  updateChanges(): void {
    this.ls.saveTeamMembers(this.teamMembers);
    alert('Attendance updated and saved!');
  }

  exportToCSV(): void {
    const csvData = this.teamMembers.map(member => ({
      Name: member.name,
      Role: member.role,
      Department: member.department,
      Attendance: member.attendance.find(a => a.date === this.today)?.status || 'N/A'
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `attendance-${this.today}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  goToAddMemberRoute(){
    //this.router.navigate([{ outlets: { primary:'', addPage: ['dashboard/add'] } }]);
    this.router.navigate(['/dashboard/add']);
  }
  goToEditMembersData(member:any){
    this.router.navigate(['/dashboard/edit', member.id])
  }

  goToViewHistory(memberId: number){
   this.router.navigate([`/member/${memberId}`]);
  }

//   debugAttendance() {
//   console.log('Today:', this.today);
//   console.log('Members:', this.ls.getTeamMembers());
//   //const today1 = new Date().toISOString().split('T')[0];
//   const today1 = new Date().toLocaleString('en-CA').split(',')[0];
//   console.log(today1);
//   const today = new Date();
//   console.log(today);
// }
}
