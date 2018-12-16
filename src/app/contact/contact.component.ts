import {AfterViewChecked, Component, OnInit} from '@angular/core';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit, AfterViewChecked {
  fragment: string;
  email: string;
  body: string;
  name: string;
  messageSuccessfullySent = false;
  messageError = false;
  showSpinner = false;
  constructor(private http: HttpClient, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.fragment.subscribe(fragment => { this.fragment = fragment; });
  }

  onSubmit(form) {
    this.showSpinner = true;
    this.http.post('https://ttx2837v69.execute-api.us-east-1.amazonaws.com/dev/email', form.value, {responseType: 'text'})
      .subscribe(res => {
        const resp = JSON.parse(res);
        this.showSpinner = false;
        if (resp.message === 'successful') {
          this.messageSuccessfullySent = true;
        } else {
          console.log('nope')
          this.showSpinner = false;
          this.messageError = true;
        }
      },
      err => {
        this.showSpinner = false;
        this.messageError = true;
      }
    )
      ;
  }

  ngAfterViewChecked(): void {
    try {
      if(this.fragment) {
        document.querySelector('#' + this.fragment).scrollIntoView();
      }
    } catch (e) { }
  }

}
