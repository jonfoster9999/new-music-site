import { Injectable } from '@angular/core';
import { Observable, Subject } from "rxjs";
import { of } from "rxjs";
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AlbumsService {
  env = environment;
  constructor(private httpClient: HttpClient) { }
  tags;
  albums;
  currentAlbum;

  getAlbums() {
    return this.httpClient.get(`${environment['rails_api_host']}/api/albums`)
  }
}
