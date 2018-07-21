import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {RouterModule} from '@angular/router';
import { AppComponent } from './app.component';
import { MusicComponent } from './music/music.component';
import { PlayerComponent } from './music/player/player.component';
import { VideosComponent } from './videos/videos.component';
import { PressComponent } from './press/press.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
    MusicComponent,
    PlayerComponent,
    VideosComponent,
    PressComponent,
    AboutComponent,
    ContactComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: 'music', component: MusicComponent, children: [
        {path: '', redirectTo: 'fullsongs', pathMatch: 'full'},
        {path: 'fullsongs', component: PlayerComponent, data: { data: 'fullsongs'}},
        {path: 'advertising', component: PlayerComponent, data: { data: 'advertising'}}
    ] },
      { path: 'videos', component: VideosComponent },
      { path: 'press', component: PressComponent },
      { path: 'about', component: AboutComponent },
      { path: 'contact', component: ContactComponent },
      { path: '**', redirectTo: 'music' }
    ], {useHash: true})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
