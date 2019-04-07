import {Component, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import * as firebase from 'firebase';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-static-album',
  templateUrl: './static-album.component.html',
  styleUrls: ['./static-album.component.scss']
})
export class StaticAlbumComponent implements OnInit, OnDestroy {
  database;
  url;
  listener;
  context;

  constructor(private authService: AuthService, private router: Router, private activatedRoute: ActivatedRoute) {
    this.database = firebase.database();
  }

  ngOnInit() {
    this.context = this.activatedRoute.snapshot.data.context;
    console.log('context is', this.context)
    this.url = 'https://d1e06abilcmk8l.cloudfront.net/?albumPath=' + this.context + '&token=' + (this.authService.token || '') + '&userId=' + this.getUID();
    this.authService.authChange.subscribe(
      () => {
        this.url = 'https://d1e06abilcmk8l.cloudfront.net/?albumPath=' + this.context + '&token=' + (this.authService.token || '') + '&userId=' + this.getUID();
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
