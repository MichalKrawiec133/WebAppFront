import { DocumentItems } from "./document-items.model";
export class Documents {

    documentId!: number;
    type!: string;
    date!: string; 
    firstName!: string;
    lastName!: string;
    city!: string;
    documentItems!: DocumentItems[];

}
