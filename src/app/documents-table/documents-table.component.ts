import { Component, ViewChild } from '@angular/core';
import { ImportComponent } from "./import/import.component";
import { TableBodyComponent } from './table-body/table-body.component';

@Component({
  selector: 'app-documents-table',
  standalone: true,
  imports: [
    ImportComponent,
    TableBodyComponent
  ],
  templateUrl: './documents-table.component.html',
  styleUrl: './documents-table.component.css'
})
export class DocumentsTableComponent {
  @ViewChild('tableBody') tableBodyComponent!: TableBodyComponent;

  handleImportCompleted(): void {
    this.tableBodyComponent.onImportCompleted(); 
  }
}
