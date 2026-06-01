import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiConfig {
  readonly baseUrl = environment.api.baseUrl;
<<<<<<< Updated upstream
=======
  readonly stripePublishableKey = ""
>>>>>>> Stashed changes
}
