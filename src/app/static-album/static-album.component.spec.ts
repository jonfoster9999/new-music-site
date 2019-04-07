import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewNotableComponent } from './new-notable.component';

describe('NewNotableComponent', () => {
  let component: NewNotableComponent;
  let fixture: ComponentFixture<NewNotableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewNotableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewNotableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
