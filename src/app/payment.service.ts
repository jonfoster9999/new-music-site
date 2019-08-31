import { environment } from './../environments/environment';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  userId: string;
  database;
  constructor(private authService: AuthService, private httpClient: HttpClient) { 
    if (this.authService.currentUser) {
      this.userId = this.authService.currentUser.uid
      this.database = firebase.database();
    }
  }

  proccessPayment(token: any, amount) {
    const payment = { token, amount };
    console.log('payment object', payment)
    this.httpClient.post(`${environment['rails_api_host']}/api/payments`, payment)
      .subscribe(x => console.log(x))
  }
}
