import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaksFormComponent } from './taks-form.component';

describe('TaksFormComponent', () => {
  let component: TaksFormComponent;
  let fixture: ComponentFixture<TaksFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaksFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaksFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
