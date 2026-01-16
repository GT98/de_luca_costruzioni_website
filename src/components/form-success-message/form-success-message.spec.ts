import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormSuccessMessage } from './form-success-message';

describe('FormSuccessMessage', () => {
  let component: FormSuccessMessage;
  let fixture: ComponentFixture<FormSuccessMessage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormSuccessMessage],
    }).compileComponents();

    fixture = TestBed.createComponent(FormSuccessMessage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display default title and message', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h2').textContent).toContain('RICHIESTA INVIATA CON SUCCESSO!');
  });

  it('should emit reset event when button is clicked', () => {
    spyOn(component.reset, 'emit');
    const button = fixture.nativeElement.querySelector('.back-button');
    button.click();
    expect(component.reset.emit).toHaveBeenCalled();
  });

  it('should use custom title when provided', () => {
    component.title = 'Custom Title';
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h2').textContent).toContain('Custom Title');
  });
});
