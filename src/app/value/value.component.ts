import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-value',
  templateUrl: './value.component.html',
  styleUrls: ['./value.component.css']
})
export class ValueComponent implements OnInit {
  values: any; // variable

  constructor(private http: HttpClient) { }

  ngOnInit() { // lifecycle method, call when component is initialized
    this.getValues(); // our api call
  }

  getValues(){
    this.http.get('https://localhost:5001/api/values').subscribe(response => {
      this.values = response;
    }, error => {
      console.log(error);
    });
  }
}
