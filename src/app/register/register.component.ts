import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { BsDaterangepickerConfig } from 'ngx-bootstrap';
import { User } from '../_models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Input() valuesFromHome: any; // This is passed from a parent element, like props in react
  @Output() cancelRegister = new EventEmitter(); // Output emits an event. Output is for comunication between child and parent

  user: User;
  registerForm: FormGroup;
  // Because some options in datepicker are mandatory, by making it a partial class now all options are optional
  bsConfig: Partial<BsDaterangepickerConfig>;

  constructor(private authService: AuthService, private alertify: AlertifyService, private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    // Date picker configutarion
    this.bsConfig = {
      containerClass: 'theme-red' // We're just changing the theme color
    },

    this.createRegisterForm();

    // this.registerForm = new FormGroup({ // Initiate validator for our register form // replaced with createRegisterForm method
    //   username: new FormControl('', Validators.required),
    //   password: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(100)]),
    //   confirmPassword: new FormControl('', Validators.required)
    // }, this.passwordMatchValidator);
  }

  createRegisterForm() {
    this.registerForm = this.fb.group({
      gender: ['male'],
      username: ['', Validators.required],
      knownAs: ['', Validators.required],
      dateOfBirth: [null, Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
      confirmPassword: ['', Validators.required]
    }, {validator: this.passwordMatchValidator});
  }

  // Our custom form validator to compare password and confirm password
  passwordMatchValidator(g: FormGroup) {
    return g.get('password').value === g.get('confirmPassword').value ? null : { 'mismatch': true};
  }

  register() { // Moramo se subskrajbovati na metodu register jer je ona observable
    if (this.registerForm.valid) {
      this.user = Object.assign({}, this.registerForm.value); // form value clones into {} then assings to user
      this.authService.register(this.user).subscribe(() => { // Register user
        this.alertify.success('Registration successful'); // alert success
      }, error => {
        this.alertify.error(error); // alert error
      }, () => {
        this.authService.login(this.user).subscribe(() => { // callback method to login user after registration
          this.router.navigate(['/members']); // then navigate to members page
        });
      });
    }

    // this.authService.register(this.model).subscribe(() => { // Prvo je za uspesno registrovanje drugo za error
    //   this.alertify.success('Registration successful');
    //   console.log('registration successful');
    // }, error => {
    //   this.alertify.error('Failed to register');
    //   console.log(error);
    // });
  }

  cancel() {
    this.cancelRegister.emit(false); // We can emit anything, as long as it is a form of data
  }

}
