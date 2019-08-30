import { environment } from './../../../environments/environment.prod';
import { Component, OnInit, HostListener } from '@angular/core';
import { PaymentService } from '../payment.service';

declare var StripeCheckout: any;

@Component({
  selector: 'app-make-payment',
  templateUrl: './make-payment.component.html',
  styleUrls: ['./make-payment.component.css']
})
export class MakePaymentComponent implements OnInit {

  handler: any;
  amount: number = 500;
  
  constructor(private paymentSvc: PaymentService) { }

  ngOnInit() {
    this.handler = StripeCheckout.configure({
      key: environment.stripeKey,
      locale: 'auto',
      token: token => {
        this.paymentSvc.proccessPayment(token, this.amount)
      }
    })
  }

  handlePayment() {
    this.handler.open({
      name: 'NeverEndingTape',
      description: 'Pay',
      amount: this.amount
    })
  }

  @HostListener('window:popstate')
    onpopstate() {
      this.handler.close();
    }
}
