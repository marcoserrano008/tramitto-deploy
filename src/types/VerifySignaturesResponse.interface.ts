import {PdfSignatureResponse} from "./PdfSignatureResponse.interface.ts";

export interface VerifySignaturesResponse {
  hasSingatures: boolean
  allSignaturesValid: boolean
  totalSignatures: number
  signatures: PdfSignatureResponse[]
  fileName: string
  fileSize: number | null
  errorMessage: string | null
}
