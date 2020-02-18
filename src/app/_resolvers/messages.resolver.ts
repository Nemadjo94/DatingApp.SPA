import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';
import { UserService } from '../_services/user.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Message } from '../_models/message';
import { AuthService } from '../_services/auth.service';

@Injectable()

export class MessagesResolver implements Resolve<Message[]> {
    pageNumber = 1;
    pageSize = 5;
    messageContainer = 'Unread';

    // tslint:disable-next-line: max-line-length
    constructor(private userService: UserService, private router: Router, private alertify: AlertifyService, private authService: AuthService) {

    }

    // tslint:disable-next-line: max-line-length
    resolve(route: ActivatedRouteSnapshot): Observable<Message[]> { // route represents the url and we are returning an Observable of type User
        // tslint:disable-next-line: max-line-length
        return this.userService.getMessages(this.authService.decodedToken.nameid, this.pageNumber, this.pageSize, this.messageContainer).pipe(
            catchError(error => { // if we encounter any errors we navigate back to members
                this.alertify.error('Problem retrieving messages');
                this.router.navigate(['/home']); // go back on error
                return of(null);  // Return Observable of null on error
            })
        );
    }
}
