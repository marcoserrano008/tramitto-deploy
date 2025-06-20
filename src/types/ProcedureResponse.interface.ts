import {ProcedureStatusEnum} from "./enum/ProcedureStatus.enum.ts";
import {ProcedureStageEnum} from "./enum/ProcedureStage.enum.ts";
import {PaymentStatusEnum} from "./enum/PaymentStatus.enum.ts";
import {WorkflowStepResponse} from "./WorkflowStepResponse.interface.ts";
import {ProcedureDocumentResponse} from "./ProcedureDocumentResponse.interface.ts";
import {PaymentResponse} from "./PaymentResponse.interface.ts";
import {UserResponse} from "./User.interface.ts";

export interface ProcedureResponse {
  id: number;
  procedureTypeName: string;
  procedureTypeId: number;
  status: ProcedureStatusEnum;
  currentStage: ProcedureStageEnum;
  paymentStatus: PaymentStatusEnum;
  createdAt: string; // ISO string for LocalDateTime
  updatedAt: string;
  workflowSteps: WorkflowStepResponse[];
  documents: ProcedureDocumentResponse[];
  payment: PaymentResponse;
  user: UserResponse;
}
