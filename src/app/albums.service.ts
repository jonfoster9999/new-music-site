import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { of } from "rxjs";
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AlbumsService {
  albums = [
    {
      image_url: 'https://f4.bcbits.com/img/a0424465757_10.jpg',
      title: 'Red Cabin - Camp Fire',
      description: 'Collaboratively administrate empowered markets via plug-and-play networks.'
    },
    {
      image_url: 'https://f4.bcbits.com/img/a1687656885_10.jpg',
      title: 'Red Cabin - Camp Fire',
      description: 'Collaboratively administrate empowered markets via plug-and-play networks.'
    },
    {
      image_url: 'https://f4.bcbits.com/img/a0424465757_10.jpg',
      title: 'Red Cabin - Camp Fire',
      description: 'Collaboratively administrate empowered markets via plug-and-play networks.'
    },
    {
      image_url: 'https://f4.bcbits.com/img/a0424465757_10.jpg',
      title: 'Red Cabin - Camp Fire',
      description: 'Collaboratively administrate empowered markets via plug-and-play networks.'
    },
    {
      image_url: 'https://f4.bcbits.com/img/a0424465757_10.jpg',
      title: 'Red Cabin - Camp Fire',
      description: 'Collaboratively administrate empowered markets via plug-and-play networks.'
    },
    {
      image_url: 'https://f4.bcbits.com/img/a0424465757_10.jpg',
      title: 'Red Cabin - Camp Fire',
      description: 'Collaboratively administrate empowered markets via plug-and-play networks.'
    },
    {
      image_url: 'https://f4.bcbits.com/img/a0424465757_10.jpg',
      title: 'Red Cabin - Camp Fire',
      description: 'Collaboratively administrate empowered markets via plug-and-play networks.'
    },
    {
      image_url: 'https://f4.bcbits.com/img/a0424465757_10.jpg',
      title: 'Red Cabin - Camp Fire',
      description: 'Collaboratively administrate empowered markets via plug-and-play networks.'
    }
  ]

  constructor(private httpClient: HttpClient) { }

  getAlbums() {
    return this.httpClient.get('https://c8ujs1df85.execute-api.us-east-1.amazonaws.com/dev/albums')
  }
}
