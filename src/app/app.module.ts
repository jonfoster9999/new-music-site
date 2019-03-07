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
import { FormsModule} from '@angular/forms';
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
    AlbumComponent
  ],
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    AngularFontAwesomeModule,
    HttpClientModule,
    NgSelectModule,
    FlexLayoutModule,
    RouterModule.forRoot([
      { path: 'music', component: MusicComponent, children: [
        {path: '', redirectTo: 'fullsongs', pathMatch: 'full'},
        {path: 'fullsongs', component: PlayerComponent, data: { data: 'fullsongs'}},
        {path: 'advertising', component: PlayerComponent, data: { data: 'advertising'}},
        {path: 'albums', component: AlbumsComponent, children: [
            { path: ':albumId', component: AlbumComponent, outlet: 'album' }
          ]
        }
    ] },
      { path: 'videos', component: VideosComponent },
      { path: 'press', component: PressComponent },
      { path: 'about', component: AboutComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'work', component: WorkComponent},
      { path: 'credits', component: CreditsComponent },
      { path: '**', redirectTo: 'music' }
    ], {useHash: true})
  ],
  providers: [
    AlbumsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
