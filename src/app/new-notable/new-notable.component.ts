import {Component, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import * as firebase from 'firebase';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-new-notable',
  templateUrl: './new-notable.component.html',
  styleUrls: ['./new-notable.component.css']
})
export class NewNotableComponent implements OnInit, OnDestroy {
  database;
  url;
  listener;

  constructor(private authService: AuthService, private router: Router) {
    this.database = firebase.database();
  }

  ngOnInit() {
    this.url = 'https://d1e06abilcmk8l.cloudfront.net/?albumPath=new_notable&token=' + (this.authService.token || '') + '&userId=' + this.getUID();
    this.authService.authChange.subscribe(
      () => {
        this.url = 'https://d1e06abilcmk8l.cloudfront.net/?albumPath=new_notable&token=' + (this.authService.token || '') + '&userId=' + this.getUID();
      }
    );
  }

  getUID() {
    if (this.authService.currentUser) {
      return this.authService.currentUser.uid
    } else {
      return '';
    }
  }

  ngOnDestroy() {
  }
}
