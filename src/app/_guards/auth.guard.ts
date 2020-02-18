import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';

// Route guards protect our routes from unauthorized access

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private alertify: AlertifyService) {

  }

  canActivate(next: ActivatedRouteSnapshot): boolean {
    const roles = next.firstChild.data['roles'] as Array<string>; // this is populated by routes.ts on link activated
    if (roles) { // check if roles are populated, which means the admin route is activated
      const match = this.authService.roleMatch(roles); // check if roles from routes.ts match with the ones from user token
      if (match) {
        return true;
      } else {
        this.router.navigate(['members']);
        this.alertify.error('You are not authorized');
      }
    }

    if (this.authService.loggedIn()) {
      return true;
    }

    this.alertify.error('You shall not pass!');
    this.router.navigate(['/home']);

    return false;

  }
}
