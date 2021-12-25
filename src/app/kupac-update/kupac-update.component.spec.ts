import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KupacUpdateComponent } from './kupac-update.component';

describe('KupacUpdateComponent', () => {
  let component: KupacUpdateComponent;
  let fixture: ComponentFixture<KupacUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KupacUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KupacUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
