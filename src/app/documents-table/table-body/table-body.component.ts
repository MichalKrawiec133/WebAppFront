import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Documents } from '../../models/documents.model';
import { ImportCsvService } from '../../services/import-csv.service';

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
  currentEnd = 0;
  documents: Documents[] = [];

  constructor(private importCSVService: ImportCsvService) {}

  ngOnInit(): void {
    this.loadDocuments();
    this.loadDocumentsCount();
  }

  loadDocumentsCount(): void {
    this.importCSVService.getDocumentsCount().subscribe((count) => {
      this.documentsCount = count;
    });
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
