import {AfterViewChecked, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs/index";

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit, AfterViewChecked {
  private sub: Subscription;
  fragment;
  data: string;
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.fragment.subscribe(fragment => { this.fragment = fragment; });
    this.sub = this.route
      .data
      .subscribe(v => this.data = v.data);
  }

  ngAfterViewChecked(): void {
    try {
      if(this.fragment === 'top') {
        window.scrollTo(0, 0);
      }
    } catch (e) { }
  }

}
