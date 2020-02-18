import { Injectable } from '@angular/core';

// We declared alertify globally in angular.json file
// but we need to make use of it because of ts lint
declare let alertify: any;

@Injectable({
  providedIn: 'root'
})
export class AlertifyService {

constructor() { }

// Confirm message box
confirm(message: string, okCallback: () => any) {
  alertify.confirm(message, function(event: any) { // event represents user click action
    if (event) {
      okCallback();
    } else {} // do nothing if users clicks cancel
  });
}

success(message: string) {
  alertify.success(message);
}

error(message: string) {
  alertify.error(message);
}

warning(message: string) {
  alertify.warning(message);
}

message(message: string) {
  alertify.message(message);
}



}
