import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ristrutturazioni } from './ristrutturazioni';

describe('Ristrutturazioni', () => {
  let component: Ristrutturazioni;
  let fixture: ComponentFixture<Ristrutturazioni>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ristrutturazioni]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ristrutturazioni);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
