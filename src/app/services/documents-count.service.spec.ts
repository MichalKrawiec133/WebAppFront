import { TestBed } from '@angular/core/testing';

import { DocumentsCountService } from './documents-count.service';

describe('DocumentsCountService', () => {
  let service: DocumentsCountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentsCountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
