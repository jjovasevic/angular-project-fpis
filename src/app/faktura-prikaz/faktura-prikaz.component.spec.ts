import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FakturaPrikazComponent } from './faktura-prikaz.component';

describe('FakturaPrikazComponent', () => {
  let component: FakturaPrikazComponent;
  let fixture: ComponentFixture<FakturaPrikazComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FakturaPrikazComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FakturaPrikazComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
