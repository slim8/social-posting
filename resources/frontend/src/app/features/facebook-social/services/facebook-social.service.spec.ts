import { TestBed } from '@angular/core/testing';

import { FacebookSocialService } from './facebook-social.service';

describe('FacebookSocialService', () => {
  let service: FacebookSocialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FacebookSocialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
