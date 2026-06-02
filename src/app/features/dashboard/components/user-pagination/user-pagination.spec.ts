import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPagination } from './user-pagination';

describe('UserPagination', () => {
  let component: UserPagination;
  let fixture: ComponentFixture<UserPagination>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPagination],
    }).compileComponents();

    fixture = TestBed.createComponent(UserPagination);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
