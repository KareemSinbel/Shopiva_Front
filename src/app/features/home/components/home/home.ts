import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FeaturedProductsComponent } from '../../../products/components/featured-products/featured-products';
import { GradientButton } from "../../../../shared/components/gradient-button/gradient-button";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, FeaturedProductsComponent, GradientButton],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  emailInput = '';

  readonly categories = [
    {
      label: 'Tech',
      subtitle: 'Modern hardware redefined.',
      gridClass: 'md:col-span-2 md:row-span-2',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwdWu9x6z1KIS6grmAzaru9EsDvcWuqS84Z-aNkiNhtKGqAzzTo-4gG27brGFKHV85FF3Q8hpqpbAPyUuiL-3hYMoRcv7OOTcMz2kI70WiEJeaqQ01chC_PewlqAIX4wLpHAyf60HbOxXapIBNwW03h300ZtmcK-Qm-a6gwB2vVKR5ZIogA1QLAMOr980s0ohqDzQB8uo7wFKJyg84rQptCNjCJNWptyLuvbljSoeo3xOBl5kzZqq2uerbDLYozCPfyZApakafYso',
      overlayClass: 'absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent',
      contentClass: 'absolute bottom-8 left-8',
      titleClass: 'text-white font-headline-md text-headline-md mb-2',
      showCta: false,
      offset: false,
    },
    {
      label: 'Luxury',
      subtitle: null,
      gridClass: '',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGgV5A_wm4s1xC7xLysMrIkGL5_UrgXXljUVkbUMt410lO61l-wCKGFyF_Pq3bEV4nHU9iY6YjjFQeC-SNmr98KW936Nvx1UTrQOwo3bWLbbSj7qCnBNI41jxPobBhRUkUMrxKmELUoedLMNhnQ6vDXSDjUS9vIw_84tiR1kBsxC4UvVRu0jntvqfXZ0YWPi2M7d7_76JGJ4dFMDBvTGP1pfyOgBIWRV37Rt3B7qjqXm_9ahCyKf2WzVJD2bZ3x0r-Kd5VFU1Nwhk',
      overlayClass: 'absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors',
      contentClass: 'absolute inset-0 flex flex-col items-center justify-center text-white',
      titleClass: 'font-headline-md text-headline-md',
      showCta: false,
      offset: false,
    },
    {
      label: 'Limited',
      subtitle: null,
      gridClass: '',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAusMaHgj9-_V17XWlRatBSKuhVm39jVmNxg8Hb2URBJVcfkrm6I5EdgGOpoGGFUhsC7r75yKhHa9xkWwgswwYFaVd6WI45MDOzLF6Ut35wjkH4kYlfVrVsKelCVDnu3HaZqO-5xH81AYjjGeje7Z9cU1Fm5pAH6nRhN4nlsVhREroLrbhhwmnKYtNPrjd7qBMRx6-c-evDiTnUY3LJqYk7lH_z-y-I-3mxqEilrkh5jDgkoEtjnBCZh_FN5WG32P5fs7ABTr4RWHk',
      overlayClass: 'absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors',
      contentClass: 'absolute inset-0 flex flex-col items-center justify-center text-white',
      titleClass: 'font-headline-md text-headline-md',
      showCta: false,
      offset: false,
    },
    {
      label: 'New Arrivals',
      subtitle: null,
      gridClass: 'md:col-span-2',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBe1Tp9g_QCqkgOo9lGf7keZB8QZdW0j_N2sr0lfzxbV_2ciKib2Ja04FzQ7UoQQffUOHNAsAcPK8LtYJC-8KJGiERC8fSltmP3Cr_2nO6ZxI6TaHPNjY41uKejKvPH6RxjmHU-ynSwiyOnfraVfFYXXAp1fIWhOqH47XfiQnLYu7WEkCPnuO4mP4OPRgBab7dySdRNHG3R3rXHhG67WmZgpUmi9MFZL3eUyDWCNI6gH-5_5e2X-37fwATkh0XTVkQ7zKIJcrW9eaI',
      overlayClass: 'absolute inset-0 bg-gradient-to-r from-black/40 to-transparent',
      contentClass: 'absolute left-8 top-1/2 -translate-y-1/2',
      titleClass: 'text-white font-headline-md text-headline-md',
      showCta: true,
      offset: false,
    },
  ];

  readonly stats = [
    { value: '99%',       label: 'Client Satisfaction', colorClass: 'text-primary',   offset: false },
    { value: '12k+',      label: 'Global Orders',        colorClass: 'text-secondary', offset: true  },
    { value: '24h',       label: 'VIP Support',          colorClass: 'text-tertiary',  offset: false },
    { value: 'Exclusive', label: 'Member Access',        colorClass: 'text-primary',   offset: true  },
  ];

  subscribeNewsletter(): void {
    if (!this.emailInput) return;
    // TODO: call NewsletterService
    console.log('Subscribe:', this.emailInput);
    this.emailInput = '';
  }
}
