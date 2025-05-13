import {DocumentTypeEnum} from "./enum/DocumentType.enum.ts";

export interface AttachDocumentRequest {
  procedureId: number;
  documentType: DocumentTypeEnum;
  documentId: string;
}
