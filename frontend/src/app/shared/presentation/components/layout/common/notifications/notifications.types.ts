import { DateTime } from 'luxon';

export interface Notification
{
    id: number;
    agrupador: string;
    moneda: string;
    clienteERP: string;
    razonSocial?: string;
    mpMonto?: number;
    mprazonSocial?: string;
    qrUsuarioGenero?: string;
    montoPago?: number;
    fechaRegistro?: DateTime;
    qrUsuarioNotificado: boolean;
}
