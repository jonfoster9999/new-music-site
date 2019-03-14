import {AfterViewChecked, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import * as firebase from 'firebase';
import {AuthService} from './auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  app;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.app = firebase.initializeApp({
      apiKey: 'AIzaSyDFFP50qmxme8g_ilMvz1FQlLxVWiRFuM4',
      authDomain: 'never-ending-tape.firebaseapp.com'
    });
  }

  logout() {
    this.authService.logout();
  }
}
