import { Component, EventEmitter, HostBinding, HostListener, Inject, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { AlbumsService } from '../albums.service';
import * as amplitudejs from 'amplitudejs';
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
export class AlbumComponent implements OnInit {
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
  downloadedSongs = []


  visibilityTimeout;
  @HostBinding('class.minimized')
  @HostBinding('@isMinimized')
  isMinimized = false;
  @HostBinding('@isVisibleChanged')
  isVisible = false;

  disableLeftScroll = true;
  disableRightScroll = true;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private albumsService: AlbumsService, private sanitizer: DomSanitizer, private authService: AuthService) {
    if (window.addEventListener) {
         window.addEventListener('message', this.receiveMessage.bind(this), false);
       } else {
          (<any>window).attachEvent('onmessage', this.receiveMessage.bind(this));
       }
    this.database = firebase.database();
  }

  receiveMessage(msg) {
    if (msg.data === 401) {
      this.router.navigate([{outlets: { auth: 'login' }}])
    } else {
      if (this.authService.currentUser) {
        let song = (msg.data as string ).split('/').pop().split('+').join(' ');

        if (!this.downloadedSongs.includes(song)) {
          this.database.ref('downloads/' + ('_' + Math.random().toString(36).substr(2, 9))).set({
            email: this.authService.currentUser.email,
            song: (msg.data as string ).split('/').pop().split('+').join(' '),
            time: String(new Date())
          });

          this.downloadedSongs.push(song);
        }
      }

    }
  }

  ngOnInit() {
    this.visibilityTimeout = window.setTimeout(() => this.isVisible = true);
    const currentAlbum = this.activatedRoute.snapshot.params.albumId;
    console.log('current album in beginning', currentAlbum)
    if (this.albumsService.albums && this.albumsService.tags) {
      this.currentAlbum = this.albumsService.albums.find(album => album.title === currentAlbum);
      this.tags = this.albumsService.tags;
      this.url = 'http://www.net-album-player.com.s3-website-us-east-1.amazonaws.com/?albumPath=' + this.currentAlbum.path.replace('/', '') + '&token=' + (this.authService.token || '');
      this.loadingAlbum = false;
      console.log('current album', this.currentAlbum)
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
        this.url = 'http://www.net-album-player.com.s3-website-us-east-1.amazonaws.com/?albumPath=' + this.currentAlbum.path.replace('/', '') + '&token=' + (this.authService.token || '');
        this.loadingAlbum = false;
      })
    }

    this.authService.authChange.subscribe(
      () => {
        this.url = 'http://www.net-album-player.com.s3-website-us-east-1.amazonaws.com/?albumPath=' + this.currentAlbum.path.replace('/', '') + '&token=' + (this.authService.token || '');
      }
    )
  }

  onCancelClick() {
    this.canceled.emit();
    this.isVisible = false;
  }

  decodeTag(i) {
    return this.tags[String(i)];
  }

  navigateBackToList() {
    this.router.navigate(['music', 'albums']);
  }

  iframeURL() {
    console.log('is this running over and over?')
    return this.sanitizer.bypassSecurityTrustResourceUrl(`http://www.net-album-player.com.s3-website-us-east-1.amazonaws.com/?albumPath=${this.path}`)
  }

  @HostListener('@isVisibleChanged.done', ['$event'])
  animationEnded(event) {
    if (event.fromState === true && event.toState === false) {
      this.navigateBackToList();
    }
  }

}
