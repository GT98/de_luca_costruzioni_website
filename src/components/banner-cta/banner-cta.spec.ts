import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerCta } from './banner-cta';

describe('BannerCta', () => {
  let component: BannerCta;
  let fixture: ComponentFixture<BannerCta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BannerCta]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BannerCta);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
