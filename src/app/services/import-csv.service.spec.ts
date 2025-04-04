import { TestBed } from '@angular/core/testing';

import { ImportCsvService } from './import-csv.service';

describe('ImportCsvService', () => {
  let service: ImportCsvService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImportCsvService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
