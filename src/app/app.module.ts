import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {RouterModule} from '@angular/router';
import { AppComponent } from './app.component';
import { MusicComponent } from './music/music.component';
import { PlayerComponent } from './music/player/player.component';

@NgModule({
  declarations: [
    AppComponent,
    MusicComponent,
    PlayerComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      { path: 'music', component: MusicComponent, children: [
        {path: '', redirectTo: 'fullsongs', pathMatch: 'full'},
        {path: 'fullsongs', component: PlayerComponent, data: { data: 'fullsongs'}},
        {path: 'advertising', component: PlayerComponent, data: { data: 'advertising'}}
    ] },
      { path: '**', redirectTo: 'music' }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
