import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { RouterModule} from '@angular/router';
import { AppComponent } from './app.component';
import { MusicComponent } from './music/music.component';
import { PressComponent } from './press/press.component';
import { VideosComponent } from './videos/videos.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule} from "@angular/common/http";
import { AngularFontAwesomeModule} from 'angular-font-awesome';
import { WorkComponent } from './work/work.component';
import { AlbumsComponent } from './albums/albums.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AlbumsService } from './albums.service';
import { AlbumComponent } from './album/album.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgSelectModule } from '@ng-select/ng-select';
import { StaticAlbumComponent } from './static-album/static-album.component';
import { AuthComponent } from './auth/auth.component';
import { SignupComponent } from './signup/signup.component';
import { AuthService } from './auth.service';
import { MaterialModule } from './material.module';
import { SafePipe } from './safe.pipe';
import { ToastrModule } from 'ng6-toastr-notifications';

export function onAppInit(config) {
  return function() {

    // const password = window.prompt('Enter the password...');
    // if (password != 'net123') {
    //   window.location.href = "https://www.google.com";
    // }
  };
}

@NgModule({
  declarations: [
    AppComponent,
    MusicComponent,
    VideosComponent,
    AboutComponent,
    ContactComponent,
    WorkComponent,
    AlbumsComponent,
    AlbumComponent,
    StaticAlbumComponent,
    AuthComponent,
    SignupComponent,
    SafePipe,
    PressComponent
  ],
  imports: [
    MaterialModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFontAwesomeModule,
    HttpClientModule,
    NgSelectModule,
    FlexLayoutModule,
    ToastrModule.forRoot(),
    RouterModule.forRoot([
      { path: 'music', component: MusicComponent, children: [
        {path: '', redirectTo: 'albums', pathMatch: 'full'},
        {path: 'new-notable', component: StaticAlbumComponent, data: { context: 'new_notable' }},
        {path: 'favorites', component: StaticAlbumComponent, data: { context: 'favorites' }},
        {path: 'compilations', component: AlbumsComponent, data: { context: 'net_compilation' }, children: [
          { path: ':albumId', component: AlbumComponent, outlet: 'net_compilation' }
        ] },
        {path: 'albums', component: AlbumsComponent, data: { context: 'net_album' }, children: [
            { path: ':albumId', component: AlbumComponent, outlet: 'net_album' }
          ]
        }
    ] },
      { path: 'videos', component: VideosComponent },
      { path: 'login', component: AuthComponent, outlet: 'auth'},
      { path: 'signup', component: SignupComponent, outlet: 'auth'},
      { path: 'about', component: AboutComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'work', component: WorkComponent},
      { path: '**', redirectTo: 'music' }
    ], {useHash: true})
  ],
  providers: [
    AlbumsService,
    AuthService,
    {
     provide: APP_INITIALIZER,
     useFactory: onAppInit,
     multi: true,
     deps: [/* your dependencies */]
   }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
