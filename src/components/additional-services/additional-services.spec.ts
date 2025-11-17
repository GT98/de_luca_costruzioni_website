import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalServices } from './additional-services';

describe('AdditionalServices', () => {
  let component: AdditionalServices;
  let fixture: ComponentFixture<AdditionalServices>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdditionalServices]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdditionalServices);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
