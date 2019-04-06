import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { AlbumsService } from '../albums.service';
import { AlbumComponent } from '../album/album.component';
import { ActivatedRoute, Router } from '@angular/router';
import { trigger, state, style, transition,
    animate, group, query, stagger, keyframes
} from '@angular/animations';

@Component({
  selector: 'app-compilations',
  templateUrl: './compilations.component.html',
  styleUrls: ['./compilations.component.css'],
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
export class CompilationsComponent implements OnInit {
  @ViewChild('el') el: any;
  loadingAlbums = true;
  albums;
  showBackgroundOverlay;
  tags;
  tagNames;
  visibleAlbums;
  selectedTags = [];
  animationState = 'in';
  selectedFilters = null;
  constructor(
    private albumsService: AlbumsService,
    private router: Router,
    public activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit() {
    console.log('on init runs')
    if (this.activatedRoute.snapshot.queryParams.selectedFilters) {
      this.selectedFilters = this.activatedRoute.snapshot.queryParams.selectedFilters.split(",")
    }
    if (this.albumsService.albums && this.albumsService.tags) {

      this.albums = this.albumsService.albums.filter(album => album['release_type'] != 'net_album');


      this.tags = this.albumsService.tags
      this.tagNames = Object.values(this.tags);

      this.albums.forEach((album, i) => {
        album.tags = album.tags.map(tag => this.decodeTag(tag))
      })

      this.visibleAlbums = this.albums;
      this.loadingAlbums = false;
      if (this.selectedFilters) {
        this.selectedTags = this.selectedFilters;
        this.filterByTags({focused: null})
      }
    } else {
    this.albumsService.getAlbums()
      .subscribe(payload => {
        const untouchedAlbums = payload['albums']
        this.albums = payload['albums'].filter(album => album['release_type'] != 'net_album');
        this.tags = payload['tags'];
        this.tagNames = Object.values(this.tags);
        this.albumsService.tags = payload['tags'];

        this.albums.forEach((album, i) => {
          album.tags = album.tags.map(tag => this.decodeTag(tag))
        })
        this.albumsService.albums = untouchedAlbums;

        this.visibleAlbums = this.albums
        this.loadingAlbums = false
        if (this.selectedFilters) {
          this.selectedTags = this.selectedFilters;
          this.filterByTags({focused: null})
        }
      });
    }
  }

  getLongestAlbumNameCount(albums) {
    return(albums.map(x => x.name).sort(function (a, b) { return b.length - a.length; })[0]).length;
  }

  listen(album) {
    this.albumsService.currentAlbum = album
    this.router.navigate([{ outlets: { compilation: [album.title]  } }], { relativeTo: this.activatedRoute });
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
    console.log(i);
    if (+i === i) {
      return this.tags[String(i)];
    } else {
      return i;
    }
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
