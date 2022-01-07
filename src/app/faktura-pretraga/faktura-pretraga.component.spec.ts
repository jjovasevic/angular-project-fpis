import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FakturaPretragaComponent } from './faktura-pretraga.component';

describe('FakturaPretragaComponent', () => {
  let component: FakturaPretragaComponent;
  let fixture: ComponentFixture<FakturaPretragaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FakturaPretragaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FakturaPretragaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
