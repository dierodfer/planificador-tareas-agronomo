import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogIncidentDetailsComponent } from './dialog-incident-details.component';

describe('DialogIncidentDetailsComponent', () => {
  let component: DialogIncidentDetailsComponent;
  let fixture: ComponentFixture<DialogIncidentDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogIncidentDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogIncidentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
