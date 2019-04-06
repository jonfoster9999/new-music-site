import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompilationsComponent } from './compilations.component';

describe('CompilationsComponent', () => {
  let component: CompilationsComponent;
  let fixture: ComponentFixture<CompilationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompilationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompilationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
