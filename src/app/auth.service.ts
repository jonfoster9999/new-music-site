import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  token: string;
  app;

  constructor(private router: Router) {

  }

  signupUser(email: string, password: string) {
    console.log('signup user?');
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .catch(
        error => console.log(error)
      );
  }

  signinUser(email: string, password: string) {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(
        response => {
          this.router.navigate([{outlets: { auth: null }}])
          console.log(response);
          firebase.auth().currentUser.getIdToken()
            .then(token => {
              this.token = token;
            });
        }
      )
      .catch(
        error => console.log(error)
      );
  }

  getToken() {
    firebase.auth().currentUser.getToken()
      .then(token => {
        this.token = token;
      });
    return this.token;
  }

  isAuthenticated() {
    return this.token != null;
  }

  logout() {
    firebase.auth().signOut();
    this.token = null;
  }

  // constructor() { }
}
