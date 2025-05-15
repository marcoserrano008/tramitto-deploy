import {useCallback, useState} from "react";
import {WorkflowReviewRequest} from "../../../types/WorkflowReviewRequest.interface.ts";
import {reviewProcedureService} from "../../../services/ReviewProcedure.http.service.ts";

interface UseReviewProcedureProps {
  onSuccess?: () => void;
}

export function useReviewProcedure({onSuccess}: UseReviewProcedureProps) {
  const [isReviewing, setIsReviewing] = useState<boolean>(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  const handleReview = useCallback(
    async (workflowReviewRequest: WorkflowReviewRequest) => {
      setIsReviewing(true);
      setReviewError(null);
      try {
        const response = await reviewProcedureService.review(workflowReviewRequest);

        if (!response) {
          throw new Error(`HTTP error!`);
        }

        onSuccess?.();
      } catch (err: any) {
        console.error("Failed to review procedure:", err);
        setReviewError(
          "No se pudo procesar la revisión. Por favor, intente nuevamente.",
        );
      } finally {
        setIsReviewing(false);
      }
    },
    [onSuccess],
  );

  return {handleReview, isReviewing, reviewError};
}
