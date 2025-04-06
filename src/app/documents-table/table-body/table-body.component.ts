import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Documents } from '../../models/documents.model';
import { ImportCsvService } from '../../services/import-csv.service';
import { Subscription } from 'rxjs';
import { DocumentsCountService } from '../../services/documents-count.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-table-body',
  standalone: true,
  imports: [CommonModule,
    FormsModule
  ],
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
  searchField: string = 'firstName';
  searchValue: string = '';
  isSearching: boolean = false;

  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

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
  
  deleteDocument(documentId: number): void {
      this.importCSVService.deleteDocument(documentId).subscribe(() => {
        this.importCSVService.getDocumentsCount().subscribe(count => {
          this.documentsCountService.updateDocumentsCount(count);
          this.loadDocuments();
        });
      });
    
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
  
  searchDocuments(): void {
    if (!this.searchValue.trim()) return;
  
    this.isSearching = true;
    this.importCSVService.getDocumentsSearch(this.searchField, this.searchValue.trim())
      .subscribe((data) => {
        this.documents = data;
        this.documentsCount = data.length;
        this.skip = 0;
        this.currentStart = 1;
        this.currentEnd = data.length;
      });
  }
  
  resetSearch(): void {
    this.isSearching = false;
    this.searchValue = '';
    this.skip = 0;
    this.importCSVService.getDocumentsCount().subscribe(count => {
      this.documentsCountService.updateDocumentsCount(count);
      this.loadDocuments();
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
  
  onImportCompleted(): void {
    this.skip = 0;
    this.importCSVService.getDocumentsCount().subscribe(count => {
      this.documentsCountService.updateDocumentsCount(count);
      this.loadDocuments(); 
    });
  }

  loadDocuments(): void {
    if (this.isSearching) return;
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
  firstPage(): void {
    this.skip = 0;
    this.loadDocuments();
  }

  lastPage(): void {
    const lastPageSkip = Math.max(0, Math.floor((this.documentsCount - 1) / this.take) * this.take);
    this.skip = lastPageSkip;
    this.loadDocuments();
  }

}
