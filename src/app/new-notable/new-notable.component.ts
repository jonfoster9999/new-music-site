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
    this.url = 'http://www.net-album-player.com.s3-website-us-east-1.amazonaws.com/?albumPath=new_notable&token=' + (this.authService.token || '') + '&userId=' + this.getUID();
    this.authService.authChange.subscribe(
      () => {
        this.url = 'http://www.net-album-player.com.s3-website-us-east-1.amazonaws.com/?albumPath=new_notable&token=' + (this.authService.token || '') + '&userId=' + this.getUID();
      }
    );
  }

  getUID() {
    console.log(this.authService.currentUser)
    if (this.authService.currentUser) {
      return this.authService.currentUser.uid
    } else {
      return '';
    }
  }

  ngOnDestroy() {
  }
}