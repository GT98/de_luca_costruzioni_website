import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeEstimate } from './free-estimate';

describe('FreeEstimate', () => {
  let component: FreeEstimate;
  let fixture: ComponentFixture<FreeEstimate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FreeEstimate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FreeEstimate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
