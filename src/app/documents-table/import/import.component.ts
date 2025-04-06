import { Component, EventEmitter, Output } from '@angular/core';
import { ImportCsvService } from '../../services/import-csv.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-import',
  standalone: true,
  imports: [NgIf],
  templateUrl: './import.component.html',
  styleUrl: './import.component.css'
})
export class ImportComponent {
  @Output() importCompleted = new EventEmitter<void>();
  documentsFile: File | null = null;
  documentItemsFile: File | null = null;
  errorMessage: string = '';
  filesSent: string = '';
  constructor(
    private importCsvService: ImportCsvService
  ) {}

  onFileSelected(event: any, type: 'documents' | 'items') {
    const file: File = event.target.files[0];
    if (file && file.name.endsWith('.csv')) {
      if (type === 'documents') {
        this.documentsFile = file;
      } else {
        this.documentItemsFile = file;
      }
      this.errorMessage = '';
    } else {
      this.errorMessage = 'Przesyłane pliki muszą mieć rozszerzenie csv';
    }
  }

  importFiles() {
    if (this.documentsFile && this.documentItemsFile) {
      this.importCsvService.importFiles(this.documentsFile, this.documentItemsFile).subscribe({
        next: () => {
          this.importCompleted.emit(); 
        },
        error: (err) => {
          
        }
      });
    }

  }


}
