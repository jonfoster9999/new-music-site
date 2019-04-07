import { Injectable } from '@angular/core';
import { Observable, Subject } from "rxjs";
import { of } from "rxjs";
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AlbumsService {


  constructor(private httpClient: HttpClient) { }
  tags;
  albums;
  currentAlbum;

  getAlbums() {
    return this.httpClient.get('https://c8ujs1df85.execute-api.us-east-1.amazonaws.com/dev/albums')
  }
}
