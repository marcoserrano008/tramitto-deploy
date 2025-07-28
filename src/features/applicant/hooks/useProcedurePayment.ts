// hooks/useProcedurePayment.ts
import {useEffect, useRef, useState} from 'react';
import {useAuth} from "../../../context/AuthContext.tsx";
import {ProcedureResponse} from "../../../types/ProcedureResponse.interface.ts";
import {PaymentDetails} from "../../../types/PaymentDetails.interface.ts";
import {procedureCreateService} from "../../../services/ProcedureCreate.http.service.ts";
import {procedurePaymentService} from "../../../services/ProcedurePayment.http.service.ts";
import {VerificarDeudaResponse} from "../../../types/VerificarDeudaResponse.interface.ts";
import {procedurePaymentValidationService} from "../../../services/ProceduresPaymentValidation.http.service.ts";

export interface ProcedurePaymentHookResult {
  createdProcedure: ProcedureResponse | null;
  creationLoading: boolean;
  creationError: string | null;

  paymentProcessing: boolean;
  paymentError: string | null;
  paymentResponse: ProcedureResponse | null;

  validationProcessing: boolean;
  validationSuccess: boolean;
  validationError: string | null;
  validationResponse: VerificarDeudaResponse | null;

  handlePayment: () => Promise<void>;
  handleValidation: (deudaId: string) => Promise<void>;
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

  const [validationProcessing, setValidationProcessing] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [validationSuccess, setValidationSuccess] = useState(false);
  const [validationResponse, setValidationResponse] = useState<VerificarDeudaResponse | null>(
    null
  );

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
      setPaymentError('No se ha creado un trámite');
      return;
    }

    setPaymentProcessing(true);
    setPaymentError(null);

    try {
      const transactionId = `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      const response = await procedurePaymentService.registerPayment({
        procedureId: createdProcedure.id,
        amount: paymentDetails.amount,
        paymentMethod: 'qr',
        transactionId,
        userId: auth.user?.id
      });

      setPaymentResponse(response);
      // No marcamos éxito aquí; eso ocurrirá al validar.
    } catch (error) {
      console.error('Error al registrar el pago:', error);
      setPaymentError('El registro de pago falló. Intenta nuevamente.');
    } finally {
      setPaymentProcessing(false);
    }
  };

  const handleValidation = async (deudaId: string) => {
    if (!paymentResponse) {
      setValidationError('No se ha registrado un pago que validar');
      return;
    }

    setValidationProcessing(true);
    setValidationError(null);

    try {
      const response = await procedurePaymentValidationService.verifyDeuda(deudaId);

      setValidationSuccess(true);

      // if (response.success) {
      //   setValidationSuccess(true);
      // } else {
      //   setValidationError('Aun no se ha realizado el pago.');
      // }

      setValidationResponse(response);
    } catch (error) {
      console.error('Error al validar el pago:', error);
      setValidationError('La validación falló. Intenta nuevamente.');
    } finally {
      setValidationProcessing(false);
    }
  };

  return {
    /* creación */
    createdProcedure,
    creationLoading,
    creationError,

    /* pago */
    paymentProcessing,
    paymentError,
    paymentResponse,
    handlePayment,

    /* validación */
    validationProcessing,
    validationError,
    validationSuccess,
    validationResponse,
    handleValidation
  };
}
