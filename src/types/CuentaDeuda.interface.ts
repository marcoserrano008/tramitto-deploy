export interface CuentaDeuda {
  cuenta_id: number;
  tipo_cuenta: string;
  tipo_monto: string;
  monto: string;
  cantidad: number;
  cantidad_fijo: boolean;
  cuenta_comision_bancaria: boolean;
}