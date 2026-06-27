import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SiteFooterComponent } from '../../components/site-footer/site-footer.component';
import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'app-payment-success',
  imports: [CommonModule, RouterLink, SiteFooterComponent],
  templateUrl: './payment-success.component.html',
  styleUrl: './payment-success.component.css'
})
export class PaymentSuccessComponent implements OnInit {
  isLoading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    const sessionId = this.route.snapshot.queryParamMap.get('session_id');

    if (!sessionId) {
      this.errorMessage = 'Missing Stripe session id.';
      this.isLoading = false;
      return;
    }

    this.paymentService.verifySuccessfulPayment(sessionId).subscribe({
      next: (order) => {
        this.router.navigate(['/track-order'], { queryParams: { orderId: order.id } });
      },
      error: () => {
        this.errorMessage = 'Unable to verify the payment right now. Please try tracking your order manually.';
        this.isLoading = false;
      }
    });
  }
}
