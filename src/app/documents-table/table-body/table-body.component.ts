import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Documents } from '../../models/documents.model';
import { ImportCsvService } from '../../services/import-csv.service';
import { Subscription } from 'rxjs';
import { DocumentsCountService } from '../../services/documents-count.service';

@Component({
  selector: 'app-table-body',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-body.component.html',
  styleUrl: './table-body.component.css'
})
export class TableBodyComponent {
  skip = 0;
  take = 50;
  documentsCount = 0;
  currentStart = 0;
  currentEnd = 50;
  subscription!: Subscription;
  documents: Documents[] = [];

  constructor(
    private importCSVService: ImportCsvService,
    private documentsCountService: DocumentsCountService
  ) {}

  ngOnInit(): void {
    this.subscription = this.documentsCountService.documentsCount$.subscribe(count => {
      this.documentsCount = count;
    });
    this.importCSVService.getDocumentsCount().subscribe(count => {
      this.documentsCountService.updateDocumentsCount(count);
    });
    this.loadDocuments();
    
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  
  clearDatabase(): void {
    this.importCSVService.clearDatabase().subscribe(() => {
      this.importCSVService.getDocumentsCount().subscribe(count => {
        this.documentsCountService.updateDocumentsCount(count);
        this.loadDocuments();
      });
    });
  }
  
  rebuildDatabase(): void {
    this.importCSVService.rebuildDatabase().subscribe(() => {
      this.importCSVService.getDocumentsCount().subscribe(count => {
        this.documentsCountService.updateDocumentsCount(count);
        this.loadDocuments();
      });
    });
  }
  
  downloadCSVFiles(): void {
    this.importCSVService.downloadDocumentsCsv().subscribe(blob => {
      this.downloadBlob(blob, 'documents.csv');
    });
  
    this.importCSVService.downloadDocumentItemsCsv().subscribe(blob => {
      this.downloadBlob(blob, 'documentItems.csv');
    });
  }
  
  private downloadBlob(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }
  
  loadDocuments(): void {
    this.importCSVService.getDocumentsPartial(this.skip, this.take).subscribe((data) => {
      this.documents = data;
      this.currentStart = this.skip + 1;
      this.currentEnd = Math.min(this.skip + this.take, this.documentsCount);
    });
  }

  nextPage(): void {
    if (this.skip + this.take < this.documentsCount) {
      this.skip += this.take;
      this.loadDocuments();
    }
  }

  prevPage(): void {
    if (this.skip > 0) {
      this.skip -= this.take;
      this.loadDocuments();
    }
  }

}
