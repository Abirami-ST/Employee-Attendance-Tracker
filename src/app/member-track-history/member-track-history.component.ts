import { ChangeDetectionStrategy,Component } from '@angular/core';
import { PersistantLsService } from '../Services/persistant-ls.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';
import { TeamMember } from '../Models/attendance-model';

@Component({
  selector: 'app-member-track-history',
  templateUrl: './member-track-history.component.html',
  styleUrl: './member-track-history.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MemberTrackHistoryComponent {
  
  member: TeamMember | undefined;
  isTeamLead: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ls: PersistantLsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const members = this.ls.getTeamMembers();
    this.member = members.find(m => m.id === id);
    this.isTeamLead = this.authService.isTeamLead();
  }

  saveChanges(): void {
    if (!this.member) return;

    const members = this.ls.getTeamMembers();
    const index = members.findIndex(m => m.id === this.member!.id);
    if (index !== -1) {
      members[index] = this.member;
      this.ls.saveTeamMembers(members);
      alert('Attendance updated successfully!');
      this.router.navigate(['/dashboard']);
    }
  }

  goBack(): void {
    if (this.isTeamLead) {
      this.router.navigate(['/dashboard']);
    } else {
      this.authService.logout();
    }
  }
}
