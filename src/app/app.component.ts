import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, Event as RouterEvent } from '@angular/router';
import { AuthService } from './Services/auth.service';
import { PersistantLsService } from './Services/persistant-ls.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'Employee-Attendance-AppTracker';

  constructor(public auth: AuthService, private ls:PersistantLsService, private router:Router) {}

  ngOnInit() {
    this.ls.trimAndAddToday();
    this.router.events
      .pipe(filter((event: RouterEvent): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (event.urlAfterRedirects === '/login') {
          this.auth.logout();
        }
      });
  }
}
