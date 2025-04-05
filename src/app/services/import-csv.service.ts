import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Documents } from '../models/documents.model';
import { DocumentsCountService } from './documents-count.service';
import { tap } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ImportCsvService {

  private apiUrl = 'http://localhost:5086'; 

  constructor(private http: HttpClient,
    private documentsCountService: DocumentsCountService
  ) {}

  importFiles(documentsFile: File, documentItemsFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('fileDocuments', documentsFile);
    formData.append('fileDocumentItems', documentItemsFile);
    return this.http.post(this.apiUrl+"/SaveCSV", formData).pipe(
      tap(() => {
        this.updateDocumentsCount();
      })
    );
  }
  clearDatabase(): Observable<void> {
    return this.http.delete<void>(this.apiUrl + "/ClearDatabase");
  }
  
  rebuildDatabase(): Observable<void> {
    return this.http.post<void>(this.apiUrl + "/RebuildDatabase", {});
  }
  
  downloadDocumentsCsv(): Observable<Blob> {
    return this.http.get(this.apiUrl + "/GetDocuments", {
      responseType: 'blob'
    });
  }
  downloadDocumentItemsCsv(): Observable<Blob> {
    return this.http.get(this.apiUrl + "/GetDocumentItems", {
      responseType: 'blob'
    });
  }
  getDocumentsPartial(skip: number = 0, take: number = 50): Observable<Documents[]> {
    return this.http.get<Documents[]>(this.apiUrl+"/GetDocuments/Partial?skip=" + skip +"&take=" + take);
  }

  getDocumentsCount(): Observable<number> {
    return this.http.get<number>(this.apiUrl + "/GetDocuments/Count");
  }

  private updateDocumentsCount(): void {
    this.getDocumentsCount().subscribe(count => {
      this.documentsCountService.updateDocumentsCount(count);
    });
  }
}
