import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import * as firebase from 'firebase';
import { AuthService } from './auth.service';
import { ToastrManager } from 'ng6-toastr-notifications';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app';
  app;
  database;
  alreadySent = false;

  constructor(public authService: AuthService, private router: Router, public toastr: ToastrManager, private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.app = firebase.initializeApp({
      apiKey: 'AIzaSyDFFP50qmxme8g_ilMvz1FQlLxVWiRFuM4',
      authDomain: 'never-ending-tape.firebaseapp.com',
      databaseURL: 'https://never-ending-tape.firebaseio.com',
      projectId: 'never-ending-tape',
      storageBucket: 'never-ending-tape.appspot.com',
      messagingSenderId: '288317421345'
    });

    const userKey = Object.keys(window.localStorage)
      .filter(it => it.startsWith('firebase:authUser'))[0];
    const user = userKey ? JSON.parse(localStorage.getItem(userKey)) : undefined;

    if (user) {
      this.authService.currentUser = user;
      this.authService.token = this.authService.currentUser.stsTokenManager.accessToken;
    }

    if (window.addEventListener) {
      window.addEventListener('message', this.receiveMessage.bind(this), false);
    } else {
      (<any>window).attachEvent('onmessage', this.receiveMessage.bind(this));
    }
    this.database = firebase.database();
    this.authService.databaseRef = this.database;
    this.route.queryParams.subscribe(params => {
      if (params['contact']) {
        if (!this.alreadySent) {
          let contact = params['contact']
          this.authService.linkMember = contact;
          var date = new Date();
          var now_utc =  Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
               date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
          var dateString = new Date(now_utc).toISOString();
          this.database.ref('link_clicks/' + ('_' + Math.random().toString(36).substr(2, 9))).set({
            email: contact,
            date: dateString
          })
          this.alreadySent = true;
          this.router.navigate([], {
            queryParams: {
              contact: null,
            },
            queryParamsHandling: 'merge'
          })
        }
      }
    });
  }

  receiveMessage(msg) {
    if (msg.data.type !== 'webpackWarnings') {
      if (msg.data === 401) {
        this.router.navigate([{outlets: {auth: 'login'}}])
      } else if (msg.data.type == 'download'){
        try {
          let user;
          if (this.authService.currentUser) {
            user = this.authService.currentUser.email;
          } else if (this.authService.linkMember) {
            user = this.authService.linkMember + " (link member)"
          } else {
            user = 'guest'
          }
          const song = msg.data.msg.split('/').pop().split('+').join(' ');

          this.database.ref('downloads/' + ('_' + Math.random().toString(36).substr(2, 9))).set({
            email: user,
            song: song,
            time: String(new Date())
          });
        }
        catch(err) {
          console.warn(err);
        }
      } else {
        if (msg.data.operation == 'add') {
          const uid = this.authService.currentUser.uid
          this.database.ref('favorites/' + uid).once('value').then(this.dbAddCallback.bind(this, uid, msg));
        } else {
          const uid = this.authService.currentUser.uid;
          this.database.ref('favorites/' + uid).once('value').then(this.dbRemoveCallback.bind(this, uid, msg));
        }
      }
    }
  }

  dbAddCallback(uid, msg, snapshot) {
    if (msg && msg.data && msg.data.song) {
      let songs_array = []
      if (snapshot.val() && snapshot.val().songs) {
        songs_array = snapshot.val().songs
      }

      songs_array.push(msg.data.song)
      this.database.ref('favorites/' + uid).set({
        title: "Favorites",
        artist: this.authService.currentUser.email,
        description: `A collection of favorites for ${this.authService.currentUser.email}`,
        songs: songs_array,
        tags: []
      })
      this.toastr.successToastr('Added to favorites', msg.data.song.title, {animate: 'fade', toastTimeout: 800});
    }
  }

  dbRemoveCallback(uid, msg, snapshot) {
    if (msg && msg.data && msg.data.song) {
      let songs_array = []
      if (snapshot.val() && snapshot.val().songs) {
        songs_array = snapshot.val().songs
      }

      let idToBeRemoved = msg.data.song.id;

      let songToBeRemoved = songs_array.find(function(song) {
        return (song.id == idToBeRemoved);
      })

      let index = songs_array.indexOf(songToBeRemoved);

      songs_array.splice(index, 1);

      this.database.ref('favorites/' + uid).set({
        title: "Favorites",
        artist: this.authService.currentUser.email,
        description: `A collection of favorites for ${this.authService.currentUser.email}`,
        songs: songs_array,
        tags: []
      })
      this.toastr.successToastr('Removed from favorites', msg.data.song.title, {animate: 'fade', toastTimeout: 800});
    }
  }

  logout() {
    this.authService.logout();
  }
}
