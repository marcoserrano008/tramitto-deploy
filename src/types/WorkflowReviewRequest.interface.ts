import {WorkflowStepStatusEnum} from "./enum/WorkflowStepStatus.enum.ts";

export interface WorkflowReviewRequest {
  workflowStepId: number;
  decision: WorkflowStepStatusEnum;
  notes?: string;
  rejectionReasons?: string[];
}
