import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule} from '@angular/router';
import { AppComponent } from './app.component';
import { MusicComponent } from './music/music.component';
import { PlayerComponent } from './music/player/player.component';
import { VideosComponent } from './videos/videos.component';
import { PressComponent } from './press/press.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule} from "@angular/common/http";
import { CreditsComponent } from './credits/credits.component';
import { AngularFontAwesomeModule} from 'angular-font-awesome';
import { WorkComponent } from './work/work.component';
import { AlbumsComponent } from './albums/albums.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AlbumsService } from './albums.service';
import { AlbumComponent } from './album/album.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgSelectModule } from '@ng-select/ng-select';
import { NewNotableComponent } from './new-notable/new-notable.component';
import { AuthComponent } from './auth/auth.component';
import { SignupComponent } from './signup/signup.component';
import { AuthService } from './auth.service';
import { MaterialModule } from './material.module';

@NgModule({
  declarations: [
    AppComponent,
    MusicComponent,
    PlayerComponent,
    VideosComponent,
    PressComponent,
    AboutComponent,
    ContactComponent,
    CreditsComponent,
    WorkComponent,
    AlbumsComponent,
    AlbumComponent,
    NewNotableComponent,
    AuthComponent,
    SignupComponent
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
    RouterModule.forRoot([
      { path: 'music', component: MusicComponent, children: [
        {path: '', redirectTo: 'albums', pathMatch: 'full'},
        {path: 'fullsongs', component: PlayerComponent, data: { data: 'fullsongs'}},
        {path: 'new-notable', component: NewNotableComponent},
        {path: 'advertising', component: PlayerComponent, data: { data: 'advertising'}},
        {path: 'albums', component: AlbumsComponent, children: [
            { path: ':albumId', component: AlbumComponent, outlet: 'album' }
          ]
        }
    ] },
      { path: 'videos', component: VideosComponent },
      { path: 'login', component: AuthComponent, outlet: 'auth'},
      { path: 'signup', component: SignupComponent, outlet: 'auth'},
      { path: 'press', component: PressComponent },
      { path: 'about', component: AboutComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'work', component: WorkComponent},
      { path: 'credits', component: CreditsComponent },
      { path: '**', redirectTo: 'music' }
    ], {useHash: true})
  ],
  providers: [
    AlbumsService,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
