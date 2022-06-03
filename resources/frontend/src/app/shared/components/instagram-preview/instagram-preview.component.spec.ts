import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstagramPreviewComponent } from './instagram-preview.component';

describe('InstagramPreviewComponent', () => {
  let component: InstagramPreviewComponent;
  let fixture: ComponentFixture<InstagramPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstagramPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstagramPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
