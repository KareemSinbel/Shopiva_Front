import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';
import { User, UserRole } from '../../models/user';

@Component({
  selector: '[app-user-row]',
  standalone: true,
  imports: [],
  host: { class: 'hover:bg-primary/5 transition-colors group' },
  templateUrl: './user-row.html',
  styleUrl: './user-row.css',
})
export class UserRow {
  @Input({ required: true }) user!: User;

  @Output() edit       = new EventEmitter<User>();
  @Output() suspend    = new EventEmitter<User>();
  @Output() reactivate = new EventEmitter<User>();
  @Output() delete     = new EventEmitter<User>();

  get initials(): string {
    //return this.user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    return this.user.firstName[0].toUpperCase();
  }

  get roleBadgeClass(): string {
    const map: Record<UserRole, string> = {
      Admin:    'bg-primary/10 text-primary',
      Seller:   'bg-secondary/10 text-secondary',
      Customer: 'bg-surface-variant text-on-surface-variant',
    };
    return map[this.user.roles[0]] || 'bg-gray-100 text-gray-800';
  }
}
