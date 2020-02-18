import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  registerMode = false; // By default the register button is not clicked yet
  values: any;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getValues();
  }

  registerToggle(){ // Switch register mode
    this.registerMode = true;
  }

  getValues(){
    this.http.get('https://localhost:5001/api/values').subscribe(response => {
      this.values = response;
      console.log(response);
    }, error => {
      console.log(error);
    });
  }

  cancelRegisterMode(registerMode: boolean){
    this.registerMode = registerMode;
  }

}
