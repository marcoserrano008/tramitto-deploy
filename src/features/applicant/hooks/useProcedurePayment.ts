// hooks/useProcedurePayment.ts
import {useEffect, useRef, useState} from 'react';
import {useAuth} from "../../../context/AuthContext.tsx";
import {ProcedureResponse} from "../../../types/ProcedureResponse.interface.ts";
import {PaymentDetails} from "../../../types/PaymentDetails.interface.ts";
import {procedureCreateService} from "../../../services/ProcedureCreate.http.service.ts";
import {procedurePaymentService} from "../../../services/ProcedurePayment.http.service.ts";

interface ProcedurePaymentHookResult {
  createdProcedure: ProcedureResponse | null;
  creationLoading: boolean;
  creationError: string | null;

  paymentProcessing: boolean;
  paymentSuccess: boolean;
  paymentError: string | null;
  paymentResponse: ProcedureResponse | null;

  handlePayment: () => Promise<void>;
}

export function useProcedurePayment(paymentDetails: PaymentDetails): ProcedurePaymentHookResult {
  const auth = useAuth();

  const [createdProcedure, setCreatedProcedure] = useState<ProcedureResponse | null>(null);
  const [creationLoading, setCreationLoading] = useState<boolean>(true);
  const [creationError, setCreationError] = useState<string | null>(null);

  const [paymentProcessing, setPaymentProcessing] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentResponse, setPaymentResponse] = useState<ProcedureResponse | null>(null);

  const procedureCreationInitiated = useRef<boolean>(false);

  useEffect(() => {
    if (procedureCreationInitiated.current || createdProcedure) {
      return;
    }

    procedureCreationInitiated.current = true;

    const createProcedure = async () => {
      if (!auth.user) {
        setCreationError('You must be logged in to create a procedure');
        setCreationLoading(false);
        return;
      }

      try {
        const response: ProcedureResponse = await procedureCreateService.createProcedure({
          procedureTypeId: paymentDetails.procedureId,
          userId: auth.user.id,
        })

        setCreatedProcedure(response);
      } catch (err) {
        console.error('Error creating procedure:', err);
        setCreationError('Failed to create procedure. Please try again.');
      } finally {
        setCreationLoading(false);
      }
    };

    void createProcedure();
  }, [auth.user, createdProcedure, paymentDetails.procedureId]);

  // Handle payment submission
  const handlePayment = async () => {
    if (!createdProcedure) {
      setPaymentError('No procedure has been created');
      return;
    }

    setPaymentProcessing(true);
    setPaymentError(null);

    try {
      const transactionId = `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      const response: ProcedureResponse = await procedurePaymentService.registerPayment({
        procedureId: createdProcedure.id,
        amount: paymentDetails.amount,
        paymentMethod: 'qr',
        transactionId: transactionId
      })

      setPaymentResponse(response);
      setPaymentSuccess(true);
    } catch (err) {
      console.error('Payment error:', err);
      setPaymentError('Payment failed. Please try again.');
    } finally {
      setPaymentProcessing(false);
    }
  };

  return {
    createdProcedure,
    creationLoading,
    creationError,
    paymentProcessing,
    paymentSuccess,
    paymentError,
    paymentResponse,
    handlePayment
  };
}
