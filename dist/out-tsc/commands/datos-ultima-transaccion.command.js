import { Command, Response } from '../command';
import * as _ from 'lodash';
export const VENTA = '1';
export const VENTA_ANULACION = '2';
export const VENTA_DEVOLUCION = '3';
export const VENTA_DEVOLUCION_ANULACION = '4';
export class UltimaTransaccionResponse extends Response {
    constructor(buffer) {
        super(buffer);
        this.tipo = Command.convertToString(_.slice(this.data, 0, 1));
        this.respuesta_codigo = Command.convertToString(_.slice(this.data, 1, 3));
        this.respuesta_mensaje = Command.convertToString(_.slice(this.data, 3, 35));
        this.autorizacion_codigo = Command.convertToString(_.slice(this.data, 35, 41));
        this.cupon_numero = Command.convertToString(_.slice(this.data, 41, 48));
        this.lote_numero = Command.convertToString(_.slice(this.data, 48, 51));
        this.cliente_nombre = Command.convertToString(_.slice(this.data, 51, 77));
        this.tarjeta_ultimos_4_digitos = Command.convertToString(_.slice(this.data, 77, 81));
        this.tarjeta_primeros_6_digitos = Command.convertToString(_.slice(this.data, 81, 87));
        this.transaccion_fecha = Command.convertToString(_.slice(this.data, 87, 97));
        this.transaccion_hora = Command.convertToString(_.slice(this.data, 97, 105));
        this.terminal_id = Command.convertToString(_.slice(this.data, 105, 113));
    }
}
export class DatosUltimaTransaccionCommand extends Command {
    constructor() {
        super('ULT', new Uint8Array(0));
    }
    decode(buffer) {
        return new UltimaTransaccionResponse(buffer);
    }
}
//# sourceMappingURL=datos-ultima-transaccion.command.js.map