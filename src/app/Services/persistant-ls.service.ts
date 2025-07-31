import { Injectable, OnInit } from '@angular/core';
import { User, userRole } from '../Models/user-model';
import { TeamMember, AttendanceRecord,attendanceStatus } from '../Models/attendance-model';

@Injectable({
  providedIn: 'root'
})

export class PersistantLsService{

  private USERS_KEY = 'users';
  private TEAM_KEY = 'teamMembers';
  private LOGIN_KEY = 'loggedInUser';

  constructor() {
    this.initialize();
  }

  initialize(): void {
    if (!localStorage.getItem(this.USERS_KEY)) {
      localStorage.setItem(this.USERS_KEY, JSON.stringify(this.initialUsers));
    }
    if (!localStorage.getItem(this.TEAM_KEY)) {
      localStorage.setItem(this.TEAM_KEY, JSON.stringify(this.initialTeamMembers));
    }
    this.trimAndAddToday();
  }

  // Users
  getUsers(): User[] {
    return JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
  }
  saveUsers(u: User[]): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(u));
  }

  // Team Members
  getTeamMembers(): TeamMember[] {
    return JSON.parse(localStorage.getItem(this.TEAM_KEY) || '[]');
  }
  saveTeamMembers(m: TeamMember[]): void {
    localStorage.setItem(this.TEAM_KEY, JSON.stringify(m));
  }

  // Logged-in User
  setLoggedInUser(u: User): void {
    localStorage.setItem(this.LOGIN_KEY, JSON.stringify(u));
  }
  getLoggedInUser(): User | null {
    const data = localStorage.getItem(this.LOGIN_KEY);
    return data ? JSON.parse(data) : null;
  }
  removeLoggedInUser(): void {
    localStorage.removeItem(this.LOGIN_KEY);
  }

  // Update today's record + trim to last 7 dates
  trimAndAddToday(): void {
    const today = new Date().toLocaleString('en-CA').split(',')[0];
    const members = this.getTeamMembers();
    const updated = members.map(m => {
      const att = m.attendance.filter(r => new Date(r.date) >= new Date(new Date(today).setDate(new Date(today).getDate() - 6)));
      if (!att.find(r => r.date === today)) {
        att.push({ date: today, status: 'Present' });
      }
      return { ...m, attendance: att };
    });
    this.saveTeamMembers(updated);
  }

  // Default Data
  private initialUsers: User[] = [
    { id: 1, name: 'Abi', role: 'TeamLead' },
    { id: 2, name: 'Nivi', role: 'TeamMember' },
    { id: 3, name: 'Aadhi', role: 'TeamMember' },
    { id: 4, name: 'Sam', role: 'TeamLead' },
  ];

  private initialTeamMembers: TeamMember[] = [
    {
      id: 1,
      name: 'Abi',
      role: 'TeamLead',
      department: 'Engineering',
      attendance: Array.from({ length: 7 }).map((_, i) => ({
        date: this.dateOffset(-i),
        status: ['Present','Present','WFH','Leave','Leave','WFH','Present'][i] as attendanceStatus
      }))
    },

    {
      id: 2,
      name: 'Nivi',
      role: 'TeamMember',
      department: 'QA',
      attendance: Array.from({ length: 7 }).map((_, i) => ({
        date: this.dateOffset(-i),
        status: ['Present','Present','WFH','Leave','Leave','WFH','Present'][i] as attendanceStatus
      }))
    },
    {
      id: 3,
      name: 'Aadhi',
      role: 'TeamMember',
      department: 'Support',
      attendance: Array.from({ length: 7 }).map((_, i) => ({
        date: this.dateOffset(-i),
        status: ['Present','Present','WFH','Leave','Leave','WFH','Present'][i] as attendanceStatus
      }))
    },
    {
      id: 4,
      name: 'Sam',
      role: 'TeamLead',
      department: 'Engineering',
      attendance: Array.from({ length: 7 }).map((_, i) => ({
        date: this.dateOffset(-i),
        status: ['Present','Present','WFH','Leave','Leave','WFH','Present'][i] as attendanceStatus
      }))
    },
  ];

  private dateOffset(offset: number): string {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return d.toLocaleString('en-CA').split(',')[0];
  }
}
