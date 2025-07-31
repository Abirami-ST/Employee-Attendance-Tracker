import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { AddMemberComponent } from './add-member/add-member.component';
import { MemberTrackHistoryComponent } from './member-track-history/member-track-history.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AuthParentGuard } from './Guard/auth-parent.guard';
import { MemberGuard } from './Guard/member.guard';

const routes: Routes = [
  {path: '' , redirectTo: '/login' , pathMatch:'full' },
  {path: 'login', component: LoginComponent},
  {path: 'dashboard', 
    canActivate: [AuthParentGuard, MemberGuard],
    data: { expectedRole: 'TeamLead' },
    children: [
      {path: '', component: DashboardComponent,},
      //{path: 'add', component:AddMemberComponent, outlet:"addPage"},
      {path: 'add', component:AddMemberComponent},
      {path: 'edit/:id', component:AddMemberComponent},
  ]},
  {path: 'member/:id', component: MemberTrackHistoryComponent,
    canActivate: [AuthParentGuard,MemberGuard],
    data: { expectedRole: 'TeamMember' }
  },
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
