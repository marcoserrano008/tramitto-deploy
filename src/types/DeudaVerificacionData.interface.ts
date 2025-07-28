import {CuentaDeuda} from "./CuentaDeuda.interface.ts";

export interface DeudaVerificacionData {
  id: string;
  precio: string;
  precio_electronico: string;
  fecha: string;
  fecha_pago: string;
  fecha_anulacion: string;
  fecha_caducado: string;
  estado: string;
  estructura_id: number;
  persona_uuid: string;
  fecha_validez: string;
  fecha_cpe: string;
  caja: boolean;
  electronico: boolean;
  payload: any;
  metodo_pago: string;
  datos_facturacion: any;
  url_redireccion: string;
  codigo_seguimiento: number;
  cuentas: CuentaDeuda[];
}
