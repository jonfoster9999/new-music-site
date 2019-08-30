import { AuthService } from './../auth.service';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  userId: string;
  database;
  constructor(private authService: AuthService) { 
    if (this.authService.currentUser) {
      this.userId = this.authService.currentUser.uid
      this.database = firebase.database();
    }
  }

  proccessPayment(token: any, amount) {
    const payment = { token, amount };
    console.log('payment object', payment)
  }
}
