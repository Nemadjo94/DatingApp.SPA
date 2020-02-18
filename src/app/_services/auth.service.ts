import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { BehaviorSubject } from 'rxjs';

@Injectable({ // Components are injectable by default but services are not components so they need to be injected
  providedIn: 'root' // This tells our service which module is providing this service
})
export class AuthService {
  // baseUrl = 'https://localhost:5001/api/auth/';
  baseUrl = environment.apiUrl + 'auth/';
  jwtHelper = new JwtHelperService();
  decodedToken: any;
  currentUser: User;

  // For Any to Any communication, components need to subscribe to this and update on changes
  photoUrl = new BehaviorSubject<string>('../../assets/user.png'); // set default user photo
  currentPhotoUrl = this.photoUrl.asObservable(); // Because its and observable we can subscribe to this property and update components

constructor(private http: HttpClient) { }

  changeMemberPhoto(photoUrl: string) {
    this.photoUrl.next(photoUrl);
  }

  login(model: any) { // We pass the model
    console.log(model);
    return this.http.post(this.baseUrl + 'login', model, {headers: {'Content-Type': 'application/json'}}) // Model is going through body
    .pipe(
      map((response: any) => { // map response to user
        const user = response;

        if (user) { // If we have a user, save the token to local storage so we can access it later
          localStorage.setItem('token', user.token); // Key and value pair 'token':'value'
          localStorage.setItem('user', JSON.stringify(user.user)); // Save our user into local storage, we just take photo from this object
          // Use jwtHelper to decode our token and display the content in console
          this.decodedToken = this.jwtHelper.decodeToken(user.token);
          this.currentUser = user.user;
          this.changeMemberPhoto(this.currentUser.photoUrl); // On login change user photo
        }
      })
    );
  }

  register(user: User) {
    return this.http.post(this.baseUrl + 'register', user);
  }

  loggedIn() {
    // Get the token from local storage
    const token = localStorage.getItem('token');
    // Validate if the token has expired
    return !this.jwtHelper.isTokenExpired(token); // if token is not expired return true
  }

  roleMatch(allowedRoles): boolean { // check to see if the user belongs to one of the allowed roles
    let isMatch = false;
    const userRoles = this.decodedToken.role as Array<string>; // get user roles from token

    allowedRoles.forEach(role => {
      if (userRoles.includes(role)) {
        isMatch = true;
        return;
      }
    });

    return isMatch;
  }
}
