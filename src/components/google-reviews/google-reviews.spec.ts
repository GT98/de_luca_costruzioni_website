import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleReviews } from './google-reviews';

describe('GoogleReviews', () => {
  let component: GoogleReviews;
  let fixture: ComponentFixture<GoogleReviews>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoogleReviews]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoogleReviews);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
