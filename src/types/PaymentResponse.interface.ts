import {PaymentStatusEnum} from "./enum/PaymentStatus.enum.ts";

export interface PaymentResponse {
  id: number;
  amount: string;
  paymentMethod: string;
  transactionId: string;
  status: PaymentStatusEnum;
  paymentDate: string;
}
