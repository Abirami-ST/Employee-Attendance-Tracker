import { ChangeDetectionStrategy,Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PersistantLsService } from '../Services/persistant-ls.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TeamMember, attendanceStatus } from '../Models/attendance-model';
import { User } from '../Models/user-model';

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrl: './add-member.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddMemberComponent implements OnInit{
  memberForm!: FormGroup;
  isEditMode = false;
  memberId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private ls: PersistantLsService
  ) {}

  ngOnInit(): void {
    this.memberForm = this.fb.group({
      name: ['', Validators.required],
      role: ['TeamMember', Validators.required],
      department: ['Engineering', Validators.required]
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.memberId = +id;
      const member = this.ls.getTeamMembers().find(m => m.id === this.memberId);
      if (member) {
        this.memberForm.patchValue({
          name: member.name,
          role: member.role,
          department: member.department
        });
      }
    }
  }

  onSubmit(): void {
    if (this.memberForm.invalid) return;

    const formValue = this.memberForm.value;
    const users = this.ls.getUsers();
    const members = this.ls.getTeamMembers();

    if (this.isEditMode) {
      const index = members.findIndex(m => m.id === this.memberId);
      if (index !== -1) {
        members[index] = {
          ...members[index],
          name: formValue.name,
          role: formValue.role,
          department: formValue.department
        };
      }

      const userIndex = users.findIndex(u => u.id === this.memberId);
      if (userIndex !== -1) {
        users[userIndex] = {
          id: this.memberId,
          name: formValue.name,
          role: formValue.role
        };
      }

      alert('Member details updated successfully!');

    } else {
      const newId = Math.max(...members.map(m => m.id), 0) + 1;
      const today = new Date().toLocaleString('en-CA').split(',')[0];

      const newMember: TeamMember = {
        id: newId,
        name: formValue.name,
        role: formValue.role,
        department: formValue.department,
        attendance: [
          {
            date: today,
            status: 'Absent' as attendanceStatus
          }
        ]
      };

      const newUser: User = {
        id: newId,
        name: formValue.name,
        role: formValue.role
      };

      members.push(newMember);
      users.push(newUser);

      alert(`${formValue.role === 'TeamLead' ? 'Team Lead' : 'Team Member'} added successfully!`);

      this.memberForm.reset({
        name: '',
        role: 'TeamMember',
        department: 'Engineering'
      });
    }

    this.ls.saveTeamMembers(members);
    this.ls.saveUsers(users);
    this.router.navigate(['/dashboard']);
  }
  
  cancel(): void {
    const confirmCancel = confirm('Are you sure you want to cancel?');
    if (confirmCancel) {
      this.router.navigate(['/dashboard']);
    }
  }
}
