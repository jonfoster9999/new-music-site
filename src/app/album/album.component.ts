import { Component, EventEmitter, HostBinding, HostListener, Inject, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { AlbumsService } from '../albums.service';
import * as amplitudejs from 'amplitudejs';


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


  visibilityTimeout;
  @HostBinding('class.minimized')
  @HostBinding('@isMinimized')
  isMinimized = false;
  @HostBinding('@isVisibleChanged')
  isVisible = false;

  disableLeftScroll = true;
  disableRightScroll = true;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private albumsService: AlbumsService) { }

  ngOnInit() {
    amplitudejs.init({
		"songs": [
			{
				"name": "Song Name 1",
				"artist": "Artist Name",
				"album": "Album Name",
				"url": "/song/url.mp3",
				"cover_art_url": "/cover/art/url.jpg"
			}
    ]})
    this.visibilityTimeout = window.setTimeout(() => this.isVisible = true);
    let currentAlbum = this.activatedRoute.snapshot.params.albumId;
    if (this.albumsService.albums && this.albumsService.tags) {
      this.loadingAlbum = false;
      this.currentAlbum = this.albumsService.albums.find(album => album.name == currentAlbum);
      this.tags = this.albumsService.tags;
      console.log('current album', this.currentAlbum)
    } else {
      this.albumsService.getAlbums().subscribe(payload => {
        this.loadingAlbum = false;
        this.albums = payload['albums'];
        this.tags = payload['tags'];
        this.albumsService.tags = payload['tags'];

        this.albums.forEach(album => {
          album.tags = album.tags.map(tag => this.decodeTag(tag))
        })
        this.albumsService.albums = this.albums;
        this.currentAlbum = this.albumsService.albums.find(album => album.name == currentAlbum);
        console.log('current album', this.currentAlbum)
      })
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
    this.router.navigate(['music', 'albums']);
  }

  @HostListener('@isVisibleChanged.done', ['$event'])
  animationEnded(event) {
    if (event.fromState === true && event.toState === false) {
      this.navigateBackToList();
    }
  }

}
