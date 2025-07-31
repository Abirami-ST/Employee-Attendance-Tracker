import { Component } from '@angular/core';
import { AuthService } from '../Services/auth.service';
import { User } from '../Models/user-model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
   user: User | null = null;

  constructor(public auth: AuthService) {
    this.user = this.auth.getCurrentUser();
  }
}
