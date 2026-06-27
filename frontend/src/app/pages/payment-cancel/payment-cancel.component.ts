import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteFooterComponent } from '../../components/site-footer/site-footer.component';

@Component({
  selector: 'app-payment-cancel',
  imports: [CommonModule, RouterLink, SiteFooterComponent],
  templateUrl: './payment-cancel.component.html',
  styleUrl: './payment-cancel.component.css'
})
export class PaymentCancelComponent {}
