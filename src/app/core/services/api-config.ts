import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiConfig {
  readonly baseUrl = environment.api.baseUrl;
  readonly stripePublishableKey = "pk_test_51TdTRtLynZtEcTLPfC2YfcFyq7H4NOi0m1KJgJ5kdqTigyXKyN9Xh0U5u9H4nNImTY9ehwbfCgAi6OWXeJNiwJ4200ScvS3oM0"
}
