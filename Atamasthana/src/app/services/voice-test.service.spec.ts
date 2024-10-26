import { TestBed } from '@angular/core/testing';

import { VoiceTestService } from './voice-test.service';

describe('VoiceTestService', () => {
  let service: VoiceTestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VoiceTestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
