import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaDraggableComponent } from './lista-draggable.component';

describe('ListaDraggableComponent', () => {
  let component: ListaDraggableComponent;
  let fixture: ComponentFixture<ListaDraggableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaDraggableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaDraggableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
