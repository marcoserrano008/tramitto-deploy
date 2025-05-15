import {WorkflowStepNameEnum} from "./enum/WorkflowStepName.enum.ts";
import {WorkflowStepStatusEnum} from "./enum/WorkflowStepStatus.enum.ts";

export interface WorkflowStepResponse {
  id: number;
  stepName: WorkflowStepNameEnum;
  status: WorkflowStepStatusEnum;
  startedAt: string | null;
  completedAt: string | null;
  notes: string;
  rejectionReasons: string[];
}
