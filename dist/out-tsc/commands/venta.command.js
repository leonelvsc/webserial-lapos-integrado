import { Command, Response } from '../command';
import { BigNumber } from 'bignumber.js';
import * as _ from 'lodash';
export var TransaccionPosModo;
(function (TransaccionPosModo) {
    TransaccionPosModo[TransaccionPosModo["TX_ONLINE"] = 1] = "TX_ONLINE";
    TransaccionPosModo[TransaccionPosModo["TX_OFFLINE"] = 0] = "TX_OFFLINE";
})(TransaccionPosModo || (TransaccionPosModo = {}));
export class VentaParams {
    constructor(params) {
        this.factura_numero = '';
        this.cantidad_cuotas = 1;
        this.tarjeta_codigo = '';
        this.plan_codigo = '0';
        this.monto_propiona = 0;
        this.comercio_codigo = '';
        this.comercio_nombre = '';
        this.cuit = '';
        this.online = TransaccionPosModo.TX_ONLINE;
        _.assign(this, params);
    }
}
export class TransaccionResponse extends Response {
    constructor(buffer) {
        super(buffer);
        this.respuesta_codigo = Command.convertToString(_.slice(this.data, 0, 2));
        this.respuesta_mensaje = Command.convertToString(_.slice(this.data, 2, 34));
        this.autorizacion_codigo = Command.convertToString(_.slice(this.data, 34, 40));
        this.cupon_numero = Command.convertToString(_.slice(this.data, 40, 47));
        this.lote_numero = Command.convertToString(_.slice(this.data, 47, 50));
        this.cliente_nombre = Command.convertToString(_.slice(this.data, 50, 76));
        this.tarjeta_ultimos_4_digitos = Command.convertToString(_.slice(this.data, 76, 80));
        this.tarjeta_primeros_6_digitos = Command.convertToString(_.slice(this.data, 80, 86));
        this.transaccion_fecha = Command.convertToString(_.slice(this.data, 86, 96));
        this.transaccion_hora = Command.convertToString(_.slice(this.data, 96, 104));
        this.terminal_id = Command.convertToString(_.slice(this.data, 104, 112));
    }
}
export class VentaCommand extends Command {
    constructor(params) {
        const data = {
            monto: _.padStart(new BigNumber(params.monto).decimalPlaces(2).multipliedBy(100).toString(10), 12, '0'),
            factura_numero: _.padStart(params.factura_numero, 12, '0'),
            cantidad_cuotas: _.padStart(params.cantidad_cuotas.toString(), 2, '0'),
            tarjeta_codigo: _.padStart(params.tarjeta_codigo, 3, '0'),
            plan_codigo: params.plan_codigo ?? '0',
            monto_propina: _.padStart(new BigNumber(params.monto_propiona).decimalPlaces(2).multipliedBy(100).toString(10), 12, '0'),
            comercio_codigo: _.padEnd(params.comercio_codigo, 15, ' '),
            comercio_nombre: _.padStart(params.comercio_nombre, 23, ' '),
            cuit: _.padStart(params.cuit, 23, ' '),
            online: params.online
        };
        super('VEN', new Uint8Array(Command.convertToByte(data)));
    }
    decode(buffer) {
        return new TransaccionResponse(buffer);
    }
}
//# sourceMappingURL=venta.command.js.map