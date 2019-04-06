import { AuthService } from './../auth.service';
import {AfterViewChecked, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-music',
  templateUrl: './music.component.html',
  styleUrls: ['./music.component.css']
})
export class MusicComponent implements OnInit, AfterViewChecked {
  fragment;
  alreadyScrolled = false;
  constructor(private route: ActivatedRoute, public authService: AuthService) {};

  ngOnInit() {
    this.route.fragment.subscribe(fragment => { this.fragment = fragment; });
  }

  ngAfterViewChecked(): void {
    try {
      if(this.fragment && !this.alreadyScrolled) {
        document.querySelector('#' + this.fragment).scrollIntoView();
        this.alreadyScrolled = true;
      }
    } catch (e) { }
  }
}
