import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowOn } from './follow-on';

describe('FollowOn', () => {
  let component: FollowOn;
  let fixture: ComponentFixture<FollowOn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FollowOn]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FollowOn);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
