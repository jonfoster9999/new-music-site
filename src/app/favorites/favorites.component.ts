import {Component, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import * as firebase from 'firebase';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {
  database;
  url;
  listener;

  constructor(public authService: AuthService, private router: Router) {
    this.database = firebase.database();
  }

  ngOnInit() {
    this.url = 'http://www.net-album-player.com.s3-website-us-east-1.amazonaws.com/?albumPath=favorites&token=' + (this.authService.token || '') + '&userId=' + this.getUID();
    this.authService.authChange.subscribe(
      () => {
        this.url = 'http://www.net-album-player.com.s3-website-us-east-1.amazonaws.com/?albumPath=favorites&token=' + (this.authService.token || '') + '&userId=' + this.getUID();
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
