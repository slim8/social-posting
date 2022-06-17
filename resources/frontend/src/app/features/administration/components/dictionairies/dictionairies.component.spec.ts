import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DictionairiesComponent } from './dictionairies.component';

describe('DictionairiesComponent', () => {
  let component: DictionairiesComponent;
  let fixture: ComponentFixture<DictionairiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DictionairiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DictionairiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
