import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentsCountService {

  constructor() { }
  private documentsCountSubject = new BehaviorSubject<number>(0);
  documentsCount$ = this.documentsCountSubject.asObservable();

  updateDocumentsCount(count: number): void {
    this.documentsCountSubject.next(count);
  }
}
