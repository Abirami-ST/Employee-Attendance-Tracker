import { Injectable } from '@angular/core';
import { PersistantLsService } from './persistant-ls.service';
import { User } from '../Models/user-model';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private ls: PersistantLsService, private router: Router) {}

  login(name: string, role: string): boolean {
    const user = this.ls.getUsers().find(u => u.name === name && u.role === role);
    if (user) {
      this.ls.setLoggedInUser(user);
      this.ls.trimAndAddToday();
      if (role === 'TeamLead') this.router.navigate(['/dashboard']);
      else this.router.navigate([`/member/${user.id}`]);
      return true;
    }
    return false;
  }

  logout(): void {
    this.ls.removeLoggedInUser();
    this.router.navigate(['/login']);
  }

  getCurrentUser(): User | null {
    return this.ls.getLoggedInUser();
  }

  isTeamLead(): boolean {
    return this.getCurrentUser()?.role === 'TeamLead';
  }
}
