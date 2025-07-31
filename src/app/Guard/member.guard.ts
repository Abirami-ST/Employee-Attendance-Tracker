import { CanActivateChildFn, Router,CanActivate, CanActivateChild, UrlTree, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from '../Services/auth.service';

// export const authChildGuard: CanActivateChildFn = (childRoute, state) => {
//   return true;
// };

@Injectable({ providedIn: 'root' })
export class MemberGuard implements CanActivate{

  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const user = this.auth.getCurrentUser();
    const expectedRole = route.data['expectedRole'];
    const routeId = +route.paramMap.get('id')!;

    if (!user) {
      this.auth.logout();
      this.router.navigate(['/login']);
      return false;
    }

    // If user is TeamLead — allow any /member/:id access
    if (user.role === 'TeamLead') {
      return true;
    }

    // If user is TeamMember — allow only their own id
    if (user.role === 'TeamMember') {
      if (user.id === routeId) {
        return true;
      } else {
        alert('Unauthorized access to another member\'s data.');
        this.router.navigate([`/member/${user.id}`]);
        return false;
      }
    }

    // Deny all else
    this.auth.logout();
    this.router.navigate(['/login']);
    return false;
  }
}
