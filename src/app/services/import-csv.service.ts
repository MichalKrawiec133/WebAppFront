import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Documents } from '../models/documents.model';

@Injectable({
  providedIn: 'root'
})
export class ImportCsvService {

  private apiUrl = 'http://localhost:5086'; 

  constructor(private http: HttpClient) {}

  importFiles(documentsFile: File, documentItemsFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('fileDocuments', documentsFile);
    formData.append('fileDocumentItems', documentItemsFile);
    console.log(this.apiUrl+"SaveCSV");
    return this.http.post(this.apiUrl+"/SaveCSV", formData);
  }

  getDocumentsPartial(skip: number = 0, take: number = 50): Observable<Documents[]> {
    return this.http.get<Documents[]>(`${this.apiUrl}/GetDocuments/Partial?skip=${skip}&take=${take}`);
  }

  getDocumentsCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/GetDocuments/Count`);
  }
}
