export interface RegisterPaymentRequest {
  procedureId: number;
  amount: number;
  paymentMethod: string;
  transactionId?: string;
  userId?: number;
}
