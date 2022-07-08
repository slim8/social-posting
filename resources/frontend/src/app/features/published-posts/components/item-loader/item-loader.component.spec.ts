import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemLoaderComponent } from './item-loader.component';

describe('ItemLoaderComponent', () => {
  let component: ItemLoaderComponent;
  let fixture: ComponentFixture<ItemLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
