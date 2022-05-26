import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsPostsComponent } from './accounts-posts.component';

describe('AccountsPostsComponent', () => {
  let component: AccountsPostsComponent;
  let fixture: ComponentFixture<AccountsPostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountsPostsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountsPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
