import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  error = undefined;

  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService) {
  }

  ngOnInit() {
  }

  nav() {
    this.router.navigate([{ outlets: { auth: 'login' }}]);
  }

  close() {
    this.router.navigate([{ outlets: { auth: null } }]);
  }


  onSignup(form: NgForm) {
    const email = form.value.email;
    const password = form.value.password;
    this.authService.signupUser(email, password)
      .then(response => {
        firebase.auth().currentUser.getIdToken()
          .then(token => {
            this.authService.currentUser = firebase.auth().currentUser;
            this.authService.token = token;
            this.authService.authChange.next();
            this.router.navigate([{outlets: { auth: null }}])
          });
      })
      .catch(
        error => this.error = error
      );
  }
}
