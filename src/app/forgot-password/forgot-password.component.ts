import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import {AuthService} from '../auth.service';
import * as firebase from 'firebase';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  constructor(private route: ActivatedRoute, 
              private router: Router, 
              private authService: AuthService,
              private toastr: ToastrManager
              ) {
  }
  ngOnInit() {
  }

  close() {
    this.router.navigate([{ outlets: { auth: null } }]);
  }

  goToSignup() {
    this.router.navigate([{ outlets: { auth: 'signup' } }]);
  }

  goToLogin() {
    this.router.navigate([{ outlets: { auth: 'login' } }]);
  }

  onForgotPassword(form: NgForm) {
    const email = form.value.email;
    this.authService.forgotPassword(email);
    this.toastr.successToastr('password reset sent')
    this.close();
  }

}
