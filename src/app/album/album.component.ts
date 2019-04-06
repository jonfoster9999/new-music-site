import { Component, EventEmitter, HostBinding, HostListener, Inject, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { AlbumsService } from '../albums.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import {AuthService } from '../auth.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.scss'],
  animations: [
    trigger('isVisibleChanged', [
      state('true', style({ opacity: 1, transform: 'translateY(0%)' })),
      state('false', style({ opacity: 0, transform: 'translateY(100%)' })),
      transition('1 => 0', animate('0.2s ease-out')),
      transition('0 => 1', animate('0.2s ease-in'))
    ]),
    trigger('isMinimized', [
      state('true', style({ transform: 'translateY(calc(100vh - 116px))' })),
      state('false', style({ transform: 'translateY(0%)' })),
      transition('1 => 0', animate('0.2s ease-in')),
      transition('0 => 1', animate('0.2s ease-out'))
    ]),
    trigger('isHeaderVisible', [
      state('true', style({ opacity: 1, visibility: 'visible' })),
      state('false', style({ opacity: 0, visibility: 'hidden' })),
      transition('1 => 0', animate('0.2s ease-out')),
      transition('0 => 1', animate('0.2s ease-in'))
    ]),
  ]
})
export class AlbumComponent implements OnInit, OnDestroy {
  @Output() minimized = new EventEmitter<void>();
  @Output() maximized = new EventEmitter<void>();
  @Output() canceled = new EventEmitter<void>();
  currentAlbum;
  loadingAlbum = true;
  tags;
  albums;
  path: SafeResourceUrl;
  url = ''
  database;

  visibilityTimeout;
  @HostBinding('class.minimized')
  @HostBinding('@isMinimized')
  isMinimized = false;
  @HostBinding('@isVisibleChanged')
  isVisible = false;

  disableLeftScroll = true;
  disableRightScroll = true;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private albumsService: AlbumsService, private sanitizer: DomSanitizer, private authService: AuthService) {
    this.database = firebase.database();
  }

  ngOnInit() {
    this.visibilityTimeout = window.setTimeout(() => this.isVisible = true);
    const currentAlbum = this.activatedRoute.snapshot.params.albumId;
    if (currentAlbum.indexOf('private_link') > - 1) {
      this.currentAlbum = {
        title: 'Private Link',
        artist: 'Never Ending Tape',
        path: currentAlbum
      }
      this.tags = []
      this.url = 'https://d1e06abilcmk8l.cloudfront.net/?albumPath=' + currentAlbum + '&token=' + (this.authService.token || '') + '&userId=' + this.getUID();
      this.loadingAlbum = false;
    } else {
      if (this.albumsService.albums && this.albumsService.tags) {
        this.currentAlbum = this.albumsService.albums.find(album => album.title === currentAlbum);
        this.tags = this.albumsService.tags;
        this.url = 'https://d1e06abilcmk8l.cloudfront.net/?albumPath=' + this.currentAlbum.path.replace('/', '') + '&token=' + (this.authService.token || '') + '&userId=' + this.getUID();
        this.loadingAlbum = false;
      } else {
        this.albumsService.getAlbums().subscribe(payload => {
          this.albums = payload['albums'];
          this.tags = payload['tags'];
          this.albumsService.tags = payload['tags'];

          this.albums.forEach(album => {
            album.tags = album.tags.map(tag => this.decodeTag(tag))
          })
          this.albumsService.albums = this.albums;
          this.currentAlbum = this.albumsService.albums.find(album => album.title == currentAlbum);
          this.url = 'https://d1e06abilcmk8l.cloudfront.net/?albumPath=' + this.currentAlbum.path.replace('/', '') + '&token=' + (this.authService.token || '') + '&userId=' + this.getUID();
          this.loadingAlbum = false;
        })
      }
    }


    this.authService.authChange.subscribe(
      () => {
        this.url = 'https://d1e06abilcmk8l.cloudfront.net/?albumPath=' + this.currentAlbum.path.replace('/', '') + '&token=' + (this.authService.token || '') + '&userId=' + this.getUID();
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

  onCancelClick() {
    this.canceled.emit();
    this.isVisible = false;
  }

  decodeTag(i) {
    return this.tags[String(i)];
  }

  navigateBackToList() {
    if (this.activatedRoute.snapshot.outlet == 'compilation') {
      this.router.navigate(['music', 'compilations']);
    } else {
      this.router.navigate(['music', 'albums']);
    };
  }

  @HostListener('@isVisibleChanged.done', ['$event'])
  animationEnded(event) {
    if (event.fromState === true && event.toState === false) {
      this.navigateBackToList();
    }
  }

  ngOnDestroy() {
  }
}
