import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FakturaUpdateComponent } from './faktura-update.component';

describe('FakturaUpdateComponent', () => {
  let component: FakturaUpdateComponent;
  let fixture: ComponentFixture<FakturaUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FakturaUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FakturaUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
