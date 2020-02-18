import { Component, OnInit, Input } from '@angular/core';
import { Message } from 'src/app/_models/message';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
  @Input() recipientId: number;
  messages: Message[];
  newMessage: any = {};

  constructor(private userService: UserService, private authService: AuthService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages() {
    const currentUserId = +this.authService.decodedToken.nameid;
    this.userService.getMessageThread(currentUserId, this.recipientId)
      .pipe(
        tap(messages => { // tap is a method for modifying the subscribe method
          // here we call api for each message, bettew way would be pass an object of unread messages to our api
          for (let i = 0; i < messages.length; i++) {
            console.log(i); // tap radi
            if (messages[i].isRead === false && messages[i].recipientId === currentUserId) {
              console.log('uso mali');
              this.userService.markAsRead(messages[i].id, currentUserId);
              console.log(messages[i].id);
            }
          }
        })
      )
      .subscribe(
        messages => {
          this.messages = messages;
        }, error => {
          this.alertify.error(error);
        });
  }

  sendMessage() {
    this.newMessage.recipientId = this.recipientId;
    this.userService.sendMessage(this.authService.decodedToken.nameid, this.newMessage).subscribe((message: Message) => {
      this.messages.unshift(message); // Insert new message in the array
      this.newMessage.content = '';
    }, error => {
      this.alertify.error(error);
    });
  }

}
