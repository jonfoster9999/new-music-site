import {AfterViewChecked, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit, AfterViewChecked {
  alreadyScrolled = false;
  fragment;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.fragment.subscribe(fragment => { this.fragment = fragment; });
  }

  ngAfterViewChecked(): void {
    try {
      if(this.fragment && !this.alreadyScrolled) {
        this.alreadyScrolled = true;
        window.scrollTo(0, 790);
      }
    } catch (e) { }
  }

}
