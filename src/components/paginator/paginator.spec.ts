import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Paginator } from './paginator';

describe('Paginator', () => {
  let component: Paginator;
  let fixture: ComponentFixture<Paginator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Paginator],
    }).compileComponents();

    fixture = TestBed.createComponent(Paginator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate total pages correctly', () => {
    component.totalItems = 100;
    component.itemsPerPage = 10;
    expect(component.totalPages).toBe(10);
  });

  it('should emit page change event', () => {
    spyOn(component.pageChange, 'emit');
    component.goToPage(2);
    expect(component.pageChange.emit).toHaveBeenCalledWith(2);
  });

  it('should not emit page change for invalid page', () => {
    spyOn(component.pageChange, 'emit');
    component.totalItems = 30;
    component.itemsPerPage = 10;
    component.currentPage = 1;

    component.goToPage(0);
    expect(component.pageChange.emit).not.toHaveBeenCalled();

    component.goToPage(4);
    expect(component.pageChange.emit).not.toHaveBeenCalled();
  });

  it('should handle previous page correctly', () => {
    component.currentPage = 2;
    spyOn(component.pageChange, 'emit');
    component.previousPage();
    expect(component.pageChange.emit).toHaveBeenCalledWith(1);
  });

  it('should handle next page correctly', () => {
    component.currentPage = 1;
    component.totalItems = 30;
    component.itemsPerPage = 10;
    spyOn(component.pageChange, 'emit');
    component.nextPage();
    expect(component.pageChange.emit).toHaveBeenCalledWith(2);
  });
});
