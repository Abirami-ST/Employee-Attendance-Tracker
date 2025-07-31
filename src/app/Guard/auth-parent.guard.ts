import { inject, Injectable } from '@angular/core';
import { CanActivateFn, Router, UrlTree, CanActivate} from '@angular/router';
import { AuthService } from '../Services/auth.service';

// export const authParentGuard: CanActivateFn = (route, state) => {
//   return true;
// };

@Injectable({ providedIn: 'root' })
export class AuthParentGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    const user = this.auth.getCurrentUser();
    if (user) {
      return true;
    }
    return this.router.parseUrl('/login');
  }
}
