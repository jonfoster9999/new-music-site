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
    this.url = 'https://d1e06abilcmk8l.cloudfront.net/?albumPath=favorites&token=' + (this.authService.token || '') + '&userId=' + this.getUID();
    this.authService.authChange.subscribe(
      () => {
        this.url = 'https://d1e06abilcmk8l.cloudfront.net/?albumPath=favorites&token=' + (this.authService.token || '') + '&userId=' + this.getUID();
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
