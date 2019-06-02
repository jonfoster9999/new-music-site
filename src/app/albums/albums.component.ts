import { Component, OnInit, AfterViewChecked, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
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
export class AlbumsComponent implements OnInit, AfterViewChecked {
  @ViewChild('el') el: any;
  loadingAlbums = true;
  context;
  albums;
  showBackgroundOverlay;
  tags;
  tagNames;
  visibleAlbums;
  selectedTags = [];
  animationState = 'in';
  selectedFilters = null;
  fragment;

  constructor(
    private albumsService: AlbumsService,
    private router: Router,
    public activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.context = this.activatedRoute.snapshot.data.context;
    this.activatedRoute.fragment.subscribe(fragment => { this.fragment = fragment; });

    if (this.activatedRoute.snapshot.queryParams.selectedFilters) {
      this.selectedFilters = this.activatedRoute.snapshot.queryParams.selectedFilters.split(",")
    }
    if (this.albumsService.albums && this.albumsService.tags) {

      this.albums = this.albumsService.albums.filter(album => album['release_type'] == this.context);

      const allTags = [].concat.apply([], this.albums.map(album => album.tags))

      this.tags = this.filterObject(Object.assign({}, this.albumsService.tags), function(k, v) {
        return allTags.indexOf(+k) == -1 && allTags.indexOf(v) == -1;
      })

      this.tagNames = Object.values(this.tags);

      this.albums.forEach(album => {
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
        this.albums = payload['albums'].filter(album => album['release_type'] == this.context);

        const allTags = [].concat.apply([], this.albums.map(album => album.tags))
        this.albumsService.tags = payload['tags'];
        this.tags = this.filterObject(Object.assign({}, payload['tags']), function(k, v) {
          return allTags.indexOf(+k) == -1;
        })
        this.tagNames = Object.values(this.tags);

        this.albums.forEach(album => {
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
    this.router.navigate([{ outlets: { [this.context]: [album.path]  } }], { relativeTo: this.activatedRoute });
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
    return (+i === i) ? this.tags[String(i)] : i;
  }

  filterByTags(el) {
    el.focused = false;
    if (this.selectedTags.length > 0) {
      this.visibleAlbums = this.albums.filter(album => album.tags.some(t=> this.selectedTags.indexOf(t) >= 0))
    } else {
      this.visibleAlbums = this.albums;
    }
    document.getElementById('helper-placeholder').focus()
  }

  clearSelections() {
    document.getElementById('helper-placeholder').focus()
  }

  filterObject(obj, predicate) {
    var result = {}, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key) && !predicate(key, obj[key])) {
            result[key] = obj[key];
        }
    }
    return result;
  }

  toggleShowDiv(divName: string) {
    if (divName === 'divA') {
      this.animationState = this.animationState === 'out' ? 'in' : 'out';
    }
  }

  tagWasClicked(el) {
    this.el.open();
  }

  ngAfterViewChecked(): void {
    try {
      if(this.fragment === 'top') {
        window.scrollTo(0, 0);
      }
    } catch (e) { }
  }
}
