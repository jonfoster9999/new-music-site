import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import {AuthService} from '../auth.service';
import * as firebase from 'firebase';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  error = undefined;

  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService) {
  }

  ngOnInit() {
  }

  nav() {
    this.router.navigate([{ outlets: { auth: 'signup' } }]);
  }

  close() {
    this.router.navigate([{ outlets: { auth: null } }]);
  }

  onSignin(form: NgForm) {
    const email = form.value.email;
    const password = form.value.password;
    this.authService.signinUser(email, password)
      .then(
        response => {
          firebase.auth().currentUser.getIdToken()
            .then(token => {
              this.authService.currentUser = firebase.auth().currentUser;
              this.authService.token = token;
              this.authService.authChange.next();
              this.router.navigate([{outlets: { auth: null }}]);
            });
        }
      )
      .catch(
        error => this.error = error
      );
  }


}
