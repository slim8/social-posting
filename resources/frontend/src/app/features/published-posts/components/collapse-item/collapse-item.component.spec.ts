import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollapseItemComponent } from './collapse-item.component';

describe('CollapseItemComponent', () => {
  let component: CollapseItemComponent;
  let fixture: ComponentFixture<CollapseItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollapseItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollapseItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
