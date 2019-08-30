import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import {Router, ActivatedRoute} from '@angular/router';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  static show = false;
  token: string;
  app;
  currentUser = null;
  linkMember = null;
  authChange = new Subject();
  databaseRef;

  constructor(private router: Router, private route: ActivatedRoute) {}

  signupUser(email: string, password: string) {
    return firebase.auth().createUserWithEmailAndPassword(email, password);
  }

  signinUser(email: string, password: string) {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  forgotPassword(email: string) {
    return firebase.auth().sendPasswordResetEmail(email)
  }

  getToken() {
    firebase.auth().currentUser.getIdToken()
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
    if (this.route.snapshot['_routerState'].url == '/music/favorites') {
      this.router.navigate(['/music'])
    };
    this.token = null;
    this.currentUser = null;
    this.authChange.next();
  }
}
