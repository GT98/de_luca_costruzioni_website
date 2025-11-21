import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImgSectionHeader } from './img-section-header';

describe('ImgSectionHeader', () => {
  let component: ImgSectionHeader;
  let fixture: ComponentFixture<ImgSectionHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImgSectionHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImgSectionHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
