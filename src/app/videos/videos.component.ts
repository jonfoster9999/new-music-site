import {AfterViewChecked, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.css']
})
export class VideosComponent implements OnInit, AfterViewChecked {
  fragment;
  alreadyScrolled = false;
  constructor(private route: ActivatedRoute) {};

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
