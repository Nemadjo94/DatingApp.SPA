import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/_models/user';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import { TabsetComponent } from 'ngx-bootstrap';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  @ViewChild('memberTabs') memberTabs: TabsetComponent;
  user: User;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];


  // tslint:disable-next-line: max-line-length
  constructor(private userService: UserService, private alertify: AlertifyService, private route: ActivatedRoute, private authService: AuthService) { } // route represents url

  ngOnInit() {
   this.route.data.subscribe(data => { // We subscribe to resolver and await for user data
     this.user = data['user']; // get user data from resolver
   });

   this.route.queryParams.subscribe(params => { // These params are passed from messages.component.html via query params
     const selectedTab = params['tab']; // Name of the query param is tab so grab that
     this.memberTabs.tabs[selectedTab > 0 ? selectedTab : 0].active = true; // message tab id is 3 for example so check if its bigger than 0
   });

   this.galleryOptions = [
     {
       width: '500px',
       height: '500px',
       imagePercent: 100,
       thumbnailsColumns: 4,
       imageAnimation: NgxGalleryAnimation.Slide,
       preview: false
      }
   ];

   this.galleryImages = this.getImages();
  }

  getImages() {
    const imageUrls = [];

    for (let i = 0; i < this.user.photos.length; i++) {
      imageUrls.push({
        small: this.user.photos[i].url,
        medium: this.user.photos[i].url,
        big: this.user.photos[i].url,
        description: this.user.photos[i].description
      });
    }

    return imageUrls;
  }

  selectTab(tabId: number) { // This method activates a certain tab in our html page by targeting the id
    this.memberTabs.tabs[tabId].active = true;
  }

  sendLike(recipientId: number) {
    this.userService.sendLike(this.authService.decodedToken.nameid, recipientId).subscribe(
      data => {
        this.alertify.success('You have liked ' + this.user.knownAs);
      }, error => {
        this.alertify.error(error);
      }
    );
  }

  // Replaced with a resolver, so we no longer call api from component but rather on activated url
  // loadUser() {
  //   const id = 0 + this.route.snapshot.params['id']; // get the id from url but since id is string and we need the number thus the plus sign
  //   this.userService.getUser(id).subscribe(( user: User ) => {
  //     this.user = user;
  //     console.log(user);
  //   }, error => {
  //     this.alertify.error(error);
  //   });
  // }

}
