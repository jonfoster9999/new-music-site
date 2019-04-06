import {AfterViewChecked, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-work',
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.css']
})
export class WorkComponent implements OnInit, AfterViewChecked {
  fragment;
  alreadyScrolled = false;

  constructor(private route: ActivatedRoute) { }

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
