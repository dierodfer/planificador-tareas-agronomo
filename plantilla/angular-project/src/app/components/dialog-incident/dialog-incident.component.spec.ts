import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogIncidentComponent } from './dialog-incident.component';

describe('DialogIncidentComponent', () => {
  let component: DialogIncidentComponent;
  let fixture: ComponentFixture<DialogIncidentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogIncidentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogIncidentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
