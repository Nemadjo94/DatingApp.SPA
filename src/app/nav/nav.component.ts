import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {}; // Stores username and password to pass to api
  username: string; // We use this to display the username welcome message
  photoUrl: string; // user nav bar small photo

  // tslint:disable-next-line: max-line-length
  constructor(private authService: AuthService, private alertify: AlertifyService, private router: Router) { } // Inject auth service into constructor

  ngOnInit() {
    this.authService.currentPhotoUrl.subscribe(photoUrl => this.photoUrl = photoUrl);

    // If user is logged in then we have a token stored if not then its null
    const userLoggedIn = localStorage.getItem('token');
    // Check if the user is logged in
    if (userLoggedIn) {
      // Set the username for welcome message, we do this because on refresh data gets lost, this way we are consistent
      this.username = this.authService.decodedToken.unique_name;
      // this.userPhoto = this.authService.currentUser.photoUrl;
    }
  }

  login() {
    this.authService.login(this.model).subscribe(next => { // since login is an observable we can subscribe
      this.username = this.authService.decodedToken.unique_name;
      this.alertify.success('Logged in successfully');
      console.log('Logged in successfully');
    }, error => {
      this.alertify.error('Failed to login');
      console.log(error);
    }, () => { // After succesful login navigate to members page
      this.router.navigate(['/members']);
    });
  }

  loggedIn() {
    // const token = localStorage.getItem('token'); // Get token when user logs in
    // return !!token; // Returns true or false !!

    // Up is the old code where we dont know if we have a valid token at all
    // so we call authService where we implemented jwt helper service to validate if the token has expired
    return this.authService.loggedIn();
  }

  logOut() {
    localStorage.removeItem('token'); // Delete token when users logs out
    localStorage.removeItem('user');
    this.authService.decodedToken = null;
    this.authService.currentUser = null;
    this.alertify.message('Logged out');
    this.router.navigate(['/home']); // Navigate to home page after logout
    console.log('logged out');
  }

}
