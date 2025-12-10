import {WorkflowReviewRequest} from "../types/WorkflowReviewRequest.interface.ts";
import {WorkflowStepResponse} from "../types/WorkflowStepResponse.interface.ts";
import axios from "axios";

const BASE_URL: string = "https://test-app-ms.duckdns.org/api/v1/procedures/workflow/review";

export const reviewProcedureService = {
  async review(workflowReviewRequest: WorkflowReviewRequest): Promise<WorkflowStepResponse> {
    const response = await axios.post<WorkflowStepResponse>(BASE_URL, workflowReviewRequest);

    return response.data;
  }
}