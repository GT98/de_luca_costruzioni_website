import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PorfolioDetail } from './portfolio-detail';

describe('PortfolioDetail', () => {
  let component: PorfolioDetail;
  let fixture: ComponentFixture<PorfolioDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PorfolioDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PorfolioDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
