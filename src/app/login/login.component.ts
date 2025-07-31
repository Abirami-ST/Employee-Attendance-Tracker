import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';
import { PersistantLsService } from '../Services/persistant-ls.service';
import { User } from '../Models/user-model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  users = this.ls.getUsers();
  selectedName = ''; 
  selectedRole: 'TeamLead' | 'TeamMember'  | '' = '';
  error = '';

  constructor(private auth: AuthService, private ls: PersistantLsService) {}

  ngOnInit(): void {
    this.ls.initialize();
  }

  login(): void {
    if (!this.auth.login(this.selectedName, this.selectedRole)) {
      this.error = 'Invalid user/role';
    }
  }
}
