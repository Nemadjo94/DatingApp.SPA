import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { User } from 'src/app/_models/user';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm: NgForm; // This gives us access to ng form methods
  user: User;
  photoUrl: string;
  @HostListener('window:beforeunload', ['$event']) // We need to stop the user from accidentally closing the site tab if he edited his form
  unloadNotification($event: any) {
    if (this.editForm.dirty) {
      $event.returnValue = true;
    }
  }

  // tslint:disable-next-line: max-line-length
  constructor(private route: ActivatedRoute, private alertify: AlertifyService, private userService: UserService, private authService: AuthService) { }

  ngOnInit() {
    this.route.data.subscribe(data => { // Subscribe to our resolver
      this.user = data['user']; // retrieve data from resolver
    });
    this.authService.currentPhotoUrl.subscribe(photoUrl => this.photoUrl = photoUrl);
  }

  updateUser() {
    console.log(this.user);
    // tslint:disable-next-line: max-line-length
    this.userService.updateUser(this.authService.decodedToken.nameid, this.user).subscribe(next => { // decodedToken.nameId represents the users id
      this.alertify.success('Profile updated successfully');
    this.editForm.reset(this.user); // Reset the form after update but keep the changes made to the form
    }, error => {
      this.alertify.error(error);
    });

  }

  updateMainPhoto(photoUrl) {
    this.user.photoUrl = photoUrl;
  }

}
