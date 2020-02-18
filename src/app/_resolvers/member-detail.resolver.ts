import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { User } from '../_models/user';
import { AlertifyService } from '../_services/alertify.service';
import { UserService } from '../_services/user.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()

export class MemberDetailResolver implements Resolve<User> {
    constructor(private userService: UserService, private router: Router, private alertify: AlertifyService) {

    }

    resolve(route: ActivatedRouteSnapshot): Observable<User> { // route represents the url and we are returning an Observable of type User
        return this.userService.getUser(route.params['id']).pipe( // pipe is rxjs function
            catchError(error => { // if we encounter any errors we navigate back to members
                this.alertify.error('Problem retrieving data');
                this.router.navigate(['/members']); // go back on error
                return of(null); // Return Observable of null on error
            })
        );
    }
}