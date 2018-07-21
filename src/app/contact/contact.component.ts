import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpClientModule} from "@angular/common/http";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  email: string;
  body: string;
  name: string;
  messageSuccessfullySent = false;
  messageError = false;
  showSpinner = false;
  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  onSubmit(form) {
    this.showSpinner = true;
    this.http.post('https://ttx2837v69.execute-api.us-east-1.amazonaws.com/dev/email', form.value, {responseType: 'text'})
      .subscribe(res => {
        const resp = JSON.parse(res);
        console.log(resp);
        this.showSpinner = false;
        if (resp.message === 'successful') {
          this.messageSuccessfullySent = true;
        } else {
          this.messageError = true;
        }
      });
  }

}
