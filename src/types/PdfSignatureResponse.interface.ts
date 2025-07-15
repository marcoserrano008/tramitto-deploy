export interface PdfSignatureResponse {
  signerName: string
  reason: string
  location: string
  signedAt: string
  valid: boolean
  certificateValid: boolean
  documentIntact: boolean
  algorithm: string
  issuer: string
  certificateValidFrom: string
  certificateValidTo: string
}