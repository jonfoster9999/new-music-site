import { Component, OnInit } from '@angular/core';
import { AlbumsService } from '../albums.service';

@Component({
  selector: 'app-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.css']
})
export class AlbumsComponent implements OnInit {
  albums;
  constructor(private albumsService: AlbumsService) { }

  ngOnInit() {
    this.albumsService.getAlbums()
      .subscribe(albums => {
        this.albums = albums;
      })
  }

  listen(album) {
    console.log('were going to listen to ', album.path)
  }
}
