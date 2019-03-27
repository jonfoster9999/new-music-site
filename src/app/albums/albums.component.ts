import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { AlbumsService } from '../albums.service';
import { AlbumComponent } from '../album/album.component';
import { ActivatedRoute, Router } from '@angular/router';
import { trigger, state, style, transition,
    animate, group, query, stagger, keyframes
} from '@angular/animations';

@Component({
  selector: 'app-albums',
  templateUrl: './albums.component.html',
  styleUrls: [
    './albums.component.scss'
  ],
  animations: [
    trigger('slideInOut', [
        state('in', style({
            'max-height': '500px', 'opacity': '1', 'visibility': 'visible'
        })),
        state('out', style({
            'max-height': '0px', 'opacity': '1', 'visibility': 'hidden'
        })),
        transition('in => out', [group([
            animate('400ms ease-in-out', style({
                'opacity': '0'
            })),
            animate('600ms ease-in-out', style({
                'max-height': '0px'
            })),
            animate('700ms ease-in-out', style({
                'visibility': 'hidden'
            }))
        ]
        )]),
        transition('out => in', [group([
            animate('1ms ease-in-out', style({
                'visibility': 'visible'
            })),
            animate('600ms ease-in-out', style({
                'max-height': '500px'
            })),
            animate('800ms ease-in-out', style({
                'opacity': '1'
            }))
        ]
        )])
    ])
  ],
  encapsulation: ViewEncapsulation.None
})
export class AlbumsComponent implements OnInit {
  @ViewChild('el') el: any;
  loadingAlbums = true;
  albums;
  showBackgroundOverlay;
  tags;
  tagNames;
  visibleAlbums;
  selectedTags = [];
  animationState = 'in';
  constructor(
    private albumsService: AlbumsService,
    private router: Router,
    public activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit() {
    if (this.albumsService.albums && this.albumsService.tags) {
      this.albums = this.albumsService.albums
      this.tags = this.albumsService.tags
      this.tagNames = Object.values(this.tags);

      this.visibleAlbums = this.albumsService.albums;
      this.loadingAlbums = false;
    } else {
    this.albumsService.getAlbums()
      .subscribe(payload => {
        this.albums = payload['albums'];
        this.tags = payload['tags'];
        this.tagNames = Object.values(this.tags);
        this.albumsService.tags = payload['tags'];

        this.albums.forEach(album => {
          album.tags = album.tags.map(tag => this.decodeTag(tag))
        })
        this.albumsService.albums = this.albums;

        this.visibleAlbums = this.albumsService.albums
        this.loadingAlbums = false
      });

    }
  }

  getLongestAlbumNameCount(albums) {
    return(albums.map(x => x.name).sort(function (a, b) { return b.length - a.length; })[0]).length;
  }

  listen(album) {
    this.albumsService.currentAlbum = album
    this.router.navigate([{ outlets: { album: [album.title]  } }], { relativeTo: this.activatedRoute });
  }

  albumPopupActivated(componentRef: AlbumComponent) {
    document.body.style.overflowY = 'hidden';
    this.showBackgroundOverlay = true;
  }
  albumPopupDeactivated() {
    document.body.style.overflowY = 'visible';
    this.showBackgroundOverlay = false;
  }

  decodeTag(i) {
    return this.tags[String(i)];
  }

  seeChange() {
  }

  filterByTags(el) {
    el.focused = false;
    if (this.selectedTags.length > 0) {
      this.visibleAlbums = this.albums.filter(album => album.tags.some(t=> this.selectedTags.indexOf(t) >= 0))
    } else {
      this.visibleAlbums = this.albums;
    }
    document.getElementById('dumb').focus()
  }

  clearSelections() {
    document.getElementById('dumb').focus()
  }

  toggleShowDiv(divName: string) {
    if (divName === 'divA') {
      this.animationState = this.animationState === 'out' ? 'in' : 'out';
    }
  }

  tagWasClicked(el) {
    this.el.open();
  }
}
