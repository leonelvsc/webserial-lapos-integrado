import { Command } from '../command';
import { BigNumber } from 'bignumber.js';
import * as _ from 'lodash';
import { TransaccionPosModo, TransaccionResponse } from './venta.command';
export class VentaDevolucionParams {
    constructor(params) {
        this.plan_codigo = '0';
        this.comercio_codigo = '';
        this.comercio_nombre = '';
        this.cuit = '';
        this.online = TransaccionPosModo.TX_ONLINE;
        _.assign(this, params);
    }
}
export class VentaDevolucionCommand extends Command {
    constructor(params) {
        const data = {
            monto: _.padStart(new BigNumber(params.monto).decimalPlaces(2).multipliedBy(100).toString(10), 12, '0'),
            tarjeta_codigo: _.padStart(params.tarjeta_codigo, 3, '0'),
            plan_codigo: params.plan_codigo ?? '0',
            cantidad_cuotas: _.padStart(params.cantidad_cuotas.toString(), 2, '0'),
            cupon_numero: _.padStart(params.cupon_numero.toString(), 7, '0'),
            transaccion_fecha: _.padStart(params.transaccion_fecha, 10, '0'),
            factura_numero: _.padStart(params.factura_numero, 12, '0'),
            comercio_codigo: _.padStart(params.comercio_codigo, 15, ' '),
            comercio_nombre: _.padStart(params.comercio_nombre, 23, ' '),
            cuit: _.padStart(params.cuit, 23, ' '),
            online: params.online
        };
        super('DEV', new Uint8Array(Command.convertToByte(data)));
    }
    decode(buffer) {
        return new TransaccionResponse(buffer);
    }
}
//# sourceMappingURL=venta-devolucion.command.js.map