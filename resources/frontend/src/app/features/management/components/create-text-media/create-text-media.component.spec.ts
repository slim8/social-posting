import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTextMediaComponent } from './create-text-media.component';

describe('CreateTextMediaComponent', () => {
  let component: CreateTextMediaComponent;
  let fixture: ComponentFixture<CreateTextMediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateTextMediaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTextMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
