import { TestBed } from '@angular/core/testing';

import { NativeRouterService } from './native-router.service';

describe('NativeRouterService', () => {
  let service: NativeRouterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NativeRouterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
