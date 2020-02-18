import { Injectable, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import { PaginatedResult } from '../_models/pagination';
import { map } from 'rxjs/operators';
import { Message } from '../_models/message';

// Replaced with jwt module in app.module
// const httpOptions = { // Since we need to be authorized to access the users we need to add the jwt token to the header of our api calls
//   headers: new HttpHeaders({
//     'Authorization': 'Bearer ' + localStorage.getItem('token') // get the token from local storage
//   })
// };

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl;

constructor(private http: HttpClient) { }

  // tslint:disable-next-line: max-line-length
  getUsers(page?, itemsPerPage?, userParams?, likedParam?): Observable<PaginatedResult<User[]>> { // We are returning a paginated array of users
    const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();

    let params = new HttpParams(); // Url params

    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    if (userParams != null) {
      params = params.append('minAge', userParams.minAge);
      params = params.append('maxAge', userParams.maxAge);
      params = params.append('gender', userParams.gender);
      params = params.append('orderBy', userParams.orderBy);
    }

    if (likedParam === 'Likers') {
      params = params.append('likers', 'true');
    }

    if (likedParam === 'Likees') {
      params = params.append('likees', 'true');
    }

    return this.http.get<User[]>(this.baseUrl + 'users', {observe: 'response', params})
    .pipe(
      map(response => {
        paginatedResult.result = response.body;
        if (response.headers.get('Pagination') != null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }
        return paginatedResult;
      })
    );
  }

  getUser(userId: string): Observable<User> {
    return this.http.get<User>(this.baseUrl + 'users/' + userId);
  }

  updateUser(userId: number, user: User) {
    return this.http.put(this.baseUrl + 'users/' + userId, user);
  }

  setMainPhoto(userId: number, id: number) {
    // tslint:disable-next-line: max-line-length
    return this.http.post(this.baseUrl + 'users/' + userId + '/photos/' + id + '/setMain', {}); // {} empty object because post method demands it
  }

  deletePhoto(userId: number, id: number) {
    return this.http.delete(this.baseUrl + 'users/' + userId + '/photos/' + id);
  }

  sendLike(userId: number, recipientId: number) {
    return this.http.post(this.baseUrl + 'users/' + userId + '/like/' + recipientId, {});
  }

  getMessages(userId: number, page?, itemsPerPage?, messageContainer?) {
    const paginatedResult: PaginatedResult<Message[]> =  new PaginatedResult<Message[]>();

    let params = new HttpParams();

    params = params.append('MessageContainer', messageContainer);

    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    return this.http.get<Message[]>(this.baseUrl + 'users/' + userId + '/messages', {observe: 'response', params})
      .pipe(
        map(response => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }

          return paginatedResult;
        })
      );
  }

  // This method gets the messages between users
  getMessageThread(userId: number, recipientId: number) {
    return this.http.get<Message[]>(this.baseUrl + 'users/' + userId + '/messages/thread/' + recipientId);
  }

  sendMessage(userId: number, message: Message) {
    return this.http.post(this.baseUrl + 'users/' + userId + '/messages', message);
  }

  deleteMessage(messageId: number, userId: number) {
    return this.http.post(this.baseUrl + 'users/' + userId + '/messages/' + messageId, {});
  }

  markAsRead(messageId: number, userId: number) {
    return this.http.post(this.baseUrl + 'users/' + userId + '/messages/' + messageId + '/read', {})
      .subscribe(); // Subscribe here because we dont return anything
  }
}
