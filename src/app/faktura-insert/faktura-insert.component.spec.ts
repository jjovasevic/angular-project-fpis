import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FakturaInsertComponent } from './faktura-insert.component';

describe('FakturaInsertComponent', () => {
  let component: FakturaInsertComponent;
  let fixture: ComponentFixture<FakturaInsertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FakturaInsertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FakturaInsertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
